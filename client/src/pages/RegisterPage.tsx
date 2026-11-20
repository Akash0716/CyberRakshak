import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, User, Building, Hash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserRole } from '../types';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [studentId, setStudentId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Validation Error', 'Please complete all required fields.', 'warning');
      return;
    }

    setIsLoading(true);
    const success = await register(name, email, password, role, department, studentId);
    setIsLoading(false);

    if (success) {
      showToast('Registration Successful', `Account created with ${role} role.`, 'success');
      navigate(`/dashboard/${role}`);
    } else {
      showToast('Registration Failed', 'Email may already be in use.', 'error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="p-8 rounded-2xl bg-cyber-secondary border border-cyber-border shadow-glass space-y-5 text-xs">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-white tracking-tight">Create TrustDesk Account</h2>
            <p className="text-slate-400">Join the Vishnu Institute Digital Trust Ecosystem</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Priya Sharma"
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-cyber-card border border-cyber-border text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="student.22pa1a0542@vishnu.edu.in"
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-cyber-card border border-cyber-border text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-cyber-card border border-cyber-border text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Role Designation</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 rounded-xl bg-cyber-card border border-cyber-border text-white focus:outline-none focus:border-cyan-400 transition-colors capitalize"
              >
                <option value="student">Student</option>
                <option value="administrator">Administrator (Notice Creation & Payments)</option>
                <option value="approver">Independent Approver (Dual-Authorization Reviewer)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Department</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder="Computer Science & Engineering"
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-cyber-card border border-cyber-border text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            {role === 'student' && (
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Student Roll Number (Optional)</label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    placeholder="22PA1A0542"
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-cyber-card border border-cyber-border text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-cyan-glow hover:opacity-95 transition-opacity disabled:opacity-50 mt-4"
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <div className="text-center pt-2 text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 hover:underline font-semibold">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

