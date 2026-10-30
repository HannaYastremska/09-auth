'use client';

import React, { useEffect, useState } from 'react';
import { checkSession } from '../../lib/api/clientApi';
import { useAuthStore } from '../../lib/store/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore(state => state.setUser);
  const clearIsAuthenticated = useAuthStore(state => state.clearIsAuthenticated);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await checkSession();
        if (user) {
          setUser(user);
        } else {
          clearIsAuthenticated();
        }
      } catch (error) {
        clearIsAuthenticated();
      } finally {
        setIsChecking(false);
      }
    };

    initAuth();
  }, [setUser, clearIsAuthenticated]);

  if (isChecking) {
    return (
      <div
        suppressHydrationWarning={true}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <p>Loading session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
