import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // TODO: Replace with actual API call
    console.log('Logging in with:', email, password);
    
    // Mock response - Replace with actual API call
    const mockResponse = {
      token: 'mock-jwt-token',
      user: {
        id: Date.now(),
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'user',
        registeredEvents: [1, 2] // Mock registered event IDs
      }
    };

    localStorage.setItem('token', mockResponse.token);
    localStorage.setItem('user', JSON.stringify(mockResponse.user));
    setUser(mockResponse.user);
    
    return { success: true, data: mockResponse };
  };

  const register = async (userData) => {
    // TODO: Replace with actual API call
    console.log('Registering:', userData);
    
    // Mock response - Replace with actual API call
    const mockResponse = {
      token: 'mock-jwt-token',
      user: {
        id: Date.now(),
        ...userData,
        role: 'user',
        registeredEvents: []
      }
    };

    localStorage.setItem('token', mockResponse.token);
    localStorage.setItem('user', JSON.stringify(mockResponse.user));
    setUser(mockResponse.user);
    
    return { success: true, data: mockResponse };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};