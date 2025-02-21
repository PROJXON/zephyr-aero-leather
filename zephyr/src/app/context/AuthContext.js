"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Create the Auth Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/user", { credentials: "include" });
        const data = await response.json();

        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          setUser(data.user);  // Update user immediately
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching authentication status:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // Runs only once on mount

  // Log user state for debugging purposes
  useEffect(() => {
    if (user) {
      console.log("User updated in AuthContext:", user);
    }
  }, [user]); // Trigger on user change

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);  // Clear the user data after logging out
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setIsAuthenticated, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth Context
export const useAuth = () => useContext(AuthContext);
