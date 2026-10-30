import React, { useState } from 'react';
import {
  CloudRain,
  Waves,
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle,
  Megaphone,
  Radio,
  Send,
  Plus,
  CheckCircle2,
  BellRing,
  Info,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { useFloodGuard } from '../context/FloodGuardContext';
import { AlertLevel, EmergencyAlert } from '../types';

export const WeatherAlerts: React.FC = () => {
  const {
    weatherStations,
    alerts,
    createAlert,
    toggleAlertStatus,
    currentUser,
    showNotification,
  } = useFloodGuard();

  // Create alert modal / form
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertLevel, setAlertLevel] = useState<AlertLevel>('HIGH RISK');
  const [selectedZones, setSelectedZones] = useState<string[]>([
    'Sector 4 Marina',
    'Sector 8 North Delta',
  ]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    'SMS Broadcast',
    'PA Sirens',
    'App Push Notification',
  ]);

  const availableZones = [
    'Sector 4 Marina',
    'Sector 8 North Delta',
    'Riverfront Promenade',
    'Grand Expressway Corridor',
    'Central Metro Underpass',
    'Sector 12 Highland Ring',
  ];

  const availableChannels = [
    'SMS Broadcast',
    'PA Sirens',
    'App Push Notification',
    'Emergency Radio 104.2 FM',
    'Electronic Highway Billboards',
  ];

  const handleToggleZone = (zone: string) => {
    setSelectedZones((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]
    );
  };

  const handleToggleChannel = (channel: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    );
  };

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle || !alertMessage || selectedZones.length === 0) {
      showNotification('Please fill in title, message, and at least one target zone', 'error');
      return;
    }

    createAlert({
      title: alertTitle,
      message: alertMessage,
      level: alertLevel,
      issuedBy: currentUser.name,
      zones: selectedZones,
      channels: selectedChannels,
    });

    setCreateModalOpen(false);
    setAlertTitle('');
    setAlertMessage('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-500/20 text-amber-400">
              <CloudRain className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
              METEOROLOGICAL & EARLY WARNING BROADCAST
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Weather Telemetry & Emergency Notification Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor real-time ultrasonic hydro gauges and dispatch emergency warnings over citywide public safety sirens.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
        >
          <Megaphone className="w-4 h-4" />
          <span>Broadcast Citywide Warning</span>
        </button>
      </div>

      {/* Real-time Weather Telemetry Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-glass-card border border-cyan-500/20">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Current Rain</span>
            <CloudRain className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-cyan-400 mt-2">
            74 <span className="text-xs font-normal text-slate-400">mm/hr</span>
          </div>
          <span className="text-[10px] text-amber-400 font-mono">Heavy Monsoon Squall</span>
        </div>

        <div className="p-4 rounded-2xl bg-glass-card border border-teal-500/20">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Max River Gauge</span>
            <Waves className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black font-mono text-teal-300 mt-2">
            6.3 <span className="text-xs font-normal text-slate-400">meters</span>
          </div>
          <span className="text-[10px] text-red-400 font-mono font-bold">+0.3m Danger Crest</span>
        </div>

        <div className="p-4 rounded-2xl bg-glass-card border border-blue-500/20">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Temperature</span>
            <Thermometer className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white mt-2">
            26.8 <span className="text-xs font-normal text-slate-400">°C</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Humid Wet-Bulb</span>
        </div>

        <div className="p-4 rounded-2xl bg-glass-card border border-blue-500/20">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Air Humidity</span>
            <Droplets className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black font-mono text-blue-300 mt-2">
            96 <span className="text-xs font-normal text-slate-400">%</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Dew Point 26°C</span>
        </div>

        <div className="p-4 rounded-2xl bg-glass-card border border-indigo-500/20">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Wind Velocity</span>
            <Wind className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black font-mono text-indigo-300 mt-2">
            44 <span className="text-xs font-normal text-slate-400">km/h</span>
          </div>
          <span className="text-[10px] text-amber-400 font-mono">Gusts to 65 km/h</span>
        </div>

        <div className="p-4 rounded-2xl bg-glass-card border border-amber-500/20">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Flood Risk Level</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-400 mt-2">
            HIGH
          </div>
          <span className="text-[10px] text-amber-300 font-mono">Red Warning Imminent</span>
        </div>
      </div>

      {/* Sensor Hydro-Stations Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Waves className="w-4 h-4 text-cyan-400" />
            <span>Water-Level Ultrasonic Monitoring Stations (IoT Grid)</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            {weatherStations.length} Hydro Stations Reporting
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weatherStations.map((stn) => {
            const isCritical = stn.status === 'Critical Crest';
            const isHigh = stn.status === 'High Risk';
            const isWarn = stn.status === 'Warning';

            return (
              <div
                key={stn.id}
                className={`p-5 rounded-2xl bg-glass-card border transition-all space-y-3 ${
                  isCritical
                    ? 'border-red-500/60 shadow-lg shadow-red-500/10'
                    : isHigh
                    ? 'border-amber-500/50'
                    : 'border-slate-800 hover:border-cyan-500/30'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400">{stn.id}</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{stn.name}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isCritical
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                        : isHigh
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : isWarn
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {stn.status}
                  </span>
                </div>

                {/* Level Meter */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#071426] p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Water Elevation</span>
                    <span className="font-mono font-bold text-cyan-300 text-base">{stn.waterLevel.toFixed(1)} m</span>
                  </div>
                  <div className="bg-[#071426] p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Danger Crest</span>
                    <span className="font-mono font-bold text-red-400 text-base">{stn.dangerThreshold.toFixed(1)} m</span>
                  </div>
                </div>

                <div className="flex justify-between text-[11px] text-slate-300 pt-1">
                  <span>Precipitation: <b className="text-white font-mono">{stn.rainfallRate} mm/hr</b></span>
                  <span>Flow Velocity: <b className="text-white font-mono">{stn.flowVelocity} m/s</b></span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${
                      stn.waterLevel >= stn.dangerThreshold ? 'bg-red-500' : 'bg-cyan-400'
                    }`}
                    style={{ width: `${Math.min(100, (stn.waterLevel / stn.dangerThreshold) * 100)}%` }}
                  />
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Sensor Health: {stn.sensorHealth}</span>
                  <span className="text-emerald-400">Latency: 12ms</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Alerts Management Section */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-red-400" />
            <span>Active Emergency Broadcast Alerts ({alerts.length})</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Public Mesh Dispatches</span>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border transition-all space-y-3 ${
                alert.isActive
                  ? alert.level === 'CRITICAL'
                    ? 'bg-gradient-to-r from-red-950/80 via-[#102A43] to-red-950/80 border-red-500/50 shadow-xl'
                    : 'bg-glass-card border-amber-500/40'
                  : 'bg-[#071426]/60 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      alert.level === 'CRITICAL'
                        ? 'bg-red-500 text-white animate-pulse'
                        : alert.level === 'HIGH RISK'
                        ? 'bg-amber-500 text-black font-bold'
                        : 'bg-yellow-500 text-black'
                    }`}
                  >
                    {alert.level}
                  </span>
                  <span className="text-xs font-mono text-cyan-400 font-bold">#{alert.id}</span>
                  <span className="text-xs text-slate-400">Issued by {alert.issuedBy}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">{alert.issuedAt}</span>
                  <button
                    onClick={() => toggleAlertStatus(alert.id)}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                      alert.isActive
                        ? 'bg-red-500/20 text-red-300 hover:bg-red-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {alert.isActive ? 'Active (Deactivate)' : 'Archived (Reactivate)'}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{alert.title}</h3>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  {alert.message}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-slate-400 text-[10px]">Target Zones:</span>
                  {alert.zones.map((z, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#071426] border border-slate-700 text-cyan-300 font-mono"
                    >
                      {z}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-slate-400 text-[10px]">Broadcast Via:</span>
                  {alert.channels.map((ch, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#071426] border border-slate-700 text-slate-300 font-mono"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulated Telemetry Disclaimer Watermark */}
      <div className="p-3.5 rounded-xl bg-[#071426]/70 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <span>
          <strong className="text-slate-300">Simulated Readings Notice:</strong> Station sensor values and weather forecasts displayed here are realistic smart-city simulated telemetry feeds for hackathon demonstration. Real deployment integrates LoRaWAN and MQTT meteorological bridges.
        </span>
      </div>

      {/* Create Broadcast Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#0d2137] border border-red-500/50 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-red-400" />
                <span>Create Citywide Emergency Broadcast</span>
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBroadcast} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Alert Severity Level:</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['NORMAL', 'WARNING', 'HIGH RISK', 'CRITICAL'] as AlertLevel[]).map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setAlertLevel(lvl)}
                      className={`py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                        alertLevel === lvl
                          ? lvl === 'CRITICAL'
                            ? 'bg-red-600 text-white shadow-lg'
                            : lvl === 'HIGH RISK'
                            ? 'bg-amber-500 text-black font-bold'
                            : 'bg-cyan-500 text-[#071426] font-bold'
                          : 'bg-[#071426] border border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Alert Headline / Title *</label>
                <input
                  type="text"
                  required
                  value={alertTitle}
                  onChange={(e) => setAlertTitle(e.target.value)}
                  placeholder="e.g. FLASH FLOOD RED WARNING: CANAL WALL BREACH"
                  className="w-full p-2.5 rounded-xl bg-[#071426] border border-slate-700 text-xs text-white focus:outline-none focus:border-red-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Broadcast Directive Message *</label>
                <textarea
                  rows={3}
                  required
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  placeholder="Clear instructions to citizens (e.g. Evacuate low-lying areas, proceed to Sector 3 Sports Dome shelter immediately)..."
                  className="w-full p-2.5 rounded-xl bg-[#071426] border border-slate-700 text-xs text-white focus:outline-none focus:border-red-400"
                />
              </div>

              {/* Target Zones Selector */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Select Geographic Target Zones:</label>
                <div className="flex flex-wrap gap-2">
                  {availableZones.map((z) => {
                    const isSelected = selectedZones.includes(z);
                    return (
                      <button
                        type="button"
                        key={z}
                        onClick={() => handleToggleZone(z)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-cyan-500 text-[#071426] font-bold'
                            : 'bg-[#071426] border border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        {isSelected ? '✓ ' : ''}{z}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Transmission Channels */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Select Transmission Channels:</label>
                <div className="flex flex-wrap gap-2">
                  {availableChannels.map((ch) => {
                    const isSelected = selectedChannels.includes(ch);
                    return (
                      <button
                        type="button"
                        key={ch}
                        onClick={() => handleToggleChannel(ch)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-teal-500 text-[#071426] font-bold'
                            : 'bg-[#071426] border border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        {isSelected ? '✓ ' : ''}{ch}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg shadow-red-600/30 cursor-pointer"
                >
                  TRANSMIT CITYWIDE BROADCAST NOW
                </button>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
