import React, { useState } from 'react';
import {
  Home,
  MapPin,
  Users,
  HeartPulse,
  Utensils,
  PhoneCall,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useFloodGuard } from '../context/FloodGuardContext';
import { SmartCityMap } from './SmartCityMap';

export const ShelterManagement: React.FC = () => {
  const {
    shelters,
    updateShelterCapacity,
    setActiveTab,
    showNotification,
  } = useFloodGuard();

  const [selectedShelterId, setSelectedShelterId] = useState<string | null>(null);

  const totalCapacityAll = shelters.reduce((acc, s) => acc + s.totalCapacity, 0);
  const totalOccupiedAll = shelters.reduce((acc, s) => acc + s.occupiedCapacity, 0);
  const totalAvailableBedsAll = shelters.reduce((acc, s) => acc + s.availableBeds, 0);

  const handleAdjustCapacity = (shelterId: string, delta: number) => {
    updateShelterCapacity(shelterId, delta);
    showNotification(`Updated evacuee headcount by ${delta > 0 ? '+' : ''}${delta}`, 'info');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-500/20 text-emerald-400">
              <Home className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
              EVACUATION REFUGE MONITORING
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Shelter Capacity & Facilities Command
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor real-time bed availability, medical triage equipment, and ration sustainment across designated municipal shelters.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('relief-distribution')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-[#071426] font-black text-xs flex items-center gap-1.5 shadow-lg shadow-teal-500/20 transition-all"
        >
          <span>Allocate Relief Supplies</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-glass-card border border-emerald-500/20">
          <span className="text-xs text-slate-400">Designated Shelters</span>
          <div className="text-2xl font-black font-mono text-white mt-1">
            {shelters.length} Facilities
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">100% Structural Clearance</span>
        </div>

        <div className="p-4 rounded-2xl bg-glass-card border border-cyan-500/20">
          <span className="text-xs text-slate-400">Total City Capacity</span>
          <div className="text-2xl font-black font-mono text-cyan-400 mt-1">
            {totalCapacityAll.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Civic & Campus Halls</span>
        </div>

        <div className="p-4 rounded-2xl bg-glass-card border border-amber-500/20">
          <span className="text-xs text-slate-400">Currently Sheltered</span>
          <div className="text-2xl font-black font-mono text-amber-400 mt-1">
            {totalOccupiedAll.toLocaleString()}
          </div>
          <span className="text-[10px] text-amber-400 font-mono">
            {Math.round((totalOccupiedAll / totalCapacityAll) * 100)}% Citywide Density
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-glass-card border border-teal-500/20">
          <span className="text-xs text-slate-400">Surplus Beds Available</span>
          <div className="text-2xl font-black font-mono text-teal-300 mt-1">
            {totalAvailableBedsAll.toLocaleString()}
          </div>
          <span className="text-[10px] text-teal-400 font-mono">Immediate Intake Ready</span>
        </div>
      </div>

      {/* Shelter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shelters.map((shelter) => {
          const isFull = shelter.status === 'Full';
          const isNear = shelter.status === 'Nearly Full';
          const occupancyPct = Math.round((shelter.occupiedCapacity / shelter.totalCapacity) * 100);

          return (
            <div
              key={shelter.id}
              className={`p-6 rounded-2xl bg-glass-card border transition-all space-y-4 ${
                isFull
                  ? 'border-red-500/40'
                  : isNear
                  ? 'border-amber-500/40'
                  : 'border-emerald-500/30 hover:border-emerald-500/60'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">{shelter.id}</span>
                    <h3 className="text-base font-bold text-white">{shelter.name}</h3>
                  </div>
                  <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    {shelter.location}
                  </span>
                </div>

                <span
                  className={`text-xs font-bold font-mono px-2.5 py-1 rounded-full ${
                    isFull
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : isNear
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {shelter.status.toUpperCase()} ({occupancyPct}%)
                </span>
              </div>

              {/* Occupancy bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300 font-mono">
                  <span>Capacity Utilization:</span>
                  <span className="font-bold">
                    {shelter.occupiedCapacity} / {shelter.totalCapacity} ({shelter.availableBeds} beds remaining)
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isFull ? 'bg-red-500' : isNear ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${occupancyPct}%` }}
                  />
                </div>
              </div>

              {/* Facilities details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-[#071426] border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Food Sustainment</span>
                  </div>
                  <div className="text-slate-200">{shelter.foodAvailability}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#071426] border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-red-400 font-semibold">
                    <HeartPulse className="w-3.5 h-3.5" />
                    <span>Medical Setup</span>
                  </div>
                  <div className="text-slate-200 line-clamp-1">{shelter.medicalFacilities}</div>
                </div>
              </div>

              {/* Headcount Intake & Evacuee Adjustment Controls */}
              <div className="p-3 rounded-xl bg-[#071426]/70 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-300 font-medium">Headcount Adjustment:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAdjustCapacity(shelter.id, -10)}
                    disabled={shelter.occupiedCapacity <= 0}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold disabled:opacity-30"
                  >
                    -10
                  </button>
                  <button
                    onClick={() => handleAdjustCapacity(shelter.id, 10)}
                    disabled={shelter.availableBeds <= 0}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold disabled:opacity-30 border border-cyan-500/30"
                  >
                    +10 Admit
                  </button>
                  <button
                    onClick={() => handleAdjustCapacity(shelter.id, 50)}
                    disabled={shelter.availableBeds < 50}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold disabled:opacity-30 border border-emerald-500/30"
                  >
                    +50 Bus Intake
                  </button>
                </div>
              </div>

              {/* Footer with Contact and Route */}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <a
                  href={`tel:${shelter.contact}`}
                  className="text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{shelter.contact}</span>
                </a>

                <button
                  onClick={() => setActiveTab('command-center')}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  <span>Locate on GIS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded Shelter Interactive Map */}
      <div className="space-y-3 pt-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>Shelter Geographic Placement & Elevation Map</span>
        </h2>
        <SmartCityMap heightClass="h-[400px]" />
      </div>
    </div>
  );
};
