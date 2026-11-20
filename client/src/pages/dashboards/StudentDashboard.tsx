import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileCheck2, 
  CreditCard, 
  Sparkles, 
  AlertTriangle, 
  QrCode, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  ArrowRight,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { QRScannerModal } from '../../components/notice/QRScannerModal';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [notices, setNotices] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const [noticesRes, incidentsRes] = await Promise.all([
        api.get('/notices'),
        api.get('/incidents')
      ]);
      if (noticesRes.data.success) setNotices(noticesRes.data.notices);
      if (incidentsRes.data.success) setIncidents(incidentsRes.data.incidents);
    } catch {
      // Ignored
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/50 via-cyber-secondary to-cyber-darker border border-cyan-500/30 shadow-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">Student Security Dashboard</span>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Roll: {user?.studentId || '22PA1A0542'} • {user?.department || 'CSE Department'}
          </p>
        </div>

        <button
          onClick={() => setIsScannerOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-cyan-glow flex items-center gap-2 hover:opacity-95 transition-opacity"
        >
          <QrCode className="w-4 h-4" />
          <span>Quick QR Scanner</span>
        </button>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Link
          to="/verify-notice"
          className="p-4 rounded-2xl bg-cyber-secondary border border-cyber-border hover:border-cyan-400 text-center transition-all group flex flex-col items-center justify-center gap-2"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-white">Verify Notice</span>
        </Link>

        <button
          onClick={() => setIsScannerOpen(true)}
          className="p-4 rounded-2xl bg-cyber-secondary border border-cyber-border hover:border-cyan-400 text-center transition-all group flex flex-col items-center justify-center gap-2"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <QrCode className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-white">Scan QR</span>
        </button>

        <Link
          to="/payment-guard"
          className="p-4 rounded-2xl bg-cyber-secondary border border-cyber-border hover:border-cyan-400 text-center transition-all group flex flex-col items-center justify-center gap-2"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CreditCard className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-white">Check Payment</span>
        </Link>

        <Link
          to="/cyber-ai"
          className="p-4 rounded-2xl bg-cyber-secondary border border-cyber-border hover:border-cyan-400 text-center transition-all group flex flex-col items-center justify-center gap-2"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-white">Ask Cyber AI</span>
        </Link>

        <Link
          to="/incident-desk"
          className="p-4 rounded-2xl bg-cyber-secondary border border-cyber-border hover:border-cyan-400 text-center transition-all group flex flex-col items-center justify-center gap-2 col-span-2 sm:col-span-1"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-white">Report Incident</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-cyber-secondary border border-cyber-border">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Notices Verified</span>
          <div className="text-2xl font-bold text-white mt-1">12</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Tamper Check
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-cyber-secondary border border-cyber-border">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Genuine Notices</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">11</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Approved & Sealed</div>
        </div>

        <div className="p-4 rounded-2xl bg-cyber-secondary border border-cyber-border">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Suspicious Flagged</span>
          <div className="text-2xl font-bold text-rose-400 mt-1">1</div>
          <div className="text-[11px] text-rose-300 mt-0.5">Tamper Intercepted</div>
        </div>

        <div className="p-4 rounded-2xl bg-cyber-secondary border border-cyber-border">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Submitted Incidents</span>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{incidents.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Case Reference Assigned</div>
        </div>
      </div>

      {/* Recent Published Campus Notices */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Official Published Circulars</h3>
          <Link to="/verify-notice" className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold">
            Verify a notice <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notices.slice(0, 4).map((notice, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-cyber-secondary border border-cyber-border space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-cyan-400 font-bold text-[11px]">{notice.noticeId}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300">
                  {notice.status}
                </span>
              </div>
              <div className="font-bold text-white text-xs">{notice.title}</div>
              <p className="text-slate-300 text-[11px] line-clamp-2 leading-relaxed">{notice.description}</p>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-cyber-border/40 flex items-center justify-between">
                <span>{notice.department}</span>
                <span>Expires: {new Date(notice.expiryDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={id => {
          window.location.href = `/verify-notice?id=${id}`;
        }}
      />
    </div>
  );
};

