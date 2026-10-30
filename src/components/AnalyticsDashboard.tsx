import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  Activity,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';
import { useFloodGuard } from '../context/FloodGuardContext';

export const AnalyticsDashboard: React.FC = () => {
  const {
    reports,
    shelters,
    resources,
    weatherStations,
    showNotification,
  } = useFloodGuard();

  const [timeRange, setTimeRange] = useState<string>('24h');
  const [selectedSector, setSelectedSector] = useState<string>('all');

  // Chart 1: Rainfall vs River Water Level Over Past 24 Hours
  const hydroTimeSeriesData = [
    { time: '00:00', rain: 15, river: 2.8, crestDanger: 6.0 },
    { time: '04:00', rain: 28, river: 3.2, crestDanger: 6.0 },
    { time: '08:00', rain: 65, river: 4.1, crestDanger: 6.0 },
    { time: '12:00', rain: 92, river: 5.4, crestDanger: 6.0 },
    { time: '16:00', rain: 125, river: 6.3, crestDanger: 6.0 },
    { time: '20:00', rain: 78, river: 6.1, crestDanger: 6.0 },
    { time: 'Now', rain: 85, river: 5.9, crestDanger: 6.0 },
  ];

  // Chart 2: Flood Incidents by Category
  const categoryCounts = reports.reduce<Record<string, number>>((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});

  const incidentsByCategoryData = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count,
  }));

  // Chart 3: Shelter Occupancy Breakdown
  const shelterOccupancyData = shelters.map((s) => ({
    name: s.name.split(' ')[0] + ' ' + (s.name.split(' ')[1] || ''),
    occupied: s.occupiedCapacity,
    available: s.availableBeds,
  }));

  // Chart 4: Relief Supplies Distributed vs Remaining
  const reliefInventoryData = resources.map((r) => ({
    name: r.name.split(' ')[0] + ' ' + (r.name.split(' ')[1] || ''),
    distributed: r.distributed,
    remaining: r.totalStock - r.distributed,
  }));

  // Chart 5: Emergency Response Performance (Minutes to Respond)
  const responsePerformanceData = [
    { sector: 'Sector 4 Marina', avgMins: 8.2, targetMins: 10 },
    { sector: 'Sector 8 Delta', avgMins: 6.5, targetMins: 10 },
    { sector: 'Metro Underpass', avgMins: 12.4, targetMins: 10 },
    { sector: 'Industrial Valley', avgMins: 14.1, targetMins: 10 },
    { sector: 'Highland Ring', avgMins: 5.8, targetMins: 10 },
  ];

  const PIE_COLORS = ['#FF4545', '#FF9F43', '#00D4FF', '#00BFA6', '#9B51E0', '#E056FD'];

  // Real CSV Generator Download
  const handleDownloadCSV = () => {
    // Generate CSV content from active reports and relief data
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'FLOODGUARD SMART CITY INCIDENT DISASTER REPORT\n';
    csvContent += `Generated At,${new Date().toISOString()}\n\n`;

    csvContent += '--- EMERGENCY SOS INCIDENTS ---\n';
    csvContent += 'Report ID,Citizen Name,Phone,Location,Category,Victims Affected,Water Depth,Status,Priority Score\n';
    reports.forEach((r) => {
      csvContent += `"${r.id}","${r.citizenName}","${r.phone}","${r.locationName}","${r.category}",${r.affectedCount},"${r.waterDepth}","${r.status}",${r.priorityScore}\n`;
    });

    csvContent += '\n--- SHELTER OCCUPANCY ---\n';
    csvContent += 'Shelter ID,Name,Location,Total Capacity,Occupied,Available Beds,Status\n';
    shelters.forEach((s) => {
      csvContent += `"${s.id}","${s.name}","${s.location}",${s.totalCapacity},${s.occupiedCapacity},${s.availableBeds},"${s.status}"\n`;
    });

    csvContent += '\n--- RELIEF RESOURCES ---\n';
    csvContent += 'Resource ID,Commodity,Total Stock,Distributed,Remaining,Unit\n';
    resources.forEach((res) => {
      csvContent += `"${res.id}","${res.name}",${res.totalStock},${res.distributed},${res.totalStock - res.distributed},"${res.unit}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `floodguard_disaster_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Disaster report audit CSV generated and downloaded', 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-blue-500/20 text-blue-400">
              <BarChart3 className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase">
              MUNICIPAL EMERGENCY ANALYTICS & AUDIT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Disaster Intelligence & Operations Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Quantitative metrics evaluating rainfall correlations, rescue response latency, shelter densities, and relief supply depletion.
          </p>
        </div>

        {/* Filter controls & CSV Download */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time range */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 rounded-xl bg-[#102A43] border border-slate-700 text-xs text-white focus:outline-none"
          >
            <option value="6h">Past 6 Hours</option>
            <option value="24h">Past 24 Hours</option>
            <option value="7d">Past 7 Days</option>
          </select>

          {/* Sector filter */}
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="p-2 rounded-xl bg-[#102A43] border border-slate-700 text-xs text-white focus:outline-none"
          >
            <option value="all">All City Sectors</option>
            <option value="sec4">Sector 4 Marina</option>
            <option value="sec8">Sector 8 North Delta</option>
            <option value="highland">Sector 12 Highland</option>
          </select>

          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-[#071426] font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Audit Report</span>
          </button>
        </div>
      </div>

      {/* Analytics Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Rainfall vs River Water Level Correlation */}
        <div className="p-5 rounded-2xl bg-glass-card border border-cyan-500/20 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Rainfall vs River Elevation (24-Hour Curve)</span>
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">DUAL-AXIS TELEMETRY</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hydroTimeSeriesData}>
                <defs>
                  <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="riverGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4545" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#FF4545" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#102A43" />
                <XAxis dataKey="time" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" stroke="#00D4FF" tick={{ fontSize: 11 }} label={{ value: 'Rain mm/hr', angle: -90, position: 'insideLeft', fill: '#00D4FF', fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#FF4545" tick={{ fontSize: 11 }} label={{ value: 'River m', angle: 90, position: 'insideRight', fill: '#FF4545', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#071426', borderColor: '#00D4FF', fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area yAxisId="left" type="monotone" dataKey="rain" stroke="#00D4FF" fill="url(#rainGradient)" name="Rainfall (mm/hr)" />
                <Line yAxisId="right" type="monotone" dataKey="river" stroke="#FF4545" strokeWidth={2.5} name="River Level (m)" />
                <Line yAxisId="right" type="monotone" dataKey="crestDanger" stroke="#F1C40F" strokeDasharray="5 5" name="Danger Threshold (6m)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Emergency SOS Incidents by Category */}
        <div className="p-5 rounded-2xl bg-glass-card border border-amber-500/20 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Flood Incident Distribution by Category</span>
            </h3>
            <span className="text-[10px] font-mono text-amber-400">CALL BREAKDOWN</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidentsByCategoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#102A43" />
                <XAxis type="number" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" stroke="#94A3B8" tick={{ fontSize: 10 }} width={110} />
                <Tooltip contentStyle={{ backgroundColor: '#071426', borderColor: '#FF9F43', fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="count" fill="#FF9F43" radius={[0, 6, 6, 0]} name="Incident Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Shelter Occupancy Breakdown */}
        <div className="p-5 rounded-2xl bg-glass-card border border-emerald-500/20 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Shelter Capacity vs Occupied Evacuees</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">BED AUDIT</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shelterOccupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#102A43" />
                <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#071426', borderColor: '#2ECC71', fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="occupied" stackId="a" fill="#E74C3C" name="Occupied Beds" />
                <Bar dataKey="available" stackId="a" fill="#2ECC71" name="Available Beds" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Relief Supplies Distributed vs Remaining */}
        <div className="p-5 rounded-2xl bg-glass-card border border-indigo-500/20 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>Relief Resource Inventory: Stock vs Distributed</span>
            </h3>
            <span className="text-[10px] font-mono text-indigo-400">DEPOT BALANCE</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reliefInventoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#102A43" />
                <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#071426', borderColor: '#9B51E0', fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="distributed" fill="#FF9F43" name="Distributed Aid" radius={[4, 4, 0, 0]} />
                <Bar dataKey="remaining" fill="#00D4FF" name="Remaining Reserve" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Emergency Response Latency Metric Table */}
      <div className="p-5 rounded-2xl bg-glass-card border border-slate-800 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Emergency First Responder Dispatch Performance</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Target Standard: &lt; 10 Mins</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {responsePerformanceData.map((item) => {
            const isGood = item.avgMins <= item.targetMins;
            return (
              <div key={item.sector} className="p-3 rounded-xl bg-[#071426] border border-slate-800">
                <span className="text-[11px] text-slate-300 font-medium block truncate">
                  {item.sector}
                </span>
                <div className="text-xl font-black font-mono mt-1 text-white">
                  {item.avgMins} <span className="text-xs font-normal text-slate-400">min</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] font-mono">
                  <span className={isGood ? 'text-emerald-400' : 'text-amber-400'}>
                    {isGood ? '✓ Meets SLA' : '▲ Congested'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
