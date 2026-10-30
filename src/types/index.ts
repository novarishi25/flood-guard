export type UserRole = 'admin' | 'rescue' | 'citizen';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  badgeNumber?: string;
  teamId?: string;
}

export type EmergencyCategory =
  | 'House flooding'
  | 'Road flooding'
  | 'People trapped'
  | 'River overflow'
  | 'Drainage blockage'
  | 'Dam overflow'
  | 'Other';

export type WaterDepthLevel =
  | 'Ankle (0.2m)'
  | 'Knee (0.5m)'
  | 'Waist (1.0m)'
  | 'Chest (1.4m)'
  | 'Submerged (>2.0m)';

export type ReportStatus = 'Submitted' | 'Under Review' | 'Rescue Assigned' | 'Resolved';

export interface FloodReport {
  id: string;
  citizenName: string;
  phone: string;
  locationName: string;
  lat: number;
  lng: number;
  category: EmergencyCategory;
  affectedCount: number;
  waterDepth: WaterDepthLevel;
  description: string;
  imageUrl?: string;
  timestamp: string;
  status: ReportStatus;
  priorityScore: number;
  assignedTeamId?: string;
  isSimulated?: boolean;
}

export type RescueTeamStatus = 'Available' | 'Dispatched' | 'On-Scene' | 'Returning';

export interface RescueTeam {
  id: string;
  name: string;
  leader: string;
  membersCount: number;
  specialty: string;
  currentLocation: string;
  lat: number;
  lng: number;
  status: RescueTeamStatus;
  assignedEmergencyId?: string;
  contactPhone: string;
  equipment: string[];
}

export type ShelterStatus = 'Available' | 'Nearly Full' | 'Full';

export interface Shelter {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  totalCapacity: number;
  occupiedCapacity: number;
  availableBeds: number;
  foodAvailability: string;
  medicalFacilities: string;
  contact: string;
  status: ShelterStatus;
  needsScore?: number;
  demands: {
    foodPacks: number;
    waterLiters: number;
    medicalKits: number;
    blankets: number;
  };
}

export interface ReliefResource {
  id: string;
  name: string;
  category: 'Nutrition' | 'Hydration' | 'Medical' | 'Shelter' | 'Rescue Gear';
  unit: string;
  totalStock: number;
  distributed: number;
  reserved: number;
  thresholdWarning: number;
}

export interface ReliefDistributionRecord {
  id: string;
  shelterId: string;
  shelterName: string;
  resourceName: string;
  quantity: number;
  timestamp: string;
  authorizedBy: string;
  status: 'Delivered' | 'In Transit' | 'Staged';
}

export interface WeatherStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  waterLevel: number; // in meters
  dangerThreshold: number; // in meters
  rainfallRate: number; // in mm/hr
  status: 'Normal' | 'Warning' | 'High Risk' | 'Critical Crest';
  flowVelocity: number; // m/s
  sensorHealth: 'Optimal' | 'Caution' | 'Offline';
}

export type AlertLevel = 'NORMAL' | 'WARNING' | 'HIGH RISK' | 'CRITICAL';

export interface EmergencyAlert {
  id: string;
  title: string;
  message: string;
  level: AlertLevel;
  issuedAt: string;
  issuedBy: string;
  zones: string[];
  channels: string[];
  isActive: boolean;
}

export interface AIAnalysisResult {
  score: number;
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  summary: string;
  vulnerableAreas: string[];
  recommendations: string[];
  confidence: string;
  hydrologicalFactors: {
    runOffCoeff: string;
    peakDischargeEstimateM3s: number;
    retentionTimeHours: string;
  };
  source?: string;
}
