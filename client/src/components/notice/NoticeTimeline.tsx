import React from 'react';
import { CheckCircle2, Clock, ShieldCheck, XCircle, FileEdit, AlertTriangle } from 'lucide-react';
import { NoticeHistory } from '../../types';

interface NoticeTimelineProps {
  history: NoticeHistory[];
}

export const NoticeTimeline: React.FC<NoticeTimelineProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return <div className="text-xs text-slate-400 italic">No audit trail records logged yet.</div>;
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'created':
        return { icon: <FileEdit className="w-3.5 h-3.5 text-cyan-400" />, label: 'Drafted', color: 'text-cyan-400 bg-cyan-500/10' };
      case 'submitted_for_review':
        return { icon: <Clock className="w-3.5 h-3.5 text-amber-400" />, label: 'Dual-Review Queued', color: 'text-amber-400 bg-amber-500/10' };
      case 'approved':
        return { icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />, label: 'Independent Approved', color: 'text-emerald-400 bg-emerald-500/10' };
      case 'published':
        return { icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />, label: 'Cryptographically Published', color: 'text-emerald-400 bg-emerald-500/10' };
      case 'rejected':
        return { icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />, label: 'Rejected by Approver', color: 'text-rose-400 bg-rose-500/10' };
      case 'revoked':
        return { icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />, label: 'Revoked & Withdrawn', color: 'text-rose-400 bg-rose-500/10' };
      default:
        return { icon: <Clock className="w-3.5 h-3.5 text-slate-400" />, label: action, color: 'text-slate-400 bg-slate-500/10' };
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-cyber-border">
      {history.map((event, index) => {
        const badge = getActionBadge(event.action);
        return (
          <div key={index} className="relative">
            {/* Dot */}
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-cyber-secondary border border-cyber-border flex items-center justify-center">
              {badge.icon}
            </div>

            {/* Content Card */}
            <div className="p-3.5 rounded-xl bg-cyber-card border border-cyber-border text-xs space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${badge.color}`}>
                  {badge.label}
                </span>
                <span className="text-[10px] text-slate-400">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="font-semibold text-white pt-1">
                Performed by: <span className="text-cyan-300">{event.performedBy}</span> ({event.performedByRole})
              </div>
              {event.remarks && (
                <p className="text-[11px] text-slate-300 italic pt-0.5 leading-relaxed">
                  "{event.remarks}"
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

