// System and Device types
export type SystemStatus = 'IDLE' | 'RUNNING' | 'STOPPED' | 'ERROR';
export type DeviceStatus = 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
export type Classification = 'GOOD' | 'BAD';
export type LogLevel = 'INFO' | 'WARNING' | 'ERROR';

// Device Info
export interface DeviceInfo {
  id: string;
  name: string;
  type: 'RASPBERRY_PI' | 'ESP32' | 'SERVO' | 'CONVEYOR' | 'LED';
  status: DeviceStatus;
  lastUpdate: number;
  data?: Record<string, any>;
}

// Raspberry Pi specific
export interface RaspberryPiInfo extends DeviceInfo {
  type: 'RASPBERRY_PI';
  cpu: number; // percentage
  memory: number; // percentage
  temperature: number; // celsius
  uptime: number; // milliseconds
}

// ESP32 specific
export interface ESP32Info extends DeviceInfo {
  type: 'ESP32';
  signalStrength: number; // dBm
  battery?: number; // percentage
  ipAddress: string;
}

// Servo Status
export interface ServoStatus {
  feeder: boolean;
  goodSorter: boolean;
  badSorter: boolean;
  lastUpdate: number;
}

// Conveyor Belt Status
export interface BeltStatus {
  running: boolean;
  speed: number; // 0-100%
  lastUpdate: number;
}

// Light Status
export interface LightStatus {
  on: boolean;
  brightness: number; // 0-100
  lastUpdate: number;
}

// Product classification result
export interface ProductResult {
  id: string;
  sessionId: string;
  timestamp: number;
  classification: Classification;
  confidence: number; // 0-1
  processingTime: number; // milliseconds
  images: string[]; // base64 encoded images
}

// System Statistics
export interface SystemStats {
  totalProducts: number;
  goodProducts: number;
  badProducts: number;
  successRate: number; // percentage
  averageProcessingTime: number; // milliseconds
  sessionDuration: number; // milliseconds
  startTime: number;
  endTime?: number;
}

// Session
export interface Session {
  id: string;
  startTime: number;
  endTime?: number;
  status: 'ACTIVE' | 'COMPLETED' | 'ERROR';
  stats: SystemStats;
  logs: SystemLog[];
  products: ProductResult[];
}

// System Log
export interface SystemLog {
  id: string;
  timestamp: number;
  level: LogLevel;
  message: string;
  device?: string;
  data?: Record<string, any>;
}

// System State
export interface SystemState {
  status: SystemStatus;
  sessionId: string;
  startTime: number;
  currentStats: SystemStats;
  devices: {
    raspberryPi?: RaspberryPiInfo;
    esp32?: ESP32Info;
    servos: ServoStatus;
    conveyorBelt: BeltStatus;
    lights: LightStatus;
  };
  error?: string;
}

// WebSocket Message Types
export type WebSocketMessage =
  | ProductClassifiedMessage
  | SystemStatusMessage
  | StatsUpdateMessage
  | SystemErrorMessage
  | DeviceStatusMessage
  | AckMessage;

export interface ProductClassifiedMessage {
  type: 'PRODUCT_CLASSIFIED';
  productId: string;
  timestamp: number;
  classification: Classification;
  confidence: number;
  images: string[]; // base64
  processingTime: number;
}

export interface SystemStatusMessage {
  type: 'SYSTEM_STATUS';
  systemState: SystemStatus;
  devices: {
    raspberryPi?: RaspberryPiInfo;
    esp32?: ESP32Info;
    servos: ServoStatus;
    conveyorBelt: BeltStatus;
    lights: LightStatus;
  };
  timestamp: number;
}

export interface StatsUpdateMessage {
  type: 'STATS_UPDATE';
  totalProducts: number;
  goodProducts: number;
  badProducts: number;
  successRate: number;
  sessionDuration: number;
  timestamp: number;
}

export interface SystemErrorMessage {
  type: 'SYSTEM_ERROR';
  severity: LogLevel;
  message: string;
  timestamp: number;
}

export interface DeviceStatusMessage {
  type: 'DEVICE_STATUS';
  device: DeviceInfo;
  timestamp: number;
}

export interface AckMessage {
  type: 'ACK';
  messageId: string;
  success: boolean;
  timestamp: number;
}

// Firebase Configuration
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
}
