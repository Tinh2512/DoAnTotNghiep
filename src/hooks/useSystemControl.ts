import { getApiClient } from '@/services/api';
import { useSystemStore } from '@/store/system-store';
import { ApiError } from '@/types';
import { executeAsyncOperation } from '@/utils';
import { useState } from 'react';

interface UseSystemControlReturn {
  isLoading: boolean;
  error: ApiError | null;
  startSystem: () => Promise<void>;
  stopSystem: () => Promise<void>;
  resetSystem: () => Promise<void>;
  getSystemStatus: () => Promise<any>;
}

export const useSystemControl = (): UseSystemControlReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const systemStore = useSystemStore();
  const apiClient = getApiClient();

  const updateState = (loading: boolean, err: ApiError | null) => {
    setIsLoading(loading);
    setError(err);
  };

  const startSystem = async () => {
    await executeAsyncOperation(
      async () => {
        await apiClient.startSystem();
        systemStore.setStatus('RUNNING');
        const now = Date.now();
        systemStore.setStartTime(now);
        systemStore.setSessionId(`SESSION-${now}`);
      },
      updateState,
      {
        onError: (err) => systemStore.setError(err.message),
      }
    );
  };

  const stopSystem = async () => {
    await executeAsyncOperation(
      async () => {
        await apiClient.stopSystem();
        systemStore.setStatus('STOPPED');
      },
      updateState,
      {
        onError: (err) => systemStore.setError(err.message),
      }
    );
  };

  const resetSystem = async () => {
    await executeAsyncOperation(
      async () => {
        await apiClient.resetSystem();
        systemStore.reset();
      },
      updateState,
      {
        onError: (err) => systemStore.setError(err.message),
      }
    );
  };

  const getSystemStatus = async () => {
    const result = await executeAsyncOperation(
      async () => {
        const response = await apiClient.getSystemStatus();
        return response.data;
      },
      updateState,
      { throwOnError: true }
    );
    return result;
  };

  return {
    isLoading,
    error,
    startSystem,
    stopSystem,
    resetSystem,
    getSystemStatus,
  };
};
