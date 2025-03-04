"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext(null);

// Create a client component wrapper that only renders its children after hydration
const ClientOnly = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? children : null;
};

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  
  // Initialize with not authenticated for SSR
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Check localStorage on client-side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const authData = localStorage.getItem('authState');
        if (authData) {
          const parsed = JSON.parse(authData);
          setUser(parsed.user);
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error('Error reading from localStorage:', e);
      } finally {
        setLoading(false);
      }
    }
  }, []);
  
  // Check with server in the background
  useEffect(() => {
    const verifyAuth = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        const response = await fetch('/api/auth/user', {
          credentials: 'include',
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error(`Network error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.isAuthenticated && data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
          localStorage.setItem('authState', JSON.stringify({
            user: data.user
          }));
        } else if (isAuthenticated) {
          // Only clear if we thought we were authenticated but server says no
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('authState');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    verifyAuth();
  }, [isAuthenticated]);
  
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setLoading(false);
    localStorage.setItem('authState', JSON.stringify({
      user: userData
    }));
  };
  
  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authState');
    
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  const contextValue = {
    user,
    isAuthenticated,
    login,
    logout,
    loading
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Special hook for components that need auth state but should only
// render when client-side authentication is available
export const useClientAuth = () => {
  const context = useAuth();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return {
    ...context,
    mounted
  };
};