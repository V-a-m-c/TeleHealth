// src/contexts/AuthContext.js
import React, { useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null); // Add applicationStatus state
  const [loading, setLoading] = useState(true);

  async function signup(email, password, userType) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', userCredential.user.uid), { role: userType });
    await signOut(auth);
    return userCredential.user;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setRole(userData.role);

          if (userData.role === 'doctor') {
            const applicationRef = doc(db, 'applications', user.uid);
            const applicationSnap = await getDoc(applicationRef);
            if (applicationSnap.exists()) {
              setApplicationStatus(applicationSnap.data().status);
            } else {
              setApplicationStatus(null);
            }
          } else {
            setApplicationStatus(null);
          }
        }
      } else {
        setRole(null);
        setApplicationStatus(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    role,
    applicationStatus, // Include applicationStatus in the context value
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
