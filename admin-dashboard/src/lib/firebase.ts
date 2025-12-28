import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCQTjxVl1bwdvqMTWQePJzXnLPLKYCLJJs',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'patente-b-2025.firebaseapp.com',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'patente-b-2025',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'patente-b-2025.firebasestorage.app',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '816270740093',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:816270740093:web:e0cdd05a59e95d2ce23d35',
};

// Initialize Firebase (client-side)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const firestore = getFirestore(app);
export const auth = getAuth(app);
export default app;
