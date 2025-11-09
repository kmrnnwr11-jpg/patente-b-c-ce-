import { config } from 'dotenv';
import { resolve } from 'path';

// Carica .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Imposta env per import.meta.env
process.env.VITE_FIREBASE_API_KEY = process.env.VITE_FIREBASE_API_KEY;
process.env.VITE_FIREBASE_AUTH_DOMAIN = process.env.VITE_FIREBASE_AUTH_DOMAIN;
process.env.VITE_FIREBASE_PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID;
process.env.VITE_FIREBASE_STORAGE_BUCKET = process.env.VITE_FIREBASE_STORAGE_BUCKET;
process.env.VITE_FIREBASE_MESSAGING_SENDER_ID = process.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
process.env.VITE_FIREBASE_APP_ID = process.env.VITE_FIREBASE_APP_ID;

console.log('🔥 Firebase Test con env vars caricate\n');
console.log('Project ID:', process.env.VITE_FIREBASE_PROJECT_ID);
console.log('Auth Domain:', process.env.VITE_FIREBASE_AUTH_DOMAIN);
console.log('\nTesting...\n');

// Importa e testa
const { testFirebaseConnection } = await import('../src/lib/firebaseTest.js');
await testFirebaseConnection();

