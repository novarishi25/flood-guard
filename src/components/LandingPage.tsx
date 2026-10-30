import React from 'react';
import {
  Shield,
  Waves,
  Activity,
  AlertTriangle,
  BrainCircuit,
  Radio,
  Truck,
  Home,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Server,
  CloudRain,
  Compass,
  Users,
  Clock,
  PhoneCall,
  ChevronRight,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { useFloodGuard } from '../context/FloodGuardContext';

export const LandingPage: React.FC = () => {
  const { setActiveTab, metrics, runDisasterScenario } = useFloodGuard();

  const corePillars = [
    {
      title: '1. PREDICT',
      subtitle: 'AI Hydrological Risk Modeling',
      desc: 'Machine learning algorithms analyze real-time rainfall, soil moisture, and river elevations to forecast flash floods 6 hours before inundation.',
      icon: BrainCircuit,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Gemini 3.8 Powered',
      action: () => setActiveTab('ai-prediction'),
    },
    {
      title: '2. PROTECT',
      subtitle: 'Automated Warning Dispatches',
      desc: 'Cell broadcast emergency sirens, localized SMS alerts, and safe shelter routing activate the moment critical river crest thresholds are breached.',
      icon: ShieldCheck,
      color: 'from-teal-400 to-emerald-600',
      badge: 'Public Safety Mesh',
      action: () => setActiveTab('weather-alerts'),
    },
    {
      title: '3. RESPOND',
      subtitle: 'Smart Rescue Prioritization',
      desc: 'AI prioritizes trapped citizens, children, and elderly patients, dispatching amphibious boats and drones to high-urgency rescue coordinates.',
      icon: Radio,
      color: 'from-amber-500 to-orange-600',
      badge: 'Sub-Minute Dispatch',
      action: () => setActiveTab('rescue-management'),
    },
    {
      title: '4. REBUILD',
      subtitle: 'Intelligent Relief Logistics',
      desc: 'Dynamic inventory tracking distributes potable water, MRE rations, and trauma medical supplies to evacuation shelters facing critical deficits.',
      icon: Truck,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Zero-Waste Supply Chain',
      action: () => setActiveTab('relief-distribution'),
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Sensor Ingestion',
      desc: 'Ultrasonic river depth gauges, rain collectors, and satellite weather feeds transmit telemetry every 30 seconds.',
    },
    {
      step: '02',
      title: 'AI Inundation Prediction',
      desc: 'Hydrological physics equations combined with Gemini reasoning calculate run-off coefficients and impact zones.',
    },
    {
      step: '03',
      title: 'Civil Defense Alerts',
      desc: 'Automatic Red/Orange warnings push to resident cell phones and citywide PA acoustic siren arrays.',
    },
    {
      step: '04',
      title: 'Prioritized Extraction',
      desc: 'Citizen SOS reports pass through priority scoring engine; tactical strike boats navigate safe water routes.',
    },
    {
      step: '05',
      title: 'Shelter & Supply Balancing',
      desc: 'Evacuees routed to shelters with verified bed availability; supply trucks restock high-demand centers.',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a1c33] via-[#071426] to-[#071426]">
        {/* Decorative Grid & Glow Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#102a4315_1px,transparent_1px),linear-gradient(to_bottom,#102a4315_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto">
          {/* Hackathon Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102A43] border border-cyan-500/30 shadow-lg text-xs font-semibold text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="font-mono uppercase tracking-wider">Smart Cities Disaster Architecture</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-mono">National Hackathon Edition</span>
            </div>
          </div>

          {/* Hero Headlines */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white">
              Building{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                Flood-Resilient Cities
              </span>{' '}
              Through Intelligent Technology.
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-normal max-w-3xl mx-auto leading-relaxed">
              An AI-powered smart-city platform that predicts flood risks, coordinates emergency response, and delivers critical relief resources when every second matters.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setActiveTab('command-center')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-[#071426] font-bold text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Activity className="w-5 h-5" />
                <span>Explore Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('citizen-portal')}
                className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-red-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>Report an Emergency</span>
              </button>

              <button
                onClick={() => setActiveTab('ai-prediction')}
                className="px-6 py-3.5 rounded-xl bg-[#102A43] hover:bg-[#193a5c] text-cyan-300 border border-cyan-500/30 font-semibold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer"
              >
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
                <span>Discover Our Technology</span>
              </button>

              <button
                onClick={runDisasterScenario}
                className="px-5 py-3.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg transition-all border border-indigo-400/40 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Run Presentation Scenario</span>
              </button>
            </div>
          </div>

          {/* Live Telemetry Ticker Strip */}
          <div className="mt-14 p-4 rounded-2xl bg-glass-card border border-cyan-500/20 shadow-2xl grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
            <div className="p-3 bg-[#071426]/60 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Flood Risk Index</div>
              <div className="text-xl font-black font-mono text-cyan-400 mt-1">
                {metrics.floodRiskScore}/100
              </div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Hydrological Model</div>
            </div>

            <div className="p-3 bg-[#071426]/60 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Active Alerts</div>
              <div className="text-xl font-black font-mono text-amber-400 mt-1">
                {metrics.activeAlertsCount} Broadcasts
              </div>
              <div className="text-[10px] text-amber-400 font-mono mt-0.5">Siren & SMS Mesh</div>
            </div>

            <div className="p-3 bg-[#071426]/60 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Affected Sectors</div>
              <div className="text-xl font-black font-mono text-red-400 mt-1">
                {metrics.affectedLocationsCount} Zones
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">High Inundation</div>
            </div>

            <div className="p-3 bg-[#071426]/60 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Citizen SOS Reports</div>
              <div className="text-xl font-black font-mono text-white mt-1">
                {metrics.totalReportsCount} Logged
              </div>
              <div className="text-[10px] text-cyan-400 font-mono mt-0.5">Smart Ranked</div>
            </div>

            <div className="p-3 bg-[#071426]/60 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Tactical Strike Teams</div>
              <div className="text-xl font-black font-mono text-cyan-300 mt-1">
                {metrics.activeRescueTeamsCount} Dispatched
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">Zodiacs & Drones</div>
            </div>

            <div className="p-3 bg-[#071426]/60 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Available Beds</div>
              <div className="text-xl font-black font-mono text-emerald-400 mt-1">
                {metrics.totalAvailableBeds} Beds
              </div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Across 4 Shelters</div>
            </div>

            <div className="p-3 bg-[#071426]/60 rounded-xl border border-slate-800 col-span-2 md:col-span-1">
              <div className="text-[11px] text-slate-400 font-medium">Relief Stockpile</div>
              <div className="text-xl font-black font-mono text-teal-300 mt-1">
                {(metrics.totalStockCount / 1000).toFixed(1)}k Units
              </div>
              <div className="text-[10px] text-teal-400 font-mono mt-0.5">Water, Food, Kits</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            ENGINEERED FOR RESILIENCE
          </div>
          <h2 className="text-3xl font-black text-white">
            The Four Pillars of FloodGuard Architecture
          </h2>
          <p className="text-sm text-slate-400">
            A closed-loop, intelligent emergency response architecture designed for high-density smart cities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {corePillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                onClick={pillar.action}
                className="group relative p-6 rounded-2xl bg-glass-card hover:border-cyan-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${pillar.color} text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {pillar.badge}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider">
                      {pillar.title}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {pillar.subtitle}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-400 font-semibold group-hover:text-cyan-300">
                  <span>Open Module</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works / Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0e243a] to-[#071426] border border-[#102A43] shadow-2xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-widest">
              END-TO-END EXECUTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              How FLOODGUARD Responds When Disaster Strikes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {workflowSteps.map((step, idx) => (
              <div
                key={step.step}
                className="relative p-5 rounded-2xl bg-[#071426]/70 border border-slate-800/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-mono text-cyan-400/40">
                    {step.step}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                </div>
                <h4 className="text-sm font-bold text-white">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI & IoT Sensor Technology Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                INTELLIGENT FOUNDATION
              </span>
              <h2 className="text-3xl font-black text-white leading-tight">
                Empowered by Gemini AI & Real-Time Hydrological Mesh
              </h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              FLOODGUARD fuses IoT sensor telemetry with Google Gemini 3.8 Flash model reasoning to evaluate physical hydrology parameters. We replace static spreadsheet forecasts with real-time flood dynamics.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-glass border border-cyan-500/15">
                <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Gemini 3.8 Flash Deep Reasoning</h4>
                  <p className="text-xs text-slate-400">
                    Synthesizes drainage outflow rates, rain radar forecasts, and historical flooding patterns to draft emergency action directives.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-glass border border-cyan-500/15">
                <Server className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Smart Hydrological Sensor Mesh</h4>
                  <p className="text-xs text-slate-400">
                    Sub-minute water elevation monitoring stations along rivers, spillways, reservoirs, and drainage outfalls.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-glass border border-cyan-500/15">
                <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Smart Priority Rescue Scoring</h4>
                  <p className="text-xs text-slate-400">
                    Weighted algorithmic scoring sorts hundreds of incoming citizen SOS requests based on trapped status, water depth, and medical vulnerabilities.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('ai-prediction')}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#071426] font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
              >
                <span>Launch AI Flood Prediction Lab</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Simulation Preview Card */}
          <div className="p-6 rounded-3xl bg-glass-card border border-cyan-500/30 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-xs font-mono font-bold text-white">REAL-TIME INUNDATION RADAR</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                LIVE TELEMETRY
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#071426] border border-slate-800">
                <span className="text-[10px] text-slate-400">Peak River Elevation</span>
                <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">6.3 meters</div>
                <div className="text-[10px] text-red-400 font-mono">+0.3m Above Danger Mark</div>
              </div>

              <div className="p-3 rounded-xl bg-[#071426] border border-slate-800">
                <span className="text-[10px] text-slate-400">Stormwater Flow Velocity</span>
                <div className="text-xl font-bold font-mono text-teal-300 mt-0.5">4.8 m/sec</div>
                <div className="text-[10px] text-slate-400 font-mono">Discharge: 1,420 m³/s</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#071426]/80 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Priority Rescue Alert
                </span>
                <span className="font-mono">P-98 / 100</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "Family of 5 trapped on rooftop patio with infant in Sector 8B North Delta. Swift current breaching lower windows."
              </p>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] font-mono text-cyan-400">Assigned: Team Alpha-1 (Zodiac Craft)</span>
                <button
                  onClick={() => setActiveTab('rescue-management')}
                  className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[11px]"
                >
                  Inspect Mission
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0d2137] border border-cyan-500/20 text-center">
              <p className="text-xs text-slate-300">
                Witness this automated response in action with our 10-step judge scenario.
              </p>
              <button
                onClick={runDisasterScenario}
                className="mt-2.5 w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-[#071426] font-black text-xs shadow-md transition-all"
              >
                Click to Run Automated Judge Demonstration
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Smart City Stakeholder Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            TRANSFORMATIVE IMPACT
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Smart City Governance & Citizen Empowerment
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-glass-card border border-slate-800 space-y-3">
            <div className="p-2.5 w-fit rounded-xl bg-cyan-500/20 text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">For Disaster Authorities</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Consolidated real-time situational awareness across municipal departments. Automated flood warnings eliminate manual bureaucratic delays.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-glass-card border border-slate-800 space-y-3">
            <div className="p-2.5 w-fit rounded-xl bg-teal-500/20 text-teal-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">For First Responders</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Eliminate guesswork. Rescue teams receive exact GPS coordinates, water depths, and victim counts prioritized so the most vulnerable are saved first.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-glass-card border border-slate-800 space-y-3">
            <div className="p-2.5 w-fit rounded-xl bg-amber-500/20 text-amber-400">
              <Home className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">For Urban Citizens</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              One-click SOS reporting with GPS locator, real-time shelter bed capacity tracking, and validated safety advisories without misinformation.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Hotline Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/80 via-[#102A43] to-red-950/80 border border-red-500/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-red-600/30 text-red-400 border border-red-500/40 animate-pulse">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Smart City Emergency Response Hotlines</h4>
              <p className="text-xs text-slate-300">
                Instant 24x7 distress triage for citizens in flooded sectors.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#071426] border border-red-500/40 text-xs font-mono">
              <span className="text-slate-400">Disaster Helpline: </span>
              <span className="font-bold text-red-400">112</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-[#071426] border border-red-500/40 text-xs font-mono">
              <span className="text-slate-400">Flood Control: </span>
              <span className="font-bold text-amber-400">1077</span>
            </div>
            <button
              onClick={() => setActiveTab('citizen-portal')}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              Open Citizen SOS Portal
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 border-t border-slate-800/80 text-xs text-slate-400 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 p-0.5">
              <div className="w-full h-full bg-[#071426] rounded-[7px] flex items-center justify-center">
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-bold text-white">FLOODGUARD</span>
              <span className="text-slate-500 mx-2">•</span>
              <span>Predict. Protect. Respond. Rebuild.</span>
            </div>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Smart City Hackathon Edition • Developed for Autonomous Relief Coordination
          </div>
        </div>
        <div className="text-[10px] text-slate-400 leading-relaxed">
          Disclaimer: This web application is a demonstration and decision-support prototype built for hackathon evaluation. Sensor telemetries and flood predictions are simulated for demonstration purposes.
        </div>
      </footer>
    </div>
  );
};
