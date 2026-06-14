import { STORAGE_KEYS } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageManager {
  static async saveCurrentSessionId(sessionId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_SESSION_ID, sessionId);
    } catch (error) {
      console.error('Error saving session ID:', error);
    }
  }

  static async getCurrentSessionId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_SESSION_ID);
    } catch (error) {
      console.error('Error getting session ID:', error);
      return null;
    }
  }

  static async clearCurrentSessionId(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION_ID);
    } catch (error) {
      console.error('Error clearing session ID:', error);
    }
  }

  static async saveUserPreferences(preferences: Record<string, any>): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PREFERENCES,
        JSON.stringify(preferences)
      );
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }

  static async getUserPreferences(): Promise<Record<string, any>> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting preferences:', error);
      return {};
    }
  }

  static async saveLastSyncTime(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_SYNC_TIME,
        Date.now().toString()
      );
    } catch (error) {
      console.error('Error saving sync time:', error);
    }
  }

  static async getLastSyncTime(): Promise<number> {
    try {
      const time = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC_TIME);
      return time ? parseInt(time, 10) : 0;
    } catch (error) {
      console.error('Error getting sync time:', error);
      return 0;
    }
  }

  static async addToOfflineQueue(command: any): Promise<void> {
    try {
      const queue = await this.getOfflineQueue();
      queue.push(command);
      await AsyncStorage.setItem(
        STORAGE_KEYS.OFFLINE_QUEUE,
        JSON.stringify(queue)
      );
    } catch (error) {
      console.error('Error adding to queue:', error);
    }
  }

  static async getOfflineQueue(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting queue:', error);
      return [];
    }
  }

  static async clearOfflineQueue(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
    } catch (error) {
      console.error('Error clearing queue:', error);
    }
  }

  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.CURRENT_SESSION_ID,
        STORAGE_KEYS.USER_PREFERENCES,
        STORAGE_KEYS.LAST_SYNC_TIME,
        STORAGE_KEYS.OFFLINE_QUEUE,
      ]);
    } catch (error) {
      console.error('Error clearing all storage:', error);
    }
  }
}
