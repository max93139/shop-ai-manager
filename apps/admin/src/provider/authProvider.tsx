'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setCredentials, logout as logoutAction } from '../store/slices/authSlice';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

    fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers,
      credentials: 'include',
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          dispatch(
            setCredentials({
              user: data.user,
              token: token || 'session-token',
            })
          );
        } else {
          localStorage.removeItem('access_token');
          dispatch(logoutAction());
        }
      })
      .catch(() => {
        if (!token) {
          dispatch(logoutAction());
        }
      })
      .finally(() => setIsLoading(false));
  }, [dispatch, API_BASE]);

  const logout = useCallback(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

    fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers,
      credentials: 'include',
    })
      .catch(() => {})
      .finally(() => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
        }
        dispatch(logoutAction());
      });
  }, [dispatch, API_BASE]);

  const contextValue = useMemo(
    () => ({
      isAuthenticated: authState.isAuthenticated,
      isLoading,
      user: authState.user,
      logout,
    }),
    [authState.isAuthenticated, isLoading, authState.user, logout]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
