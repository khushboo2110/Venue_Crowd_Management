import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { VenueProvider } from "./context/VenueContext";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import EmergencyOverlay from "./components/EmergencyOverlay";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardOverview from "./pages/DashboardOverview";
import VenueUploadPage from "./pages/VenueUploadPage";
import CrowdDataPage from "./pages/CrowdDataPage";
import AISimulationPage from "./pages/AISimulationPage";
import LiveMapPage from "./pages/LiveMapPage";
import AlternateRoutePage from "./pages/AlternateRoutePage";
import AlertsPage from "./pages/AlertsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import VisitorQRView from "./pages/VisitorQRView";

function AppLayout({ children }) {
  const location = useLocation();
  const isPublicPage = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/visitor";

  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      <Navbar />
      <EmergencyOverlay />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <VenueProvider>
        <Router>
          <AppLayout>
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/visitor" element={<VisitorQRView />} />

              {/* Dashboard & Venue Pages */}
              <Route path="/dashboard" element={<DashboardOverview />} />
              <Route path="/venue" element={<VenueUploadPage />} />
              <Route path="/crowd-data" element={<CrowdDataPage />} />
              <Route path="/simulation" element={<AISimulationPage />} />
              <Route path="/live-map" element={<LiveMapPage />} />
              <Route path="/routes" element={<AlternateRoutePage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AppLayout>
        </Router>
      </VenueProvider>
    </AuthProvider>
  );
}
