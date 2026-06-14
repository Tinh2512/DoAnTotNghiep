import { getFirebaseService } from '@/services/firebase';
import { ProductResult, Session } from '@/types';
import { executeAsyncOperation, getErrorMessage } from '@/utils';
import { useState } from 'react';

interface UseFirebaseSyncReturn {
  isLoading: boolean;
  error: string | null;
  syncSession: (session: any) => Promise<string>;
  getSession: (sessionId: string) => Promise<Session | null>;
  getSessions: (limit?: number) => Promise<Session[]>;
  addProduct: (product: ProductResult) => Promise<string>;
  addLog: (log: any) => Promise<string>;
  isSyncing: boolean;
}

export const useFirebaseSync = (): UseFirebaseSyncReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firebaseService = getFirebaseService();

  const updateLoadingState = (loading: boolean, err: any) => {
    setIsLoading(loading);
    setError(err ? getErrorMessage(err) : null);
  };

  const updateSyncingState = (syncing: boolean, err: any) => {
    setIsSyncing(syncing);
    setError(err ? getErrorMessage(err) : null);
  };

  const syncSession = async (session: any): Promise<string> => {
    const result = await executeAsyncOperation(
      async () => {
        const sessionId = await firebaseService.createSession({
          startTime: session.startTime || Date.now(),
          status: 'ACTIVE',
          stats: session.stats || {},
          logs: [],
          products: [],
        });
        return sessionId;
      },
      updateSyncingState,
      { throwOnError: true }
    );
    return result || '';
  };

  const getSession = async (sessionId: string): Promise<Session | null> => {
    const result = await executeAsyncOperation(
      async () => firebaseService.getSession(sessionId),
      updateLoadingState
    );
    return result || null;
  };

  const getSessions = async (limit = 10): Promise<Session[]> => {
    const result = await executeAsyncOperation(
      async () => firebaseService.getSessions(limit),
      updateLoadingState
    );
    return result || [];
  };

  const addProduct = async (product: ProductResult): Promise<string> => {
    const result = await executeAsyncOperation(
      async () => firebaseService.addProduct(product),
      updateSyncingState,
      { throwOnError: true }
    );
    return result || '';
  };

  const addLog = async (log: any): Promise<string> => {
    try {
      const docId = await firebaseService.addSystemLog({
        timestamp: Date.now(),
        level: log.level || 'INFO',
        message: log.message,
        device: log.device,
        data: log.data,
      });
      return docId;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error(message);
      throw err;
    }
  };

  return {
    isLoading,
    error,
    syncSession,
    getSession,
    getSessions,
    addProduct,
    addLog,
    isSyncing,
  };
};
