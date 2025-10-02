// Test Firebase connection
import { database } from './lib/firebase';
import { ref, set, get } from 'firebase/database';

const testFirebase = async () => {
  try {
    // Test write
    await set(ref(database, 'test/connection'), {
      timestamp: Date.now(),
      message: 'Firebase connection test'
    });
    
    // Test read
    const snapshot = await get(ref(database, 'test/connection'));
    console.log('Firebase test successful:', snapshot.val());
  } catch (error) {
    console.error('Firebase test failed:', error);
  }
};

testFirebase();