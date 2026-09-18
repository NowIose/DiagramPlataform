/**
 * Configuración centralizada de variables de entorno.
 * Permite acceder a las variables dinámicas sin hardcodear URLs ni credenciales.
 */
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};
