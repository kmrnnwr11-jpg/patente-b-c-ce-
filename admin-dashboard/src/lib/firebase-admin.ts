import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin (server-side only)
function initAdmin() {
    if (getApps().length === 0) {
        // Use service account JSON or environment variables
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
            ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
            : undefined;

        initializeApp({
            credential: serviceAccount ? cert(serviceAccount) : undefined,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'patente-b-2025',
        });
    }

    return {
        db: getFirestore(),
        auth: getAuth(),
    };
}

export const { db, auth } = initAdmin();
