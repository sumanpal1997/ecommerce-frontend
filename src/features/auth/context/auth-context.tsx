'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { User } from '../types/auth.types';
import { LoginFormData, RegisterFormData } from '../schemas/auth.schema';
import { authApi } from '../services/auth.api';
import { apiClient } from '@/lib/api/api-client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginFormData) => Promise<User>;
  register: (data: Omit<RegisterFormData, 'confirmPassword'>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();

  // Helper to merge guest cart upon successful login
  const triggerCartMerge = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const guestId = localStorage.getItem('guest_id');
    if (guestId) {
      try {
        await apiClient('/cart/merge', {
          method: 'POST',
          body: JSON.stringify({ guestId }),
        });
        localStorage.removeItem('guest_id');
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      } catch (err) {
        console.warn('Cart merge failed during login session init:', err);
      }
    }
  }, [queryClient]);

  // Silent session hydration using the HttpOnly refresh token cookie
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        const token = await authApi.refreshToken();
        if (token && isMounted) {
          const profile = await authApi.getMe();
          if (isMounted) {
            setUser(profile);
            await triggerCartMerge();
          }
        }
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initSession();

    return () => {
      isMounted = false;
    };
  }, [triggerCartMerge]);

  const login = async (credentials: LoginFormData): Promise<User> => {
    setIsLoading(true);
    try {
      const data = await authApi.login(credentials);
      setUser(data.user);
      await triggerCartMerge();
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: Omit<RegisterFormData, 'confirmPassword'>) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(data);
      setUser(res.user);
      await triggerCartMerge();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
