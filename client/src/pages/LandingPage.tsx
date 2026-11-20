import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  AlertTriangle, 
  FileCheck2, 
  ArrowRight, 
  CheckCircle, 
  Smartphone, 
  QrCode, 
  PhoneOff, 
  Globe2, 
  Users, 
  Zap,
  Award
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { TRANSLATIONS } from '../utils/translations';

export const LandingPage: React.FC = () => {
  const { language } = useAccessibility();
  const t = TRANSLATIONS[language];

  const surveyProblems = [
    {
      icon: <Smartphone className="w-5 h-5 text-rose-400" />,
      title: 'Phishing Attacks & Fake Links',
      titleTe: 'ఫిషింగ్ దాడులు మరియు నకిలీ లింకులు',
      description: 'Deceptive SMS and WhatsApp circulars targeting students with urgency to harvest college portal credentials.',
      descriptionTe: 'విద్యార్థుల లాగిన్ వివరాలు దొంగిలించడానికి అత్యవసరమని వచ్చే నకిలీ ఎస్ఎమ్ఎస్ మరియు లింకులు.'
    },
    {
      icon: <Lock className="w-5 h-5 text-amber-400" />,
      title: 'OTP & UPI Payment Fraud',
      titleTe: 'OTP మరియు UPI చెల్లింపుల మోసాలు',
      description: 'Misleading instructions coercing students to enter their UPI PIN under the false premise of receiving refunds.',
      descriptionTe: 'డబ్బులు తిరిగి ఇస్తామని నమ్మించి విద్యార్థులతో యూపీఐ పిన్ ఎంటర్ చేయించి చేసే మోసాలు.'
    },
    {
      icon: <PhoneOff className="w-5 h-5 text-cyan-400" />,
      title: 'Fake Customer-Care Calls',
      titleTe: 'నకిలీ కస్టమర్ కేర్ కాల్స్',
      description: 'Impersonators posing as bank branch managers or exam controllers demanding immediate card or OTP verification.',
      descriptionTe: 'బ్యాంక్ లేదా కళాశాల అధికారుల పేరిట ఫోన్ చేసి ఓటీపీ మరియు బ్యాంక్ వివరాలు అడిగే వల.'
    },
    {
      icon: <QrCode className="w-5 h-5 text-emerald-400" />,
      title: 'Pasted & Malicious QR Scams',
      titleTe: 'నకిలీ క్యూఆర్ కోడ్ స్కామ్లు',
      description: 'Counterfeit payment QR codes pasted over legitimate campus cafeteria and stationery store payment counters.',
      descriptionTe: 'కళాశాల క్యాంటీన్ లేదా బుక్‌స్టాల్ కౌంటర్లపై ఉన్న నిజమైన క్యూఆర్ కోడ్లపై నకిలీ స్టిక్కర్లు అంటించడం.'
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-purple-400" />,
      title: 'Reporting Barrier & Stigma',
      titleTe: 'సైబర్‌క్రైమ్ ఫిర్యాదు చేయడంలో ఇబ్బందులు',
      description: 'Hesitation, lack of immediate campus redressal mechanisms, and delay in freezing fraudulent transactions.',
      descriptionTe: 'మోసపోయిన వెంటనే ఎవరిని సంప్రదించాలో తెలియకపోవడం మరియు ఫిర్యాదు చేయడంలో జాప్యం.'
    },
    {
      icon: <Globe2 className="w-5 h-5 text-blue-400" />,
      title: 'Language Barriers in Alerts',
      titleTe: 'భాషా సమస్యలు',
      description: 'Technical English jargon prevents non-technical campus members from comprehending cyber risks in time.',
      descriptionTe: 'సైబర్ మోసాల హెచ్చరికలు ఇంగ్లీషులో ఉండటం వల్ల అర్థం చేసుకోవడంలో ఎదురయ్యే ఇబ్బందులు.'
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-cyan-glow">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Vishnu Institute of Technology, Bhimavaram</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">Community Service Project</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Campus Digital Trust &{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Cybersecurity Protection
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            {t.hero.description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/verify-notice"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs sm:text-sm shadow-cyan-glow hover:opacity-95 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {t.hero.verifyBtn}
            </Link>

            <Link
              to="/demo"
              className="px-6 py-3 rounded-xl bg-cyber-card border border-cyan-500/40 text-cyan-300 font-bold text-xs sm:text-sm hover:bg-cyber-cardHover transition-all flex items-center gap-2 shadow-sm"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              {t.hero.demoBtn}
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10">
            <div className="p-4 rounded-xl bg-cyber-card/70 border border-cyber-border">
              <div className="text-2xl font-extrabold text-cyan-400 font-mono">100%</div>
              <div className="text-[11px] text-slate-300 mt-1">SHA-256 Tamper Audit</div>
            </div>
            <div className="p-4 rounded-xl bg-cyber-card/70 border border-cyber-border">
              <div className="text-2xl font-extrabold text-emerald-400 font-mono">2-Person</div>
              <div className="text-[11px] text-slate-300 mt-1">Dual-Approval Protocol</div>
            </div>
            <div className="p-4 rounded-xl bg-cyber-card/70 border border-cyber-border">
              <div className="text-2xl font-extrabold text-blue-400 font-mono">Bilingual</div>
              <div className="text-[11px] text-slate-300 mt-1">English & Telugu Support</div>
            </div>
            <div className="p-4 rounded-xl bg-cyber-card/70 border border-cyber-border">
              <div className="text-2xl font-extrabold text-purple-400 font-mono">Helpline</div>
              <div className="text-[11px] text-slate-300 mt-1">National 1930 Integration</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Community Survey Problems Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            Field Research Findings
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Six Critical Cybersecurity Problems Identified on Campus
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Based on our community survey conducted by 11 CSE students at Vishnu Institute of Technology,
            these six threats most frequently impact students and staff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveyProblems.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-cyber-secondary border border-cyber-border hover:border-cyan-500/40 transition-all shadow-glass flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyber-card border border-cyber-border flex items-center justify-center group-hover:scale-110 transition-transform">
                  {p.icon}
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {language === 'te' ? p.titleTe : p.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'te' ? p.descriptionTe : p.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Pillars / Solutions Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-cyber-secondary to-cyber-darker border border-cyber-border shadow-glass space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">Solution Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              How CyberRakshak Protects the Campus
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              A comprehensive multi-layered trust ecosystem covering notices, payments, threat detection, and response.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">1. Smart Notice Verification</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dual-authorization workflow (Created → Review → Approved → Published). Server-side SHA-256 cryptographic hash checking and QR validation detects any tampered notice.
              </p>
              <Link to="/verify-notice" className="inline-flex items-center gap-1 text-xs text-cyan-400 font-semibold hover:underline pt-2">
                Verify circulars <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">2. Payment Change Guard</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pre-registers official college bank accounts and UPI IDs. Students can verify payment details before transferring funds to intercept fake vendor or spoofed UPI handles.
              </p>
              <Link to="/payment-guard" className="inline-flex items-center gap-1 text-xs text-blue-400 font-semibold hover:underline pt-2">
                Check payment accounts <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">3. Cyber AI Assistant</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Powered by Google Gemini API. Paste suspicious SMS, links, emails, or phone messages to receive immediate bilingual (English & Telugu) risk scores and safety advice.
              </p>
              <Link to="/cyber-ai" className="inline-flex items-center gap-1 text-xs text-purple-400 font-semibold hover:underline pt-2">
                Ask Cyber AI <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">4. Cyber Incident Desk</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Confidential incident reporting with automated unique case tracking IDs (CR-INC-2026-XXXX) and direct escalation to National Cybercrime Helpline 1930.
              </p>
              <Link to="/incident-desk" className="inline-flex items-center gap-1 text-xs text-amber-400 font-semibold hover:underline pt-2">
                Report incident <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 5 */}
            <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">5. Cyber Learning Centre</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                7 interactive gamified lessons covering phishing, OTP traps, fake customer care, and QR scams with quizzes, instant scoring, and champion badges in Telugu & English.
              </p>
              <Link to="/learning" className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold hover:underline pt-2">
                Start learning <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Live Demo Callout */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-blue-950/60 border border-cyan-500/40 space-y-3 flex flex-col justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                  Mandatory Section 12
                </span>
                <h3 className="text-sm font-bold text-white mt-2">Faculty Evaluation Demo</h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  Four pre-configured interactive scenarios demonstrating genuine notice verification, fake notice detection, payment guard, and incident reporting.
                </p>
              </div>
              <Link
                to="/demo"
                className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-900 font-bold text-xs text-center hover:bg-cyan-400 transition-colors shadow-cyan-glow"
              >
                Launch Live Demo Mode ⚡
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

