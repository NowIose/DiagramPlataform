import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const CtaSection: React.FC = () => {
  return (
    <section className="w-full px-6 lg:px-12 py-20 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-gradient-to-r from-primary to-primary-container rounded-3xl p-10 lg:p-16 text-on-primary overflow-hidden shadow-2xl">
          {/* Subtle Pattern Decorator */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none hidden md:block">
            <svg fill="none" height="100%" viewBox="0 0 400 400" width="100%">
              <rect height="90" rx="8" stroke="currentColor" strokeWidth="4" width="120" x="50" y="50"></rect>
              <rect height="90" rx="8" stroke="currentColor" strokeWidth="4" width="130" x="220" y="160"></rect>
              <path d="M 170 95 L 220 205" stroke="currentColor" strokeDasharray="6 6" strokeWidth="3"></path>
            </svg>
          </div>

          <div className="relative z-10 max-w-2xl">
            <span className="px-3.5 py-1 rounded-full text-xs font-label bg-on-primary/15 text-primary-fixed uppercase tracking-wider font-semibold inline-block mb-4">
              Comienza en menos de 2 minutos
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight leading-tight">
              Empieza a modelar tu próximo sistema hoy mismo.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-on-primary-container font-body leading-relaxed font-normal">
              Sin tarjeta de crédito requerida. Acceso total a diagramas UML ilimitados, copiloto de arquitectura impulsado por IA y exportador directo a Spring Boot 3 con PostgreSQL.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to={ROUTES.REGISTER}
                className="px-7 py-3.5 rounded-xl bg-surface-container-lowest text-primary font-label text-sm font-bold shadow-lg hover:bg-surface-bright transition-colors flex items-center gap-2"
              >
                <span>Crear Cuenta Gratis</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <a
                href="#documentacion"
                className="px-6 py-3.5 rounded-xl bg-on-primary/10 text-on-primary font-label text-sm font-semibold hover:bg-on-primary/20 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">terminal</span>
                <span>Descargar CLI &amp; Plugins</span>
              </a>
            </div>

            <div className="mt-8 flex items-center gap-6 text-xs font-label text-on-primary/80">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">check_circle</span>
                <span>14 días de prueba Pro</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">check_circle</span>
                <span>Compatible con IntelliJ &amp; VS Code</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
