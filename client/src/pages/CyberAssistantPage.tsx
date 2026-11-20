import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  ShieldAlert, 
  Globe2, 
  AlertTriangle, 
  CheckCircle, 
  Shield, 
  HelpCircle, 
  Info,
  Zap,
  PhoneCall,
  Lock
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { AIAnalysis } from '../types';

export const CyberAssistantPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysis | null>(null);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const { language, setLanguage } = useAccessibility();
  const { showToast } = useToast();

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const res = await api.get('/ai/scenarios');
      if (res.data.success) {
        setScenarios(res.data.scenarios);
      }
    } catch {
      // Handled silently
    }
  };

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = (textToAnalyze || inputText).trim();
    if (!text) {
      showToast('Input Required', 'Please paste a suspicious message or type a cyber query.', 'warning');
      return;
    }

    try {
      setIsAnalyzing(true);
      setAnalysisResult(null);

      const res = await api.post('/ai/analyze', {
        content: text,
        language
      });

      if (res.data.success) {
        setAnalysisResult(res.data.analysis);
        showToast('Analysis Completed', `Threat assessed as: ${res.data.analysis.riskLevel} Risk`, 'info');
      }
    } catch (err: any) {
      showToast('AI Analysis Error', err.response?.data?.message || 'Failed to analyze content.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectScenario = (sample: any) => {
    setInputText(sample.sampleText);
    if (sample.language) {
      setLanguage(sample.language);
    }
    handleAnalyze(sample.sampleText);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Priority Feature 3 • Cyber AI Threat Intelligence
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI-Powered Phishing & Threat Analyzer
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          Analyze suspicious SMS, fake caller numbers, malicious URLs, or payment requests using Google Gemini AI.
          Available in both English and Telugu.
        </p>
      </div>

      {/* Language Switcher & Controls */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Globe2 className="w-4 h-4 text-cyan-400" />
          <span>Analysis Language:</span>
          <div className="inline-flex rounded-lg bg-cyber-secondary p-1 border border-cyber-border">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                language === 'en' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('te')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                language === 'te' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              తెలుగు (Telugu)
            </button>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Advisory Protection • Google Gemini Engine
        </span>
      </div>

      {/* Input Box Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-cyber-secondary border border-cyber-border shadow-glass space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-white flex items-center justify-between">
            <span>Paste suspicious text, SMS, URL, or describe a suspicious phone call:</span>
            <span className="text-[10px] text-slate-400">Do NOT paste real OTPs or passwords</span>
          </label>
          <textarea
            rows={4}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="e.g., 'Dear Student, your semester result is withheld. Click http://vit-kyc-update.xyz to pay dues and submit OTP within 1 hour.'"
            className="w-full p-4 rounded-2xl bg-cyber-card border border-cyber-border text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none leading-relaxed"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>AI never executes submitted links or visits dangerous external servers.</span>
          </div>

          <button
            onClick={() => handleAnalyze()}
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs shadow-cyan-glow hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing Threat Markers...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze with AI</span>
              </>
            )}
          </button>
        </div>

        {/* Pre-built scenario test pills */}
        <div className="pt-4 border-t border-cyber-border/60 space-y-2">
          <div className="text-[10px] uppercase font-bold text-slate-400">
            Click to test real-world campus scam examples:
          </div>
          <div className="flex flex-wrap gap-2">
            {scenarios.map(s => (
              <button
                key={s.id}
                onClick={() => handleSelectScenario(s)}
                className="px-3 py-1.5 rounded-lg bg-cyber-card hover:bg-cyber-cardHover border border-cyber-border hover:border-purple-500/50 text-[11px] text-slate-300 hover:text-white transition-all text-left flex items-center gap-1.5"
              >
                <Zap className="w-3 h-3 text-purple-400" />
                <span>{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Structured Analysis Result Card */}
      {analysisResult && (
        <div className="p-6 sm:p-8 rounded-3xl bg-cyber-secondary border border-cyber-border shadow-glass space-y-6 animate-fadeIn text-xs">
          {/* Header & Risk Level */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-cyber-border">
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">AI Security Diagnosis</span>
              <div className="text-base font-bold text-white mt-0.5">Threat Category: {analysisResult.category}</div>
            </div>

            <div className="flex items-center gap-3">
              {/* Risk Score Pill */}
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Risk Score</span>
                <span className="font-mono text-sm font-bold text-white">{analysisResult.riskScore} / 100</span>
              </div>

              {/* Risk Level Badge */}
              <div
                className={`px-4 py-2 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 ${
                  analysisResult.riskLevel === 'High'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                    : analysisResult.riskLevel === 'Medium'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {analysisResult.riskLevel === 'High' ? (
                  <ShieldAlert className="w-4 h-4" />
                ) : analysisResult.riskLevel === 'Medium' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                {analysisResult.riskLevel} Risk
              </div>
            </div>
          </div>

          {/* Indicators Identified */}
          <div className="space-y-2">
            <div className="font-bold text-slate-200">Suspicious Indicators Identified:</div>
            <div className="flex flex-wrap gap-2">
              {analysisResult.indicators.map((ind, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] font-semibold flex items-center gap-1"
                >
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  {ind}
                </span>
              ))}
            </div>
          </div>

          {/* Plain Language Explanation */}
          <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border space-y-1">
            <div className="font-bold text-cyan-300 text-[11px] uppercase tracking-wide">
              {language === 'te' ? 'విశ్లేషణ వివరణ (Explanation):' : 'Plain Language Threat Assessment:'}
            </div>
            <p className="text-slate-200 leading-relaxed text-xs">{analysisResult.explanation}</p>
          </div>

          {/* Recommended Next Steps & Safety Precautions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recommended Steps */}
            <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border space-y-2">
              <div className="font-bold text-white text-xs flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                {language === 'te' ? 'తీసుకోవలసిన చర్యలు (Recommended Next Steps):' : 'Recommended Next Steps:'}
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-slate-300 text-[11px]">
                {analysisResult.recommendedSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>

            {/* Precautions */}
            <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border space-y-2">
              <div className="font-bold text-white text-xs flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                {language === 'te' ? 'ముఖ్యమైన జాగ్రత్తలు (Safety Precautions):' : 'Mandatory Safety Precautions:'}
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-slate-300 text-[11px]">
                {analysisResult.safetyPrecautions.map((prec, idx) => (
                  <li key={idx}>{prec}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Disclaimer & Emergency Callout */}
          <div className="pt-4 border-t border-cyber-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <div>
              <strong>Advisory Notice: </strong> {analysisResult.disclaimer}
            </div>
            <div className="flex items-center gap-2 text-rose-300 shrink-0 font-bold">
              <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
              <span>National Cyber Helpline: 1930</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

