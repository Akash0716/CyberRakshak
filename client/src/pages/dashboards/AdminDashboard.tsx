import React, { useState, useEffect } from 'react';
import { 
  FilePlus, 
  FileCheck2, 
  AlertTriangle, 
  ShieldCheck, 
  CreditCard, 
  TrendingUp, 
  Ban, 
  CheckCircle, 
  Clock, 
  X,
  Search,
  MessageSquare
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Notice, Incident, PaymentRecord } from '../../types';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notices' | 'incidents' | 'payments' | 'create-notice'>('notices');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);

  // Create Notice Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Academic');
  const [newDepartment, setNewDepartment] = useState('Department of CSE');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('high');
  const [newExpiryDate, setNewExpiryDate] = useState('2026-06-30');
  const [newDescription, setNewDescription] = useState('');
  const [newPaymentUpi, setNewPaymentUpi] = useState('');
  const [newPaymentBeneficiary, setNewPaymentBeneficiary] = useState('');
  const [isCreatingNotice, setIsCreatingNotice] = useState(false);

  // Revoke modal
  const [revokingNoticeId, setRevokingNoticeId] = useState<string | null>(null);
  const [revocationReason, setRevocationReason] = useState('');

  // Incident remark modal
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [incidentStatus, setIncidentStatus] = useState<any>('under_investigation');
  const [incidentRemarks, setIncidentRemarks] = useState('');

  const { showToast } = useToast();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [noticesRes, incidentsRes, paymentsRes] = await Promise.all([
        api.get('/notices'),
        api.get('/incidents'),
        api.get('/payments/records')
      ]);

      if (noticesRes.data.success) setNotices(noticesRes.data.notices);
      if (incidentsRes.data.success) setIncidents(incidentsRes.data.incidents);
      if (paymentsRes.data.success) setPaymentRecords(paymentsRes.data.records);
    } catch {
      // Ignored
    }
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription || !newDepartment || !newExpiryDate) {
      showToast('Validation Error', 'Please complete all required fields.', 'warning');
      return;
    }

    try {
      setIsCreatingNotice(true);
      const payload: any = {
        title: newTitle,
        category: newCategory,
        department: newDepartment,
        priority: newPriority,
        expiryDate: newExpiryDate,
        description: newDescription
      };

      if (newPaymentUpi || newPaymentBeneficiary) {
        payload.paymentDetailsReferenced = {
          upiId: newPaymentUpi,
          beneficiary: newPaymentBeneficiary
        };
      }

      const res = await api.post('/notices', payload);
      if (res.data.success) {
        showToast('Notice Created', 'Notice queued for Independent Approver review.', 'success');
        setNewTitle('');
        setNewDescription('');
        setNewPaymentUpi('');
        setNewPaymentBeneficiary('');
        setActiveTab('notices');
        fetchAdminData();
      }
    } catch (err: any) {
      showToast('Creation Failed', err.response?.data?.message || 'Failed to create notice.', 'error');
    } finally {
      setIsCreatingNotice(false);
    }
  };

  const handleRevokeNotice = async () => {
    if (!revokingNoticeId || !revocationReason) {
      showToast('Reason Required', 'Please enter a valid revocation reason.', 'warning');
      return;
    }

    try {
      const res = await api.post(`/notices/${revokingNoticeId}/revoke`, {
        reason: revocationReason
      });
      if (res.data.success) {
        showToast('Notice Revoked', `Notice ${revokingNoticeId} is now revoked campus-wide.`, 'success');
        setRevokingNoticeId(null);
        setRevocationReason('');
        fetchAdminData();
      }
    } catch (err: any) {
      showToast('Revocation Failed', err.response?.data?.message || 'Failed to revoke notice.', 'error');
    }
  };

  const handleUpdateIncident = async () => {
    if (!selectedIncident) return;
    try {
      const res = await api.patch(`/incidents/${selectedIncident.caseId}/status`, {
        status: incidentStatus,
        adminRemarks: incidentRemarks
      });
      if (res.data.success) {
        showToast('Incident Updated', `Case ${selectedIncident.caseId} marked as ${incidentStatus}.`, 'success');
        setSelectedIncident(null);
        setIncidentRemarks('');
        fetchAdminData();
      }
    } catch (err: any) {
      showToast('Update Failed', err.response?.data?.message || 'Failed to update case.', 'error');
    }
  };

  // Analytics data for charts
  const incidentCategoryData = [
    { name: 'Phishing', count: incidents.filter(i => i.category === 'Phishing').length },
    { name: 'UPI Fraud', count: incidents.filter(i => i.category === 'UPI Fraud').length },
    { name: 'Fake Notices', count: incidents.filter(i => i.category === 'Fake College Notices').length },
    { name: 'OTP Fraud', count: incidents.filter(i => i.category === 'OTP Fraud').length },
    { name: 'QR Scams', count: incidents.filter(i => i.category === 'QR Code Scams').length }
  ];

  const noticeStatusData = [
    { name: 'Published', value: notices.filter(n => n.status === 'published').length, color: '#10B981' },
    { name: 'Pending Review', value: notices.filter(n => n.status === 'pending_review').length, color: '#F59E0B' },
    { name: 'Revoked', value: notices.filter(n => n.status === 'revoked').length, color: '#EF4444' }
  ];

  return (
    <div className="space-y-8 text-xs">
      {/* Top Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-cyber-secondary border border-cyber-border shadow-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">Campus Administration Portal</span>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
            TrustDesk Administration & Governance
          </h1>
          <p className="text-slate-400 mt-0.5">
            Create notices, review incidents, govern payment channels, and analyze security posture.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('create-notice')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-cyan-glow flex items-center gap-2 hover:opacity-95 transition-opacity"
        >
          <FilePlus className="w-4 h-4" />
          <span>Draft Official Notice</span>
        </button>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-cyber-secondary border border-cyber-border">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Notices</span>
          <div className="text-2xl font-bold text-white mt-1">{notices.length}</div>
          <div className="text-[11px] text-cyan-400 mt-0.5">Campus Ledger</div>
        </div>
        <div className="p-4 rounded-2xl bg-cyber-secondary border border-cyber-border">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Published Notices</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {notices.filter(n => n.status === 'published').length}
          </div>
          <div className="text-[11px] text-emerald-300 mt-0.5">Dual-Approved Active</div>
        </div>
        <div className="p-4 rounded-2xl bg-cyber-secondary border border-cyber-border">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Pending Approvals</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {notices.filter(n => n.status === 'pending_review').length}
          </div>
          <div className="text-[11px] text-amber-300 mt-0.5">Awaiting Approver</div>
        </div>
        <div className="p-4 rounded-2xl bg-cyber-secondary border border-cyber-border">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Incident Reports</span>
          <div className="text-2xl font-bold text-rose-400 mt-1">{incidents.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Campus Security Logs</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-cyber-secondary border border-cyber-border shadow-glass space-y-4">
          <h3 className="font-bold text-white text-xs">Reported Incident Categories Breakdown</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidentCategoryData}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} />
                <YAxis stroke="#94A3B8" fontSize={10} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#12263A', borderColor: '#1F3A56', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#00D9FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-cyber-secondary border border-cyber-border shadow-glass space-y-4">
          <h3 className="font-bold text-white text-xs">Notice Governance Status</h3>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={noticeStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {noticeStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#12263A', borderColor: '#1F3A56', color: '#fff', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-cyber-border text-xs font-semibold">
        <button
          onClick={() => setActiveTab('notices')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'notices' ? 'border-cyan-400 text-cyan-300 font-bold' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Manage Notices ({notices.length})
        </button>
        <button
          onClick={() => setActiveTab('incidents')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'incidents' ? 'border-cyan-400 text-cyan-300 font-bold' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Incident Desk ({incidents.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'payments' ? 'border-cyan-400 text-cyan-300 font-bold' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Payment Channels ({paymentRecords.length})
        </button>
        <button
          onClick={() => setActiveTab('create-notice')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'create-notice' ? 'border-cyan-400 text-cyan-300 font-bold' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          + Draft New Notice
        </button>
      </div>

      {/* Tab 1: Notices Table */}
      {activeTab === 'notices' && (
        <div className="p-6 rounded-3xl bg-cyber-secondary border border-cyber-border shadow-glass space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Campus Official Notices Ledger</h3>
            <span className="text-[11px] text-slate-400">Total: {notices.length} registered circulars</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left divide-y divide-cyber-border">
              <thead className="bg-cyber-card text-[11px] text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">Notice ID</th>
                  <th className="py-2.5 px-3">Title & Category</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Expiry</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border text-[11px]">
                {notices.map((n, i) => (
                  <tr key={i} className="hover:bg-cyber-card/30">
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">{n.noticeId}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-white">{n.title}</div>
                      <div className="text-[10px] text-slate-400">{n.category}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{n.department}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          n.status === 'published'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : n.status === 'pending_review'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {n.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{new Date(n.expiryDate).toLocaleDateString()}</td>
                    <td className="py-2.5 px-3 text-right">
                      {n.status === 'published' && (
                        <button
                          onClick={() => setRevokingNoticeId(n.noticeId)}
                          className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 transition-colors font-semibold"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Incident Management Table */}
      {activeTab === 'incidents' && (
        <div className="p-6 rounded-3xl bg-cyber-secondary border border-cyber-border shadow-glass space-y-4">
          <h3 className="font-bold text-white text-sm">Campus Incident Redressal Queue</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left divide-y divide-cyber-border">
              <thead className="bg-cyber-card text-[11px] text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">Case ID</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Reporter</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border text-[11px]">
                {incidents.map((inc, i) => (
                  <tr key={i} className="hover:bg-cyber-card/30">
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">{inc.caseId}</td>
                    <td className="py-2.5 px-3 font-semibold text-white">{inc.category}</td>
                    <td className="py-2.5 px-3 text-slate-300">{inc.reporterName || 'Anonymous'}</td>
                    <td className="py-2.5 px-3 text-slate-300 max-w-xs truncate">{inc.description}</td>
                    <td className="py-2.5 px-3">
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
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedIncident(inc);
                          setIncidentStatus(inc.status);
                          setIncidentRemarks(inc.adminRemarks || '');
                        }}
                        className="px-2.5 py-1 rounded bg-cyber-card border border-cyber-border hover:border-cyan-400 text-cyan-300 font-semibold"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Payment Channels */}
      {activeTab === 'payments' && (
        <div className="p-6 rounded-3xl bg-cyber-secondary border border-cyber-border shadow-glass space-y-4">
          <h3 className="font-bold text-white text-sm">Approved Campus Financial Accounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentRecords.map((acc, i) => (
              <div key={i} className="p-4 rounded-2xl bg-cyber-card border border-cyber-border space-y-2">
                <div className="font-bold text-white text-xs">{acc.beneficiary}</div>
                <div className="font-mono text-cyan-400 font-bold">{acc.upiId}</div>
                <div className="text-slate-300">{acc.bankName}</div>
                <div className="text-slate-400">{acc.maskedAccount} • IFSC: {acc.ifsc}</div>
                <div className="text-slate-500 text-[10px]">{acc.purpose}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Draft New Notice Form */}
      {activeTab === 'create-notice' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-cyber-secondary border border-cyber-border shadow-glass space-y-5">
          <div>
            <h3 className="font-bold text-white text-sm">Draft Official Notice (Requires Dual-Approval)</h3>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Administrators create notices, but they require independent review and cryptographic sign-off before campus publication.
            </p>
          </div>

          <form onSubmit={handleCreateNotice} className="space-y-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Notice Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g., Campus Placement Drive Schedule - IT & CSE"
                className="w-full px-4 py-2.5 rounded-xl bg-cyber-card border border-cyber-border text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-cyber-card border border-cyber-border text-white text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="Academic">Academic</option>
                  <option value="Examination">Examination</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Placement">Placement</option>
                  <option value="Events">Events</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Issuing Department</label>
                <input
                  type="text"
                  required
                  value={newDepartment}
                  onChange={e => setNewDepartment(e.target.value)}
                  placeholder="Examination Cell"
                  className="w-full px-4 py-2.5 rounded-xl bg-cyber-card border border-cyber-border text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Validity Expiry Date</label>
                <input
                  type="date"
                  required
                  value={newExpiryDate}
                  onChange={e => setNewExpiryDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-cyber-card border border-cyber-border text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Official Notice Description / Body Content</label>
              <textarea
                rows={4}
                required
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="Enter complete circular text..."
                className="w-full p-4 rounded-xl bg-cyber-card border border-cyber-border text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
              />
            </div>

            {/* Optional Referenced Payment Details */}
            <div className="p-4 rounded-2xl bg-cyber-card border border-cyber-border space-y-3">
              <div className="text-cyan-400 font-bold text-xs flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                Referenced Official Bank Details (If circular requires fee payment)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newPaymentBeneficiary}
                  onChange={e => setNewPaymentBeneficiary(e.target.value)}
                  placeholder="Beneficiary: Vishnu Institute Exam Fund"
                  className="px-3 py-2 rounded-xl bg-cyber-darker border border-cyber-border text-white text-xs"
                />
                <input
                  type="text"
                  value={newPaymentUpi}
                  onChange={e => setNewPaymentUpi(e.target.value)}
                  placeholder="Official UPI: vishnu.exams@okaxis"
                  className="px-3 py-2 rounded-xl bg-cyber-darker border border-cyber-border text-white text-xs font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isCreatingNotice}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-cyan-glow hover:opacity-95 transition-opacity disabled:opacity-50 mt-2"
            >
              {isCreatingNotice ? 'Generating QR & Hashes...' : 'Queue Notice for Independent Approval'}
            </button>
          </form>
        </div>
      )}

      {/* Revocation Reason Modal */}
      {revokingNoticeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-cyber-secondary border border-rose-500/40 shadow-glass space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 text-rose-400">
              <Ban className="w-4 h-4" />
              Revoke Official Circular: {revokingNoticeId}
            </h3>
            <p className="text-slate-300 text-xs">
              Revoking marks the circular as invalid campus-wide. Please provide the administrative revocation reason:
            </p>
            <textarea
              rows={3}
              value={revocationReason}
              onChange={e => setRevocationReason(e.target.value)}
              placeholder="e.g., Circular superseded by revised academic calendar VIT-NOT-2026-0920."
              className="w-full p-3 rounded-xl bg-cyber-card border border-cyber-border text-white text-xs"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRevokingNoticeId(null)}
                className="px-4 py-2 rounded-xl text-slate-300 hover:bg-cyber-card font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRevokeNotice}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                Confirm Revocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incident Status Update Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-cyber-secondary border border-cyan-500/40 shadow-glass space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              Update Incident Case: {selectedIncident.caseId}
            </h3>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Update Status</label>
              <select
                value={incidentStatus}
                onChange={e => setIncidentStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-cyber-card border border-cyber-border text-white text-xs"
              >
                <option value="submitted">Submitted</option>
                <option value="under_investigation">Under Investigation</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Internal Security Remarks</label>
              <textarea
                rows={3}
                value={incidentRemarks}
                onChange={e => setIncidentRemarks(e.target.value)}
                placeholder="e.g., Domain reported to AP Cyber Crime cell & blocked on firewall."
                className="w-full p-3 rounded-xl bg-cyber-card border border-cyber-border text-white text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-2 rounded-xl text-slate-300 hover:bg-cyber-card font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateIncident}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold"
              >
                Save Updates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

