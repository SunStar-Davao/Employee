import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../api/axios';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadByChat, setUnreadByChat] = useState({});

  useEffect(() => {
    loadStoredData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadStoredData = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedUserType = localStorage.getItem('userType');
      const token = localStorage.getItem('token');
      
      if (storedUser && storedUserType && token) {
        setUser(JSON.parse(storedUser));
        setUserType(storedUserType);
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axiosInstance.get('/chats/unread-count');
      if (response.data.success) {
        setUnreadCount(response.data.totalUnread);
        setUnreadByChat(response.data.chats || {});
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const employeeLogin = async (employeeId, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        employeeId,
        password,
      });

      const { token, employee } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(employee));
      localStorage.setItem('userType', 'employee');
      
      setUser(employee);
      setUserType('employee');
      
      fetchUnreadCount();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const guardLogin = async (username, password) => {
    try {
      const response = await axiosInstance.post('/auth/guard/login', {
        username,
        password,
      });

      const { token, guard } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(guard));
      localStorage.setItem('userType', 'guard');
      
      setUser(guard);
      setUserType('guard');

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      
      const { token, employee } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(employee));
      localStorage.setItem('userType', 'employee');
      
      setUser(employee);
      setUserType('employee');

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    setUser(null);
    setUserType(null);
    setUnreadCount(0);
    setUnreadByChat({});
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userType,
        isLoading,
        employeeLogin,
        guardLogin,
        register,
        logout,
        unreadCount,
        unreadByChat,
        fetchUnreadCount,
      }}>
      {children}
    </AuthContext.Provider>
  );
};