import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold shadow-sm">
            <span className="material-symbols-outlined text-[20px]">hub</span>
          </div>
          <span className="font-headline text-lg font-bold tracking-tight text-on-surface">DiagramConnect</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <a className="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors" href="#inicio">
            Inicio / Producto
          </a>
          <a className="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors" href="#canvas-demo">
            Modelado IA
          </a>
          <a className="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors" href="#arquitectura">
            Spring Boot Engine
          </a>
          <a className="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors" href="#capacidades">
            Casos de Uso
          </a>
          <a className="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors" href="#documentacion">
            Documentación
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} className="w-8 h-8 rounded-full border border-primary/20 object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs">
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <span className="text-sm font-label font-semibold text-on-surface hidden sm:inline">
                  {user?.username}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-label rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>Salir</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to={ROUTES.LOGIN} className="hidden sm:inline-flex px-3.5 py-1.5 text-sm font-label text-on-surface-variant hover:text-on-surface transition-colors">
                Iniciar Sesión
              </Link>
              <Link to={ROUTES.REGISTER} className="px-4 py-2 text-sm font-label rounded-lg bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-[0_2px_8px_rgba(9,76,178,0.25)] hover:opacity-95 transition-opacity">
                Comenzar Gratis
              </Link>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
