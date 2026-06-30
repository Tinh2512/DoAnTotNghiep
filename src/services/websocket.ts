import { SERVER_CONFIG, WS_MESSAGE_TYPE } from '@/constants/config';
import { useProductStore } from '@/store/product-store';
import { useSystemStore } from '@/store/system-store';
import {
  DeviceStatusMessage,
  OrangeClassifiedMessage,
  OrangeResult,
  StatsUpdateMessage,
  SystemErrorMessage,
  SystemStatusMessage,
  WebSocketMessage,
} from '@/types';

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = SERVER_CONFIG.WS_MAX_RETRIES;
  private reconnectInterval = SERVER_CONFIG.WS_RECONNECT_INTERVAL;
  private pingInterval: NodeJS.Timeout | null = null;
  private messageHandlers: Map<string, (message: WebSocketMessage) => void> = new Map();
  private onConnected: (() => void) | null = null;
  private onDisconnected: (() => void) | null = null;
  private onError: ((error: string) => void) | null = null;

  constructor(url?: string) {
    this.url = url || SERVER_CONFIG.WS_URL;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.startPingInterval();
          useSystemStore.setState({ isConnected: true });
          this.onConnected?.();
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.onError?.(error.message || 'WebSocket error');
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.stopPingInterval();
          useSystemStore.setState({ isConnected: false });
          this.onDisconnected?.();
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleMessage(data: string) {
    try {
      const message: WebSocketMessage = JSON.parse(data);

      switch (message.type) {
        case WS_MESSAGE_TYPE.PRODUCT_CLASSIFIED:
          // ✅ Xử lý cấu trúc Orange mới
          this.handleOrangeClassified(message as OrangeClassifiedMessage);
          break;
        case WS_MESSAGE_TYPE.SYSTEM_STATUS:
          this.handleSystemStatus(message as SystemStatusMessage);
          break;
        case WS_MESSAGE_TYPE.STATS_UPDATE:
          this.handleStatsUpdate(message as StatsUpdateMessage);
          break;
        case WS_MESSAGE_TYPE.SYSTEM_ERROR:
          this.handleSystemError(message as SystemErrorMessage);
          break;
        case WS_MESSAGE_TYPE.DEVICE_STATUS:
          this.handleDeviceStatus(message as DeviceStatusMessage);
          break;
      }

      const handler = this.messageHandlers.get(message.type);
      handler?.(message);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  // ✅ Handler mới theo cấu trúc Orange
  private handleOrangeClassified(message: OrangeClassifiedMessage) {
    const sessionId = useSystemStore.getState().sessionId;

    // Chuyển đổi 5 ảnh thành mảng base64 (tương thích UI cũ)
    const imageArray = [
      message.images.img1.data,
      message.images.img2.data,
      message.images.img3.data,
      message.images.img4.data,
      message.images.img5.data,
    ];

    // Tạo OrangeResult đầy đủ
    const orangeResult: OrangeResult = {
      id: message.id,
      timestamp: message.timestamp,
      images: message.images,
      finalClassification: message.finalClassification,
      confidence: message.confidence,
      processingTime: message.processingTime,
      sessionId,
    };

    // Lưu vào store
    useProductStore.getState().addProduct({
      id: message.id,
      sessionId,
      timestamp: message.timestamp,
      classification: message.finalClassification ? 'GOOD' : 'BAD',
      confidence: message.confidence,
      processingTime: message.processingTime,
      images: imageArray,
      orangeData: orangeResult,  // Lưu chi tiết từng ảnh
    });

    // Cập nhật stats
    const systemStore = useSystemStore.getState();
    const currentStats = systemStore.currentStats;
    const isGood = message.finalClassification;
    const newGoodCount = currentStats.goodProducts + (isGood ? 1 : 0);
    const newBadCount = currentStats.badProducts + (!isGood ? 1 : 0);
    const newTotal = newGoodCount + newBadCount;

    systemStore.updateStats({
      totalProducts: newTotal,
      goodProducts: newGoodCount,
      badProducts: newBadCount,
      successRate: newTotal > 0 ? (newGoodCount / newTotal) * 100 : 0,
    });
  }

  private handleSystemStatus(message: SystemStatusMessage) {
    const systemStore = useSystemStore.getState();
    systemStore.setStatus(message.systemState);

    if (message.devices.raspberryPi) {
      systemStore.updateRaspberryPi(message.devices.raspberryPi);
    }
    if (message.devices.esp32) {
      systemStore.updateESP32(message.devices.esp32);
    }
    systemStore.updateServoStatus(message.devices.servos);
    systemStore.updateBeltStatus(message.devices.conveyorBelt);
    systemStore.updateLightStatus(message.devices.lights);
  }

  private handleStatsUpdate(message: StatsUpdateMessage) {
    useSystemStore.getState().updateStats({
      totalProducts: message.totalProducts,
      goodProducts: message.goodProducts,
      badProducts: message.badProducts,
      successRate: message.successRate,
      sessionDuration: message.sessionDuration,
    });
  }

  private handleSystemError(message: SystemErrorMessage) {
    const systemStore = useSystemStore.getState();
    systemStore.setError(message.message);
    this.onError?.(message.message);
  }

  private handleDeviceStatus(message: DeviceStatusMessage) {
    console.log('Device status update:', message.device);
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => {
        this.connect().catch((error) => {
          console.error('Reconnection failed:', error);
        });
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
      this.onError?.('Failed to connect to server');
    }
  }

  private startPingInterval() {
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: 'PING', timestamp: Date.now() });
      }
    }, SERVER_CONFIG.WS_PING_INTERVAL);
  }

  private stopPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  send(message: any): boolean {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  on(messageType: string, handler: (message: WebSocketMessage) => void) {
    this.messageHandlers.set(messageType, handler);
  }

  off(messageType: string) {
    this.messageHandlers.delete(messageType);
  }

  onConnectedCallback(callback: () => void) {
    this.onConnected = callback;
  }

  onDisconnectedCallback(callback: () => void) {
    this.onDisconnected = callback;
  }

  onErrorCallback(callback: (error: string) => void) {
    this.onError = callback;
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  disconnect() {
    this.stopPingInterval();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Singleton instance
let wsInstance: WebSocketClient | null = null;

export const getWebSocketClient = (): WebSocketClient => {
  if (!wsInstance) {
    wsInstance = new WebSocketClient();
  }
  return wsInstance;
};

export const resetWebSocketClient = () => {
  wsInstance?.disconnect();
  wsInstance = null;
};
