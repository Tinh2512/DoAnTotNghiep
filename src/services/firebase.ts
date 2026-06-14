import { FIREBASE_COLLECTIONS } from '@/constants/config';
import { FirebaseConfig, ProductResult, Session, SystemLog } from '@/types';
import { initializeApp } from 'firebase/app';
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

export class FirebaseService {
  private app: any;
  private database: any;
  private firestore: any;
  private isInitialized = false;

  initialize(config: FirebaseConfig) {
    try {
      this.app = initializeApp(config);
      this.database = getDatabase(this.app);
      this.firestore = getFirestore(this.app);
      this.isInitialized = true;
      console.log('Firebase initialized successfully');
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

export const initializeFirebase = (config: FirebaseConfig): FirebaseService => {
  if (!firebaseService) {
    firebaseService = new FirebaseService();
  }
  firebaseService.initialize(config);
  return firebaseService;
};
