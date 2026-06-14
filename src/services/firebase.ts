import { FIREBASE_COLLECTIONS } from '@/constants/config';
import { ProductResult, Session, SystemLog } from '@/types';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { get, getDatabase, onValue, ref, set, update } from 'firebase/database';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: "https://system1-cd746-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Tránh khởi tạo nhiều lần
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export class FirebaseService {
  private database: any;
  private firestore: any;
  private isInitialized = false;

  initialize() {  // Không cần nhận config nữa
    try {
      this.database = getDatabase(app);  // Dùng app đã khởi tạo ở trên
      this.firestore = getFirestore(app);
      this.isInitialized = true;
    } catch (error) {
      console.error('Firebase initialization error:', error);
      throw error;
    }
  }

  // Realtime Database operations
  async setSystemStatus(status: any): Promise<void> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    const dbRef = ref(this.database, 'system/status');
    await set(dbRef, {
      ...status,
      lastUpdate: Date.now(),
    });
  }

  async getSystemStatus(): Promise<any> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    const dbRef = ref(this.database, 'system/status');
    const snapshot = await get(dbRef);
    return snapshot.val();
  }

  onSystemStatusChange(callback: (status: any) => void): () => void {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    const dbRef = ref(this.database, 'system/status');
    const unsubscribe = onValue(dbRef, (snapshot) => {
      callback(snapshot.val());
    });
    return unsubscribe;
  }

  async setDeviceStatus(deviceId: string, status: any): Promise<void> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    const dbRef = ref(this.database, `devices/${deviceId}`);
    await set(dbRef, {
      ...status,
      lastUpdate: Date.now(),
    });
  }

  async getDeviceStatus(deviceId: string): Promise<any> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    const dbRef = ref(this.database, `devices/${deviceId}`);
    const snapshot = await get(dbRef);
    return snapshot.val();
  }

  async setSessionActive(sessionId: string, sessionData: any): Promise<void> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    const dbRef = ref(this.database, `sessions/${sessionId}`);
    await set(dbRef, {
      ...sessionData,
      startTime: Date.now(),
      status: 'active',
    });
  }

  async updateSessionStats(sessionId: string, stats: any): Promise<void> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    const dbRef = ref(this.database, `sessions/${sessionId}/stats`);
    await update(dbRef, {
      ...stats,
      lastUpdate: Date.now(),
    });
  }

  // Firestore operations for long-term storage
  async createSession(session: Omit<Session, 'id'>): Promise<string> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    const docRef = await addDoc(collection(this.firestore, FIREBASE_COLLECTIONS.SESSIONS), {
      ...session,
      createdAt: Date.now(),
    });
    return docRef.id;
  }

  async getSession(sessionId: string): Promise<Session | null> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    const docRef = doc(this.firestore, FIREBASE_COLLECTIONS.SESSIONS, sessionId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Session;
    }
    return null;
  }

  async getSessions(limitCount = 10): Promise<Session[]> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    const q = query(
      collection(this.firestore, FIREBASE_COLLECTIONS.SESSIONS),
      orderBy('startTime', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Session));
  }

  async addProduct(product: ProductResult): Promise<string> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    const docRef = await addDoc(collection(this.firestore, FIREBASE_COLLECTIONS.PRODUCTS), {
      ...product,
      createdAt: Date.now(),
    });
    return docRef.id;
  }

  async getProducts(
    sessionId: string,
    limitCount = 100
  ): Promise<ProductResult[]> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    const q = query(
      collection(this.firestore, FIREBASE_COLLECTIONS.PRODUCTS),
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as ProductResult));
  }

  async addSystemLog(log: Omit<SystemLog, 'id'>): Promise<string> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    const docRef = await addDoc(collection(this.firestore, FIREBASE_COLLECTIONS.SYSTEM_LOGS), {
      ...log,
      createdAt: Date.now(),
    });
    return docRef.id;
  }

  async getSystemLogs(
    sessionId: string,
    limitCount = 100
  ): Promise<SystemLog[]> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    const q = query(
      collection(this.firestore, FIREBASE_COLLECTIONS.SYSTEM_LOGS),
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as SystemLog));
  }

  // Cleanup
  async cleanup(): Promise<void> {
    // Perform any cleanup operations if needed
    console.log('Firebase cleanup completed');
  }
}

// Singleton instance
let firebaseService: FirebaseService | null = null;

export const getFirebaseService = (): FirebaseService => {
  if (!firebaseService) {
    firebaseService = new FirebaseService();
  }
  return firebaseService;
};

export const initializeFirebase = (): FirebaseService => {  
  if (!firebaseService) {
    firebaseService = new FirebaseService();
  }
  firebaseService.initialize();  
  return firebaseService;
};
