import { ApiError } from '@/types';

/**
 * Converts any error into a standardized error message
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object') {
    if ('message' in error) {
      return (error as any).message;
    }
  }
  return 'An unknown error occurred';
};

/**
 * Converts error to ApiError with optional status code
 */
export const toApiError = (error: unknown, statusCode?: number): ApiError => {
  const message = getErrorMessage(error);
  const code = (error as any)?.code || 'UNKNOWN';
  
  return {
    message,
    code,
    statusCode: statusCode || 0,
  };
};

/**
 * Logs error with context for debugging
 */
export const logError = (context: string, error: unknown): void => {
  const message = getErrorMessage(error);
  console.error(`[${context}] ${message}`, error);
};
