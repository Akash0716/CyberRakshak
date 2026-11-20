import React, { useState } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  FileText, 
  CreditCard, 
  ArrowRight, 
  Download, 
  Shield, 
  PhoneCall, 
  Copy, 
  Check 
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { downloadNoticeReceipt, downloadPaymentReceipt } from '../utils/receiptPdf';

export const LiveDemoPage: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [loadingScenario, setLoadingScenario] = useState<string | null>(null);
  const [scenarioData, setScenarioData] = useState<any>(null);
  const [copiedText, setCopiedText] = useState(false);
  const { showToast } = useToast();

  const runScenario = async (scenarioId: string) => {
    try {
      setLoadingScenario(scenarioId);
      setActiveScenario(scenarioId);
      setScenarioData(null);

      const res = await api.get(`/demo/${scenarioId}`);
      if (res.data.success) {
        setScenarioData(res.data);
        showToast('Demo Loaded', `Executed: ${res.data.demoName}`, 'success');
      }
    } catch (err: any) {
      showToast('Execution Error', err.response?.data?.message || 'Failed to execute demo scenario.', 'error');
    } finally {
      setLoadingScenario(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
    showToast('Copied', 'Case ID copied to clipboard.', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          Section 12 • Mandatory Live Evaluation Mode
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Interactive Cybersecurity Demonstration Lab
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          Built specifically for faculty evaluation at Vishnu Institute of Technology.
          Test all four core defense scenarios with guaranteed instant execution without external credentials.
        </p>
      </div>

      {/* 4 Interactive Scenario Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Scenario 1 */}
        <div className={`p-5 rounded-2xl bg-cyber-secondary border transition-all flex flex-col justify-between ${
          activeScenario === 'demo-1-genuine' ? 'border-emerald-500 ring-1 ring-emerald-500/30' : 'border-cyber-border hover:border-emerald-500/40'
        }`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Scenario 1
              </span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Genuine Circular</h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Verifies registered exam fee notice VIT-NOT-2026-0891 with SHA-256 seal & dual authorization.
            </p>
          </div>
          <button
            onClick={() => runScenario('demo-1-genuine')}
            disabled={loadingScenario === 'demo-1-genuine'}
            className="w-full mt-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 font-bold text-xs transition-colors"
          >
            {loadingScenario === 'demo-1-genuine' ? 'Validating...' : 'Verify Genuine Notice'}
          </button>
        </div>

        {/* Scenario 2 */}
        <div className={`p-5 rounded-2xl bg-cyber-secondary border transition-all flex flex-col justify-between ${
          activeScenario === 'demo-2-fake' ? 'border-amber-500 ring-1 ring-amber-500/30' : 'border-cyber-border hover:border-amber-500/40'
        }`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                Scenario 2
              </span>
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Tampered Fake Circular</h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Simulates a forged WhatsApp notice where attackers altered the fee UPI ID and expiry dates.
            </p>
          </div>
          <button
            onClick={() => runScenario('demo-2-fake')}
            disabled={loadingScenario === 'demo-2-fake'}
            className="w-full mt-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 font-bold text-xs transition-colors"
          >
            {loadingScenario === 'demo-2-fake' ? 'Detecting...' : 'Detect Fake Notice'}
          </button>
        </div>

        {/* Scenario 3 */}
        <div className={`p-5 rounded-2xl bg-cyber-secondary border transition-all flex flex-col justify-between ${
          activeScenario === 'demo-3-payment-mismatch' ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-cyber-border hover:border-rose-500/40'
        }`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                Scenario 3
              </span>
              <CreditCard className="w-5 h-5 text-rose-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Payment Spoof Guard</h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Catches fake UPI handle <code className="text-rose-400">vishnu.fee.payment@okaxis</code> masquerading as official college account.
            </p>
          </div>
          <button
            onClick={() => runScenario('demo-3-payment-mismatch')}
            disabled={loadingScenario === 'demo-3-payment-mismatch'}
            className="w-full mt-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 font-bold text-xs transition-colors"
          >
            {loadingScenario === 'demo-3-payment-mismatch' ? 'Checking...' : 'Test Payment Protection'}
          </button>
        </div>

        {/* Scenario 4 */}
        <div className={`p-5 rounded-2xl bg-cyber-secondary border transition-all flex flex-col justify-between ${
          activeScenario === 'demo-4-incident' ? 'border-cyan-500 ring-1 ring-cyan-500/30' : 'border-cyber-border hover:border-cyan-500/40'
        }`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                Scenario 4
              </span>
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Incident Simulation</h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Submits a simulated exam phishing attack and issues unique Case Reference with 1930 escalation.
            </p>
          </div>
          <button
            onClick={() => runScenario('demo-4-incident')}
            disabled={loadingScenario === 'demo-4-incident'}
            className="w-full mt-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 font-bold text-xs transition-colors"
          >
            {loadingScenario === 'demo-4-incident' ? 'Generating...' : 'Simulate Cyber Incident'}
          </button>
        </div>
      </div>

      {/* Live Results Display Area */}
      {scenarioData && (
        <div className="p-6 sm:p-8 rounded-3xl bg-cyber-secondary border border-cyber-border shadow-glass space-y-6 animate-fadeIn">
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-cyber-border">
            <div>
              <div className="text-xs uppercase font-bold text-cyan-400 tracking-wider">Evaluation Output</div>
              <h2 className="text-xl font-bold text-white mt-1">{scenarioData.demoName}</h2>
              <p className="text-xs text-slate-300 mt-0.5">{scenarioData.description}</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Result Status Badge */}
              <div
                className={`px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 ${
                  scenarioData.result === 'VERIFIED'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : scenarioData.result === 'WARNING'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : scenarioData.result === 'MISMATCH'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                }`}
              >
                {scenarioData.result || 'SIMULATION COMPLETE'}
              </div>

              {/* PDF Download Action if applicable */}
              {scenarioData.result && (
                <button
                  onClick={() => {
                    if (scenarioData.scenario === 'payment_mismatch') {
                      downloadPaymentReceipt(scenarioData, scenarioData.enteredDetails);
                    } else {
                      downloadNoticeReceipt(scenarioData);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-cyber-card border border-cyber-border hover:border-cyan-400 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  PDF Receipt
                </button>
              )}
            </div>
          </div>

          {/* Scenario Specific Content */}
          {/* DEMO 1: Genuine Notice */}
          {scenarioData.scenario === 'genuine_notice' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200">
                <span className="font-bold">Cryptographic Verdict: </span>
                {scenarioData.reason}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Document Information</div>
                  <div className="text-white font-bold text-sm">{scenarioData.originalNotice.title}</div>
                  <div className="text-slate-300">Department: {scenarioData.originalNotice.department}</div>
                  <div className="text-slate-300">Issuing Officer: {scenarioData.originalNotice.issuer}</div>
                  <div className="text-cyan-400 font-mono">Notice ID: {scenarioData.noticeId}</div>
                </div>

                <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Dual-Authorization & Crypto Seals</div>
                  <div className="text-slate-300">
                    Dual Approver: <strong className="text-white">{scenarioData.originalNotice.approver}</strong>
                  </div>
                  <div className="text-slate-300">Approval Status: <span className="text-emerald-400 uppercase font-semibold">Published</span></div>
                  <div className="text-slate-400 font-mono text-[10px] break-all">
                    SHA-256 Digest: {scenarioData.originalNotice.contentHash}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DEMO 2: Fake Notice with Mismatch Diff Highlights */}
          {scenarioData.scenario === 'fake_notice' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200">
                <span className="font-bold">Tamper Detection Engine Alert: </span>
                {scenarioData.reason}
              </div>

              <div className="border border-cyber-border rounded-xl overflow-hidden">
                <div className="p-3 bg-cyber-card font-bold text-white text-xs border-b border-cyber-border">
                  Tampered Fields Highlight Matrix:
                </div>
                <table className="w-full text-left divide-y divide-cyber-border">
                  <thead className="bg-cyber-darker text-[11px] text-slate-400">
                    <tr>
                      <th className="py-2.5 px-4">Field</th>
                      <th className="py-2.5 px-4 text-emerald-400">Official Vishnu Registered Value</th>
                      <th className="py-2.5 px-4 text-rose-400">Circulated Tampered Value</th>
                      <th className="py-2.5 px-4">Severity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyber-border text-[11px]">
                    {scenarioData.mismatches.map((m: any, idx: number) => (
                      <tr key={idx} className="bg-rose-500/5 hover:bg-rose-500/10 transition-colors">
                        <td className="py-2.5 px-4 font-bold text-white">{m.label}</td>
                        <td className="py-2.5 px-4 text-emerald-300">{String(m.originalValue)}</td>
                        <td className="py-2.5 px-4 text-rose-300 font-mono font-bold">{String(m.submittedValue)}</td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-400">
                            {m.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DEMO 3: Payment Mismatch */}
          {scenarioData.scenario === 'payment_mismatch' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-200">
                <span className="font-bold">Payment Change Guard Warning: </span>
                {scenarioData.recommendation}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border space-y-2">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase">Official Registered Account</div>
                  <div className="text-white font-bold">{scenarioData.approvedOfficialRecord.beneficiary}</div>
                  <div className="text-slate-300 font-mono">UPI: {scenarioData.approvedOfficialRecord.upiId}</div>
                  <div className="text-slate-300">Bank: {scenarioData.approvedOfficialRecord.bankName}</div>
                  <div className="text-slate-400">Account: {scenarioData.approvedOfficialRecord.maskedAccount}</div>
                </div>

                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 space-y-2">
                  <div className="text-[10px] font-bold text-rose-400 uppercase">Fraudulent Target Intercepted</div>
                  <div className="text-rose-200 font-bold">{scenarioData.enteredDetails.beneficiary}</div>
                  <div className="text-rose-300 font-mono font-bold">UPI: {scenarioData.enteredDetails.upiId}</div>
                  <div className="text-slate-400">Attempted Amount: Rs. {scenarioData.enteredDetails.amount}</div>
                  <div className="text-rose-400 font-semibold text-[11px] pt-1">
                    Discrepancy: Spoofed VPA not owned by Vishnu Institute of Technology.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DEMO 4: Incident Simulation */}
          {scenarioData.scenario === 'incident_simulation' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-cyber-card border border-cyan-500/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Case Reference Number</span>
                  <div className="font-mono text-cyan-400 text-base font-bold flex items-center gap-2 mt-0.5">
                    {scenarioData.caseId}
                    <button
                      onClick={() => copyToClipboard(scenarioData.caseId)}
                      className="p-1 rounded hover:bg-cyber-secondary text-slate-400 hover:text-white"
                    >
                      {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Case Status</span>
                  <div className="text-amber-400 font-bold uppercase text-xs">Under Investigation</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border space-y-2">
                <div className="font-bold text-white text-xs">Automated Recommended Actions & Response Protocol:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {scenarioData.incident.recommendedActions.map((action: string, idx: number) => (
                    <li key={idx}>{action}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between text-rose-200">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-rose-400" />
                  <span>National Cybercrime Emergency Helpline: Dial <strong>1930</strong> immediately.</span>
                </div>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline font-bold"
                >
                  cybercrime.gov.in
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

