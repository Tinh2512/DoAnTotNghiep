// Server Configuration
export const SERVER_CONFIG = {
  // Raspberry Pi WebSocket server
  WS_URL: process.env.EXPO_PUBLIC_WS_URL || 'ws://192.168.1.100:8000',
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.100:8000',
  
  // WebSocket settings
  WS_RECONNECT_INTERVAL: 3000, // ms
  WS_MAX_RETRIES: 10,
  WS_PING_INTERVAL: 30000, // ms
  
  // API timeouts
  API_TIMEOUT: 10000, // ms
  
  // Real-time updates
  STATS_UPDATE_INTERVAL: 5000, // ms
};

// Device Types
export const DEVICE_TYPES = {
  RASPBERRY_PI: 'RASPBERRY_PI',
  ESP32: 'ESP32',
  SERVO: 'SERVO',
  CONVEYOR: 'CONVEYOR',
  LED: 'LED',
} as const;

// System Status
export const SYSTEM_STATUS = {
  IDLE: 'IDLE',
  RUNNING: 'RUNNING',
  STOPPED: 'STOPPED',
  ERROR: 'ERROR',
} as const;

// Device Status
export const DEVICE_STATUS = {
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  ERROR: 'ERROR',
} as const;

// Classification Types
export const CLASSIFICATION = {
  GOOD: 'GOOD',
  BAD: 'BAD',
} as const;

// Log Levels
export const LOG_LEVEL = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
} as const;

// WebSocket Message Types
export const WS_MESSAGE_TYPE = {
  PRODUCT_CLASSIFIED: 'PRODUCT_CLASSIFIED',
  SYSTEM_STATUS: 'SYSTEM_STATUS',
  STATS_UPDATE: 'STATS_UPDATE',
  SYSTEM_ERROR: 'SYSTEM_ERROR',
  DEVICE_STATUS: 'DEVICE_STATUS',
  ACK: 'ACK',
} as const;

// Colors for UI
export const COLORS = {
  PRIMARY: '#007AFF',
  SUCCESS: '#34C759',
  WARNING: '#FF9500',
  ERROR: '#FF3B30',
  BACKGROUND: '#F2F2F7',
  SURFACE: '#FFFFFF',
  TEXT: '#000000',
  TEXT_SECONDARY: '#666666',
  BORDER: '#E5E5EA',
  GOOD: '#34C759',
  BAD: '#FF3B30',
} as const;

// Default values for statistics
export const DEFAULT_STATS = {
  totalProducts: 0,
  goodProducts: 0,
  badProducts: 0,
  successRate: 0,
  averageProcessingTime: 0,
  sessionDuration: 0,
  startTime: 0,
} as const;

// Default device states
export const DEFAULT_SERVO_STATUS = {
  feeder: false,
  goodSorter: false,
  badSorter: false,
  lastUpdate: 0,
};

export const DEFAULT_BELT_STATUS = {
  running: false,
  speed: 0,
  lastUpdate: 0,
};

export const DEFAULT_LIGHT_STATUS = {
  on: false,
  brightness: 0,
  lastUpdate: 0,
};

// Firebase Collections
export const FIREBASE_COLLECTIONS = {
  SESSIONS: 'sessions',
  PRODUCTS: 'products',
  SYSTEM_LOGS: 'system-logs',
  DEVICES: 'devices',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  CURRENT_SESSION_ID: 'current_session_id',
  USER_PREFERENCES: 'user_preferences',
  LAST_SYNC_TIME: 'last_sync_time',
  OFFLINE_QUEUE: 'offline_queue',
} as const;

// Pagination
export const PAGINATION = {
  PRODUCTS_PER_PAGE: 20,
  LOGS_PER_PAGE: 50,
  HISTORY_LIMIT: 100,
} as const;
