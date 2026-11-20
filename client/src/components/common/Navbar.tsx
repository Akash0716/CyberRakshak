import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Sparkles, AlertTriangle, User, LogOut, Sun, Moon, Type, Globe, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { TRANSLATIONS } from '../../utils/translations';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { language, toggleLanguage, fontSize, toggleFontSize, highContrast, toggleHighContrast } = useAccessibility();
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyber-border bg-cyber-bg/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-cyan-glow group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                CyberRakshak <span className="text-cyan-400 font-mono text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">3.0</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">Campus TrustDesk • VIT</p>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-300">
          <Link to="/" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-cyber-card transition-colors">
            {t.nav.home}
          </Link>
          <Link to="/verify-notice" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-cyber-card transition-colors flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
            {t.nav.verifyNotice}
          </Link>
          <Link to="/payment-guard" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-cyber-card transition-colors flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            {t.nav.paymentGuard}
          </Link>
          <Link to="/cyber-ai" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-cyber-card transition-colors flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            {t.nav.cyberAi}
          </Link>
          <Link to="/incident-desk" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-cyber-card transition-colors flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            {t.nav.incidentDesk}
          </Link>
          <Link to="/learning" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-cyber-card transition-colors">
            {t.nav.learningCentre}
          </Link>
          <Link to="/demo" className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all font-semibold shadow-sm">
            ⚡ {t.nav.liveDemo}
          </Link>
        </nav>

        {/* Right Accessibility & Auth Controls */}
        <div className="flex items-center gap-2">
          {/* Accessible: Language Switcher */}
          <button
            onClick={toggleLanguage}
            title="Switch Language: English / Telugu"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-cyber-card border border-cyber-border text-cyan-300 hover:border-cyan-500/50 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'తెలుగు' : 'English'}</span>
          </button>

          {/* Accessible: Font Size Toggle */}
          <button
            onClick={toggleFontSize}
            title={fontSize === 'normal' ? 'Switch to Larger Font' : 'Switch to Normal Font'}
            className="p-1.5 rounded-lg bg-cyber-card border border-cyber-border text-slate-300 hover:text-white hover:border-cyan-500/50 transition-colors text-xs font-bold"
          >
            <Type className="w-4 h-4" />
          </button>

          {/* Accessible: High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            title="Toggle High Contrast Mode"
            className={`p-1.5 rounded-lg border transition-colors ${
              highContrast ? 'bg-amber-400 text-black border-amber-300' : 'bg-cyber-card border-cyber-border text-slate-300 hover:text-white'
            }`}
          >
            {highContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Account / Login */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-cyber-border">
              <Link
                to={`/dashboard/${user.role}`}
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-cyber-card border border-cyber-border hover:border-cyan-500/40 text-xs text-white"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-slate-200 leading-tight">{user.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-cyan-400 capitalize">{user.role}</div>
                </div>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-cyber-border">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-300 hover:text-white hover:bg-cyber-card transition-colors"
              >
                {t.nav.login}
              </Link>
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-glow hover:opacity-95 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

