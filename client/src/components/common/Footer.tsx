import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, FileCheck, CheckCircle2, Heart, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-cyber-border bg-cyber-darker text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-white tracking-wide">
                CyberRakshak 3.0 – Campus TrustDesk
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A Community Service Project conceived, designed, and engineered by 11 CSE Students at{' '}
              <strong className="text-slate-200">Vishnu Institute of Technology, Bhimavaram</strong>.
              Dedicated to eradicating campus phishing, payment fraud, and unauthorized notice tampering.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-cyan-400">
              <Award className="w-4 h-4" />
              <span>Department of Computer Science & Engineering</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-3">Core Pillars</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/verify-notice" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Smart Notice Verification
                </Link>
              </li>
              <li>
                <Link to="/payment-guard" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-blue-400" /> Payment Change Guard
                </Link>
              </li>
              <li>
                <Link to="/cyber-ai" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-purple-400" /> Cyber AI Threat Assistant
                </Link>
              </li>
              <li>
                <Link to="/incident-desk" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <FileCheck className="w-3 h-3 text-amber-400" /> Campus Incident Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-3">Institutional Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://www.vishnu.edu.in" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                  Vishnu Institute of Technology
                </a>
              </li>
              <li>
                <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-rose-400 transition-colors">
                  National Cybercrime Portal
                </a>
              </li>
              <li>
                <Link to="/demo" className="text-cyan-400 hover:underline font-semibold">
                  ⚡ Live Faculty Demo Mode
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cyber-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} CyberRakshak 3.0. Developed for Vishnu Institute of Technology, Bhimavaram.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for community digital trust & safety.
          </p>
        </div>
      </div>
    </footer>
  );
};

