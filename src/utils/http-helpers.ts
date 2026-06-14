/**
 * Generic HTTP request utilities to reduce boilerplate in API clients
 */

import { AxiosInstance } from 'axios';

/**
 * Generic GET request wrapper that extracts response data
 */
export const getRequest = async <T>(
  client: AxiosInstance,
  endpoint: string,
  params?: Record<string, any>
): Promise<T> => {
  const response = await client.get<T>(endpoint, { params });
  return response.data;
};

/**
 * Generic POST request wrapper that extracts response data
 */
export const postRequest = async <T>(
  client: AxiosInstance,
  endpoint: string,
  data?: any
): Promise<T> => {
  const response = await client.post<T>(endpoint, data);
  return response.data;
};

/**
 * Generic PUT request wrapper that extracts response data
 */
export const putRequest = async <T>(
  client: AxiosInstance,
  endpoint: string,
  data?: any
): Promise<T> => {
  const response = await client.put<T>(endpoint, data);
  return response.data;
};

/**
 * Generic DELETE request wrapper that extracts response data
 */
export const deleteRequest = async <T>(
  client: AxiosInstance,
  endpoint: string
): Promise<T> => {
  const response = await client.delete<T>(endpoint);
  return response.data;
};

/**
 * Batch request multiple endpoints concurrently
 */
export const batchRequests = async <T extends Record<string, Promise<any>>>(
  requests: T
): Promise<{ [K in keyof T]: Awaited<T[K]> }> => {
  const entries = Object.entries(requests);
  const results = await Promise.all(entries.map(([, promise]) => promise));
  const resultMap = Object.fromEntries(
    entries.map(([key], index) => [key, results[index]])
  );
  return resultMap as { [K in keyof T]: Awaited<T[K]> };
};

/**
 * Retry logic for failed requests
 */
export const retryRequest = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error('Request failed after retries');
};
