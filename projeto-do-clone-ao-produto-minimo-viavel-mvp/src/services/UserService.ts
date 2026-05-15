import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface UserSettings {
  theme: 'light' | 'dark' | 'solarized';
  autoAnalyze: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'user';
  settings?: UserSettings;
}

export interface HistoryItem {
  id?: string;
  fileName: string;
  fileType: string;
  timestamp: any;
  source: 'file' | 'url';
  summary: string;
}

export class UserService {
  static async syncProfile(user: any): Promise<void> {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    const path = `users/${user.uid}`;
    
    try {
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: 'user',
          settings: {
            theme: 'solarized',
            autoAnalyze: true
          }
        };
        await setDoc(userRef, newProfile);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  static async updateSettings(userId: string, settings: Partial<UserSettings>): Promise<void> {
    const userRef = doc(db, 'users', userId);
    const path = `users/${userId}`;
    
    try {
      await updateDoc(userRef, {
        settings: settings
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }

  static async addToHistory(userId: string, item: Omit<HistoryItem, 'id' | 'timestamp'>): Promise<void> {
    const historyRef = collection(db, 'users', userId, 'history');
    const path = `users/${userId}/history`;
    
    try {
      await addDoc(historyRef, {
        ...item,
        timestamp: new Date().toISOString() // Using ISO string as per rules validation helper
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }

  static async getHistory(userId: string, maxItems: number = 10): Promise<HistoryItem[]> {
    const historyRef = collection(db, 'users', userId, 'history');
    const path = `users/${userId}/history`;
    
    try {
      const q = query(historyRef, orderBy('timestamp', 'desc'), limit(maxItems));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as HistoryItem));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  }

  static async deleteHistoryItem(userId: string, itemId: string): Promise<void> {
    const itemRef = doc(db, 'users', userId, 'history', itemId);
    const path = `users/${userId}/history/${itemId}`;
    
    try {
      await deleteDoc(itemRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }

  static async clearAllHistory(userId: string): Promise<void> {
    const historyRef = collection(db, 'users', userId, 'history');
    const path = `users/${userId}/history`;
    
    try {
      const querySnapshot = await getDocs(historyRef);
      // Firestore doesn't have a "delete collection" in client SDK, so we delete each doc
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
}
