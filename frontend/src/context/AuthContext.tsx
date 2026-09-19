import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types';
import { AuthService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (data: AuthResponse) => {
    const userData: User = {
      id: data.id,
      username: data.username,
      email: data.email,
      avatarUrl: data.avatarUrl || `https://ui-avatars.com/api/?name=${data.username}&background=094cb2&color=fff`,
      role: (data.role as any) || 'ROLE_USER',
      authProvider: (data.authProvider as any) || 'LOCAL',
    };
    setToken(data.token);
    setUser(userData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const data = await AuthService.login(credentials);
      handleAuthSuccess(data);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      const res = await AuthService.register(data);
      handleAuthSuccess(res);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
