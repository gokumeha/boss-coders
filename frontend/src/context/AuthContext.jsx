import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { auth, database, isFirebaseConfigured } from '../lib/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signInWithGoogle() {
    if (!isFirebaseConfigured || !auth || !database) {
      const message =
        'Firebase is not configured yet. Add the VITE_FIREBASE_* environment variables first.';
      setError(message);
      throw new Error(message);
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      setError('');
      const result = await signInWithPopup(auth, provider);

      await setDoc(
        doc(database, 'users', result.user.uid),
        {
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          lastLoginAt: serverTimestamp(),
        },
        { merge: true },
      );

      return result.user;
    } catch (signInError) {
      const message =
        signInError instanceof Error
          ? signInError.message
          : 'Google sign-in failed.';
      setError(message);
      throw signInError;
    }
  }

  async function signOutUser() {
    if (!auth) {
      return;
    }

    await signOut(auth);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isFirebaseConfigured,
      signInWithGoogle,
      signOutUser,
    }),
    [user, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}

