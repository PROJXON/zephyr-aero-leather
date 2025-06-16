"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { User, AuthContextType } from "../../../types/types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const clearAuthState = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const fetchUserFromServer = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/user", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch user");
      const data = await response.json();

      if (data.isAuthenticated) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        clearAuthState();
      }
    } catch (error) {
      console.error("Error fetching user from API:", error);
      clearAuthState();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserFromServer();
  }, [fetchUserFromServer]);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    clearAuthState();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        fetchUserFromServer,
        login,
        logout,
        setIsAuthenticated,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};