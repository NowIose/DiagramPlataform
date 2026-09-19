import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

export const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Por favor ingresa tu correo y contraseña');
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
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-headline text-2xl lg:text-3xl font-bold tracking-tight text-on-surface mb-2">
            Bienvenido de nuevo
          </h1>
          <p className="font-body text-xs lg:text-sm text-on-surface-variant">
            Inicia sesión para continuar en tus espacios de modelado de <span className="font-medium text-primary">DiagramConnect</span>.
          </p>
        </div>

        {/* OAuth / Enterprise Fast-lane buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
          {/* GitHub Button */}
          <button
            type="button"
            className="group flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-all duration-200 text-on-surface text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 border border-surface-container-high cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
            </svg>
            <span>GitHub</span>
          </button>

          {/* Google Button */}
          <button
            type="button"
            className="group flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-all duration-200 text-on-surface text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 border border-surface-container-high cursor-pointer"
          >
            <svg className="w-4 h-4 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
            </svg>
            <span>Google</span>
          </button>

          {/* SSO SAML Button */}
          <button
            type="button"
            className="group flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-all duration-200 text-on-surface text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 border border-surface-container-high cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-primary group-hover:scale-105 transition-transform">domain_verification</span>
            <span>SSO (SAML)</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="w-full h-px bg-surface-container"></div>
          <span className="absolute bg-surface-container-lowest px-3 text-[11px] font-label uppercase tracking-wider text-secondary">
            o usa tu correo institucional
          </span>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
            <span className="material-symbols-outlined text-sm shrink-0">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Interactive Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-label font-medium text-on-surface" htmlFor="corporate-email">
              Correo electrónico corporativo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary">
                <span className="material-symbols-outlined text-sm">alternate_email</span>
              </div>
              <input
                id="corporate-email"
                type="email"
                required
                placeholder="tu.nombre@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs font-body rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/40 border border-surface-container transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-label font-medium text-on-surface" htmlFor="corporate-password">
                Contraseña
              </label>
              <a href="#forgot-pwd" className="text-xs font-label text-primary hover:underline font-medium">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary">
                <span className="material-symbols-outlined text-sm">lock</span>
              </div>
              <input
                id="corporate-password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 text-xs font-body rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/40 border border-surface-container transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary hover:text-on-surface transition-colors cursor-pointer"
                aria-label="Mostrar u ocultar contraseña"
              >
                <span className="material-symbols-outlined text-base">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-primary bg-surface-container-low border-0 focus:ring-2 focus:ring-primary/40"
              />
              <span className="text-xs font-body text-on-surface-variant">Recordar este equipo por 30 días</span>
            </label>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-primary to-primary-container text-on-primary font-medium text-xs tracking-wide shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  <span>Verificando credenciales...</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión en DiagramConnect</span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Footer / Registration links & Security metadata */}
      <div className="pt-6 mt-6 space-y-4 border-t border-surface-container-low">
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-body text-on-surface-variant gap-2 pt-2">
          <span>¿No tienes una cuenta de equipo?</span>
          <div className="flex items-center gap-3">
            <Link to={ROUTES.REGISTER} className="text-primary font-medium hover:underline">
              Crea una cuenta (14 días gratis)
            </Link>
            <span className="text-outline-variant">•</span>
            <a href="#demo" className="text-secondary font-medium hover:text-on-surface hover:underline">
              Demo Enterprise
            </a>
          </div>
        </div>

        {/* Compliance badge */}
        <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-surface-container-low text-[11px] font-label text-secondary">
          <span className="material-symbols-outlined text-xs text-primary">verified_user</span>
          <span>Autenticación cifrada TLS 1.3 • Compatible con SOC2 y GDPR</span>
        </div>
      </div>
    </div>
  );
};
