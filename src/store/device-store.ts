import { DeviceInfo } from '@/types';
import { create } from 'zustand';

interface DeviceStore {
  // State
  devices: Map<string, DeviceInfo>;
  
  // Actions
  updateDevice: (id: string, info: Partial<DeviceInfo>) => void;
  addDevice: (device: DeviceInfo) => void;
  removeDevice: (id: string) => void;
  getDevice: (id: string) => DeviceInfo | undefined;
  getAllDevices: () => DeviceInfo[];
  getDevicesByType: (type: string) => DeviceInfo[];
  getDeviceHealth: () => number; // 0-100
  reset: () => void;
}

export const useDeviceStore = create<DeviceStore>((set, get) => ({
  devices: new Map(),

  updateDevice: (id, info) =>
    set((state) => {
      const updatedDevices = new Map(state.devices);
      const existingDevice = updatedDevices.get(id);
      
      if (existingDevice) {
        updatedDevices.set(id, {
          ...existingDevice,
          ...info,
          lastUpdate: Date.now(),
        });
      } else {
        updatedDevices.set(id, {
          id,
          name: info.name || id,
          type: info.type || 'SERVO',
          status: info.status || 'DISCONNECTED',
          lastUpdate: Date.now(),
          ...info,
        } as DeviceInfo);
      }
      
      return { devices: updatedDevices };
    }),

  addDevice: (device) =>
    set((state) => {
      const updatedDevices = new Map(state.devices);
      updatedDevices.set(device.id, {
        ...device,
        lastUpdate: Date.now(),
      });
      return { devices: updatedDevices };
    }),

  removeDevice: (id) =>
    set((state) => {
      const updatedDevices = new Map(state.devices);
      updatedDevices.delete(id);
      return { devices: updatedDevices };
    }),

  getDevice: (id) => {
    const state = get();
    return state.devices.get(id);
  },

  getAllDevices: () => {
    const state = get();
    return Array.from(state.devices.values());
  },

  getDevicesByType: (type) => {
    const state = get();
    return Array.from(state.devices.values()).filter((device) => device.type === type);
  },

  getDeviceHealth: () => {
    const state = get();
    const devices = Array.from(state.devices.values());
    
    if (devices.length === 0) return 0;
    
    const connectedCount = devices.filter(
      (d) => d.status === 'CONNECTED'
    ).length;
    
    return Math.round((connectedCount / devices.length) * 100);
  },

  reset: () => set({ devices: new Map() }),
}));

// Selector hooks
export const useAllDevices = () => useDeviceStore((state) => state.getAllDevices());
export const useDeviceHealth = () => useDeviceStore((state) => state.getDeviceHealth());
