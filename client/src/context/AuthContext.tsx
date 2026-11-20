import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginAsDemoUser: (role: UserRole) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole, department?: string, studentId?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('cyberrakshak_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const storedToken = localStorage.getItem('cyberrakshak_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/auth/profile');
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          logout();
        }
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token: receivedToken, user: receivedUser } = response.data;
        localStorage.setItem('cyberrakshak_token', receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const loginAsDemoUser = async (role: UserRole): Promise<boolean> => {
    const credentials = {
      student: { email: 'student@vishnu.edu.in', password: 'Student@123' },
      administrator: { email: 'admin@vishnu.edu.in', password: 'Admin@123' },
      approver: { email: 'approver@vishnu.edu.in', password: 'Approver@123' }
    };
    const cred = credentials[role];
    return await login(cred.email, cred.password);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    department?: string,
    studentId?: string
  ): Promise<boolean> => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
        department,
        studentId
      });
      if (response.data.success) {
        const { token: receivedToken, user: receivedUser } = response.data;
        localStorage.setItem('cyberrakshak_token', receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('cyberrakshak_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        loginAsDemoUser,
        register,
        logout,
        isAuthenticated: !!user
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

