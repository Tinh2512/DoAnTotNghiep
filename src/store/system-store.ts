import {
    DEFAULT_BELT_STATUS,
    DEFAULT_LIGHT_STATUS,
    DEFAULT_SERVO_STATUS,
    DEFAULT_STATS,
} from '@/constants/config';
import {
    ESP32Info,
    RaspberryPiInfo,
    SystemState,
    SystemStats,
    SystemStatus,
} from '@/types';
import { create } from 'zustand';

interface SystemStore {
  // State
  status: SystemStatus;
  sessionId: string;
  startTime: number;
  currentStats: SystemStats;
  devices: SystemState['devices'];
  error?: string;
  isConnected: boolean;
  lastUpdate: number;

  // Actions
  setStatus: (status: SystemStatus) => void;
  setSessionId: (id: string) => void;
  setStartTime: (time: number) => void;
  updateStats: (stats: Partial<SystemStats>) => void;
  updateRaspberryPi: (info: Partial<RaspberryPiInfo>) => void;
  updateESP32: (info: Partial<ESP32Info>) => void;
  updateServoStatus: (status: SystemState['devices']['servos']) => void;
  updateBeltStatus: (status: SystemState['devices']['conveyorBelt']) => void;
  updateLightStatus: (status: SystemState['devices']['lights']) => void;
  setError: (error?: string) => void;
  setConnected: (connected: boolean) => void;
  reset: () => void;
  updateFromWebSocket: (data: Partial<SystemState>) => void;
}

const initialState = {
  status: 'IDLE' as SystemStatus,
  sessionId: '',
  startTime: 0,
  currentStats: { ...DEFAULT_STATS },
  devices: {
    servos: DEFAULT_SERVO_STATUS,
    conveyorBelt: DEFAULT_BELT_STATUS,
    lights: DEFAULT_LIGHT_STATUS,
  },
  error: undefined,
  isConnected: false,
  lastUpdate: 0,
};

export const useSystemStore = create<SystemStore>((set) => ({
  ...initialState,

  setStatus: (status) =>
    set({
      status,
      lastUpdate: Date.now(),
    }),

  setSessionId: (id) =>
    set({
      sessionId: id,
      lastUpdate: Date.now(),
    }),

  setStartTime: (time) =>
    set({
      startTime: time,
      lastUpdate: Date.now(),
    }),

  updateStats: (stats) =>
    set((state) => ({
      currentStats: {
        ...state.currentStats,
        ...stats,
      },
      lastUpdate: Date.now(),
    })),

  updateRaspberryPi: (info) =>
    set((state) => ({
      devices: {
        ...state.devices,
        raspberryPi: {
          id: 'raspberry-pi',
          name: 'Raspberry Pi 4',
          type: 'RASPBERRY_PI',
          status: info.status || state.devices.raspberryPi?.status || 'DISCONNECTED',
          lastUpdate: Date.now(),
          ...state.devices.raspberryPi,
          ...info,
        },
      },
      lastUpdate: Date.now(),
    })),

  updateESP32: (info) =>
    set((state) => ({
      devices: {
        ...state.devices,
        esp32: {
          id: 'esp32-s3',
          name: 'ESP32-S3 Camera',
          type: 'ESP32',
          status: info.status || state.devices.esp32?.status || 'DISCONNECTED',
          lastUpdate: Date.now(),
          ipAddress: '',
          ...state.devices.esp32,
          ...info,
        },
      },
      lastUpdate: Date.now(),
    })),

  updateServoStatus: (status) =>
    set({
      devices: (state) => ({
        ...state.devices,
        servos: {
          ...status,
          lastUpdate: Date.now(),
        },
      }),
      lastUpdate: Date.now(),
    }),

  updateBeltStatus: (status) =>
    set({
      devices: (state) => ({
        ...state.devices,
        conveyorBelt: {
          ...status,
          lastUpdate: Date.now(),
        },
      }),
      lastUpdate: Date.now(),
    }),

  updateLightStatus: (status) =>
    set({
      devices: (state) => ({
        ...state.devices,
        lights: {
          ...status,
          lastUpdate: Date.now(),
        },
      }),
      lastUpdate: Date.now(),
    }),

  setError: (error) =>
    set({
      error,
      status: error ? 'ERROR' : 'IDLE',
      lastUpdate: Date.now(),
    }),

  setConnected: (connected) =>
    set({
      isConnected: connected,
      lastUpdate: Date.now(),
    }),

  reset: () => set(initialState),

  updateFromWebSocket: (data) =>
    set((state) => ({
      status: data.status || state.status,
      currentStats: data.currentStats || state.currentStats,
      devices: data.devices || state.devices,
      lastUpdate: Date.now(),
    })),
}));

// Selector hooks for better performance
export const useSystemStatus = () => useSystemStore((state) => state.status);
export const useSystemStats = () => useSystemStore((state) => state.currentStats);
export const useDeviceStatus = () => useSystemStore((state) => state.devices);
export const useSystemError = () => useSystemStore((state) => state.error);
export const useIsConnected = () => useSystemStore((state) => state.isConnected);
