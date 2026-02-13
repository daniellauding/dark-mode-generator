import { useState, useEffect, useCallback } from 'react';
import { onAuthChange, login as fbLogin, signup as fbSignup, logout as fbLogout, type User } from '../firebase/auth';
import { FirebaseError } from 'firebase/app';

const AUTH_ERRORS: Record<string, string> = {
  'auth/invalid-email': 'Invalid email address.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
};

function getErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return AUTH_ERRORS[error.code] ?? 'Something went wrong. Please try again.';
  }
  return 'Something went wrong. Please try again.';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setActionLoading(true);
    try {
      await fbLogin(email, password);
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    setError(null);
    setActionLoading(true);
    try {
      await fbSignup(email, password);
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await fbLogout();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { user, loading, error, actionLoading, login, signup, logout, clearError };
}
