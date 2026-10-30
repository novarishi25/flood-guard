import React, { useState } from 'react';
import {
  AlertTriangle,
  LifeBuoy,
  PhoneCall,
  MapPin,
  Camera,
  Compass,
  CheckCircle2,
  Search,
  BookOpen,
  Home,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useFloodGuard } from '../context/FloodGuardContext';
import { EmergencyCategory, WaterDepthLevel, FloodReport } from '../types';

export const CitizenPortal: React.FC = () => {
  const {
    reports,
    shelters,
    alerts,
    addReport,
    showNotification,
    setActiveTab,
  } = useFloodGuard();

  // Active sub-tab
  const [subTab, setSubTab] = useState<'sos-report' | 'track' | 'shelters' | 'guidelines'>('sos-report');

  // Form State
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [locationName, setLocationName] = useState<string>('');
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 19.0760,
    lng: 72.8777,
  });
  const [category, setCategory] = useState<EmergencyCategory>('People trapped');
  const [affectedCount, setAffectedCount] = useState<number>(4);
  const [waterDepth, setWaterDepth] = useState<WaterDepthLevel>('Waist (1.0m)');
  const [description, setDescription] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Success Modal
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Complaint Tracking State
  const [searchTrackingId, setSearchTrackingId] = useState<string>('');
  const [trackedReport, setTrackedReport] = useState<FloodReport | null>(null);

  // Geolocation detector
  const handleGetGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoordinates({
            lat: Number(pos.coords.latitude.toFixed(4)),
            lng: Number(pos.coords.longitude.toFixed(4)),
          });
          setLocationName(`GPS: [${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}] (Near Sector 4 Marina)`);
          showNotification('Acquired precise satellite coordinates', 'success');
        },
        () => {
          // fallback sample coordinates
          setGpsCoordinates({ lat: 19.0820, lng: 72.8710 });
          setLocationName('Sector 4 Riverfront Marina (GPS Calibrated)');
          showNotification('Acquired mock coordinates for Smart City Grid', 'info');
        }
      );
    } else {
      setGpsCoordinates({ lat: 19.0820, lng: 72.8710 });
      setLocationName('Sector 4 Riverfront Marina (Smart City Sector)');
    }
  };

  // Simulated photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      showNotification('Damage scene photo attached for rescue reconnaissance', 'info');
    }
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !locationName) {
      showNotification('Please fill in Name, Phone, and Location', 'error');
      return;
    }

    const newId = addReport({
      citizenName: fullName,
      phone,
      locationName,
      lat: gpsCoordinates.lat,
      lng: gpsCoordinates.lng,
      category,
      affectedCount: Number(affectedCount),
      waterDepth,
      description: description || 'No further description provided.',
      imageUrl: previewImage || undefined,
    });

    setSubmittedId(newId);
    // Reset form
    setFullName('');
    setPhone('');
    setLocationName('');
    setDescription('');
    setPreviewImage(null);
  };

  // Track search
  const handleSearchTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTrackingId.trim()) return;

    const found = reports.find(
      (r) => r.id.toLowerCase() === searchTrackingId.trim().toLowerCase()
    );

    if (found) {
      setTrackedReport(found);
      showNotification(`Incident #${found.id} located in central registry`, 'success');
    } else {
      setTrackedReport(null);
      showNotification(`No report found with ID: ${searchTrackingId}`, 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Citizen Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1c0e18] via-[#102A43] to-[#071426] border border-red-500/40 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
              SMART CITIZEN LIFELINE PORTAL
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Emergency Distress & Public Safety Portal
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Report live flood incidents, beacon emergency SOS coordinates, track rescue status, and locate verified shelters.
          </p>
        </div>

        {/* Hotlines */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-red-950/80 border border-red-500/40 text-xs font-mono">
            <span className="text-slate-400">Emergency 24x7: </span>
            <span className="font-bold text-red-400">112</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-xs font-mono">
            <span className="text-slate-400">Flood Control: </span>
            <span className="font-bold text-amber-400">1077</span>
          </div>
        </div>
      </div>

      {/* Citizen Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setSubTab('sos-report')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            subTab === 'sos-report'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'text-slate-400 hover:text-white hover:bg-[#102A43]'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Report Flood / SOS</span>
        </button>

        <button
          onClick={() => setSubTab('track')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            subTab === 'track'
              ? 'bg-cyan-500 text-[#071426] shadow-lg shadow-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-[#102A43]'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Track My Report ({reports.length})</span>
        </button>

        <button
          onClick={() => setSubTab('shelters')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            subTab === 'shelters'
              ? 'bg-teal-500 text-[#071426] shadow-lg shadow-teal-500/30'
              : 'text-slate-400 hover:text-white hover:bg-[#102A43]'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Find Safe Shelters</span>
        </button>

        <button
          onClick={() => setSubTab('guidelines')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            subTab === 'guidelines'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-[#102A43]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Flood Safety Protocols</span>
        </button>
      </div>

      {/* SUB-TAB 1: Citizen SOS Report Form */}
      {subTab === 'sos-report' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Intake Form (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-2xl bg-glass-card border border-red-500/30 shadow-2xl space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
                  RAPID INTAKE DISPATCH SYSTEM
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  Citizen Flood Emergency Incident Report
                </h2>
                <p className="text-xs text-slate-400">
                  Submissions are prioritized by automated AI algorithms and routed instantly to rescue units.
                </p>
              </div>

              <form onSubmit={handleSubmitReport} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 font-medium">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Sen"
                      className="w-full p-2.5 rounded-xl bg-[#071426] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 font-medium">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full p-2.5 rounded-xl bg-[#071426] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                {/* Location with Auto-GPS button */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-slate-300 font-medium">Incident Location / Address *</label>
                    <button
                      type="button"
                      onClick={handleGetGPS}
                      className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Use My Current GPS</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. North Delta Canal Road, Sector 8B, House #42"
                    className="w-full p-2.5 rounded-xl bg-[#071426] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span>GPS Coordinates: {gpsCoordinates.lat.toFixed(4)}, {gpsCoordinates.lng.toFixed(4)}</span>
                    <span className="text-emerald-400">Precision Lock: High</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 font-medium">Emergency Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as EmergencyCategory)}
                      className="w-full p-2.5 rounded-xl bg-[#071426] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="People trapped">People trapped (Top Priority)</option>
                      <option value="House flooding">House flooding</option>
                      <option value="Road flooding">Road flooding</option>
                      <option value="River overflow">River overflow</option>
                      <option value="Drainage blockage">Drainage blockage</option>
                      <option value="Dam overflow">Dam overflow</option>
                      <option value="Other">Other emergency</option>
                    </select>
                  </div>

                  {/* Number of People */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 font-medium">People Affected *</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={affectedCount}
                      onChange={(e) => setAffectedCount(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-[#071426] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  {/* Water Depth */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 font-medium">Estimated Depth *</label>
                    <select
                      value={waterDepth}
                      onChange={(e) => setWaterDepth(e.target.value as WaterDepthLevel)}
                      className="w-full p-2.5 rounded-xl bg-[#071426] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Ankle (0.2m)">Ankle (0.2m)</option>
                      <option value="Knee (0.5m)">Knee (0.5m)</option>
                      <option value="Waist (1.0m)">Waist (1.0m)</option>
                      <option value="Chest (1.4m)">Chest (1.4m)</option>
                      <option value="Submerged (>2.0m)">Submerged (&gt;2.0m)</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">
                    Situation Details / Special Hazards
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mention if children, elderly, pregnant women, or sick patients are present. Mention if current is rapid or power lines are submerged..."
                    className="w-full p-2.5 rounded-xl bg-[#071426] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Simulated photo upload */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Attach Photo Evidence (Optional)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="px-3.5 py-2 rounded-xl bg-[#071426] hover:bg-[#102A43] border border-dashed border-slate-600 text-xs text-slate-300 cursor-pointer flex items-center gap-1.5">
                      <span>Upload Camera Capture</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    {previewImage && (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-cyan-400">
                        <img src={previewImage} alt="Uploaded scene" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 transition-all cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>TRANSMIT EMERGENCY REPORT (SOS)</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Public Alerts & Hotlines (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Active Citizen Advisories */}
            <div className="p-5 rounded-2xl bg-glass-card border border-amber-500/30 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Active Citywide Flood Warnings</span>
              </div>
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-xl bg-[#071426] border border-amber-500/20 space-y-1 text-xs"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-amber-300">{alert.title}</span>
                      <span className="text-[10px] font-mono text-slate-400">{alert.issuedAt}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {alert.message}
                    </p>
                    <div className="text-[10px] text-cyan-400 font-mono pt-1">
                      Target Zones: {alert.zones.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick SOS Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-red-950/80 to-[#071426] border border-red-500/40 shadow-xl text-center space-y-3">
              <h3 className="text-base font-black text-white">
                IMMEDIATE LIFE THREAT?
              </h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                If flood water has breached the upper story or someone is washed away, dial direct emergency frequencies:
              </p>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <a
                  href="tel:112"
                  className="p-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex flex-col items-center gap-1 shadow-lg shadow-red-600/30"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call 112 (Disaster)</span>
                </a>
                <a
                  href="tel:1077"
                  className="p-3 rounded-xl bg-[#102A43] hover:bg-[#1a3d60] text-cyan-300 border border-cyan-500/30 font-bold text-xs flex flex-col items-center gap-1"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call 1077 (Flood)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Track Submitted Reports */}
      {subTab === 'track' && (
        <div className="space-y-6">
          {/* Search Box */}
          <div className="p-6 rounded-2xl bg-glass-card border border-cyan-500/20 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Track Submitted Emergency Report</span>
            </h3>
            <form onSubmit={handleSearchTracking} className="flex gap-2">
              <input
                type="text"
                value={searchTrackingId}
                onChange={(e) => setSearchTrackingId(e.target.value)}
                placeholder="Enter Report ID (e.g. FG-2026-9041)..."
                className="flex-1 p-2.5 rounded-xl bg-[#071426] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#071426] font-bold text-xs"
              >
                Track Status
              </button>
            </form>

            {/* Found Report Inspector */}
            {trackedReport && (
              <div className="p-4 rounded-xl bg-[#071426] border border-cyan-500/40 space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400">INCIDENT ID: #{trackedReport.id}</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{trackedReport.category}</h4>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded ${
                      trackedReport.status === 'Resolved'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : trackedReport.status === 'Rescue Assigned'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {trackedReport.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Location</span>
                    <span className="text-white font-medium">{trackedReport.locationName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Water Depth</span>
                    <span className="text-amber-400 font-medium">{trackedReport.waterDepth}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Victims</span>
                    <span className="text-white font-medium">{trackedReport.affectedCount} persons</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Priority Score</span>
                    <span className="text-cyan-400 font-mono font-bold">{trackedReport.priorityScore}/100</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 pt-1">
                  {trackedReport.description}
                </p>
              </div>
            )}
          </div>

          {/* List of All Reports Logged in System */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>All Active Emergency Reports in Area</span>
              <span className="text-xs font-mono text-cyan-400">{reports.length} Reports</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-xl bg-glass-card border border-slate-800 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400">#{rep.id}</span>
                      <h4 className="text-xs font-bold text-white">{rep.category}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        rep.status === 'Resolved'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : rep.status === 'Rescue Assigned'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {rep.status}
                    </span>
                  </div>
                  <div className="text-xs text-cyan-300">{rep.locationName}</div>
                  <p className="text-xs text-slate-300 line-clamp-2">{rep.description}</p>
                  <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                    <span>Affected: {rep.affectedCount} ppl</span>
                    <span>Depth: {rep.waterDepth.split(' ')[0]}</span>
                    <span className="font-mono text-cyan-400">P-{rep.priorityScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Find Nearby Shelters */}
      {subTab === 'shelters' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-glass-card border border-cyan-500/20 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Smart City Designated Emergency Shelters</h3>
              <p className="text-xs text-slate-400">
                Verified safe havens equipped with beds, medical staff, potable water, and dry rations.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('command-center')}
              className="px-3 py-1.5 rounded-lg bg-[#102A43] hover:bg-[#1a3d60] text-cyan-300 text-xs font-semibold"
            >
              View on Map
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shelters.map((shl) => (
              <div
                key={shl.id}
                className="p-5 rounded-2xl bg-glass-card border border-slate-800 hover:border-cyan-500/40 space-y-3 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-white">{shl.name}</h4>
                    <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {shl.location}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      shl.status === 'Full'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : shl.status === 'Nearly Full'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {shl.status}
                  </span>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Occupancy:</span>
                    <span className="font-mono font-bold">{shl.occupiedCapacity} / {shl.totalCapacity}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${
                        shl.status === 'Full' ? 'bg-red-500' : shl.status === 'Nearly Full' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${(shl.occupiedCapacity / shl.totalCapacity) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                  <div className="bg-[#071426] p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Available Beds</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">{shl.availableBeds}</span>
                  </div>
                  <div className="bg-[#071426] p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Food Rations</span>
                    <span className="font-semibold text-cyan-300">{shl.foodAvailability}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-300">
                  <span className="text-slate-400">Medical Setup:</span> {shl.medicalFacilities}
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <a
                    href={`tel:${shl.contact}`}
                    className="text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{shl.contact}</span>
                  </a>
                  <button
                    onClick={() => showNotification(`Directions to ${shl.name} sent to mobile device`, 'success')}
                    className="px-3 py-1 rounded bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-[#071426] font-bold text-xs transition-all"
                  >
                    Get GPS Route
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Illustrated Flood Safety Guidelines */}
      {subTab === 'guidelines' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phase 1: Before Flood */}
          <div className="p-6 rounded-2xl bg-glass-card border border-cyan-500/20 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <ShieldAlert className="w-5 h-5" />
              <span>BEFORE THE FLOOD</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Keep important identity papers, deeds, and medications in sealed waterproof pouches.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Identify nearest elevated smart shelters and memorize escape routes avoid underpasses.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Keep power banks charged and store at least 3 days of potable water in clean containers.</span>
              </li>
            </ul>
          </div>

          {/* Phase 2: During Flood */}
          <div className="p-6 rounded-2xl bg-glass-card border border-red-500/30 space-y-4">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>DURING THE FLOOD</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>Turn off main electric circuit breaker before water enters the living quarters.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>Never drive or walk through moving water. 15cm of rapid water can knock an adult down.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>If trapped, climb to the roof. Signal rescue helicopters or boats with bright fabric or flashlights.</span>
              </li>
            </ul>
          </div>

          {/* Phase 3: After Flood */}
          <div className="p-6 rounded-2xl bg-glass-card border border-teal-500/20 space-y-4">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>AFTER THE FLOOD</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Do not touch damp electrical appliances until inspected by a licensed electrician.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Boil all drinking water for at least 1 minute or use halogen water purification tablets.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Watch for snakes, exposed debris, and structural damage before re-entering residences.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Submission Success Modal */}
      {submittedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0d2137] border-2 border-red-500 rounded-3xl shadow-2xl p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 text-red-400 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
                SOS BEACON REGISTERED
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                Emergency Report Transmitted!
              </h3>
            </div>

            <div className="p-3 bg-[#071426] rounded-xl border border-slate-700 font-mono text-cyan-300 font-bold text-base">
              REPORT ID: #{submittedId}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Your distress signal has been placed into the priority rescue queue. Tactical rescue teams and nearby shelter coordinators have received your exact GPS pin.
            </p>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  setSubmittedId(null);
                  setSubTab('track');
                  setSearchTrackingId(submittedId);
                }}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#071426] font-bold text-xs"
              >
                Track Live Status
              </button>
              <button
                onClick={() => setSubmittedId(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
