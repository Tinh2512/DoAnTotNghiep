// System and Device types
export type SystemStatus = 'IDLE' | 'RUNNING' | 'STOPPED' | 'ERROR';
export type DeviceStatus = 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
export type Classification = 'GOOD' | 'BAD';
export type LogLevel = 'INFO' | 'WARNING' | 'ERROR';

// ✅ Cấu trúc ảnh cho từng góc chụp
export interface OrangeImage {
  format: string;           // Định dạng ảnh: 'jpeg' | 'png' | 'base64'
  data: string;             // Dữ liệu ảnh base64
  classification: boolean;  // Phân loại: true = GOOD, false = BAD
}

// ✅ Cấu trúc dữ liệu Orange
export interface OrangeResult {
  id: string;               // ID sản phẩm
  timestamp: number;        // Thời gian phân loại
  images: {
    img1: OrangeImage;
    img2: OrangeImage;
    img3: OrangeImage;
    img4: OrangeImage;
    img5: OrangeImage;
  };
  // Kết quả tổng hợp (tính từ 5 ảnh)
  finalClassification: boolean;   // true = GOOD, false = BAD
  confidence: number;             // Độ tin cậy 0-1
  processingTime: number;         // Thời gian xử lý (ms)
  sessionId: string;
}

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
  cpu: number;
  memory: number;
  temperature: number;
  uptime: number;
}

// ESP32 specific
export interface ESP32Info extends DeviceInfo {
  type: 'ESP32';
  signalStrength: number;
  battery?: number;
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
  speed: number;
  lastUpdate: number;
}

// Light Status
export interface LightStatus {
  on: boolean;
  brightness: number;
  lastUpdate: number;
}

// ✅ ProductResult dùng OrangeResult
export interface ProductResult {
  id: string;
  sessionId: string;
  timestamp: number;
  classification: Classification;   // 'GOOD' | 'BAD' (từ finalClassification)
  confidence: number;
  processingTime: number;
  images: string[];                 // base64 array (giữ tương thích)
  orangeData?: OrangeResult;        // Dữ liệu chi tiết Orange
}

// System Statistics
export interface SystemStats {
  totalProducts: number;
  goodProducts: number;
  badProducts: number;
  successRate: number;
  averageProcessingTime: number;
  sessionDuration: number;
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

// ✅ WebSocket Message - cập nhật theo cấu trúc Orange
export type WebSocketMessage =
  | OrangeClassifiedMessage      // Thay ProductClassifiedMessage
  | SystemStatusMessage
  | StatsUpdateMessage
  | SystemErrorMessage
  | DeviceStatusMessage
  | AckMessage;

// ✅ Message chính từ Raspberry Pi
export interface OrangeClassifiedMessage {
  type: 'PRODUCT_CLASSIFIED';
  id: string;                   // ID sản phẩm
  timestamp: number;
  images: {
    img1: OrangeImage;
    img2: OrangeImage;
    img3: OrangeImage;
    img4: OrangeImage;
    img5: OrangeImage;
  };
  finalClassification: boolean; // true = GOOD, false = BAD
  confidence: number;
  processingTime: number;
}

// Giữ lại để tương thích
export interface ProductClassifiedMessage {
  type: 'PRODUCT_CLASSIFIED';
  productId: string;
  timestamp: number;
  classification: Classification;
  confidence: number;
  images: string[];
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
