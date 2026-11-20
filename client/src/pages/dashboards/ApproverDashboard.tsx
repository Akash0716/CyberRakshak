import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Building, 
  Calendar, 
  CreditCard,
  MessageSquare
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Notice } from '../../types';

export const ApproverDashboard: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'request_modifications'>('approve');
  const [actionRemarks, setActionRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await api.get('/notices');
      if (res.data.success) {
        setNotices(res.data.notices);
      }
    } catch {
      // Ignored
    }
  };

  const handleAction = async () => {
    if (!selectedNotice) return;

    if (actionType === 'reject' && !actionRemarks.trim()) {
      showToast('Reason Required', 'Please provide a reason for notice rejection.', 'warning');
      return;
    }

    try {
      setIsProcessing(true);
      const res = await api.post(`/notices/${selectedNotice.noticeId}/status`, {
        action: actionType,
        remarks: actionRemarks
      });

      if (res.data.success) {
        showToast(
          'Notice Updated',
          `Notice ${selectedNotice.noticeId} ${actionType === 'approve' ? 'approved & published' : 'rejected'}.`,
          'success'
        );
        setSelectedNotice(null);
        setActionRemarks('');
        fetchNotices();
      }
    } catch (err: any) {
      showToast('Action Failed', err.response?.data?.message || 'Failed to update notice status.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingNotices = notices.filter(n => n.status === 'pending_review');
  const approvedNotices = notices.filter(n => n.status === 'published');
  const rejectedNotices = notices.filter(n => n.status === 'rejected');

  return (
    <div className="space-y-8 text-xs">
      {/* Top Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-cyber-secondary border border-cyber-border shadow-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
            Dual-Authorization Authority
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Independent Notice Verification Desk
          </h1>
          <p className="text-slate-400 mt-0.5">
            Review notices drafted by college administrators before public release. Approve, reject, or request changes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
            {pendingNotices.length} Pending Dual-Reviews
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-cyber-secondary border border-amber-500/30">
          <span className="text-[10px] text-amber-300 uppercase font-semibold">Pending Review</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">{pendingNotices.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Awaiting independent verification</div>
        </div>
        <div className="p-4 rounded-2xl bg-cyber-secondary border border-emerald-500/30">
          <span className="text-[10px] text-emerald-300 uppercase font-semibold">Approved & Sealed</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{approvedNotices.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Published with SHA-256 stamp</div>
        </div>
        <div className="p-4 rounded-2xl bg-cyber-secondary border border-rose-500/30">
          <span className="text-[10px] text-rose-300 uppercase font-semibold">Rejected Notices</span>
          <div className="text-2xl font-bold text-rose-400 mt-1">{rejectedNotices.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Non-compliant circulars blocked</div>
        </div>
      </div>

      {/* Pending Queue Section */}
      <div className="p-6 rounded-3xl bg-cyber-secondary border border-cyber-border shadow-glass space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Pending Dual-Authorization Queue
          </h3>
          <span className="text-[11px] text-slate-400">{pendingNotices.length} awaiting review</span>
        </div>

        {pendingNotices.length === 0 ? (
          <div className="p-8 text-center text-slate-400 border border-dashed border-cyber-border rounded-2xl">
            <CheckCircle className="w-8 h-8 mx-auto text-emerald-400 mb-2 opacity-80" />
            <p className="font-bold text-white text-xs">All Circulars Reviewed</p>
            <p className="text-[11px] mt-1">There are currently no administrative notices queued for approval.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingNotices.map((notice, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-cyber-card border border-cyber-border hover:border-amber-400/50 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-400 font-bold text-[11px]">{notice.noticeId}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300">
                      Pending Review
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{notice.title}</h4>
                  <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
                    {notice.description}
                  </p>
                  <div className="text-[10px] text-slate-400 pt-2 border-t border-cyber-border/40 space-y-1">
                    <div>Department: <span className="text-slate-200">{notice.department}</span></div>
                    <div>Drafted by: <span className="text-slate-200">{notice.issuer}</span></div>
                    <div>Validity until: <span className="text-slate-200">{new Date(notice.expiryDate).toLocaleDateString()}</span></div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedNotice(notice);
                      setActionType('approve');
                      setActionRemarks('Verified circular contents against registrar registry. Approved for release.');
                    }}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setSelectedNotice(notice);
                      setActionType('reject');
                      setActionRemarks('');
                    }}
                    className="py-2 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold text-xs transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review & Approve / Reject Action Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-cyber-secondary border border-cyber-border shadow-glass space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-cyber-border">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400">Independent Review Authority</span>
                <h3 className="font-bold text-white text-base mt-0.5">{selectedNotice.title}</h3>
                <span className="font-mono text-cyan-400 text-xs">{selectedNotice.noticeId}</span>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border space-y-2 text-slate-300 text-xs">
              <div><strong className="text-white">Department:</strong> {selectedNotice.department}</div>
              <div><strong className="text-white">Issuing Authority:</strong> {selectedNotice.issuer}</div>
              <div><strong className="text-white">Validity Expiry:</strong> {new Date(selectedNotice.expiryDate).toLocaleDateString()}</div>
              <div><strong className="text-white">Notice Body:</strong></div>
              <p className="p-2.5 rounded-lg bg-cyber-darker text-slate-200 leading-relaxed text-[11px]">
                {selectedNotice.description}
              </p>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-white text-xs">Verification Decision</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setActionType('approve')}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                    actionType === 'approve'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-cyber-card border-cyber-border text-slate-400'
                  }`}
                >
                  Approve & Sign
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('reject')}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                    actionType === 'reject'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-cyber-card border-cyber-border text-slate-400'
                  }`}
                >
                  Reject Circular
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('request_modifications')}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                    actionType === 'request_modifications'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-cyber-card border-cyber-border text-slate-400'
                  }`}
                >
                  Ask Changes
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Approver Remarks (Recorded on Audit Timeline)</label>
              <textarea
                rows={3}
                value={actionRemarks}
                onChange={e => setActionRemarks(e.target.value)}
                placeholder="Enter audit remarks or reason for decision..."
                className="w-full p-3 rounded-xl bg-cyber-card border border-cyber-border text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-4 py-2 rounded-xl text-slate-300 hover:bg-cyber-card font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={isProcessing}
                className={`px-5 py-2 rounded-xl font-bold text-white text-xs ${
                  actionType === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : actionType === 'reject'
                    ? 'bg-rose-600 hover:bg-rose-500'
                    : 'bg-amber-600 hover:bg-amber-500'
                }`}
              >
                {isProcessing ? 'Recording On Ledger...' : `Confirm ${actionType.replace('_', ' ')}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

