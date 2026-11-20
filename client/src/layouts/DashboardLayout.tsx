import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { EmergencyBanner } from '../components/common/EmergencyBanner';
import { Sidebar } from '../components/common/Sidebar';
import { Footer } from '../components/common/Footer';
import { ToastContainer } from '../components/common/ToastContainer';
import { useAuth } from '../context/AuthContext';

export const DashboardLayout: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-bg text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-300">
            Authenticating Vishnu TrustDesk Session...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-cyber-bg text-slate-100">
      <Navbar />
      <EmergencyBanner />
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

