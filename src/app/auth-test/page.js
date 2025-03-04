"use client";

import AuthDebugger from '@/components/AuthDebugger'; 
import { useAuth } from '@/app/context/AuthContext';
import { useState, useEffect } from 'react';

export default function AuthTestPage() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [clientLoaded, setClientLoaded] = useState(false);
  
  // Mark when client-side JavaScript has executed
  useEffect(() => {
    setClientLoaded(true);
  }, []);
  
  const testLogin = () => {
    // Test login with sample user data
    login({
      id: 123,
      first_name: "Test",
      last_name: "User",
      email: "test@example.com"
    });
  };

  const testLocalStorage = () => {
    // Test basic localStorage functionality
    localStorage.setItem('testValue', 'This is a test ' + new Date().toISOString());
    alert('Value set. Check developer tools to verify.');
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Authentication Test Page</h1>
      
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">Auth Context State:</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Client-side JavaScript loaded:</strong> {clientLoaded ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>isAuthenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
          </div>
          <div className="col-span-2">
            <strong>User:</strong> 
            <pre className="bg-gray-50 p-2 mt-2 rounded text-sm">
              {JSON.stringify(user, null, 2) || "null"}
            </pre>
          </div>
        </div>
        
        <div className="flex space-x-4 mt-4">
          <button 
            onClick={testLogin}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Test Login
          </button>
          <button 
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
          <button 
            onClick={testLocalStorage}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Test localStorage
          </button>
        </div>
      </div>
      
      <AuthDebugger />
    </div>
  );
}