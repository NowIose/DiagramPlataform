import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { ROUTES } from '../../constants/routes';
import { LogIn, AlertCircle } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Por favor ingrese su correo y contraseña');
      return;
    }

    try {
      await login({ email, password });
      navigate(ROUTES.HOME);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Error al iniciar sesión. Verifique sus credenciales.';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Iniciar Sesión</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Ingresa a tu cuenta de DiagramConect
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="ejemplo@diagramconect.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" variant="primary" fullWidth disabled={isLoading} className="mt-2 flex items-center gap-2">
          <LogIn className="w-4 h-4" />
          {isLoading ? 'Iniciando sesión...' : 'Entrar'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        ¿No tienes una cuenta?{' '}
        <Link to={ROUTES.REGISTER} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
          Regístrate aquí
        </Link>
      </div>
    </div>
  );
};
