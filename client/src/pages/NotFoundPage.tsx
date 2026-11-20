import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">404 - Page Not Found</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          The requested trustdesk node or circular does not exist on the CyberRakshak campus ledger.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyber-secondary border border-cyber-border hover:border-cyan-400 text-cyan-300 font-bold text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Campus Home</span>
        </Link>
      </div>
    </div>
  );
};

