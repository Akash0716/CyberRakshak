import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileCheck2, 
  CreditCard, 
  Sparkles, 
  AlertTriangle, 
  GraduationCap, 
  FilePlus, 
  CheckSquare, 
  History, 
  ShieldAlert,
  LogOut,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  const role = user.role;

  return (
    <aside className="w-64 shrink-0 bg-cyber-secondary border-r border-cyber-border min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3.5 rounded-xl bg-cyber-card border border-cyber-border/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-cyan-glow">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">{user.name}</h4>
              <p className="text-[10px] text-cyan-400 capitalize font-medium">{user.role}</p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.department || 'VIT Bhimavaram'}</p>
            </div>
          </div>
        </div>

        {/* Role-Specific Navigation */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Navigation
          </div>

          <NavLink
            to={`/dashboard/${role}`}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-cyber-card hover:text-white'
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4 text-cyan-400" />
            <span>Dashboard Overview</span>
          </NavLink>

          <NavLink
            to="/verify-notice"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-cyber-card hover:text-white'
              }`
            }
          >
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <span>Verify Notice & QR</span>
          </NavLink>

          <NavLink
            to="/payment-guard"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-cyber-card hover:text-white'
              }`
            }
          >
            <CreditCard className="w-4 h-4 text-blue-400" />
            <span>Payment Change Guard</span>
          </NavLink>

          <NavLink
            to="/cyber-ai"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-cyber-card hover:text-white'
              }`
            }
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Cyber AI Assistant</span>
          </NavLink>

          <NavLink
            to="/incident-desk"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-cyber-card hover:text-white'
              }`
            }
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Cyber Incident Desk</span>
          </NavLink>

          <NavLink
            to="/learning"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-cyber-card hover:text-white'
              }`
            }
          >
            <GraduationCap className="w-4 h-4 text-emerald-300" />
            <span>Learning Centre</span>
          </NavLink>
        </div>

        {/* Administrator specific links */}
        {role === 'administrator' && (
          <div className="space-y-1 pt-2 border-t border-cyber-border/60">
            <div className="px-3 text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-2">
              Admin Governance
            </div>
            <NavLink
              to="/dashboard/administrator?tab=create-notice"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-cyber-card hover:text-white"
            >
              <FilePlus className="w-4 h-4 text-cyan-400" />
              <span>Create Official Notice</span>
            </NavLink>
            <NavLink
              to="/dashboard/administrator?tab=manage-payments"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-cyber-card hover:text-white"
            >
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Manage Payment Accounts</span>
            </NavLink>
          </div>
        )}

        {/* Approver specific links */}
        {role === 'approver' && (
          <div className="space-y-1 pt-2 border-t border-cyber-border/60">
            <div className="px-3 text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-2">
              Dual-Approval Authority
            </div>
            <NavLink
              to="/dashboard/approver"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-cyber-card hover:text-white"
            >
              <CheckSquare className="w-4 h-4 text-amber-400" />
              <span>Review Pending Queue</span>
            </NavLink>
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="pt-4 border-t border-cyber-border/60">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Session</span>
        </button>
      </div>
    </aside>
  );
};

