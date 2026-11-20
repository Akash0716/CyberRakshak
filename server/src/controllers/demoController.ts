import { Request, Response } from 'express';
import { verifyNoticeAuthenticity } from '../services/noticeVerificationService.js';
import { isUsingFallbackDB } from '../config/db.js';
import { memoryDb } from '../services/memoryDbFallback.js';
import { IncidentModel } from '../models/Incident.js';

export async function runDemoScenario(req: Request, res: Response): Promise<void> {
  try {
    const { scenarioId } = req.params;

    switch (scenarioId) {
      case 'demo-1-genuine': {
        // DEMO 1 – Genuine Notice
        // Notice ID: VIT-NOT-2026-0891
        const result = await verifyNoticeAuthenticity({
          noticeId: 'VIT-NOT-2026-0891',
          submittedTitle: 'Semester Examination Fee & Hall Ticket Release - March 2026',
          submittedDepartment: 'Examination Cell & Academic Affairs',
          submittedIssuer: 'Dr. K. Srinivas Rao, Controller of Examinations',
          submittedDescription: 'All B.Tech CSE, IT, ECE, and AI students must clear their semester examination fees through official bank details only. Hall tickets will be issued starting March 25th.',
          submittedExpiryDate: '2027-04-30',
          submittedPaymentDetails: {
            upiId: 'vishnu.exams@okaxis',
            beneficiary: 'Vishnu Institute of Technology Exam Fund'
          },
          verificationType: 'notice_id'
        });

        res.json({
          success: true,
          demoName: 'DEMO 1 – Genuine Notice Verification',
          description: 'Loaded official pre-registered circular. Cryptographic hash matched, two-person approval confirmed.',
          scenario: 'genuine_notice',
          ...result
        });
        return;
      }

      case 'demo-2-fake': {
        // DEMO 2 – Fake Notice (Altered version with changed UPI ID & modified dates)
        const result = await verifyNoticeAuthenticity({
          noticeId: 'VIT-NOT-2026-0891',
          // Tampered fields!
          submittedTitle: 'Semester Examination Fee & Hall Ticket Release - March 2026 (TAMPERED)',
          submittedDepartment: 'Examination Cell & Academic Affairs',
          submittedIssuer: 'Chief Examination Hacker',
          submittedDescription: 'All students must pay Rs. 3,500 immediately to the private scanner or hall tickets will be withheld within 24 hours.',
          submittedExpiryDate: '2027-02-10', // Tampered date
          submittedPaymentDetails: {
            upiId: 'fraud.vit.exam@okaxis', // Tampered UPI!
            beneficiary: 'Private Exam Cell Scanner'
          },
          submittedHash: '9999999999999999999999999999999999999999999999999999999999999999',
          verificationType: 'notice_tamper_check'
        });

        res.json({
          success: true,
          demoName: 'DEMO 2 – Detect Fake Notice',
          description: 'Circulated modified document detected. Altered payment UPI, title, issuer, and body content flagged in real-time.',
          scenario: 'fake_notice',
          ...result
        });
        return;
      }

      case 'demo-3-payment-mismatch': {
        // DEMO 3 – Payment Mismatch
        // Official UPI: vishnu.fees@okaxis
        // Suspicious UPI: vishnu.fee.payment@okaxis
        const enteredDetails = {
          institution: 'Vishnu Institute of Technology',
          beneficiary: 'Vishnu Fees Collection Desk',
          upiId: 'vishnu.fee.payment@okaxis', // Fictional spoofed UPI
          accountNumber: '30982349999', // Mismatched account
          purpose: 'Tuition and College Development Fee',
          amount: 45000
        };

        const approvedOfficialRecord = {
          institution: 'Vishnu Institute of Technology',
          beneficiary: 'Vishnu Institute of Technology General Fund',
          bankName: 'State Bank of India, Bhimavaram Branch',
          maskedAccount: 'XXXX-XXXX-8921',
          ifsc: 'SBIN0001234',
          upiId: 'vishnu.fees@okaxis',
          purpose: 'Tuition and College Development Fee',
          validTill: '2027-06-01'
        };

        res.json({
          success: true,
          demoName: 'DEMO 3 – Payment Change Guard Protection',
          description: 'Payment verification intercepted a subtle spoofing attempt where a fake UPI handle simulated the official college fee account.',
          scenario: 'payment_mismatch',
          result: 'MISMATCH',
          enteredDetails,
          approvedOfficialRecord,
          mismatchedFields: [
            {
              field: 'upiId',
              label: 'UPI Handle',
              official: 'vishnu.fees@okaxis',
              suspicious: 'vishnu.fee.payment@okaxis',
              verdict: 'MISMATCH - Unregistered external VPA'
            },
            {
              field: 'beneficiary',
              label: 'Registered Beneficiary Name',
              official: 'Vishnu Institute of Technology General Fund',
              suspicious: 'Vishnu Fees Collection Desk',
              verdict: 'MISMATCH - Discrepancy in legal title'
            },
            {
              field: 'accountNumber',
              label: 'Bank Account Ending',
              official: 'XXXX-XXXX-8921',
              suspicious: 'XXXX-XXXX-9999',
              verdict: 'MISMATCH - Fraudulent bank routing target'
            }
          ],
          recommendation: 'CRITICAL ALERT: DO NOT AUTHORIZE TRANSACTION. The UPI ID "vishnu.fee.payment@okaxis" is an unauthorized impersonator. Report to campus Cyber Incident Desk immediately.'
        });
        return;
      }

      case 'demo-4-incident': {
        // DEMO 4 – Simulate Cyber Incident
        const year = new Date().getFullYear();
        const caseId = `CR-INC-${year}-${Math.floor(1000 + Math.random() * 9000)}`;

        const demoIncident = {
          caseId,
          reporterName: 'Demonstration Student (Evaluation Mode)',
          reporterEmail: 'eval.demo@vishnu.edu.in',
          category: 'Phishing',
          description: '[SIMULATED EVALUATION SCENARIO] Student received urgent SMS claiming that semester grades were withheld due to pending fee verification with a shortened phishing URL bit.ly/vit-results-urgent.',
          incidentDate: new Date(),
          financialLoss: 0,
          status: 'submitted',
          isDemoSimulation: true,
          createdAt: new Date(),
          recommendedActions: [
            'Alerted campus firewall administrators to block bit.ly/vit-results-urgent domain.',
            'Issued broadcast warning to all CSE 3rd-year students.',
            'Case logged under CyberRakshak institutional audit ledger.',
            'Emergency contact recorded: National Cybercrime Helpline 1930 / cybercrime.gov.in.'
          ]
        };

        if (isUsingFallbackDB()) {
          memoryDb.incidents.unshift(demoIncident);
        } else {
          try {
            await IncidentModel.create(demoIncident);
          } catch {
            memoryDb.incidents.unshift(demoIncident);
          }
        }

        res.json({
          success: true,
          demoName: 'DEMO 4 – Incident Reporting Simulation',
          description: 'Simulated high-priority phishing report submission with automated case reference tracking and advisory issuance.',
          scenario: 'incident_simulation',
          caseId,
          incident: demoIncident
        });
        return;
      }

      default:
        res.status(400).json({ success: false, message: 'Invalid demo scenario specified.' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
