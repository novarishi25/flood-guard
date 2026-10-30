/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FloodGuardProvider, useFloodGuard } from './context/FloodGuardContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { CommandCenter } from './components/CommandCenter';
import { AIFloodPrediction } from './components/AIFloodPrediction';
import { CitizenPortal } from './components/CitizenPortal';
import { RescueManagement } from './components/RescueManagement';
import { ReliefDistribution } from './components/ReliefDistribution';
import { ShelterManagement } from './components/ShelterManagement';
import { WeatherAlerts } from './components/WeatherAlerts';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { DisasterScenarioRunner } from './components/DisasterScenarioRunner';
import { ToastContainer } from './components/ToastContainer';
import { AuthModal } from './components/AuthModal';
import { KeyRound, ShieldAlert, Sparkles, Activity } from 'lucide-react';

function AppContent() {
  const { activeTab, currentUser, simulationActive, scenarioStep, runDisasterScenario } = useFloodGuard();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#071426] text-slate-100 flex flex-col font-['Outfit',sans-serif]">
      {/* Top Navbar */}
      <Navbar />

      {/* 10-Step Automated Disaster Scenario Presentation Banner */}
      <DisasterScenarioRunner />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activeTab === 'landing' && <LandingPage />}
        {activeTab === 'command-center' && <CommandCenter />}
        {activeTab === 'ai-prediction' && <AIFloodPrediction />}
        {activeTab === 'citizen-portal' && <CitizenPortal />}
        {activeTab === 'rescue-management' && <RescueManagement />}
        {activeTab === 'relief-distribution' && <ReliefDistribution />}
        {activeTab === 'shelter-management' && <ShelterManagement />}
        {activeTab === 'weather-alerts' && <WeatherAlerts />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </main>

      {/* Floating Demo Tools Trigger (Quick Access for Judges) */}
      <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2">
        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-3 py-2 rounded-xl bg-[#0d2137]/90 hover:bg-[#153454] border border-cyan-500/40 text-cyan-300 backdrop-blur-md shadow-2xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          title="Switch Role or Login with Demo Accounts"
        >
          <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
          <span className="capitalize">{currentUser.role} Account</span>
        </button>

        {scenarioStep === null && (
          <button
            onClick={runDisasterScenario}
            className="hidden md:flex px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-[#071426] font-black text-xs items-center gap-1.5 shadow-xl transition-all cursor-pointer"
            title="Demonstrate 10-step full emergency response loop for Hackathon judges"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Judge Demo Scenario</span>
          </button>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <FloodGuardProvider>
      <AppContent />
    </FloodGuardProvider>
  );
}
