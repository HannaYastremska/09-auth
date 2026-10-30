'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '../../lib/api/clientApi';
import { useAuthStore } from '../../lib/store/authStore';

export default function AuthNavigation() {
  const router = useRouter();
  const { user, isAuthenticated, clearIsAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      clearIsAuthenticated();
      router.push('/sign-in');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!mounted) {
    return (
      <>
        <li>
          <a href="/sign-in">Login</a>
        </li>
        <li>
          <a href="/sign-up">Sign up</a>
        </li>
      </>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <>
          <li>
            <a href="/notes/filter/all">Notes</a>
          </li>
          <li>
            <a href="/profile">Profile</a>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: '#ccc' }}>{user?.email}</span>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1px solid white',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li>
            <a href="/sign-in">Login</a>
          </li>
          <li>
            <a href="/sign-up">Sign up</a>
          </li>
        </>
      )}
    </>
  );
}
