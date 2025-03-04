"use client";

import { useEffect, useState } from 'react';

const AuthDebugger = () => {
  const [debugInfo, setDebugInfo] = useState({
    localStorage: null,
    cookies: null,
    apiResponse: null,
    timestamp: null
  });

  // Get authentication state from various sources
  const refreshDebugInfo = async () => {
    // Check local storage
    let localStorageAuth = null;
    try {
      const authState = localStorage.getItem('authState');
      localStorageAuth = authState ? JSON.parse(authState) : null;
    } catch (e) {
      localStorageAuth = `Error: ${e.message}`;
    }

    // Get cookies (can only see non-HttpOnly cookies from client)
    const cookies = document.cookie;
    
    // Check API response
    let apiResponse = null;
    try {
      const response = await fetch('/api/auth/user', {
        credentials: 'include',
        cache: 'no-store'
      });
      apiResponse = await response.json();
    } catch (e) {
      apiResponse = `Error: ${e.message}`;
    }

    setDebugInfo({
      localStorage: localStorageAuth,
      cookies,
      apiResponse,
      timestamp: new Date().toISOString()
    });
  };

  // On mount
  useEffect(() => {
    refreshDebugInfo();
  }, []);

  return (
    <div className="bg-gray-100 p-4 rounded-lg my-4">
      <h2 className="text-xl font-bold mb-4">Auth Debug Info</h2>
      <button 
        onClick={refreshDebugInfo}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Refresh Debug Info
      </button>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">localStorage['authState']:</h3>
          <pre className="bg-gray-50 p-2 mt-2 rounded text-sm overflow-auto max-h-40">
            {JSON.stringify(debugInfo.localStorage, null, 2)}
          </pre>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Client-Accessible Cookies:</h3>
          <pre className="bg-gray-50 p-2 mt-2 rounded text-sm overflow-auto max-h-40">
            {debugInfo.cookies || "No cookies found"}
          </pre>
          <p className="text-xs text-gray-500 mt-2">
            Note: HttpOnly cookies can't be accessed by JavaScript
          </p>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">API Response (/api/auth/user):</h3>
          <pre className="bg-gray-50 p-2 mt-2 rounded text-sm overflow-auto max-h-40">
            {JSON.stringify(debugInfo.apiResponse, null, 2)}
          </pre>
        </div>
        
        <div className="text-xs text-gray-500">
          Last updated: {debugInfo.timestamp}
        </div>
      </div>
    </div>
  );
};

export default AuthDebugger;