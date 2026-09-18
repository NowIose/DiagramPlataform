import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom Hook para acceder al AuthContext de forma limpia y segura.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
