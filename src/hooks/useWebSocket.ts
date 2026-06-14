import { getWebSocketClient, resetWebSocketClient } from '@/services/websocket';
import { useEffect, useRef, useState } from 'react';

interface UseWebSocketOptions {
  autoConnect?: boolean;
  url?: string;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: string) => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    autoConnect = true,
    url,
    onConnected,
    onDisconnected,
    onError,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsClientRef = useRef(getWebSocketClient());

  useEffect(() => {
    if (autoConnect) {
      const wsClient = wsClientRef.current;
      
      wsClient.onConnectedCallback(() => {
        setIsConnected(true);
        setError(null);
        onConnected?.();
      });

      wsClient.onDisconnectedCallback(() => {
        setIsConnected(false);
        onDisconnected?.();
      });

      wsClient.onErrorCallback((err) => {
        setError(err);
        onError?.(err);
      });

      wsClient.connect().catch((err) => {
        setError(err.message || 'Failed to connect');
        setIsConnected(false);
      });

      return () => {
        // Don't disconnect on unmount, keep connection alive
      };
    }
  }, [autoConnect, onConnected, onDisconnected, onError]);

  const disconnect = () => {
    wsClientRef.current.disconnect();
    resetWebSocketClient();
    setIsConnected(false);
  };

  const send = (message: any) => {
    return wsClientRef.current.send(message);
  };

  const on = (messageType: string, handler: (message: any) => void) => {
    wsClientRef.current.on(messageType, handler);
  };

  const off = (messageType: string) => {
    wsClientRef.current.off(messageType);
  };

  return {
    isConnected,
    error,
    send,
    on,
    off,
    disconnect,
  };
};
