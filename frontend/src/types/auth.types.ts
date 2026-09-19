/**
 * Definición de tipos e interfaces para Autenticación y Usuarios
 */

export interface User {
  id?: number;
  username: string;
  email: string;
  avatarUrl?: string;
  authProvider?: 'LOCAL' | 'GOOGLE';
  role?: 'ROLE_USER' | 'ROLE_ADMIN';
  enabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  id?: number;
  username: string;
  email: string;
  avatarUrl?: string;
  role?: string;
  authProvider?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
