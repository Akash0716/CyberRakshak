import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { EmergencyBanner } from '../components/common/EmergencyBanner';
import { Footer } from '../components/common/Footer';
import { ToastContainer } from '../components/common/ToastContainer';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cyber-bg text-slate-100">
      <Navbar />
      <EmergencyBanner />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

