import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'administrator';
  avatar: string;
  currentXP: number;
  currentLevel: number;
  streak: {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string | null;
  };
  preferredLanguage: string;
  interests: string[];
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  learningGoals?: string[];
  dailyStudyMinutes?: number;
  onboardingCompleted: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  demoLogin: (role: 'student' | 'admin') => Promise<void>;
  register: (data: { name: string; email: string; password: string; preferredLanguage?: string; mainInterest?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('sq_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const storedToken = localStorage.getItem('sq_token');
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch {
      localStorage.removeItem('sq_token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('sq_token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
  };

  const demoLogin = async (role: 'student' | 'admin') => {
    const res = await api.post('/auth/demo-login', { role });
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('sq_token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
  };

  const register = async (data: { name: string; email: string; password: string; preferredLanguage?: string; mainInterest?: string }) => {
    const res = await api.post('/auth/register', data);
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('sq_token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
  };

  const logout = () => {
    localStorage.removeItem('sq_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        demoLogin,
        register,
        logout,
        refreshUser,
        updateUser,
      }}
    >
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
