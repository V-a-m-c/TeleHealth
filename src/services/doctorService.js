// src/services/doctorService.js
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const fetchApprovedDoctors = async () => {
  try {
    const doctorsRef = collection(db, 'applications');
    const q = query(doctorsRef, where('status', '==', 'approved'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching approved doctors:', error);
    throw new Error('Failed to fetch approved doctors.');
  }
};
