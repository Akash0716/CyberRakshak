import React from 'react';
import { PhoneCall, ExternalLink, AlertOctagon } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { TRANSLATIONS } from '../../utils/translations';

export const EmergencyBanner: React.FC = () => {
  const { language } = useAccessibility();
  const t = TRANSLATIONS[language].helpline;

  return (
    <div className="bg-gradient-to-r from-rose-950/80 via-cyber-secondary to-cyber-bg border-y border-rose-500/30 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-rose-200">
          <div className="p-1 rounded-full bg-rose-500/20 text-rose-400 animate-pulse">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white tracking-wide uppercase">{t.title}:</span>{' '}
            <span className="text-slate-300">{t.emergencyTip}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <a
            href="tel:1930"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 font-bold transition-all shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
            <span>{t.dial}</span>
          </a>

          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-slate-300 hover:text-cyan-400 underline font-medium transition-colors"
          >
            <span>{t.portalText}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

