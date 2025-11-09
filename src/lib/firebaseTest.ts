import { db, storage } from '@/lib/firebase';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function testFirestoreConnection(): Promise<boolean> {
  try {
    console.log('🔥 Testing Firestore connection...');
    
    const testRef = doc(db, 'test_connection', 'test_doc');
    const testData = {
      message: 'Firebase connesso!',
      timestamp: Timestamp.now(),
      version: '1.0'
    };
    
    // Write
    await setDoc(testRef, testData);
    console.log('✅ Firestore WRITE ok');
    
    // Read
    const snap = await getDoc(testRef);
    if (snap.exists()) {
      console.log('✅ Firestore READ ok:', snap.data());
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Firestore error:', error);
    return false;
  }
}

export async function testStorageConnection(): Promise<boolean> {
  try {
    console.log('📦 Testing Storage connection...');
    
    const testRef = ref(storage, 'test/test.txt');
    const testBlob = new Blob(['Firebase Storage test'], { type: 'text/plain' });
    
    // Upload
    await uploadBytes(testRef, testBlob);
    console.log('✅ Storage UPLOAD ok');
    
    // Get URL
    const url = await getDownloadURL(testRef);
    console.log('✅ Storage URL ok:', url);
    
    return true;
  } catch (error) {
    console.error('❌ Storage error:', error);
    return false;
  }
}

export async function testFirebaseConnection() {
  console.log('🚀 Testing Firebase connection...\n');
  
  const firestoreOk = await testFirestoreConnection();
  const storageOk = await testStorageConnection();
  
  if (firestoreOk && storageOk) {
    console.log('\n✅ Firebase completamente connesso e funzionante!');
    return true;
  } else {
    console.log('\n⚠️ Alcuni servizi Firebase hanno problemi');
    return false;
  }
}

