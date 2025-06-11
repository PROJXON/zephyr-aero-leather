"use client";

import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const clearAuthState = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const fetchUserFromServer = async () => {
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
  };

  useEffect(() => {
    fetchUserFromServer();
  }, []);

  const login = (userData) => {
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
        setUser }}>
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
