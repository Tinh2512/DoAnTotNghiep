import { SERVER_CONFIG } from '@/constants/config';
import { ApiError, ApiResponse, SystemStats } from '@/types';
import { deleteRequest, getRequest, postRequest } from '@/utils/http-helpers';
import axios, { AxiosError, AxiosInstance } from 'axios';

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL: baseURL || SERVER_CONFIG.API_URL,
      timeout: SERVER_CONFIG.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add error interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      code: error.code || 'UNKNOWN',
      message: error.message || 'An unknown error occurred',
      statusCode: error.response?.status || 0,
    };

    if (error.response?.data) {
      const data = error.response.data as any;
      apiError.message = data.message || data.error || apiError.message;
    }

    return apiError;
  }

  // System Control
  async startSystem(): Promise<ApiResponse<void>> {
    return postRequest<ApiResponse<void>>(this.client, '/system/start');
  }

  async stopSystem(): Promise<ApiResponse<void>> {
    return postRequest<ApiResponse<void>>(this.client, '/system/stop');
  }

  async resetSystem(): Promise<ApiResponse<void>> {
    return postRequest<ApiResponse<void>>(this.client, '/system/reset');
  }

  async getSystemStatus(): Promise<ApiResponse<any>> {
    return getRequest<ApiResponse<any>>(this.client, '/system/status');
  }

  // Device Control
  async getDevicesStatus(): Promise<ApiResponse<any>> {
    return getRequest<ApiResponse<any>>(this.client, '/devices/status');
  }

  async controlDevice(deviceId: string, command: string, params?: any): Promise<ApiResponse<any>> {
    return postRequest<ApiResponse<any>>(this.client, `/devices/${deviceId}/control`, {
      command,
      params,
    });
  }

  // Product History
  async getProductsHistory(limit?: number): Promise<ApiResponse<any[]>> {
    return getRequest<ApiResponse<any[]>>(this.client, '/products/history', { limit });
  }

  async getProductById(productId: string): Promise<ApiResponse<any>> {
    return getRequest<ApiResponse<any>>(this.client, `/products/${productId}`);
  }

  // Statistics
  async getCurrentStats(): Promise<ApiResponse<SystemStats>> {
    return getRequest<ApiResponse<SystemStats>>(this.client, '/stats/current');
  }

  async getSessionStats(sessionId: string): Promise<ApiResponse<SystemStats>> {
    return getRequest<ApiResponse<SystemStats>>(this.client, `/stats/session/${sessionId}`);
  }

  // Sessions
  async startSession(): Promise<ApiResponse<{ sessionId: string }>> {
    return postRequest<ApiResponse<{ sessionId: string }>>(this.client, '/session/start');
  }

  async endSession(sessionId: string): Promise<ApiResponse<any>> {
    return postRequest<ApiResponse<any>>(this.client, '/session/end', { sessionId });
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  }

  // Raw request methods
  async get<T>(endpoint: string, params?: any): Promise<T> {
    return getRequest<T>(this.client, endpoint, params);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return postRequest<T>(this.client, endpoint, data);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    return deleteRequest<T>(this.client, endpoint);
  }
}

// Singleton instance
let apiClient: ApiClient | null = null;

export const getApiClient = (): ApiClient => {
  if (!apiClient) {
    apiClient = new ApiClient();
  }
  return apiClient;
};

export const createApiClient = (baseURL: string): ApiClient => {
  return new ApiClient(baseURL);
};
