import React, { useState } from 'react';
import { 
  FileCheck2, 
  QrCode, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon, 
  Download, 
  Clock, 
  Calendar, 
  User, 
  Building, 
  CreditCard,
  FileText
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { VerificationResult, NoticeHistory } from '../types';
import { QRScannerModal } from '../components/notice/QRScannerModal';
import { NoticeReceiptModal } from '../components/notice/NoticeReceiptModal';
import { NoticeTimeline } from '../components/notice/NoticeTimeline';
import { downloadNoticeReceipt } from '../utils/receiptPdf';

export const NoticeVerificationPage: React.FC = () => {
  const [noticeId, setNoticeId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [noticeHistory, setNoticeHistory] = useState<NoticeHistory[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Optional manual tamper testing fields to test tampering detection
  const [showAdvancedTamperTest, setShowAdvancedTamperTest] = useState(false);
  const [testTamperedTitle, setTestTamperedTitle] = useState('');
  const [testTamperedUpi, setTestTamperedUpi] = useState('');
  const [testTamperedExpiry, setTestTamperedExpiry] = useState('');

  const { showToast } = useToast();

  const handleVerify = async (targetId?: string) => {
    const idToVerify = (targetId || noticeId).trim();
    if (!idToVerify) {
      showToast('Validation Warning', 'Please enter a Notice ID or scan a QR code.', 'warning');
      return;
    }

    try {
      setIsVerifying(true);
      setResult(null);
      setNoticeHistory([]);

      const payload: any = {
        noticeId: idToVerify,
        verificationType: targetId ? 'notice_qr' : 'notice_id'
      };

      if (showAdvancedTamperTest) {
        if (testTamperedTitle) payload.submittedTitle = testTamperedTitle;
        if (testTamperedUpi) payload.submittedPaymentDetails = { upiId: testTamperedUpi };
        if (testTamperedExpiry) payload.submittedExpiryDate = testTamperedExpiry;
      }

      const res = await api.post('/notices/verify', payload);
      if (res.data.success) {
        setResult(res.data);

        if (res.data.result === 'VERIFIED') {
          showToast('Notice Verified', 'Cryptographic signature is genuine and approved.', 'success');
        } else if (res.data.result === 'WARNING') {
          showToast('Tampering Detected', 'Information differs from registered record!', 'warning');
        } else if (res.data.result === 'NOT_FOUND') {
          showToast('Unregistered Notice', 'No matching circular found in trustdesk ledger.', 'error');
        }

        // Try to fetch notice audit history
        if (res.data.noticeId) {
          try {
            const histRes = await api.get(`/notices/${res.data.noticeId}`);
            if (histRes.data.history) {
              setNoticeHistory(histRes.data.history);
            }
          } catch {
            // Not fatal if guest user
          }
        }
      }
    } catch (err: any) {
      showToast('Verification Failed', err.response?.data?.message || 'Error communicating with trustdesk.', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleQRScanSuccess = (decodedPayload: string) => {
    let cleanNoticeId = decodedPayload;
    try {
      // If it's a JSON QR payload
      const parsed = JSON.parse(decodedPayload);
      if (parsed.noticeId) {
        cleanNoticeId = parsed.noticeId;
      }
    } catch {
      // Simple text
    }

    setNoticeId(cleanNoticeId);
    handleVerify(cleanNoticeId);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <FileCheck2 className="w-3.5 h-3.5" />
          Priority Feature 1 • Smart Notice Verification
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Verify Official Campus Circular Authenticity
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          Every legitimate Vishnu Institute circular is sealed with a dual-authorization cryptographic hash.
          Enter a Notice ID or scan the circular's QR code to detect any unauthorized tampering.
        </p>
      </div>

      {/* Main Verification Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-cyber-secondary border border-cyber-border shadow-glass space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Method 1: Notice ID */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={noticeId}
              onChange={e => setNoticeId(e.target.value)}
              placeholder="Enter Notice ID (e.g., VIT-NOT-2026-0891)"
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-cyber-card border border-cyber-border text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors uppercase font-mono tracking-wider"
              onKeyDown={e => e.key === 'Enter' && handleVerify()}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => handleVerify()}
              disabled={isVerifying}
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-cyan-glow hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              {isVerifying ? 'Checking Ledger...' : 'Verify Authenticity'}
            </button>

            {/* Method 2: Camera Scanner */}
            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-4 py-3 rounded-2xl bg-cyber-card hover:bg-cyber-cardHover border border-cyber-border hover:border-cyan-400 text-cyan-300 font-bold text-xs transition-all flex items-center gap-2"
              title="Scan QR Code with Camera"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Scan QR</span>
            </button>
          </div>
        </div>

        {/* Quick Presets for Demo */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="text-slate-400">Quick Test Notice IDs:</span>
          <button
            onClick={() => {
              setNoticeId('VIT-NOT-2026-0891');
              handleVerify('VIT-NOT-2026-0891');
            }}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors font-mono"
          >
            VIT-NOT-2026-0891 (Genuine Published)
          </button>
          <button
            onClick={() => {
              setNoticeId('VIT-NOT-2026-0902');
              handleVerify('VIT-NOT-2026-0902');
            }}
            className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors font-mono"
          >
            VIT-NOT-2026-0902 (Pending Approval)
          </button>
          <button
            onClick={() => {
              setNoticeId('VIT-NOT-2026-0744');
              handleVerify('VIT-NOT-2026-0744');
            }}
            className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-colors font-mono"
          >
            VIT-NOT-2026-0744 (Revoked Notice)
          </button>
        </div>

        {/* Optional Tamper Test Toggle */}
        <div className="pt-2 border-t border-cyber-border/60">
          <button
            type="button"
            onClick={() => setShowAdvancedTamperTest(prev => !prev)}
            className="text-[11px] text-cyan-400 hover:underline font-semibold"
          >
            {showAdvancedTamperTest ? '▼ Hide Tamper Simulation Lab' : '▶ Simulate Tampered Notice Inputs'}
          </button>

          {showAdvancedTamperTest && (
            <div className="mt-3 p-4 rounded-xl bg-cyber-darker border border-cyber-border text-xs space-y-3 animate-fadeIn">
              <p className="text-[11px] text-slate-400">
                Simulate what happens when an attacker modifies fields on a circulated circular:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold">Altered Title</label>
                  <input
                    type="text"
                    value={testTamperedTitle}
                    onChange={e => setTestTamperedTitle(e.target.value)}
                    placeholder="Altered Title Here"
                    className="w-full mt-1 p-2 rounded-lg bg-cyber-card border border-cyber-border text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold">Altered UPI ID</label>
                  <input
                    type="text"
                    value={testTamperedUpi}
                    onChange={e => setTestTamperedUpi(e.target.value)}
                    placeholder="hacker.upi@fakebank"
                    className="w-full mt-1 p-2 rounded-lg bg-cyber-card border border-cyber-border text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold">Altered Expiry Date</label>
                  <input
                    type="date"
                    value={testTamperedExpiry}
                    onChange={e => setTestTamperedExpiry(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg bg-cyber-card border border-cyber-border text-white text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verification Result Card */}
      {result && (
        <div className="p-6 sm:p-8 rounded-3xl bg-cyber-secondary border border-cyber-border shadow-glass space-y-6 animate-fadeIn">
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-cyber-border">
            <div>
              <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">Cryptographic Result</span>
              <div className="flex items-center gap-3 mt-1">
                <span
                  className={`px-3.5 py-1 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 ${
                    result.result === 'VERIFIED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : result.result === 'WARNING'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {result.result === 'VERIFIED' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  {result.statusBadge.label}
                </span>
                <span className="font-mono text-xs text-slate-400">Notice ID: {result.noticeId}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsReceiptModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-cyber-card hover:bg-cyber-cardHover border border-cyber-border hover:border-cyan-400 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                View Trust Receipt
              </button>

              <button
                onClick={() => downloadNoticeReceipt(result)}
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
              result.result === 'VERIFIED'
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                : result.result === 'WARNING'
                ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
            }`}
          >
            <span className="font-bold">TrustDesk Advisory: </span>
            {result.reason}
          </div>

          {/* Discrepancies if Tampered */}
          {result.mismatches && result.mismatches.length > 0 && (
            <div className="border border-rose-500/30 bg-rose-500/5 rounded-2xl overflow-hidden text-xs">
              <div className="p-3.5 bg-rose-950/40 font-bold text-rose-200 flex items-center gap-2 border-b border-rose-500/30">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span>Tamper Breakdown: Registered Institutional Data vs Submitted Circular</span>
              </div>
              <table className="w-full text-left divide-y divide-rose-500/20">
                <thead className="bg-rose-950/20 text-[11px] text-slate-400">
                  <tr>
                    <th className="py-2.5 px-4">Field</th>
                    <th className="py-2.5 px-4 text-emerald-400">Registered Record (Official)</th>
                    <th className="py-2.5 px-4 text-rose-400">Submitted / Circulated Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-500/10 text-[11px]">
                  {result.mismatches.map((m, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-4 font-bold text-white">{m.label}</td>
                      <td className="py-2 px-4 text-slate-300">{String(m.originalValue)}</td>
                      <td className="py-2 px-4 text-rose-300 font-mono font-bold">{String(m.submittedValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Official Registered Record Details */}
          {result.originalNotice && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-cyber-card border border-cyber-border space-y-3 text-xs">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-cyan-400" /> Notice Specification
                </h4>
                <div className="text-white font-bold text-sm">{result.originalNotice.title}</div>
                <div className="text-slate-300 flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Department: {result.originalNotice.department}</span>
                </div>
                <div className="text-slate-300 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Issuing Officer: {result.originalNotice.issuer}</span>
                </div>
                <div className="text-slate-300 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Valid until: {new Date(result.originalNotice.expiryDate).toLocaleDateString()}
                  </span>
                </div>
                {result.originalNotice.paymentDetails && (
                  <div className="mt-3 p-3 rounded-xl bg-cyber-secondary border border-cyan-500/30 space-y-1">
                    <div className="text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5" /> Official Bank Payment Target
                    </div>
                    <div className="text-white font-bold">{result.originalNotice.paymentDetails.beneficiary}</div>
                    <div className="text-slate-300 font-mono">UPI: {result.originalNotice.paymentDetails.upiId}</div>
                  </div>
                )}
              </div>

              <div className="p-5 rounded-2xl bg-cyber-card border border-cyber-border space-y-3 text-xs">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" /> Audit Ledger & Approvals
                </h4>
                <div className="text-slate-300">
                  Independent Approver: <strong className="text-white">{result.originalNotice.approver || 'TrustDesk Verification Authority'}</strong>
                </div>
                <div className="text-slate-300">
                  Notice Version: <span className="font-mono text-cyan-400">v{result.originalNotice.version}.0</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Cryptographic Digest</span>
                  <div className="font-mono text-[10px] text-slate-300 bg-cyber-darker p-2 rounded-lg border border-cyber-border break-all">
                    {result.originalNotice.contentHash}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trust History Timeline */}
          {noticeHistory.length > 0 && (
            <div className="pt-6 border-t border-cyber-border space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                Immutable Notice Audit Timeline
              </h3>
              <NoticeTimeline history={noticeHistory} />
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleQRScanSuccess}
      />

      <NoticeReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        result={result}
      />
    </div>
  );
};

