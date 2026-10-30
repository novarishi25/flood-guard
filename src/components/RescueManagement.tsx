import React, { useState } from 'react';
import {
  Users,
  ShieldAlert,
  AlertTriangle,
  Radio,
  MapPin,
  CheckCircle2,
  PhoneCall,
  Clock,
  ArrowUpRight,
  Filter,
  Flame,
  LifeBuoy,
} from 'lucide-react';
import { useFloodGuard } from '../context/FloodGuardContext';
import { RescueTeam, RescueTeamStatus, FloodReport } from '../types';

export const RescueManagement: React.FC = () => {
  const {
    rescueTeams,
    reports,
    assignRescueTeam,
    updateTeamStatus,
    updateReportStatus,
    setActiveTab,
    showNotification,
  } = useFloodGuard();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [assignModal, setAssignModal] = useState<{ reportId: string; teamId?: string } | null>(null);

  // Sort emergency reports by smart priority score descending
  const prioritizedReports = [...reports].sort((a, b) => b.priorityScore - a.priorityScore);

  const filteredTeams = rescueTeams.filter((t) => {
    if (filterStatus === 'all') return true;
    return t.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const handleStatusChange = (teamId: string, newStatus: RescueTeamStatus) => {
    updateTeamStatus(teamId, newStatus);
  };

  const handleAssignConfirm = (teamId: string) => {
    if (!assignModal?.reportId) return;
    assignRescueTeam(assignModal.reportId, teamId);
    setAssignModal(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-teal-500/20 text-teal-400">
              <Users className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-teal-400 uppercase">
              TACTICAL FIELD DISPATCH
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Rescue Operations Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Coordinate swift-water strike units, monitor deployed amphibious craft, and execute priority life-safety extractions.
          </p>
        </div>

        {/* View on Map button */}
        <button
          onClick={() => setActiveTab('command-center')}
          className="px-4 py-2 rounded-xl bg-[#102A43] hover:bg-[#1a3d60] text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>View Team Positions on Map</span>
        </button>
      </div>

      {/* Triage Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-glass-card border border-teal-500/20">
          <span className="text-xs text-slate-400">Total Rescue Teams</span>
          <div className="text-2xl font-black font-mono text-white mt-1">
            {rescueTeams.length}
          </div>
          <span className="text-[10px] text-teal-400 font-mono">29 Certified Divers</span>
        </div>

        <div className="p-4 rounded-2xl bg-glass-card border border-cyan-500/20">
          <span className="text-xs text-slate-400">Available For Dispatch</span>
          <div className="text-2xl font-black font-mono text-cyan-400 mt-1">
            {rescueTeams.filter((t) => t.status === 'Available').length}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">Staged At Depots</span>
        </div>

        <div className="p-4 rounded-2xl bg-glass-card border border-amber-500/20">
          <span className="text-xs text-slate-400">Active Extractions</span>
          <div className="text-2xl font-black font-mono text-amber-400 mt-1">
            {rescueTeams.filter((t) => t.status === 'Dispatched' || t.status === 'On-Scene').length}
          </div>
          <span className="text-[10px] text-amber-400 font-mono">Boats On Water</span>
        </div>

        <div className="p-4 rounded-2xl bg-glass-card border border-red-500/20">
          <span className="text-xs text-slate-400">Trapped Victims Pending</span>
          <div className="text-2xl font-black font-mono text-red-400 mt-1">
            {reports.filter((r) => r.category === 'People trapped' && r.status !== 'Resolved').length}
          </div>
          <span className="text-[10px] text-red-400 font-mono">Urgent Priority #1</span>
        </div>
      </div>

      {/* Main Split: Left 7 Cols Teams, Right 5 Cols Smart Prioritized SOS Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Teams List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Deployed Rescue Teams</span>
            </h2>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-[#071426] p-1 rounded-xl border border-slate-800 text-xs">
              {['all', 'available', 'dispatched', 'on-scene'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition-all ${
                    filterStatus === st
                      ? 'bg-cyan-500 text-[#071426] font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredTeams.map((team) => {
              const isAvail = team.status === 'Available';
              const isDisp = team.status === 'Dispatched';
              const isOnScene = team.status === 'On-Scene';

              return (
                <div
                  key={team.id}
                  className="p-5 rounded-2xl bg-glass-card border border-slate-800 hover:border-cyan-500/40 space-y-3 transition-all"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-400">
                          {team.id}
                        </span>
                        <h3 className="text-sm font-bold text-white">
                          {team.name}
                        </h3>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Leader: <span className="text-slate-200 font-medium">{team.leader}</span> • {team.membersCount} Crew Members
                      </div>
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <select
                        value={team.status}
                        onChange={(e) => handleStatusChange(team.id, e.target.value as RescueTeamStatus)}
                        className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                          isAvail
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                            : isDisp
                            ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700'
                            : isOnScene
                            ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                            : 'bg-slate-900 text-slate-300 border-slate-700'
                        }`}
                      >
                        <option value="Available">Available</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="On-Scene">On-Scene</option>
                        <option value="Returning">Returning</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="text-slate-300">
                      <span className="text-slate-400">Specialty:</span> {team.specialty}
                    </div>
                    <div className="text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{team.currentLocation}</span>
                    </div>
                  </div>

                  {/* Tactical Gear Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {team.equipment.map((eq, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#071426] border border-slate-700 text-slate-300"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>

                  {/* Active Engagement Banner */}
                  {team.assignedEmergencyId && (
                    <div className="p-2.5 rounded-xl bg-red-950/70 border border-red-500/30 flex items-center justify-between text-xs">
                      <span className="text-red-300 font-mono font-semibold">
                        Assigned Mission: #{team.assignedEmergencyId}
                      </span>
                      <button
                        onClick={() => {
                          updateReportStatus(team.assignedEmergencyId!, 'Resolved');
                          updateTeamStatus(team.id, 'Available');
                        }}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                      >
                        Mark Mission Complete
                      </button>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-mono flex items-center gap-1">
                      <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                      Comms: {team.contactPhone}
                    </span>
                    <button
                      onClick={() => showNotification(`Contacting radio dispatch for ${team.id}...`, 'info')}
                      className="text-cyan-400 hover:underline font-semibold"
                    >
                      Radio Ping
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: Smart Prioritized Emergency Reports Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Smart Priority Emergency Queue</span>
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
              URGENCY SORTED
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Our weighted algorithm factors trapped victims, water depth levels, and vulnerable demographics to place the most urgent cases at the top.
          </p>

          <div className="space-y-3">
            {prioritizedReports.map((report, idx) => {
              const isResolved = report.status === 'Resolved';
              const isAssigned = report.status === 'Rescue Assigned';
              const isTrapped = report.category === 'People trapped';

              return (
                <div
                  key={report.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isTrapped && !isResolved
                      ? 'bg-gradient-to-br from-[#2a0c10] to-[#071426] border-red-500/50 shadow-lg'
                      : 'bg-glass-card border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-mono text-[10px] font-black flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {report.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-cyan-300 block mt-0.5 font-medium">
                        {report.locationName}
                      </span>
                    </div>

                    <div className="flex flex-col items-end">
                      <span
                        className={`text-xs font-mono font-black px-2 py-0.5 rounded ${
                          report.priorityScore >= 90
                            ? 'bg-red-500 text-white animate-pulse'
                            : report.priorityScore >= 70
                            ? 'bg-amber-500/30 text-amber-300'
                            : 'bg-cyan-500/20 text-cyan-300'
                        }`}
                      >
                        P-{report.priorityScore}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                        Score / 100
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 mt-2 leading-relaxed">
                    {report.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mt-2.5 pt-2 border-t border-slate-800">
                    <div>Affected: <b className="text-white">{report.affectedCount} persons</b></div>
                    <div>Depth: <b className="text-amber-400">{report.waterDepth.split(' ')[0]}</b></div>
                    <div>Caller: <span className="text-slate-300">{report.citizenName}</span></div>
                    <div className="font-mono text-cyan-400">{report.phone}</div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        isResolved
                          ? 'bg-emerald-500/20 text-emerald-300'
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
                            onClick={() => setAssignModal({ reportId: report.id })}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-sm transition-all"
                          >
                            Assign Rescue Team
                          </button>
                        ) : (
                          <button
                            onClick={() => updateReportStatus(report.id, 'Resolved')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 text-xs font-bold transition-all"
                          >
                            Complete Rescue
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

      {/* Assignment Modal */}
      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0d2137] border border-cyan-500/40 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span>Assign Strike Team to #{assignModal.reportId}</span>
              </h3>
              <button
                onClick={() => setAssignModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Select an available tactical crew to immediately dispatch to coordinates.
            </p>

            <div className="space-y-2">
              {rescueTeams.map((team) => {
                const isAvail = team.status === 'Available';
                return (
                  <div
                    key={team.id}
                    onClick={() => isAvail && handleAssignConfirm(team.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      isAvail
                        ? 'bg-[#071426] border-cyan-500/30 hover:border-cyan-400 cursor-pointer'
                        : 'bg-slate-900/50 border-slate-800 opacity-50'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">
                        {team.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {team.specialty} • {team.membersCount} Crew
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        isAvail ? 'bg-cyan-500 text-[#071426]' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isAvail ? 'Dispatch' : team.status}
                    </span>
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
