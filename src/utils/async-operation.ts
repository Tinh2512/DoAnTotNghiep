import { ApiError } from '@/types';
import { toApiError } from './error-handler';

interface AsyncOperationOptions {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
  throwOnError?: boolean;
}

/**
 * Wraps an async function with loading and error state management
 * @param fn - The async function to execute
 * @param onStateChange - Callback for state updates: (isLoading, error)
 * @param options - Additional options
 */
export const executeAsyncOperation = async <T>(
  fn: () => Promise<T>,
  onStateChange: (isLoading: boolean, error: ApiError | null) => void,
  options: AsyncOperationOptions = {}
): Promise<T | null> => {
  const { onSuccess, onError, throwOnError = false } = options;

  onStateChange(true, null);

  try {
    const result = await fn();
    onStateChange(false, null);
    onSuccess?.();
    return result;
  } catch (error) {
    const apiError = toApiError(error);
    onStateChange(false, apiError);
    onError?.(apiError);

    if (throwOnError) {
      throw apiError;
    }
    return null;
  }
};

/**
 * Type-safe async operation wrapper for React hooks
 * Manages isLoading and error states automatically
 */
export class AsyncOperationHandler {
  private state: Map<string, { isLoading: boolean; error: ApiError | null }> = new Map();
  private listeners: Set<(key: string) => void> = new Set();

  /**
   * Execute an async operation with automatic state management
   */
  async execute<T>(
    key: string,
    fn: () => Promise<T>,
    options: AsyncOperationOptions = {}
  ): Promise<T | null> {
    const { onSuccess, onError, throwOnError = false } = options;

    this.setState(key, { isLoading: true, error: null });

    try {
      const result = await fn();
      this.setState(key, { isLoading: false, error: null });
      onSuccess?.();
      return result;
    } catch (error) {
      const apiError = toApiError(error);
      this.setState(key, { isLoading: false, error: apiError });
      onError?.(apiError);

      if (throwOnError) {
        throw apiError;
      }
      return null;
    }
  }

  /**
   * Get current state for a key
   */
  getState(key: string) {
    return this.state.get(key) || { isLoading: false, error: null };
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (key: string) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Reset state for a key
   */
  reset(key: string) {
    this.state.delete(key);
    this.notifyListeners(key);
  }

  /**
   * Reset all states
   */
  resetAll() {
    this.state.clear();
    this.listeners.forEach((listener) => {
      listener('*');
    });
  }

  private setState(key: string, state: { isLoading: boolean; error: ApiError | null }) {
    this.state.set(key, state);
    this.notifyListeners(key);
  }

  private notifyListeners(key: string) {
    this.listeners.forEach((listener) => listener(key));
  }
}

/**
 * Create a singleton instance for global async operation tracking
 */
export const createAsyncOperationManager = () => new AsyncOperationHandler();
