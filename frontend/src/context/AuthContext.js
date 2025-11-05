import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await fetch(`${API_BASE}/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            // Token invalid, clear it
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (err) {
          console.error('Auth check failed:', err);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token, API_BASE]);

  const login = async (email, password) => {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (response.ok) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      return { success: true };
    } else {
      return { success: false, error: data.message };
    }
  };

  const signup = async (name, email, password) => {
    const response = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();
    if (response.ok) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      return { success: true };
    } else {
      return { success: false, error: data.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  // Helper for authenticated API calls
  const apiCall = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return fetch(`${API_BASE}${url}`, { ...options, headers });
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    apiCall,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};