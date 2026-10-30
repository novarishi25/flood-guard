import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  UserProfile,
  FloodReport,
  RescueTeam,
  Shelter,
  ReliefResource,
  WeatherStation,
  EmergencyAlert,
  ReliefDistributionRecord,
  UserRole,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_WEATHER_STATIONS,
  INITIAL_RESCUE_TEAMS,
  INITIAL_SHELTERS,
  INITIAL_RESOURCES,
  INITIAL_DISTRIBUTIONS,
  INITIAL_REPORTS,
  INITIAL_ALERTS,
} from '../data/mockData';

export function computePriorityScore(report: {
  category: string;
  affectedCount: number;
  waterDepth: string;
  description: string;
}): number {
  let score = 15;
  if (report.category === 'People trapped') score += 45;
  else if (report.category === 'Dam overflow' || report.category === 'River overflow') score += 35;
  else if (report.category === 'House flooding') score += 25;
  else if (report.category === 'Road flooding') score += 20;
  else if (report.category === 'Drainage blockage') score += 15;

  if (report.waterDepth.includes('Submerged')) score += 30;
  else if (report.waterDepth.includes('Chest')) score += 24;
  else if (report.waterDepth.includes('Waist')) score += 18;
  else if (report.waterDepth.includes('Knee')) score += 10;
  else score += 5;

  score += Math.min(25, report.affectedCount * 3);

  const desc = (report.description || '').toLowerCase();
  if (desc.includes('elderly') || desc.includes('baby') || desc.includes('child') || desc.includes('pregnant') || desc.includes('patient')) {
    score += 12;
  }
  if (desc.includes('roof') || desc.includes('stranded') || desc.includes('rising') || desc.includes('current')) {
    score += 10;
  }

  return Math.min(100, Math.max(15, score));
}

interface ToastNotification {
  id: string;
  text: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

interface FloodGuardContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  reports: FloodReport[];
  rescueTeams: RescueTeam[];
  shelters: Shelter[];
  resources: ReliefResource[];
  distributions: ReliefDistributionRecord[];
  alerts: EmergencyAlert[];
  weatherStations: WeatherStation[];
  
  // Actions
  addReport: (report: Omit<FloodReport, 'id' | 'timestamp' | 'priorityScore' | 'status'>) => string;
  updateReportStatus: (id: string, status: FloodReport['status']) => void;
  assignRescueTeam: (reportId: string, teamId: string) => void;
  updateTeamStatus: (teamId: string, status: RescueTeam['status'], location?: string) => void;
  updateShelterCapacity: (shelterId: string, deltaOccupied: number) => void;
  distributeResource: (shelterId: string, resourceName: string, quantity: number) => boolean;
  addResourceStock: (resourceId: string, addedQty: number) => void;
  createAlert: (alert: Omit<EmergencyAlert, 'id' | 'issuedAt' | 'isActive'>) => void;
  toggleAlertStatus: (id: string) => void;

  // Simulation mode
  simulationActive: boolean;
  toggleSimulation: () => void;
  resetSimulation: () => void;

  // Presentation Mode (10-Step Scenario)
  scenarioStep: number | null;
  scenarioRunning: boolean;
  runDisasterScenario: () => void;
  pauseDisasterScenario: () => void;
  resumeDisasterScenario: () => void;
  resetDisasterScenario: () => void;
  goToScenarioStep: (step: number) => void;

  // Toasts
  notifications: ToastNotification[];
  showNotification: (text: string, type?: ToastNotification['type']) => void;
  dismissNotification: (id: string) => void;

  // Stats
  metrics: {
    floodRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    floodRiskScore: number;
    activeAlertsCount: number;
    affectedLocationsCount: number;
    totalReportsCount: number;
    activeRescueTeamsCount: number;
    totalAvailableBeds: number;
    criticalSheltersCount: number;
    totalStockCount: number;
  };
}

const FloodGuardContext = createContext<FloodGuardContextType | null>(null);

