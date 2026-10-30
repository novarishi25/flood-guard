import React from 'react';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertOctagon,
  CloudRain,
  Waves,
  BrainCircuit,
  Megaphone,
  Radio,
  Clock,
  ShieldAlert,
  Home,
  Truck,
  CheckCheck,
} from 'lucide-react';
import { useFloodGuard } from '../context/FloodGuardContext';

export const DisasterScenarioRunner: React.FC = () => {
  const {
    scenarioStep,
    scenarioRunning,
    pauseDisasterScenario,
    resumeDisasterScenario,
    resetDisasterScenario,
    goToScenarioStep,
    setActiveTab,
  } = useFloodGuard();

  if (scenarioStep === null) return null;

  const steps = [
    {
      step: 1,
      title: 'Heavy Rainfall Detected',
      desc: 'IoT telemetry gauges record precipitous downpour exceeding 140 mm/hr across North Basin.',
      icon: CloudRain,
      tab: 'weather-alerts',
    },
    {
      step: 2,
      title: 'River Water Levels Surge',
      desc: 'Central Hydro-Station STN-02 crosses danger threshold reaching 6.3m (Danger Mark: 6.0m).',
      icon: Waves,
      tab: 'weather-alerts',
    },
    {
      step: 3,
      title: 'AI Predicts Critical Flood Risk',
      desc: 'Hydrological machine intelligence model projects 94% inundation risk for Riverfront Zone A.',
      icon: BrainCircuit,
      tab: 'ai-prediction',
    },
    {
      step: 4,
      title: 'Citywide Emergency Red Alert Issued',
      desc: 'Broadcast sirens, cellular SMS alerts, and app push warnings dispatched to 140,000 citizens.',
      icon: Megaphone,
      tab: 'weather-alerts',
    },
    {
      step: 5,
      title: 'Citizen Submits SOS Distress Request',
      desc: 'Family of 5 trapped on rooftop patio with infant and elderly parents due to breached embankment.',
      icon: Radio,
      tab: 'citizen-portal',
    },
    {
      step: 6,
      title: 'Smart Algorithm Prioritizes Incident',
      desc: 'Urgency engine computes Priority 98/100 (Trapped Victims + High Water + Vulnerable Dependents).',
      icon: AlertOctagon,
      tab: 'rescue-management',
    },
    {
      step: 7,
      title: 'Rescue Team Alpha-1 Dispatched',
      desc: 'Swift-water tactical crew deployed with Zodiac assault boats and thermal imaging recon drones.',
      icon: ShieldAlert,
      tab: 'rescue-management',
    },
    {
      step: 8,
      title: 'Nearby Shelter Designated',
      desc: 'Northridge University designated with 120 reserved beds and pre-warmed emergency triage.',
      icon: Home,
      tab: 'shelter-management',
    },
    {
      step: 9,
      title: 'Relief Inventory Allocated',
      desc: 'Smart logistics engine automatically transfers 300 MREs, 600L potable water, and medical kits.',
      icon: Truck,
      tab: 'relief-distribution',
    },
    {
      step: 10,
      title: 'Command Center Stabilized',
      desc: 'Victims evacuated to safety, shelter intake logged, and live incident resolved in real-time.',
      icon: CheckCheck,
      tab: 'command-center',
    },
  ];

  const currentStepData = steps[scenarioStep - 1] || steps[0];
  const IconComponent = currentStepData.icon;

  return (
    <div className="bg-gradient-to-r from-[#0d2137] via-[#102A43] to-[#071426] border-b-2 border-cyan-500 shadow-2xl p-4 text-white">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-400 animate-pulse">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                  HACKATHON DEMO SCENARIO
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  Autonomous 10-Step Smart City Disaster Loop
                </span>
              </div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>Step {scenarioStep} of 10:</span>
                <span className="text-cyan-300">{currentStepData.title}</span>
              </h3>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(currentStepData.tab)}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <span>View In App</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {scenarioRunning ? (
              <button
                onClick={pauseDisasterScenario}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={resumeDisasterScenario}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Resume</span>
              </button>
            )}

            <button
              onClick={resetDisasterScenario}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Scenario</span>
            </button>
          </div>
        </div>

        {/* Narrative Banner */}
        <div className="bg-[#071426]/80 p-3 rounded-xl border border-cyan-500/20 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
            <IconComponent className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-200 font-medium">
            {currentStepData.desc}
          </p>
        </div>

        {/* 10-Step Interactive Visual Timeline */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 pt-1">
          {steps.map((st) => {
            const isCompleted = scenarioStep > st.step;
            const isCurrent = scenarioStep === st.step;
            return (
              <button
                key={st.step}
                onClick={() => goToScenarioStep(st.step)}
                className={`p-1.5 rounded-lg flex flex-col items-center text-center transition-all ${
                  isCurrent
                    ? 'bg-cyan-500 text-[#071426] font-bold shadow-lg shadow-cyan-500/30 scale-105 ring-2 ring-white'
                    : isCompleted
                    ? 'bg-emerald-950/60 border border-emerald-600/40 text-emerald-400 hover:bg-emerald-900/40'
                    : 'bg-[#071426]/50 border border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
                title={`Step ${st.step}: ${st.title}`}
              >
                <span className="text-[10px] font-mono">
                  {isCompleted ? '✓' : `0${st.step}`}
                </span>
                <span className="text-[9px] line-clamp-1 truncate w-full mt-0.5">
                  {st.title.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
