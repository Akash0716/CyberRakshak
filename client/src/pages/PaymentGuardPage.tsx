import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  Search, 
  Download, 
  FileText, 
  Info, 
  ArrowRight,
  Building2,
  Lock
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { PaymentRecord, PaymentVerificationResult } from '../types';
import { PaymentReceiptModal } from '../components/payment/PaymentReceiptModal';
import { downloadPaymentReceipt } from '../utils/receiptPdf';

export const PaymentGuardPage: React.FC = () => {
  const [beneficiary, setBeneficiary] = useState('');
  const [upiId, setUpiId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [purpose, setPurpose] = useState('Tuition and College Development Fee');
  const [amount, setAmount] = useState('');

  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<PaymentVerificationResult | null>(null);
  const [approvedRecords, setApprovedRecords] = useState<PaymentRecord[]>([]);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    fetchApprovedRecords();
  }, []);

  const fetchApprovedRecords = async () => {
    try {
      const res = await api.get('/payments/records');
      if (res.data.success) {
        setApprovedRecords(res.data.records);
      }
    } catch {
      // Handled silently
    }
  };

  const handleVerify = async (customPayload?: any) => {
    const payload = customPayload || {
      beneficiary,
      upiId,
      accountNumber,
      purpose,
      amount: Number(amount) || 0
    };

    if (!payload.beneficiary && !payload.upiId && !payload.accountNumber) {
      showToast('Validation Error', 'Please enter a Beneficiary Name, UPI ID, or Account Number.', 'warning');
      return;
    }

    try {
      setIsVerifying(true);
      setResult(null);

      const res = await api.post('/payments/verify', payload);
      if (res.data.success) {
        setResult(res.data);
        if (res.data.result === 'MATCH') {
          showToast('Payment Verified', 'Account matches official Vishnu Institute registry.', 'success');
        } else if (res.data.result === 'MISMATCH') {
          showToast('Fraud Alert', 'Mismatches detected against official records!', 'error');
        } else {
          showToast('Review Required', 'Details could not be matched with high confidence.', 'warning');
        }
      }
    } catch (err: any) {
      showToast('Verification Failed', err.response?.data?.message || 'Verification service error.', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRunDemoFraud = () => {
    // Demonstration comparison from section 6
    const demoPayload = {
      beneficiary: 'Vishnu Fees Collection Desk',
      upiId: 'vishnu.fee.payment@okaxis', // Fictional spoofed UPI
      accountNumber: '30982349999',
      purpose: 'Tuition and College Development Fee',
      amount: 45000
    };

    setBeneficiary(demoPayload.beneficiary);
    setUpiId(demoPayload.upiId);
    setAccountNumber(demoPayload.accountNumber);
    setPurpose(demoPayload.purpose);
    setAmount('45000');

    handleVerify(demoPayload);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
          <CreditCard className="w-3.5 h-3.5" />
          Priority Feature 2 • Payment Change Guard
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Verify Campus Payment Beneficiary & UPI Coordinates
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          Intercept fake bank instructions and spoofed UPI IDs before authorizing transfers.
          All inputs are cross-checked against official Vishnu Institute of Technology accounts.
        </p>
      </div>

      {/* Verification Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-cyber-secondary border border-cyber-border shadow-glass space-y-5 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Payment Details Verification Form</h3>
            <button
              onClick={handleRunDemoFraud}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-[11px] font-semibold transition-colors flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              Test Fictional Fraud Example
            </button>
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              handleVerify();
            }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Registered Beneficiary Name</label>
              <input
                type="text"
                value={beneficiary}
                onChange={e => setBeneficiary(e.target.value)}
                placeholder="e.g., Vishnu Institute of Technology General Fund"
                className="w-full px-4 py-2.5 rounded-xl bg-cyber-card border border-cyber-border text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">UPI Virtual Payment Address (VPA)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="e.g., vishnu.fees@okaxis"
                  className="w-full px-4 py-2.5 rounded-xl bg-cyber-card border border-cyber-border text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Bank Account Number (Optional)</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value)}
                  placeholder="e.g., 30982348921"
                  className="w-full px-4 py-2.5 rounded-xl bg-cyber-card border border-cyber-border text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Payment Purpose</label>
                <select
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-cyber-card border border-cyber-border text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  <option value="Tuition and College Development Fee">Tuition and College Development Fee</option>
                  <option value="End-Semester Examination Fee">End-Semester Examination Fee</option>
                  <option value="Hostel Accommodation and Mess Charges">Hostel Accommodation and Mess Charges</option>
                  <option value="Supplementary Lab & Exam Fee">Supplementary Lab & Exam Fee</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Amount (INR ₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="e.g., 2500"
                  className="w-full px-4 py-2.5 rounded-xl bg-cyber-card border border-cyber-border text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-blue-glow hover:opacity-95 transition-opacity disabled:opacity-50 mt-2"
            >
              {isVerifying ? 'Scanning Campus Payment Ledger...' : 'Verify Payment Details Against College Records'}
            </button>
          </form>

          {/* Educational Disclaimer */}
          <div className="p-3.5 rounded-xl bg-cyber-darker border border-cyber-border text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              Safety Guarantee & Disclaimers:
            </div>
            <p>
              CyberRakshak never initiates payments, connects to bank APIs, or asks for passwords, OTPs, or CVVs. All records are for demonstration & fraud detection purposes.
            </p>
          </div>
        </div>

        {/* Right Info: Official Approved Accounts */}
        <div className="p-6 rounded-3xl bg-cyber-secondary border border-cyber-border shadow-glass space-y-4 text-xs">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Building2 className="w-4 h-4 text-cyan-400" />
            Official Campus Accounts
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Authorized accounts registered with Vishnu Institute of Technology, Bhimavaram:
          </p>

          <div className="space-y-3">
            {approvedRecords.map((acc, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-cyber-card border border-cyber-border space-y-1">
                <div className="font-bold text-white text-xs">{acc.beneficiary}</div>
                <div className="font-mono text-cyan-400 text-[11px]">{acc.upiId}</div>
                <div className="text-[10px] text-slate-400">{acc.bankName} • {acc.maskedAccount}</div>
                <div className="text-[10px] text-slate-500">{acc.purpose}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verification Result Display */}
      {result && (
        <div className="p-6 sm:p-8 rounded-3xl bg-cyber-secondary border border-cyber-border shadow-glass space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-cyber-border">
            <div>
              <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">Guard Analysis Verdict</span>
              <div className="flex items-center gap-3 mt-1">
                <span
                  className={`px-3.5 py-1 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 ${
                    result.result === 'MATCH'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : result.result === 'MISMATCH'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {result.result === 'MATCH' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  {result.result}
                </span>
                <span className="font-mono text-xs text-slate-400">Ref: {result.referenceId}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsReceiptModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-cyber-card hover:bg-cyber-cardHover border border-cyber-border hover:border-cyan-400 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                View Receipt
              </button>
              <button
                onClick={() =>
                  downloadPaymentReceipt(result, {
                    beneficiary,
                    upiId,
                    accountNumber,
                    purpose,
                    amount
                  })
                }
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-cyan-glow flex items-center gap-1.5 hover:opacity-95 transition-opacity"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
            </div>
          </div>

          {/* Verdict Description */}
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed ${
              result.result === 'MATCH'
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
            }`}
          >
            <span className="font-bold">Recommendation: </span>
            {result.recommendation}
          </div>

          {/* Mismatch breakdown matrix */}
          {result.discrepancies && result.discrepancies.length > 0 && (
            <div className="border border-cyber-border rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left divide-y divide-cyber-border">
                <thead className="bg-cyber-card text-[11px] text-slate-400">
                  <tr>
                    <th className="py-2.5 px-4">Field Attribute</th>
                    <th className="py-2.5 px-4 text-emerald-400">Official Campus Registered Target</th>
                    <th className="py-2.5 px-4 text-slate-200">Entered Payment Target</th>
                    <th className="py-2.5 px-4">Match Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-border text-[11px]">
                  {result.discrepancies.map((d, i) => (
                    <tr
                      key={i}
                      className={d.status === 'MISMATCH' ? 'bg-rose-500/10' : 'hover:bg-cyber-card/30'}
                    >
                      <td className="py-2.5 px-4 font-bold text-white">{d.label}</td>
                      <td className="py-2.5 px-4 text-emerald-300 font-mono">{d.approvedValue}</td>
                      <td className="py-2.5 px-4 font-mono text-slate-300">{d.enteredValue}</td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            d.status === 'MATCH'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300 font-bold'
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <PaymentReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        result={result}
        enteredDetails={{
          beneficiary,
          upiId,
          accountNumber,
          purpose,
          amount
        }}
      />
    </div>
  );
};

