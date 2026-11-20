import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { ToastProvider } from './context/ToastContext';

import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { LiveDemoPage } from './pages/LiveDemoPage';
import { NoticeVerificationPage } from './pages/NoticeVerificationPage';
import { PaymentGuardPage } from './pages/PaymentGuardPage';
import { CyberAssistantPage } from './pages/CyberAssistantPage';
import { IncidentDeskPage } from './pages/IncidentDeskPage';
import { LearningCentrePage } from './pages/LearningCentrePage';

import { StudentDashboard } from './pages/dashboards/StudentDashboard';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { ApproverDashboard } from './pages/dashboards/ApproverDashboard';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AccessibilityProvider>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              {/* Public & Core Feature Routes inside MainLayout */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/demo" element={<LiveDemoPage />} />
                <Route path="/verify-notice" element={<NoticeVerificationPage />} />
                <Route path="/payment-guard" element={<PaymentGuardPage />} />
                <Route path="/cyber-ai" element={<CyberAssistantPage />} />
                <Route path="/incident-desk" element={<IncidentDeskPage />} />
                <Route path="/learning" element={<LearningCentrePage />} />
                <Route path="/404" element={<NotFoundPage />} />
              </Route>

              {/* Protected Role-Based Dashboard Routes inside DashboardLayout */}
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard/student" element={<StudentDashboard />} />
                <Route path="/dashboard/administrator" element={<AdminDashboard />} />
                <Route path="/dashboard/approver" element={<ApproverDashboard />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  );
};

export default App;

