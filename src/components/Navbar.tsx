import React, { useState } from 'react';
import {
  Shield,
  Waves,
  Activity,
  AlertTriangle,
  Users,
  Box,
  Home,
  CloudRain,
  BarChart3,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  UserCheck,
  LifeBuoy,
  Menu,
  X,
  Compass,
} from 'lucide-react';
import { useFloodGuard } from '../context/FloodGuardContext';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    switchRole,
    simulationActive,
    toggleSimulation,
    resetSimulation,
    scenarioRunning,
    runDisasterScenario,
    resetDisasterScenario,
    scenarioStep,
    metrics,
  } = useFloodGuard();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'command-center', label: 'Command Center', icon: Activity, badge: metrics.activeAlertsCount },
    { id: 'ai-prediction', label: 'AI Prediction', icon: Sparkles },
    { id: 'citizen-portal', label: 'Citizen Portal', icon: LifeBuoy, highlight: true },
    { id: 'rescue-management', label: 'Rescue Ops', icon: Users, badge: metrics.totalReportsCount },
    { id: 'relief-distribution', label: 'Relief Logistics', icon: Box },
    { id: 'shelter-management', label: 'Shelters', icon: Home },
    { id: 'weather-alerts', label: 'Weather & Alerts', icon: CloudRain },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#071426]/95 backdrop-blur-md border-b border-[#102A43] text-white">
      {/* Top Telemetry Alert Strip */}
      <div className="bg-[#102A43]/60 px-4 py-1.5 text-xs border-b border-cyan-500/10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-mono text-cyan-400 font-semibold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            Smart City Telemetry: ACTIVE
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-300">
            Flood Risk Status:{' '}
            <span
              className={`font-bold px-1.5 py-0.5 rounded ${
                metrics.floodRiskLevel === 'CRITICAL'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                  : metrics.floodRiskLevel === 'HIGH'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}
            >
              {metrics.floodRiskLevel} ({metrics.floodRiskScore}/100)
            </span>
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300 font-mono">
            Active Alarms: <span className="text-amber-400 font-semibold">{metrics.activeAlertsCount}</span>
          </span>
        </div>

        {/* Presentation & Simulation Controls */}
        <div className="flex items-center gap-2">
          {/* Hackathon Judge Presentation Button */}
          <button
            onClick={() => (scenarioStep !== null ? resetDisasterScenario() : runDisasterScenario())}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
              scenarioRunning || scenarioStep !== null
                ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                : 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-[#071426] font-bold'
            }`}
            title="Demonstrate 10-step full emergency response loop for Hackathon judges"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {scenarioStep !== null ? `Step ${scenarioStep}/10 (Reset Demo)` : 'Run Disaster Scenario (Judge Demo)'}
          </button>

          {/* Simulation Toggle */}
          <button
            onClick={toggleSimulation}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
              simulationActive
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                : 'bg-[#102A43] hover:bg-[#1a3d60] text-slate-300 border border-slate-700'
            }`}
            title="Toggle simulated heavy rainfall and surging water sensors"
          >
            <Activity className="w-3 h-3 text-cyan-400" />
            {simulationActive ? 'Simulation: RUNNING' : 'Start Simulation'}
          </button>

          {simulationActive && (
            <button
              onClick={resetSimulation}
              className="p-1 rounded bg-[#102A43] hover:bg-slate-700 text-slate-300"
              title="Reset simulation data to calm state"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="px-2 py-0.5 rounded text-xs bg-[#102A43] hover:bg-[#1b4168] border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5 font-medium"
            >
              <UserCheck className="w-3 h-3" />
              <span className="capitalize">{currentUser.role}</span>
              <span className="text-[10px] text-slate-400 font-mono">({currentUser.name.split(' ')[0]})</span>
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-[#0d2137] border border-cyan-500/30 rounded-lg shadow-2xl py-1 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-slate-700/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  Switch Demo Account
                </div>
                <button
                  onClick={() => {
                    switchRole('admin');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex flex-col hover:bg-cyan-500/10 ${
                    currentUser.role === 'admin' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-200'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span>Disaster Commander (Admin)</span>
                    <span className="text-[10px] font-mono text-cyan-400">admin@</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Full control room & resource authority</span>
                </button>
                <button
                  onClick={() => {
                    switchRole('rescue');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex flex-col hover:bg-cyan-500/10 ${
                    currentUser.role === 'rescue' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-200'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span>Rescue Team Lead (Rescue)</span>
                    <span className="text-[10px] font-mono text-amber-400">rescue@</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Tactical missions & boat dispatch queue</span>
                </button>
                <button
                  onClick={() => {
                    switchRole('citizen');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex flex-col hover:bg-cyan-500/10 ${
                    currentUser.role === 'citizen' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-200'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span>Smart City Resident (Citizen)</span>
                    <span className="text-[10px] font-mono text-emerald-400">citizen@</span>
                  </span>
                  <span className="text-[10px] text-slate-400">SOS distress, shelters & alerts</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-[#102A43] to-teal-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <div className="w-full h-full bg-[#071426] rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <Shield className="w-6 h-6 text-cyan-400 absolute" />
                <Waves className="w-4 h-4 text-teal-300 relative z-10 translate-y-1" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-wider bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
                  FLOODGUARD
                </span>
                <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/80 px-1.5 py-0.5 rounded font-bold">
                  v3.8
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Smart Flood Relief System
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all relative ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : item.highlight
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-[#102A43]/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : ''}`} />
                  <span>{item.label}</span>
                  {Boolean(item.badge && item.badge > 0) && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                        item.id === 'command-center'
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-cyan-500/30 text-cyan-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick SOS Shortcut for Citizens & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('citizen-portal')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-500 text-white font-bold text-xs tracking-wider shadow-lg shadow-red-600/30 animate-pulse transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>EMERGENCY SOS</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-[#102A43] text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a1b2f] border-b border-[#102A43] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400 font-semibold'
                    : 'text-slate-300 hover:bg-[#102A43]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{item.label}</span>
                </div>
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