export function FloodGuardProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS.admin);
  const [activeTab, setActiveTab] = useState<string>('landing');

  const [reports, setReports] = useState<FloodReport[]>(INITIAL_REPORTS);
  const [rescueTeams, setRescueTeams] = useState<RescueTeam[]>(INITIAL_RESCUE_TEAMS);
  const [shelters, setShelters] = useState<Shelter[]>(INITIAL_SHELTERS);
  const [resources, setResources] = useState<ReliefResource[]>(INITIAL_RESOURCES);
  const [distributions, setDistributions] = useState<ReliefDistributionRecord[]>(INITIAL_DISTRIBUTIONS);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(INITIAL_ALERTS);
  const [weatherStations, setWeatherStations] = useState<WeatherStation[]>(INITIAL_WEATHER_STATIONS);

  const [simulationActive, setSimulationActive] = useState<boolean>(false);
  const [scenarioStep, setScenarioStep] = useState<number | null>(null);
  const [scenarioRunning, setScenarioRunning] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const showNotification = useCallback((text: string, type: ToastNotification['type'] = 'info') => {
    const id = 'notif-' + Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4500);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    const user = DEMO_USERS[role];
    if (user) {
      setCurrentUser(user);
      showNotification(`Switched role to ${user.name} (${role.toUpperCase()})`, 'success');
      if (role === 'citizen') {
        setActiveTab('citizen-portal');
      } else if (role === 'rescue') {
        setActiveTab('rescue-management');
      } else {
        setActiveTab('command-center');
      }
    }
  }, [showNotification]);

  // Add report
  const addReport = useCallback((data: Omit<FloodReport, 'id' | 'timestamp' | 'priorityScore' | 'status'>) => {
    const id = `FG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const priorityScore = computePriorityScore({
      category: data.category,
      affectedCount: data.affectedCount,
      waterDepth: data.waterDepth,
      description: data.description,
    });

    const newReport: FloodReport = {
      ...data,
      id,
      timestamp: 'Just now',
      status: 'Submitted',
      priorityScore,
    };

    setReports((prev) => [newReport, ...prev]);
    showNotification(`Emergency Report #${id} logged. Assigned Priority Score: ${priorityScore}/100`, 'warning');
    return id;
  }, [showNotification]);

  // Update report status
  const updateReportStatus = useCallback((id: string, status: FloodReport['status']) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    showNotification(`Report #${id} status updated to: ${status}`, 'info');
  }, [showNotification]);

  // Assign rescue team
  const assignRescueTeam = useCallback((reportId: string, teamId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'Rescue Assigned', assignedTeamId: teamId } : r))
    );
    setRescueTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? { ...t, status: 'Dispatched', assignedEmergencyId: reportId }
          : t
      )
    );
    showNotification(`Team ${teamId} dispatched to Emergency #${reportId}`, 'success');
  }, [showNotification]);

  // Update team status
  const updateTeamStatus = useCallback((teamId: string, status: RescueTeam['status'], location?: string) => {
    setRescueTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? { ...t, status, currentLocation: location || t.currentLocation }
          : t
      )
    );
    showNotification(`Team ${teamId} is now ${status}`, 'info');
  }, [showNotification]);

  // Shelter capacity delta
  const updateShelterCapacity = useCallback((shelterId: string, deltaOccupied: number) => {
    setShelters((prev) =>
      prev.map((s) => {
        if (s.id !== shelterId) return s;
        const newOccupied = Math.max(0, Math.min(s.totalCapacity, s.occupiedCapacity + deltaOccupied));
        const availableBeds = s.totalCapacity - newOccupied;
        const ratio = newOccupied / s.totalCapacity;
        const status: Shelter['status'] = ratio >= 0.95 ? 'Full' : ratio >= 0.8 ? 'Nearly Full' : 'Available';
        return {
          ...s,
          occupiedCapacity: newOccupied,
          availableBeds,
          status,
        };
      })
    );
  }, []);

  // Relief distribution
  const distributeResource = useCallback((shelterId: string, resourceName: string, quantity: number): boolean => {
    const targetResource = resources.find((r) => r.name === resourceName);
    const targetShelter = shelters.find((s) => s.id === shelterId);
    if (!targetResource || !targetShelter) return false;

    const available = targetResource.totalStock - targetResource.distributed;
    if (quantity > available) {
      showNotification(`Insufficient stock of ${resourceName}. Max available: ${available}`, 'error');
      return false;
    }

    setResources((prev) =>
      prev.map((r) =>
        r.name === resourceName
          ? { ...r, distributed: r.distributed + quantity }
          : r
      )
    );

    const record: ReliefDistributionRecord = {
      id: `DIS-${Date.now().toString().slice(-4)}`,
      shelterId,
      shelterName: targetShelter.name,
      resourceName,
      quantity,
      timestamp: 'Just now',
      authorizedBy: currentUser.name,
      status: 'Delivered',
    };

    setDistributions((prev) => [record, ...prev]);
    showNotification(`Dispatched ${quantity} ${targetResource.unit} of ${resourceName} to ${targetShelter.name}`, 'success');
    return true;
  }, [resources, shelters, currentUser, showNotification]);

  // Add resource stock
  const addResourceStock = useCallback((resourceId: string, addedQty: number) => {
    setResources((prev) =>
      prev.map((r) =>
        r.id === resourceId ? { ...r, totalStock: r.totalStock + addedQty } : r
      )
    );
    showNotification(`Added +${addedQty} units to inventory`, 'success');
  }, [showNotification]);

  // Create emergency alert
  const createAlert = useCallback((data: Omit<EmergencyAlert, 'id' | 'issuedAt' | 'isActive'>) => {
    const id = `ALT-${data.level}-${Math.floor(100 + Math.random() * 900)}`;
    const newAlert: EmergencyAlert = {
      ...data,
      id,
      issuedAt: 'Just now',
      isActive: true,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    showNotification(`BROADCAST DISPATCHED: ${data.title}`, 'warning');
  }, [showNotification]);

  // Toggle alert
  const toggleAlertStatus = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  }, []);

  // Simulation mode loop
  useEffect(() => {
    if (!simulationActive) return;

    showNotification('Flood Simulation Mode ACTIVE. Dynamic sensor metrics surging...', 'warning');

    const interval = setInterval(() => {
      // Increase water levels on stations
      setWeatherStations((prev) =>
        prev.map((stn) => {
          const increase = (Math.random() * 0.15 + 0.05);
          const newLevel = +(stn.waterLevel + increase).toFixed(2);
          const newRain = Math.min(180, Math.round(stn.rainfallRate + (Math.random() * 6 - 1)));
          let status: WeatherStation['status'] = 'Normal';
          if (newLevel >= stn.dangerThreshold + 0.8) status = 'Critical Crest';
          else if (newLevel >= stn.dangerThreshold) status = 'High Risk';
          else if (newLevel >= stn.dangerThreshold - 1.2) status = 'Warning';
          return {
            ...stn,
            waterLevel: newLevel,
            rainfallRate: newRain,
            status,
          };
        })
      );

      // Randomly populate shelters
      setShelters((prev) =>
        prev.map((shl) => {
          if (shl.availableBeds <= 2) return shl;
          const delta = Math.floor(Math.random() * 8) + 2;
          const newOcc = Math.min(shl.totalCapacity, shl.occupiedCapacity + delta);
          return {
            ...shl,
            occupiedCapacity: newOcc,
            availableBeds: shl.totalCapacity - newOcc,
            status: newOcc >= shl.totalCapacity * 0.95 ? 'Full' : newOcc >= shl.totalCapacity * 0.8 ? 'Nearly Full' : 'Available',
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [simulationActive, showNotification]);

  const toggleSimulation = useCallback(() => {
    setSimulationActive((prev) => !prev);
  }, []);

  const resetSimulation = useCallback(() => {
    setSimulationActive(false);
    setWeatherStations(INITIAL_WEATHER_STATIONS);
    setShelters(INITIAL_SHELTERS);
    setReports(INITIAL_REPORTS);
    setRescueTeams(INITIAL_RESCUE_TEAMS);
    setResources(INITIAL_RESOURCES);
    setAlerts(INITIAL_ALERTS);
    showNotification('Simulation reset. Baseline telemetry restored.', 'info');
  }, [showNotification]);

  // Hackathon 10-Step Scenario Presentation Automation
  useEffect(() => {
    if (!scenarioRunning || scenarioStep === null) return;

    const timer = setTimeout(() => {
      if (scenarioStep < 10) {
        setScenarioStep((prev) => (prev !== null ? prev + 1 : 1));
      } else {
        setScenarioRunning(false);
        showNotification('Disaster Response Scenario complete. All 10 protocol checkpoints executed.', 'success');
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, [scenarioRunning, scenarioStep, showNotification]);

  // Apply step modifications when scenarioStep advances
  useEffect(() => {
    if (scenarioStep === null) return;

    if (scenarioStep === 1) {
      showNotification('STEP 1: Heavy rainfall detected by IoT gauge array (>140mm/hr)', 'info');
      setWeatherStations((prev) =>
        prev.map((s) => ({ ...s, rainfallRate: s.rainfallRate + 55 }))
      );
    } else if (scenarioStep === 2) {
      showNotification('STEP 2: River water levels surging past critical threshold (+1.8m)', 'warning');
      setWeatherStations((prev) =>
        prev.map((s) => ({ ...s, waterLevel: +(s.waterLevel + 1.6).toFixed(2), status: 'Critical Crest' }))
      );
    } else if (scenarioStep === 3) {
      showNotification('STEP 3: AI Model identifies CRITICAL 94% Flood Risk across Riverfront Sector', 'warning');
    } else if (scenarioStep === 4) {
      showNotification('STEP 4: Emergency Alert broadcast dispatched across city sirens & SMS', 'error');
      const simAlert: EmergencyAlert = {
        id: `ALT-SIM-${Date.now().toString().slice(-3)}`,
        title: 'EMERGENCY RED ALERT: IMMEDIATE EVACUATION ORDER',
        message: 'Dam overflow risk detected. Sector 4 & Sector 8 citizens proceed to designated high-ground shelters.',
        level: 'CRITICAL',
        issuedAt: 'Just now',
        issuedBy: 'FLOODGUARD Autonomous AI Commander',
        zones: ['Sector 4', 'Sector 8', 'Marina Promenade'],
        channels: ['SMS Broadcast', 'PA Sirens', 'App Push'],
        isActive: true,
      };
      setAlerts((prev) => [simAlert, ...prev]);
    } else if (scenarioStep === 5) {
      showNotification('STEP 5: Citizen SOS received: Family of 5 trapped on roof in Sector 8B', 'error');
      const sosReport: FloodReport = {
        id: `FG-2026-SOS-${Math.floor(100 + Math.random() * 900)}`,
        citizenName: 'Ramesh Sen & Family',
        phone: '+1 (555) 912-3811',
        locationName: 'North Delta Creek Lane, Sector 8B',
        lat: 19.1170,
        lng: 72.8930,
        category: 'People trapped',
        affectedCount: 5,
        waterDepth: 'Chest (1.4m)',
        description: 'SOS: House ground floor underwater. Trapped on terrace with infant and elderly mother. Rapid current outside.',
        timestamp: 'Just now',
        status: 'Submitted',
        priorityScore: 98,
        isSimulated: true,
      };
      setReports((prev) => [sosReport, ...prev]);
    } else if (scenarioStep === 6) {
      showNotification('STEP 6: Smart Priority Engine classified SOS as TOP URGENT (Score: 98/100)', 'warning');
    } else if (scenarioStep === 7) {
      showNotification('STEP 7: Rescue Strike Team Alpha-1 dispatched with Zodiac assault craft', 'success');
      setRescueTeams((prev) =>
        prev.map((t) => (t.id === 'TEAM-ALPHA-1' ? { ...t, status: 'Dispatched', currentLocation: 'En route to Sector 8B' } : t))
      );
      setReports((prev) =>
        prev.map((r, i) => (i === 0 ? { ...r, status: 'Rescue Assigned', assignedTeamId: 'TEAM-ALPHA-1' } : r))
      );
    } else if (scenarioStep === 8) {
      showNotification('STEP 8: Nearby shelter (Northridge University) designated with 120 reserved beds', 'info');
      setShelters((prev) =>
        prev.map((s) => (s.id === 'SHL-02' ? { ...s, availableBeds: Math.max(0, s.availableBeds - 15) } : s))
      );
    } else if (scenarioStep === 9) {
      showNotification('STEP 9: Allocated 300 Food Packs, 600L Water & 20 Trauma Kits to Shelter', 'success');
      setResources((prev) =>
        prev.map((r) => ({ ...r, distributed: r.distributed + 150 }))
      );
    } else if (scenarioStep === 10) {
      showNotification('STEP 10: Command Center synchronized: Sector 8B stabilized, victims safely evacuated', 'success');
      setReports((prev) =>
        prev.map((r, i) => (i === 0 ? { ...r, status: 'Resolved' } : r))
      );
      setRescueTeams((prev) =>
        prev.map((t) => (t.id === 'TEAM-ALPHA-1' ? { ...t, status: 'Returning' } : t))
      );
    }
  }, [scenarioStep, showNotification]);

  const runDisasterScenario = useCallback(() => {
    setScenarioStep(1);
    setScenarioRunning(true);
    showNotification('Initializing 10-Step Automated Disaster Scenario for Hackathon Judges...', 'warning');
  }, [showNotification]);

  const pauseDisasterScenario = useCallback(() => {
    setScenarioRunning(false);
  }, []);

  const resumeDisasterScenario = useCallback(() => {
    if (scenarioStep !== null && scenarioStep <= 10) {
      setScenarioRunning(true);
    }
  }, [scenarioStep]);

  const resetDisasterScenario = useCallback(() => {
    setScenarioRunning(false);
    setScenarioStep(null);
    resetSimulation();
  }, [resetSimulation]);

  const goToScenarioStep = useCallback((step: number) => {
    setScenarioStep(step);
    setScenarioRunning(false);
  }, []);

  // Calculated overall metrics
  const maxWaterLevel = Math.max(...weatherStations.map((w) => w.waterLevel));
  const avgRainfall = Math.round(weatherStations.reduce((acc, w) => acc + w.rainfallRate, 0) / weatherStations.length);
  const floodRiskScore = Math.min(100, Math.round((maxWaterLevel / 8) * 55 + (avgRainfall / 150) * 45));
  let floodRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (floodRiskScore >= 80) floodRiskLevel = 'CRITICAL';
  else if (floodRiskScore >= 60) floodRiskLevel = 'HIGH';
  else if (floodRiskScore >= 35) floodRiskLevel = 'MODERATE';

  const activeAlertsCount = alerts.filter((a) => a.isActive).length;
  const affectedLocationsCount = weatherStations.filter((s) => s.status === 'High Risk' || s.status === 'Critical Crest').length + 2;
  const totalReportsCount = reports.length;
  const activeRescueTeamsCount = rescueTeams.filter((t) => t.status === 'Dispatched' || t.status === 'On-Scene').length;
  const totalAvailableBeds = shelters.reduce((acc, s) => acc + s.availableBeds, 0);
  const criticalSheltersCount = shelters.filter((s) => s.status === 'Full' || s.status === 'Nearly Full').length;
  const totalStockCount = resources.reduce((acc, r) => acc + (r.totalStock - r.distributed), 0);

  return (
    <FloodGuardContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        activeTab,
        setActiveTab,
        reports,
        rescueTeams,
        shelters,
        resources,
        distributions,
        alerts,
        weatherStations,
        addReport,
        updateReportStatus,
        assignRescueTeam,
        updateTeamStatus,
        updateShelterCapacity,
        distributeResource,
        addResourceStock,
        createAlert,
        toggleAlertStatus,
        simulationActive,
        toggleSimulation,
        resetSimulation,
        scenarioStep,
        scenarioRunning,
        runDisasterScenario,
        pauseDisasterScenario,
        resumeDisasterScenario,
        resetDisasterScenario,
        goToScenarioStep,
        notifications,
        showNotification,
        dismissNotification,
        metrics: {
          floodRiskLevel,
          floodRiskScore,
          activeAlertsCount,
          affectedLocationsCount,
          totalReportsCount,
          activeRescueTeamsCount,
          totalAvailableBeds,
          criticalSheltersCount,
          totalStockCount,
        },
      }}
    >
      {children}
    </FloodGuardContext.Provider>
  );
}

export function useFloodGuard() {
  const context = useContext(FloodGuardContext);
  if (!context) {
    throw new Error('useFloodGuard must be used within a FloodGuardProvider');
  }
  return context;
}
