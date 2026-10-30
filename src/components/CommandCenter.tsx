import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  MapPin,
  Users,
  Home,
  Box,
  Radio,
  Sparkles,
  Waves,
  RefreshCw,
  Plus,
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  CheckCircle2,
  Clock,
  Layers,
  Search,
} from 'lucide-react';
import { useFloodGuard } from '../context/FloodGuardContext';
import { SmartCityMap } from './SmartCityMap';

export const CommandCenter: React.FC = () => {
  const {
    metrics,
    reports,
    alerts,
    rescueTeams,
    shelters,
    weatherStations,
    setActiveTab,
    simulationActive,
    toggleSimulation,
    runDisasterScenario,
    assignRescueTeam,
    updateReportStatus,
    showNotification,
  } = useFloodGuard();

  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState<boolean>(false);
  const [targetReportId, setTargetReportId] = useState<string | null>(null);

  // Top urgent reports sorted by smart priority score
  const sortedReports = [...reports].sort((a, b) => b.priorityScore - a.priorityScore);

  const handleOpenAssign = (reportId: string) => {
    setTargetReportId(reportId);
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = (teamId: string) => {
    if (!targetReportId) return;
    assignRescueTeam(targetReportId, teamId);
    setAssignModalOpen(false);
    setTargetReportId(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header & Fast Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              SMART CITY DISASTER CONTROL ROOM
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Command Center Overview
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-agency situational intelligence and synchronized flood relief dispatch.
          </p>
        </div>

        {/* Action button cluster */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('ai-prediction')}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Risk Forecaster</span>
          </button>

          <button
            onClick={() => setActiveTab('weather-alerts')}
            className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Broadcast Alert</span>
          </button>

          <button
            onClick={toggleSimulation}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              simulationActive
                ? 'bg-red-500/20 text-red-300 border border-red-500/50 animate-pulse'
                : 'bg-[#102A43] hover:bg-[#1b436c] text-slate-200 border border-slate-700'
            }`}
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>{simulationActive ? 'Simulation ACTIVE' : 'Toggle Simulation'}</span>
          </button>
        </div>
      </div>

      {/* 7 Key Command Center Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Metric 1: Flood Risk */}
        <div
          onClick={() => setActiveTab('ai-prediction')}
          className="p-3.5 rounded-2xl bg-glass-card border border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300">Flood Risk</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-black font-mono text-cyan-400">
              {metrics.floodRiskScore}<span className="text-sm font-normal text-slate-400">/100</span>
            </div>
            <div
              className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded w-fit mt-1 ${
                metrics.floodRiskLevel === 'CRITICAL'
                  ? 'bg-red-500/30 text-red-300 animate-pulse'
                  : metrics.floodRiskLevel === 'HIGH'
                  ? 'bg-amber-500/30 text-amber-300'
                  : 'bg-emerald-500/30 text-emerald-300'
              }`}
            >
              {metrics.floodRiskLevel}
            </div>
          </div>
          <span className="text-[10px] text-cyan-400 font-medium flex items-center gap-0.5">
            AI Inundation Radar <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        {/* Metric 2: Active Alerts */}
        <div
          onClick={() => setActiveTab('weather-alerts')}
          className="p-3.5 rounded-2xl bg-glass-card border border-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300">Active Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-black font-mono text-amber-400">
              {metrics.activeAlertsCount}
            </div>
            <div className="text-[10px] text-slate-300 font-mono mt-1">
              Citywide Red/Amber
            </div>
          </div>
          <span className="text-[10px] text-amber-400 font-medium flex items-center gap-0.5">
            Inspect Broadcasts <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        {/* Metric 3: Affected Locations */}
        <div className="p-3.5 rounded-2xl bg-glass-card border border-red-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300">Affected Zones</span>
            <MapPin className="w-4 h-4 text-red-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-black font-mono text-red-400">
              {metrics.affectedLocationsCount}
            </div>
            <div className="text-[10px] text-slate-300 font-mono mt-1">
              High Risk / Inundated
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Sectors 4, 8 & Marina
          </span>
        </div>

        {/* Metric 4: Citizen Reports */}
        <div
          onClick={() => setActiveTab('rescue-management')}
          className="p-3.5 rounded-2xl bg-glass-card border border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300">Citizen Reports</span>
            <Radio className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-black font-mono text-white">
              {metrics.totalReportsCount}
            </div>
            <div className="text-[10px] text-cyan-300 font-mono mt-1">
              Priority Ranked
            </div>
          </div>
          <span className="text-[10px] text-cyan-400 font-medium flex items-center gap-0.5">
            Review Queue <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        {/* Metric 5: Active Rescue Teams */}
        <div
          onClick={() => setActiveTab('rescue-management')}
          className="p-3.5 rounded-2xl bg-glass-card border border-teal-500/20 hover:border-teal-500/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300">Rescue Teams</span>
            <Users className="w-4 h-4 text-teal-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-black font-mono text-teal-300">
              {metrics.activeRescueTeamsCount}<span className="text-sm font-normal text-slate-400">/{rescueTeams.length}</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">
              Active Missions
            </div>
          </div>
          <span className="text-[10px] text-teal-400 font-medium flex items-center gap-0.5">
            Manage Teams <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        {/* Metric 6: Available Shelters */}
        <div
          onClick={() => setActiveTab('shelter-management')}
          className="p-3.5 rounded-2xl bg-glass-card border border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300">Available Beds</span>
            <Home className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-black font-mono text-emerald-400">
              {metrics.totalAvailableBeds}
            </div>
            <div className="text-[10px] text-slate-300 font-mono mt-1">
              Across {shelters.length} Shelters
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5">
            Shelter Map <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        {/* Metric 7: Relief Resources */}
        <div
          onClick={() => setActiveTab('relief-distribution')}
          className="p-3.5 rounded-2xl bg-glass-card border border-indigo-500/20 hover:border-indigo-500/40 transition-all cursor-pointer flex flex-col justify-between col-span-2 md:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300">Relief Stock</span>
            <Box className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-black font-mono text-indigo-300">
              {(metrics.totalStockCount / 1000).toFixed(1)}k
            </div>
            <div className="text-[10px] text-slate-300 font-mono mt-1">
              MREs, Water, Meds
            </div>
          </div>
          <span className="text-[10px] text-indigo-400 font-medium flex items-center gap-0.5">
            Logistics Supply <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Active Broadcast Alert Banner Ticker */}
      {alerts.filter((a) => a.isActive).length > 0 && (
        <div className="p-3.5 rounded-2xl bg-red-950/70 border border-red-500/40 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-ping shrink-0"></div>
            <div>
              <span className="text-xs font-mono font-bold text-red-300 uppercase tracking-wider">
                CURRENT BROADCAST: {alerts.find((a) => a.isActive)?.title}
              </span>
              <p className="text-xs text-slate-200 mt-0.5 line-clamp-1">
                {alerts.find((a) => a.isActive)?.message}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('weather-alerts')}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shrink-0"
          >
            Manage Alerts
          </button>
        </div>
      )}

      {/* Main Content Split: Interactive Map & Live Priority Triage Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Large Interactive Smart City Map */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h2 className="text-base font-bold text-white">
                Live Geographic Information System (GIS)
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Click any pin to inspect station or dispatch crew
            </span>
          </div>

          {/* Interactive Map */}
          <SmartCityMap heightClass="h-[550px]" />
        </div>

        {/* Right 4 Cols: Smart Priority Triage Queue */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <h2 className="text-base font-bold text-white">
                Priority Incident Queue
              </h2>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
              AI RANKED
            </span>
          </div>

          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
            {sortedReports.map((report, idx) => {
              const isAssigned = report.status === 'Rescue Assigned';
              const isResolved = report.status === 'Resolved';
              const isTrapped = report.category === 'People trapped';

              return (
                <div
                  key={report.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isTrapped && !isResolved
                      ? 'bg-gradient-to-br from-[#2a0f14] to-[#071426] border-red-500/50 shadow-md'
                      : 'bg-glass-card border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold font-mono text-slate-300 flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {report.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          report.priorityScore >= 90
                            ? 'bg-red-500 text-white'
                            : report.priorityScore >= 70
                            ? 'bg-amber-500/30 text-amber-300'
                            : 'bg-cyan-500/20 text-cyan-300'
                        }`}
                      >
                        P-{report.priorityScore}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-cyan-300 font-medium mt-1.5 line-clamp-1">
                    {report.locationName}
                  </p>

                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {report.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <div>
                      Depth: <span className="text-amber-400 font-semibold">{report.waterDepth.split(' ')[0]}</span>
                    </div>
                    <div>
                      Affected: <span className="text-white font-bold">{report.affectedCount} ppl</span>
                    </div>
                  </div>

                  {/* Quick Action Footer */}
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        isResolved
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : isAssigned
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {report.status}
                    </span>

                    {!isResolved && (
                      <div className="flex items-center gap-1.5">
                        {!isAssigned ? (
                          <button
                            onClick={() => handleOpenAssign(report.id)}
                            className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] shadow-sm transition-all"
                          >
                            Dispatch Crew
                          </button>
                        ) : (
                          <button
                            onClick={() => updateReportStatus(report.id, 'Resolved')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 text-[11px] font-bold transition-all"
                          >
                            Mark Rescued
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dispatch Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0d2137] border border-cyan-500/40 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  Dispatch Rescue Strike Team
                </h3>
              </div>
              <button
                onClick={() => setAssignModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Select an available tactical crew to assign to incident <span className="text-cyan-400 font-mono font-bold">#{targetReportId}</span>.
            </p>

            <div className="space-y-2">
              {rescueTeams.map((team) => {
                const isAvail = team.status === 'Available';
                return (
                  <div
                    key={team.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      isAvail
                        ? 'bg-[#071426] border-cyan-500/30 hover:border-cyan-400 cursor-pointer'
                        : 'bg-slate-900/50 border-slate-800 opacity-60'
                    }`}
                    onClick={() => isAvail && handleConfirmAssign(team.id)}
                  >
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{team.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300">
                          {team.membersCount} crew
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {team.specialty}
                      </div>
                    </div>

                    <button
                      disabled={!isAvail}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                        isAvail
                          ? 'bg-cyan-500 text-[#071426] hover:bg-cyan-400'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isAvail ? 'Dispatch' : team.status}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
