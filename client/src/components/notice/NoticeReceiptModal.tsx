import React from 'react';
import { Download, CheckCircle, AlertTriangle, AlertOctagon, Calendar, FileText, User, ShieldCheck } from 'lucide-react';
import { Modal } from '../common/Modal';
import { VerificationResult } from '../../types';
import { downloadNoticeReceipt } from '../../utils/receiptPdf';

interface NoticeReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: VerificationResult | null;
}

export const NoticeReceiptModal: React.FC<NoticeReceiptModalProps> = ({ isOpen, onClose, result }) => {
  if (!result) return null;

  const handleDownload = () => {
    downloadNoticeReceipt(result);
  };

  const isVerified = result.result === 'VERIFIED';
  const isWarning = result.result === 'WARNING';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Trust Decision Receipt" maxWidth="2xl">
      <div className="space-y-5">
        {/* Top Header Card */}
        <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Receipt Reference ID</span>
            <div className="font-mono text-cyan-400 font-bold text-sm">{result.referenceId}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{new Date(result.verificationTimestamp).toLocaleString()}</div>
          </div>

          <div
            className={`px-3.5 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 ${
              isVerified
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : isWarning
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}
          >
            {isVerified ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {result.result}
          </div>
        </div>

        {/* Verdict Explanation */}
        <div
          className={`p-4 rounded-xl border text-xs leading-relaxed ${
            isVerified
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
              : isWarning
              ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
              : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
          }`}
        >
          <div className="font-bold mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Decision Verdict Summary:
          </div>
          <p>{result.reason}</p>
        </div>

        {/* Discrepancies alert if tampered */}
        {result.mismatches && result.mismatches.length > 0 && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs space-y-2">
            <div className="font-bold flex items-center gap-1 text-rose-400">
              <AlertOctagon className="w-4 h-4" />
              Critical Content Discrepancies Flagged:
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-rose-500/20 text-slate-400">
                    <th className="py-1">Field</th>
                    <th className="py-1 text-emerald-400">Original Registered Value</th>
                    <th className="py-1 text-rose-400">Circulated / Tampered Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-500/10">
                  {result.mismatches.map((m, idx) => (
                    <tr key={idx}>
                      <td className="py-1 font-semibold text-white">{m.label}</td>
                      <td className="py-1 text-slate-300">{String(m.originalValue)}</td>
                      <td className="py-1 text-rose-300 font-mono">{String(m.submittedValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Verified Attributes Table */}
        {result.originalNotice && (
          <div className="border border-cyber-border rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs divide-y divide-cyber-border">
              <tbody className="divide-y divide-cyber-border">
                <tr className="bg-cyber-card/40">
                  <td className="py-2 px-4 text-slate-400 font-medium w-1/3">Notice Title</td>
                  <td className="py-2 px-4 text-white font-bold">{result.originalNotice.title}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-slate-400 font-medium">Notice ID</td>
                  <td className="py-2 px-4 font-mono text-cyan-400">{result.noticeId}</td>
                </tr>
                <tr className="bg-cyber-card/40">
                  <td className="py-2 px-4 text-slate-400 font-medium">Department</td>
                  <td className="py-2 px-4 text-slate-200">{result.originalNotice.department}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-slate-400 font-medium">Issuing Officer</td>
                  <td className="py-2 px-4 text-slate-200">{result.originalNotice.issuer}</td>
                </tr>
                <tr className="bg-cyber-card/40">
                  <td className="py-2 px-4 text-slate-400 font-medium">Dual Approver</td>
                  <td className="py-2 px-4 text-slate-200">{result.originalNotice.approver || 'TrustDesk Independent Authority'}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-slate-400 font-medium">SHA-256 Hash Digest</td>
                  <td className="py-2 px-4 font-mono text-[10px] text-slate-400 truncate max-w-xs">
                    {result.originalNotice.contentHash}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-[10px] text-slate-400">
            Cryptographically sealed • Vishnu Institute of Technology, Bhimavaram
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-cyber-card transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-glow flex items-center gap-1.5 hover:opacity-95 transition-opacity"
            >
              <Download className="w-3.5 h-3.5" />
              Download Official PDF Receipt
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

