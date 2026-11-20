import React from 'react';
import { Download, ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { PaymentVerificationResult } from '../../types';
import { downloadPaymentReceipt } from '../../utils/receiptPdf';

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: PaymentVerificationResult | null;
  enteredDetails: any;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  isOpen,
  onClose,
  result,
  enteredDetails
}) => {
  if (!result) return null;

  const isMatch = result.result === 'MATCH';
  const isMismatch = result.result === 'MISMATCH';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payment Verification Receipt" maxWidth="xl">
      <div className="space-y-4">
        {/* Top Header */}
        <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Receipt Reference</span>
            <div className="font-mono text-cyan-400 font-bold text-sm">{result.referenceId}</div>
            <div className="text-[11px] text-slate-400">{new Date().toLocaleString()}</div>
          </div>

          <div
            className={`px-3.5 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 ${
              isMatch
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : isMismatch
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}
          >
            {isMatch ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {result.result}
          </div>
        </div>

        {/* Summary Card */}
        <div
          className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
            isMatch
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
              : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
          }`}
        >
          <div className="font-bold mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Verification Verdict:
          </div>
          <p>{result.summary}</p>
        </div>

        {/* Action Recommendation */}
        <div className="p-3.5 rounded-xl bg-cyber-card border border-cyber-border text-xs space-y-1">
          <div className="font-bold text-slate-200">Recommended Student Action:</div>
          <p className="text-slate-300 leading-relaxed">{result.recommendation}</p>
        </div>

        {/* Discrepancies if any */}
        {result.discrepancies && result.discrepancies.length > 0 && (
          <div className="border border-cyber-border rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left divide-y divide-cyber-border">
              <thead className="bg-cyber-card text-[11px] text-slate-400">
                <tr>
                  <th className="py-2 px-3">Field</th>
                  <th className="py-2 px-3 text-emerald-400">Official Campus Record</th>
                  <th className="py-2 px-3">Entered Details</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border text-[11px]">
                {result.discrepancies.map((d, i) => (
                  <tr key={i} className="hover:bg-cyber-card/30">
                    <td className="py-2 px-3 font-semibold text-white">{d.label}</td>
                    <td className="py-2 px-3 text-emerald-300">{d.approvedValue}</td>
                    <td className="py-2 px-3 font-mono text-slate-300">{d.enteredValue}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          d.status === 'MATCH'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
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

        {/* Footer Buttons */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-[10px] text-slate-500">
            Demonstration Guard • No real transactions executed
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-cyber-card transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => downloadPaymentReceipt(result, enteredDetails)}
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

