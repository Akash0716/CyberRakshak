import { Response } from 'express';
import { isUsingFallbackDB } from '../config/db.js';
import { PaymentRecordModel, IPaymentRecord } from '../models/PaymentRecord.js';
import { memoryDb } from '../services/memoryDbFallback.js';
import { AuthRequest } from '../middleware/auth.js';
import { VerificationLogModel } from '../models/VerificationLog.js';

export async function getPaymentRecords(req: AuthRequest, res: Response): Promise<void> {
  try {
    let records: any[] = [];
    if (isUsingFallbackDB()) {
      records = memoryDb.paymentRecords.map(r => ({
        ...r,
        accountNumber: undefined // Hide raw account in public listings
      }));
    } else {
      try {
        records = await PaymentRecordModel.find().select('-accountNumber').lean();
      } catch {
        records = memoryDb.paymentRecords.map(r => ({
          ...r,
          accountNumber: undefined
        }));
      }
    }

    res.json({
      success: true,
      records
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function verifyPayment(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { beneficiary, upiId, accountNumber, purpose, amount } = req.body;

    if (!beneficiary && !upiId && !accountNumber) {
      res.status(400).json({
        success: false,
        message: 'Please provide at least a Beneficiary Name, UPI ID, or Bank Account Number to verify.'
      });
      return;
    }

    // Retrieve approved records
    let records: any[] = [];
    if (isUsingFallbackDB()) {
      records = memoryDb.paymentRecords;
    } else {
      try {
        records = await PaymentRecordModel.find().lean();
      } catch {
        records = memoryDb.paymentRecords;
      }
    }

    const referenceId = `PAY-CHK-${Date.now().toString().slice(-6)}`;
    const cleanUpi = (upiId || '').trim().toLowerCase();
    const cleanBeneficiary = (beneficiary || '').trim().toLowerCase();
    const cleanAccount = (accountNumber || '').trim().replace(/[-\s]/g, '');

    // Attempt to match by UPI ID or raw Account Number or partial Beneficiary
    let matchedRecord = records.find(r => {
      const upiMatch = cleanUpi && r.upiId.toLowerCase() === cleanUpi;
      const accMatch = cleanAccount && r.accountNumber.replace(/[-\s]/g, '') === cleanAccount;
      return upiMatch || accMatch;
    });

    // If no exact UPI/Account match, check if beneficiary closely matches an official record (potential spoofing attempt)
    let potentialImpersonation = false;
    if (!matchedRecord && (cleanBeneficiary || cleanUpi)) {
      matchedRecord = records.find(r => {
        const nameSimilarity = cleanBeneficiary && (
          r.beneficiary.toLowerCase().includes(cleanBeneficiary) ||
          cleanBeneficiary.includes('vishnu')
        );
        const upiSimilarity = cleanUpi && (
          cleanUpi.includes('vishnu') || 
          cleanUpi.includes('vit')
        );
        return nameSimilarity || upiSimilarity;
      });
      if (matchedRecord) {
        potentialImpersonation = true;
      }
    }

    const discrepancies: Array<{
      field: string;
      label: string;
      approvedValue: string;
      enteredValue: string;
      status: 'MATCH' | 'MISMATCH';
    }> = [];

    let result: 'MATCH' | 'MISMATCH' | 'REVIEW_REQUIRED' = 'REVIEW_REQUIRED';
    let summary = '';
    let recommendation = '';

    if (!matchedRecord) {
      result = 'REVIEW_REQUIRED';
      summary = 'No registered institutional payment record matched the entered payment coordinates.';
      recommendation = 'Hold payment immediately. Vishnu Institute only authorizes fee clearance through listed official accounts. Contact Finance Desk before proceeding.';
    } else {
      // Check each field
      // 1. UPI ID Check
      if (cleanUpi) {
        const upiMatches = matchedRecord.upiId.toLowerCase() === cleanUpi;
        discrepancies.push({
          field: 'upiId',
          label: 'UPI Virtual Payment Address (VPA)',
          approvedValue: matchedRecord.upiId,
          enteredValue: upiId,
          status: upiMatches ? 'MATCH' : 'MISMATCH'
        });
      }

      // 2. Beneficiary Name Check
      if (cleanBeneficiary) {
        const nameMatches = matchedRecord.beneficiary.toLowerCase().includes(cleanBeneficiary) ||
                            cleanBeneficiary.includes(matchedRecord.beneficiary.toLowerCase());
        discrepancies.push({
          field: 'beneficiary',
          label: 'Registered Beneficiary Name',
          approvedValue: matchedRecord.beneficiary,
          enteredValue: beneficiary,
          status: nameMatches ? 'MATCH' : 'MISMATCH'
        });
      }

      // 3. Account Number Check
      if (cleanAccount) {
        const accMatches = matchedRecord.accountNumber.replace(/[-\s]/g, '') === cleanAccount;
        discrepancies.push({
          field: 'accountNumber',
          label: 'Bank Account Number',
          approvedValue: matchedRecord.maskedAccount,
          enteredValue: accountNumber.length > 4 ? `XXXX-XXXX-${accountNumber.slice(-4)}` : accountNumber,
          status: accMatches ? 'MATCH' : 'MISMATCH'
        });
      }

      const hasMismatches = discrepancies.some(d => d.status === 'MISMATCH');

      if (potentialImpersonation || hasMismatches) {
        result = 'MISMATCH';
        summary = 'ALERT: Payment mismatch detected! The entered details show significant variations from the official bank coordinates registered by Vishnu Institute of Technology.';
        recommendation = 'DO NOT SEND MONEY. This is a potential payment fraud or spoofed UPI ID. Report this incident immediately on the Cyber Incident Desk.';
      } else {
        result = 'MATCH';
        summary = 'All verified payment coordinates perfectly correspond with the authorized institutional beneficiary on record.';
        recommendation = 'Safe to proceed with official fee payment. Verify that the bank app shows the exact beneficiary name before entering your UPI PIN.';
      }
    }

    // Log the verification
    const logData = {
      referenceId,
      userId: req.user?.userId,
      userRole: req.user?.role || 'student',
      verificationType: 'payment_guard' as const,
      targetIdentifier: upiId || beneficiary || accountNumber || 'N/A',
      result,
      reason: summary,
      originalSnapshot: matchedRecord ? {
        beneficiary: matchedRecord.beneficiary,
        upiId: matchedRecord.upiId,
        maskedAccount: matchedRecord.maskedAccount,
        bankName: matchedRecord.bankName,
        purpose: matchedRecord.purpose
      } : undefined,
      submittedSnapshot: {
        beneficiary,
        upiId,
        accountNumber: accountNumber ? `XXXX-XXXX-${accountNumber.slice(-4)}` : undefined,
        purpose,
        amount
      },
      mismatches: discrepancies.filter(d => d.status === 'MISMATCH').map(d => d.field),
      clientIp: req.ip,
      timestamp: new Date()
    };

    if (isUsingFallbackDB()) {
      memoryDb.verificationLogs.unshift(logData);
    } else {
      try {
        await VerificationLogModel.create(logData);
      } catch {
        memoryDb.verificationLogs.unshift(logData);
      }
    }

    res.json({
      success: true,
      referenceId,
      result,
      summary,
      recommendation,
      matchedRecord: matchedRecord ? {
        institution: matchedRecord.institution,
        beneficiary: matchedRecord.beneficiary,
        bankName: matchedRecord.bankName,
        maskedAccount: matchedRecord.maskedAccount,
        ifsc: matchedRecord.ifsc,
        upiId: matchedRecord.upiId,
        purpose: matchedRecord.purpose,
        validTill: matchedRecord.validTill
      } : null,
      discrepancies,
      disclaimer: 'DEMONSTRATION GUARD: CyberRakshak does not initiate or handle fund transactions. All checks compare against verified campus registry records.'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function createPaymentRecord(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { institution, beneficiary, bankName, accountNumber, ifsc, upiId, purpose, validTill, notes } = req.body;

    if (!beneficiary || !bankName || !accountNumber || !ifsc || !upiId || !purpose) {
      res.status(400).json({ success: false, message: 'All banking credentials and purpose are required.' });
      return;
    }

    const maskedAccount = `XXXX-XXXX-${accountNumber.trim().slice(-4)}`;
    const recordId = `REC-VIT-${Math.floor(100 + Math.random() * 900)}`;

    const newRecord: any = {
      _id: `pay_${Date.now()}`,
      recordId,
      institution: institution || 'Vishnu Institute of Technology',
      beneficiary,
      bankName,
      accountNumber,
      maskedAccount,
      ifsc,
      upiId: upiId.toLowerCase().trim(),
      purpose,
      validFrom: new Date(),
      validTill: validTill ? new Date(validTill) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: 'active',
      notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (isUsingFallbackDB()) {
      memoryDb.paymentRecords.push(newRecord);
    } else {
      try {
        await PaymentRecordModel.create(newRecord);
      } catch {
        memoryDb.paymentRecords.push(newRecord);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Approved payment account record registered successfully.',
      record: {
        ...newRecord,
        accountNumber: undefined // Hide in response
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

