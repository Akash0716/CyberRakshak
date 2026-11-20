import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  FileText, 
  PhoneCall, 
  ExternalLink, 
  ShieldAlert, 
  Clock, 
  IndianRupee, 
  Calendar, 
  User, 
  Mail, 
  Phone,
  Copy,
  Check
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Incident } from '../types';

export const IncidentDeskPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [category, setCategory] = useState('Phishing');
  const [description, setDescription] = useState('');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [financialLoss, setFinancialLoss] = useState('');
  const [reporterName, setReporterName] = useState(user?.name || '');
  const [reporterEmail, setReporterEmail] = useState(user?.email || '');
  const [reporterPhone, setReporterPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submittedCase, setSubmittedCase] = useState<any | null>(null);
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    fetchIncidents();
  }, [user]);

  const fetchIncidents = async () => {
    try {
      const res = await api.get('/incidents');
      if (res.data.success) {
        setRecentIncidents(res.data.incidents);
      }
    } catch {
      // Ignored
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast('Validation Error', 'Please describe the cyber incident.', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post('/incidents', {
        category,
        description,
        incidentDate,
        financialLoss: Number(financialLoss) || 0,
        reporterName,
        reporterEmail,
        reporterPhone
      });

      if (res.data.success) {
        setSubmittedCase(res.data.incident);
        showToast('Incident Submitted', `Case Reference ${res.data.incident.caseId} assigned.`, 'success');
        setDescription('');
        setFinancialLoss('');
        fetchIncidents();
      }
    } catch (err: any) {
      showToast('Submission Failed', err.response?.data?.message || 'Failed to submit report.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCaseId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
    showToast('Copied', 'Case reference ID copied.', 'info');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <AlertTriangle className="w-3.5 h-3.5" />
          Priority Feature 4 • Cyber Incident Desk
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Campus Cyber Incident Reporting Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          Confidential incident reporting for students and staff at Vishnu Institute of Technology.
          Log attacks for internal campus remediation and receive official helpline escalation coordinates.
        </p>
      </div>

      {/* Emergency Guidance Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/70 via-cyber-secondary to-cyber-darker border border-rose-500/40 shadow-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-sm uppercase tracking-wide">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            Official Indian Cybercrime Escalation Guidelines
          </div>
          <p className="text-slate-300 leading-relaxed max-w-2xl">
            If you have suffered immediate financial loss from UPI/OTP fraud within the last 2 hours,
            immediately dial <strong>1930</strong> (Citizen Financial Cyber Fraud Reporting).
            Prompt reporting enables authorities to freeze fraudulent recipient accounts before cash-out.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
          <a
            href="tel:1930"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            Dial 1930 Helpline
          </a>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cyber-card border border-rose-500/40 text-rose-200 hover:text-white font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <span>cybercrime.gov.in</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Post Submission Confirmation Card */}
      {submittedCase && (
        <div className="p-6 sm:p-8 rounded-3xl bg-cyber-secondary border border-emerald-500/50 shadow-glass space-y-4 animate-fadeIn text-xs">
          <div className="flex items-center gap-3 text-emerald-400 font-bold text-base">
            <CheckCircle2 className="w-6 h-6" />
            Case Registered Successfully on Campus TrustDesk
          </div>
          <div className="p-4 rounded-2xl bg-cyber-card border border-cyber-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Unique Case Reference Number</span>
              <div className="font-mono text-cyan-400 text-lg font-bold flex items-center gap-2 mt-0.5">
                {submittedCase.caseId}
                <button
                  onClick={() => copyCaseId(submittedCase.caseId)}
                  className="p-1 rounded hover:bg-cyber-secondary text-slate-400 hover:text-white"
                >
                  {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Current Case Status</span>
              <div className="text-cyan-400 font-bold uppercase text-xs">Submitted & Queued</div>
            </div>
          </div>

          <div className="text-slate-300 leading-relaxed text-xs">
            <strong>Next Steps: </strong> A copy of your report has been placed in the campus security log.
            If this incident involves monetary theft, file an official cyber complaint at{' '}
            <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-semibold">
              cybercrime.gov.in
            </a>{' '}
            using this reference number as supplemental evidence.
          </div>
        </div>
      )}

      {/* Reporting Form & Recent Cases Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-cyber-secondary border border-cyber-border shadow-glass space-y-5 text-xs">
          <h3 className="font-bold text-white text-sm">Submit New Cyber Incident Report</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Incident Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-cyber-card border border-cyber-border text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
              >
                <option value="Phishing">Phishing Attacks & Deceptive Links</option>
                <option value="OTP Fraud">OTP & Credential Interception Fraud</option>
                <option value="UPI Fraud">UPI Payment & Fake QR Reverse Fraud</option>
                <option value="Fake Customer-Care Calls">Fake Customer-Care & Remote Desktop Traps</option>
                <option value="QR Code Scams">Counterfeit / Pasted QR Scams</option>
                <option value="Fake College Notices">Fake College Notices & Forged Circulars</option>
                <option value="Identity Theft">Student Identity Theft & Impersonation</option>
                <option value="Other Cybercrime">Other Cybercrime Threat</option>
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Detailed Description of What Occurred</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe how the contact was initiated, exact text of SMS/email, sender handles or phone numbers, and any actions taken..."
                className="w-full p-4 rounded-xl bg-cyber-card border border-cyber-border text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Date & Financial Loss */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Date of Incident</label>
                <input
                  type="date"
                  value={incidentDate}
                  onChange={e => setIncidentDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-cyber-card border border-cyber-border text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Approximate Financial Loss (INR ₹, if any)</label>
                <input
                  type="number"
                  value={financialLoss}
                  onChange={e => setFinancialLoss(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl bg-cyber-card border border-cyber-border text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            {/* Contact Details (Optional) */}
            <div className="pt-2 border-t border-cyber-border/60 space-y-3">
              <span className="text-[11px] font-bold text-slate-300 block">
                Contact Information (Optional - Leave blank to report anonymously)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={reporterName}
                  onChange={e => setReporterName(e.target.value)}
                  placeholder="Your Name (Optional)"
                  className="px-3 py-2 rounded-xl bg-cyber-card border border-cyber-border text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <input
                  type="email"
                  value={reporterEmail}
                  onChange={e => setReporterEmail(e.target.value)}
                  placeholder="Email (Optional)"
                  className="px-3 py-2 rounded-xl bg-cyber-card border border-cyber-border text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <input
                  type="tel"
                  value={reporterPhone}
                  onChange={e => setReporterPhone(e.target.value)}
                  placeholder="Phone Number (Optional)"
                  className="px-3 py-2 rounded-xl bg-cyber-card border border-cyber-border text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-xs shadow-lg hover:opacity-95 transition-opacity disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Submitting Incident...' : 'Submit Incident Report to TrustDesk'}
            </button>
          </form>

          {/* Prototype Notice */}
          <p className="text-[11px] text-slate-500 text-center italic pt-1">
            * Note: These are institutional prototype reports for Vishnu Institute of Technology. Submitting here does NOT automatically lodge a state police First Information Report (FIR).
          </p>
        </div>

        {/* Recent Cases Column */}
        <div className="p-6 rounded-3xl bg-cyber-secondary border border-cyber-border shadow-glass space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Recent Campus Incidents</h3>
            <span className="text-[10px] text-slate-400">{recentIncidents.length} Cases</span>
          </div>

          <div className="space-y-3">
            {recentIncidents.slice(0, 5).map((inc, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-cyber-card border border-cyber-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-cyan-400 text-[11px] font-bold">{inc.caseId}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      inc.status === 'resolved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : inc.status === 'under_investigation'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-cyan-500/20 text-cyan-300'
                    }`}
                  >
                    {inc.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-white font-semibold text-xs">{inc.category}</div>
                <p className="text-slate-300 text-[11px] line-clamp-2 leading-relaxed">
                  {inc.description}
                </p>
                {inc.adminRemarks && (
                  <div className="text-[10px] text-cyan-300 pt-1 border-t border-cyber-border/40">
                    <strong>Admin Remark: </strong> {inc.adminRemarks}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

