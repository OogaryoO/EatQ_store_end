import { database, firestore } from './firebase';
import { ref, set, push, get } from 'firebase/database';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

// Waiting List Operations (using Firestore)
export const addToWaitingList = async (customerData) => {
  try {
    const docRef = await addDoc(collection(firestore, 'waitingList'), {
      ...customerData,
      status: 'waiting',
      createdAt: serverTimestamp(),
      notifiedAt: null
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding customer to waiting list:', error);
    throw error;
  }
};

export const updateWaitingListStatus = async (customerId, status) => {
  try {
    const customerRef = doc(firestore, 'waitingList', customerId);
    const updateData = { status };
    
    if (status === 'notified') {
      updateData.notifiedAt = serverTimestamp();
    }
    
    await updateDoc(customerRef, updateData);
  } catch (error) {
    console.error('Error updating waiting list status:', error);
    throw error;
  }
};

export const removeFromWaitingList = async (customerId) => {
  try {
    await deleteDoc(doc(firestore, 'waitingList', customerId));
  } catch (error) {
    console.error('Error removing from waiting list:', error);
    throw error;
  }
};

// Restaurant Status Operations (using Realtime Database)
export const updateSeatingStatus = async (isAvailable) => {
  try {
    await set(ref(database, 'restaurant/seatingAvailable'), isAvailable);
  } catch (error) {
    console.error('Error updating seating status:', error);
    throw error;
  }
};

export const updateAvailableSeats = async (count) => {
  try {
    await set(ref(database, 'restaurant/availableSeats'), count);
  } catch (error) {
    console.error('Error updating available seats:', error);
    throw error;
  }
};

export const updateRestaurantInfo = async (info) => {
  try {
    await set(ref(database, 'restaurant/info'), {
      ...info,
      lastUpdated: Date.now()
    });
  } catch (error) {
    console.error('Error updating restaurant info:', error);
    throw error;
  }
};

// Statistics Operations
export const getWaitingStatistics = async () => {
  try {
    const statsRef = ref(database, 'statistics');
    const snapshot = await get(statsRef);
    return snapshot.val() || {};
  } catch (error) {
    console.error('Error getting waiting statistics:', error);
    throw error;
  }
};

// Generate next ticket number
export const generateTicketNumber = async () => {
  try {
    const counterRef = ref(database, 'restaurant/ticketCounter');
    const snapshot = await get(counterRef);
    const currentCounter = snapshot.val() || 0;
    const newCounter = currentCounter + 1;
    
    await set(counterRef, newCounter);
    
    // Format as A001, A002, etc.
    return `A${newCounter.toString().padStart(3, '0')}`;
  } catch (error) {
    console.error('Error generating ticket number:', error);
    throw error;
  }
};