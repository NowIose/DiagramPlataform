import { apiClient } from '../config/api';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types';

/**
 * Servicio encargado de las llamadas HTTP de Autenticación al Backend.
 */
export const AuthService = {
  /**
   * Iniciar Sesión con credenciales locales (email/contraseña)
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Registrar un nuevo usuario
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
};
