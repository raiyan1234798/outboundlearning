import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim(),
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim(),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim(),
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim(),
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim(),
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim(),
};

const isValidConfig = typeof firebaseConfig.apiKey === 'string' && firebaseConfig.apiKey.length > 0 && firebaseConfig.apiKey !== 'demo-api-key';

let app: FirebaseApp | undefined = undefined;
let auth: Auth | any = null;
let db: Firestore | any = null;
let storage: FirebaseStorage | any = null;

try {
    if (isValidConfig) {
        app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
    }
} catch (error) {
    console.error('Firebase initialization error:', error);
}

let analytics = null;
if (typeof window !== 'undefined' && isValidConfig && app) {
    import('firebase/analytics').then(({ getAnalytics, isSupported }) => {
        isSupported().then(supported => {
            if (supported) {
                analytics = getAnalytics(app as FirebaseApp);
            }
        });
    });
}

export { app, auth, db, storage, analytics };
