import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { ROUTES } from '../../constants/routes';
import { UserPlus, AlertCircle } from 'lucide-react';

export const RegisterForm: React.FC = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username || !email || !password) {
      setErrorMessage('Por favor complete todos los campos');
      return;
    }

    try {
      await register({ username, email, password });
      navigate(ROUTES.HOME);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Error al registrar el usuario. El correo puede estar en uso.';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Crear Cuenta</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Únete a DiagramConect y empieza a diseñar con IA
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
          label="Nombre de Usuario"
          type="text"
          placeholder="juanperez"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

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
          <UserPlus className="w-4 h-4" />
          {isLoading ? 'Registrando...' : 'Registrar Cuenta'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        ¿Ya tienes una cuenta?{' '}
        <Link to={ROUTES.LOGIN} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
          Inicia sesión aquí
        </Link>
      </div>
    </div>
  );
};
