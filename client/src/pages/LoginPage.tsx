import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginAsDemoUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Validation Error', 'Please enter both email and password.', 'warning');
      return;
    }

    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);

    if (success) {
      showToast('Login Successful', 'Welcome to CyberRakshak Campus TrustDesk.', 'success');
      // Navigation will be handled in context / or check profile
      navigate('/');
    } else {
      showToast('Authentication Failed', 'Invalid email or password. Please try again or use a demo role.', 'error');
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setIsLoading(true);
    const success = await loginAsDemoUser(role);
    setIsLoading(false);
    if (success) {
      showToast('Demo Access Granted', `Logged in with ${role} privileges.`, 'success');
      navigate(`/dashboard/${role}`);
    } else {
      showToast('Demo Login Failed', 'Please ensure server is running.', 'error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Card */}
        <div className="p-8 rounded-2xl bg-cyber-secondary border border-cyber-border shadow-glass space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto text-white shadow-cyan-glow">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Campus TrustDesk Login</h2>
            <p className="text-xs text-slate-400">
              Vishnu Institute of Technology, Bhimavaram
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Institutional Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="student@vishnu.edu.in"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-cyber-card border border-cyber-border text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-cyber-card border border-cyber-border text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-cyan-glow hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Role Logins */}
          <div className="pt-4 border-t border-cyber-border/70 space-y-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Instant Faculty Evaluation Logins
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('student')}
                className="p-2 rounded-lg bg-cyber-card hover:bg-cyber-cardHover border border-cyber-border hover:border-emerald-500/50 text-[11px] font-semibold text-slate-200 transition-all text-center"
              >
                <div className="text-emerald-400 font-bold">Student</div>
                <div className="text-[9px] text-slate-400">Priya S.</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('administrator')}
                className="p-2 rounded-lg bg-cyber-card hover:bg-cyber-cardHover border border-cyber-border hover:border-cyan-500/50 text-[11px] font-semibold text-slate-200 transition-all text-center"
              >
                <div className="text-cyan-400 font-bold">Admin</div>
                <div className="text-[9px] text-slate-400">Dr. Srinivas</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('approver')}
                className="p-2 rounded-lg bg-cyber-card hover:bg-cyber-cardHover border border-cyber-border hover:border-amber-500/50 text-[11px] font-semibold text-slate-200 transition-all text-center"
              >
                <div className="text-amber-400 font-bold">Approver</div>
                <div className="text-[9px] text-slate-400">Prof. Ramana</div>
              </button>
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-400 hover:underline font-semibold">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

