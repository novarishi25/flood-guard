import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  ShieldAlert,
  Home,
  Users,
  Radio,
  Eye,
  Filter,
  Layers,
  MapPin,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useFloodGuard } from '../context/FloodGuardContext';
import { Shelter, WeatherStation, RescueTeam, FloodReport } from '../types';

interface SmartCityMapProps {
  heightClass?: string;
  selectedEntityId?: string | null;
  onSelectEntity?: (type: string, id: string) => void;
}

export const SmartCityMap: React.FC<SmartCityMapProps> = ({
  heightClass = 'h-[520px]',
  selectedEntityId,
  onSelectEntity,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const {
    weatherStations,
    shelters,
    rescueTeams,
    reports,
    assignRescueTeam,
    updateReportStatus,
    showNotification,
  } = useFloodGuard();

  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'shelters' | 'rescue' | 'sensors' | 'sos'>('all');

  // Center coordinate of our Smart City Metropolis Basin
  const cityCenter: [number, number] = [19.0760, 72.8777];

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Initialize Map with dark CartoDB tiles
    const map = L.map(mapContainerRef.current, {
      center: cityCenter,
      zoom: 12,
      zoomControl: true,
      attributionControl: false,
    });

    // Dark Matter tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Flood risk polygon zones (simulated river basin inundation zone)
    const criticalFloodZone = L.polygon(
      [
        [19.0980, 72.8650],
        [19.1250, 72.8900],
        [19.1100, 72.9200],
        [19.0850, 72.8950],
      ],
      {
        color: '#FF4545',
        fillColor: '#FF4545',
        fillOpacity: 0.18,
        weight: 2,
        dashArray: '5, 5',
      }
    ).addTo(map);

    criticalFloodZone.bindTooltip('CRITICAL SURGE BASIN (Sector 8 / Delta)', {
      permanent: false,
      direction: 'center',
      className: 'bg-red-950 text-red-200 text-xs font-mono font-bold px-2 py-1 rounded border border-red-700',
    });

    // High risk buffer zone
    const highRiskZone = L.polygon(
      [
        [19.0550, 72.8550],
        [19.0850, 72.8650],
        [19.0700, 72.8900],
        [19.0450, 72.8750],
      ],
      {
        color: '#FF9F43',
        fillColor: '#FF9F43',
        fillOpacity: 0.12,
        weight: 1.5,
      }
    ).addTo(map);

    highRiskZone.bindTooltip('HIGH RISK INUNDATION: Sector 4 Marina', {
      permanent: false,
      direction: 'center',
      className: 'bg-amber-950 text-amber-200 text-xs font-mono font-bold px-2 py-1 rounded border border-amber-700',
    });

    // Safe Highland Zone
    const safeZone = L.polygon(
      [
        [19.0850, 72.9250],
        [19.1150, 72.9450],
        [19.0750, 72.9550],
      ],
      {
        color: '#2ECC71',
        fillColor: '#2ECC71',
        fillOpacity: 0.1,
        weight: 1.5,
      }
    ).addTo(map);

    safeZone.bindTooltip('SAFE HIGH-ELEVATION REFUGE ZONE', {
      permanent: false,
      direction: 'center',
      className: 'bg-emerald-950 text-emerald-200 text-xs font-mono font-bold px-2 py-1 rounded border border-emerald-700',
    });

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Render markers whenever data or filter changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const layer = markersLayerRef.current;
    layer.clearLayers();

    // 1. Water Level Sensor Stations
    if (activeFilter === 'all' || activeFilter === 'sensors' || activeFilter === 'critical') {
      weatherStations.forEach((stn) => {
        const isCritical = stn.status === 'Critical Crest';
        const isHighRisk = stn.status === 'High Risk';
        const isWarning = stn.status === 'Warning';

        if (activeFilter === 'critical' && !isCritical && !isHighRisk) return;

        const colorClass = isCritical
          ? 'bg-red-500 border-red-300 ring-4 ring-red-500/40 animate-pulse'
          : isHighRisk
          ? 'bg-amber-500 border-amber-300 ring-2 ring-amber-500/40'
          : isWarning
          ? 'bg-yellow-500 border-yellow-200'
          : 'bg-emerald-500 border-emerald-300';

        const customIcon = L.divIcon({
          className: 'custom-sensor-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="w-8 h-8 rounded-full ${colorClass} flex items-center justify-center shadow-lg border-2 text-white font-mono text-[10px] font-black">
                ${stn.waterLevel.toFixed(1)}m
              </div>
              <div class="absolute -bottom-1 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-white"></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        const marker = L.marker([stn.lat, stn.lng], { icon: customIcon });

        const popupContent = `
          <div class="p-2 space-y-2 min-w-[220px]">
            <div class="flex items-center justify-between border-b border-cyan-500/30 pb-1.5">
              <span class="font-bold text-cyan-300 text-sm">${stn.name}</span>
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded ${
                isCritical ? 'bg-red-500/30 text-red-300' : 'bg-cyan-500/20 text-cyan-300'
              }">${stn.status}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="bg-[#071426] p-1.5 rounded">
                <div class="text-[10px] text-slate-400">Water Elevation</div>
                <div class="font-mono font-bold text-cyan-400 text-sm">${stn.waterLevel} m</div>
              </div>
              <div class="bg-[#071426] p-1.5 rounded">
                <div class="text-[10px] text-slate-400">Danger Mark</div>
                <div class="font-mono font-bold text-red-400 text-sm">${stn.dangerThreshold} m</div>
              </div>
              <div class="bg-[#071426] p-1.5 rounded">
                <div class="text-[10px] text-slate-400">Rainfall Rate</div>
                <div class="font-mono font-semibold text-slate-200">${stn.rainfallRate} mm/hr</div>
              </div>
              <div class="bg-[#071426] p-1.5 rounded">
                <div class="text-[10px] text-slate-400">Flow Velocity</div>
                <div class="font-mono font-semibold text-slate-200">${stn.flowVelocity} m/s</div>
              </div>
            </div>
            <div class="text-[10px] text-slate-400 flex items-center justify-between pt-1">
              <span>Telemetry: 100% Operational</span>
              <span class="text-cyan-400 font-mono">${stn.id}</span>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        layer.addLayer(marker);
      });
    }

    // 2. Emergency Shelters
    if (activeFilter === 'all' || activeFilter === 'shelters') {
      shelters.forEach((shelter) => {
        const isFull = shelter.status === 'Full';
        const isNear = shelter.status === 'Nearly Full';

        const colorClass = isFull
          ? 'bg-red-600 border-red-300'
          : isNear
          ? 'bg-amber-500 border-amber-300'
          : 'bg-emerald-500 border-emerald-300';

        const customIcon = L.divIcon({
          className: 'custom-shelter-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="w-8 h-8 rounded-xl ${colorClass} flex items-center justify-center shadow-lg border-2 text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-900 flex items-center justify-center text-[9px] font-bold text-cyan-300 border border-cyan-400">
                ${Math.round((shelter.occupiedCapacity / shelter.totalCapacity) * 100)}%
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        const marker = L.marker([shelter.lat, shelter.lng], { icon: customIcon });

        const popupContent = `
          <div class="p-2 space-y-2 min-w-[230px]">
            <div class="flex items-center justify-between border-b border-teal-500/30 pb-1.5">
              <span class="font-bold text-teal-300 text-sm">${shelter.name}</span>
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isFull ? 'bg-red-500/30 text-red-300' : isNear ? 'bg-amber-500/30 text-amber-300' : 'bg-emerald-500/30 text-emerald-300'
              }">${shelter.status}</span>
            </div>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between text-slate-300">
                <span>Occupancy:</span>
                <span class="font-mono font-bold">${shelter.occupiedCapacity} / ${shelter.totalCapacity}</span>
              </div>
              <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div class="h-full ${isFull ? 'bg-red-500' : isNear ? 'bg-amber-500' : 'bg-emerald-500'}" style="width: ${(shelter.occupiedCapacity / shelter.totalCapacity) * 100}%"></div>
              </div>
              <div class="flex justify-between text-slate-400 text-[11px] pt-1">
                <span>Available Beds:</span>
                <span class="text-cyan-400 font-bold font-mono">${shelter.availableBeds}</span>
              </div>
              <div class="text-[11px] text-slate-300">
                <span class="text-slate-400">Rations:</span> ${shelter.foodAvailability}
              </div>
              <div class="text-[11px] text-slate-300">
                <span class="text-slate-400">Medical:</span> ${shelter.medicalFacilities}
              </div>
              <div class="text-[11px] text-slate-400 font-mono">
                Phone: ${shelter.contact}
              </div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        layer.addLayer(marker);
      });
    }

    // 3. Rescue Teams
    if (activeFilter === 'all' || activeFilter === 'rescue') {
      rescueTeams.forEach((team) => {
        const isDispatched = team.status === 'Dispatched' || team.status === 'On-Scene';

        const customIcon = L.divIcon({
          className: 'custom-rescue-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="w-8 h-8 rounded-full bg-cyan-600 border-2 border-cyan-200 flex items-center justify-center text-white shadow-lg ${
                isDispatched ? 'ring-4 ring-cyan-400/50 animate-pulse' : ''
              }">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        const marker = L.marker([team.lat, team.lng], { icon: customIcon });

        const popupContent = `
          <div class="p-2 space-y-2 min-w-[220px]">
            <div class="flex items-center justify-between border-b border-cyan-500/30 pb-1.5">
              <span class="font-bold text-cyan-300 text-sm">${team.name}</span>
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">${team.status}</span>
            </div>
            <div class="text-xs space-y-1 text-slate-300">
              <div><span class="text-slate-400">Commander:</span> ${team.leader}</div>
              <div><span class="text-slate-400">Crew:</span> ${team.membersCount} Certified Divers/Paramedics</div>
              <div><span class="text-slate-400">Specialty:</span> ${team.specialty}</div>
              <div><span class="text-slate-400">Location:</span> ${team.currentLocation}</div>
              ${
                team.assignedEmergencyId
                  ? `<div class="p-1 rounded bg-red-950/60 border border-red-500/30 text-red-300 text-[11px] font-mono">
                      Engaged with SOS #${team.assignedEmergencyId}
                    </div>`
                  : ''
              }
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        layer.addLayer(marker);
      });
    }

    // 4. Citizen SOS Flood Reports
    if (activeFilter === 'all' || activeFilter === 'sos' || activeFilter === 'critical') {
      reports.forEach((rep) => {
        if (rep.status === 'Resolved') return;

        const isTrapped = rep.category === 'People trapped';

        const customIcon = L.divIcon({
          className: 'custom-sos-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="w-8 h-8 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-white shadow-xl ring-4 ring-red-500/60 animate-ping absolute"></div>
              <div class="w-8 h-8 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-white shadow-xl relative z-10">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <div class="absolute -top-2 -right-2 px-1 rounded-full bg-red-950 border border-red-500 text-[9px] font-bold text-red-300 font-mono z-20">
                ${rep.priorityScore}
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        const marker = L.marker([rep.lat, rep.lng], { icon: customIcon });

        const popupContent = `
          <div class="p-2 space-y-2 min-w-[240px]">
            <div class="flex items-center justify-between border-b border-red-500/30 pb-1.5">
              <span class="font-bold text-red-400 text-sm">${rep.category}</span>
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">P-${rep.priorityScore}</span>
            </div>
            <div class="text-xs space-y-1 text-slate-300">
              <div class="font-semibold text-white">${rep.locationName}</div>
              <div class="text-slate-300 text-[11px] line-clamp-3">${rep.description}</div>
              <div class="flex justify-between text-slate-400 text-[11px] pt-1 border-t border-slate-700/60">
                <span>Affected: <b class="text-white">${rep.affectedCount} persons</b></span>
                <span>Depth: <b class="text-amber-400">${rep.waterDepth}</b></span>
              </div>
              <div class="text-[10px] text-slate-400 flex justify-between">
                <span>Caller: ${rep.citizenName}</span>
                <span class="text-cyan-400 font-mono">${rep.phone}</span>
              </div>
              <div class="pt-1.5">
                <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                  rep.status === 'Submitted' ? 'bg-red-500/20 text-red-300' : 'bg-cyan-500/20 text-cyan-300'
                }">
                  Status: ${rep.status}
                </span>
              </div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        layer.addLayer(marker);
      });
    }
  }, [weatherStations, shelters, rescueTeams, reports, activeFilter]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#102A43] bg-[#071426] shadow-2xl">
      {/* Map Control Bar & Layer Filters */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#071426]/90 backdrop-blur-md p-1.5 rounded-xl border border-cyan-500/20 shadow-xl pointer-events-auto">
          <span className="text-[11px] font-bold text-cyan-400 px-2 flex items-center gap-1 font-mono uppercase tracking-wider">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Entities' },
            { id: 'critical', label: 'Critical Zones' },
            { id: 'sos', label: 'Citizen SOS' },
            { id: 'shelters', label: 'Shelters' },
            { id: 'rescue', label: 'Rescue Units' },
            { id: 'sensors', label: 'Hydro Gauges' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === tab.id
                  ? 'bg-cyan-500 text-[#071426] font-bold shadow-md shadow-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-[#102A43]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Legend pill */}
        <div className="hidden sm:flex items-center gap-3 bg-[#071426]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-[11px] font-medium text-slate-300 pointer-events-auto">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            Critical / SOS
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            High Risk
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Safe / Available
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            Rescue Unit
          </span>
        </div>
      </div>

      {/* Map Container DOM */}
      <div ref={mapContainerRef} className={`w-full ${heightClass} z-10`} />

      {/* Watermark Notice */}
      <div className="absolute bottom-2 left-2 z-[400] text-[10px] text-slate-400 bg-[#071426]/80 backdrop-blur px-2 py-0.5 rounded border border-slate-800 font-mono">
        SMART CITY GIS ENGINE • OPENSTREETMAP / CARTO TILES • REAL-TIME MESH
      </div>
    </div>
  );
};
