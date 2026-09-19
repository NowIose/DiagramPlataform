import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden px-6 lg:px-12 pt-10 pb-20 bg-surface" id="inicio">
      {/* Ambient Blueprint Grid & Soft Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern height="48" id="arch-grid" patternUnits="userSpaceOnUse" width="48">
              <path className="text-outline-variant" d="M 48 0 L 0 0 0 48" fill="none" opacity="0.35" stroke="currentColor" strokeWidth="0.7"></path>
              <circle className="text-primary" cx="0" cy="0" fill="currentColor" opacity="0.25" r="1.5"></circle>
            </pattern>
          </defs>
          <rect fill="url(#arch-grid)" height="100%" width="100%"></rect>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Announcement Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface-container-high shadow-sm mb-8 transition-transform hover:scale-[1.02] cursor-pointer">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="font-label text-xs uppercase tracking-wider text-primary font-semibold">DiagramConnect 2.0</span>
          <span className="text-on-surface-variant text-xs font-body">• Modelado Colaborativo con IA &amp; Generación de Backend</span>
          <span className="material-symbols-outlined text-[16px] text-primary">arrow_forward</span>
        </div>

        {/* Main Heading */}
        <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl text-on-surface font-normal tracking-tight max-w-5xl leading-[1.12]">
          Diseña Diagramas de Clases y Bases de Datos en Equipo. <br className="hidden sm:inline" />
          <span className="italic font-normal bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
            La IA genera tu Backend en Spring Boot.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-on-surface-variant max-w-3xl font-body leading-relaxed font-normal">
          Diseño concurrente en tiempo real de diagramas UML y modelos relacionales. Asistencia multimodal por voz, prompts y bocetos con exportación instantánea a Spring Boot 3 + PostgreSQL.
        </p>

        {/* Primary Action Row */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            to={ROUTES.REGISTER}
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-95 transition-all flex items-center gap-2"
          >
            <span>Iniciar Prueba Gratuita</span>
            <span className="material-symbols-outlined text-[18px]">bolt</span>
          </Link>

          <a
            href="#canvas-demo"
            className="px-6 py-3.5 rounded-xl bg-surface-container-high text-on-surface font-label text-sm font-semibold hover:bg-surface-container transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-primary text-[20px]">view_quilt</span>
            <span>Explorar Canvas Demo</span>
          </a>

          <a
            href="#arquitectura"
            className="px-4 py-3.5 text-on-surface-variant hover:text-primary font-label text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            <span>Ver arquitectura de ejemplo</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </a>
        </div>

        {/* Quick Metrics Strip */}
        <div className="mt-14 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface-container-lowest/80 backdrop-blur px-5 py-4 rounded-xl shadow-sm flex items-center gap-4 text-left border border-surface-container-high">
            <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[22px]">speed</span>
            </div>
            <div>
              <div className="font-headline text-lg font-bold text-on-surface">10x velocidad</div>
              <div className="font-label text-xs text-on-surface-variant">En prototipado DDD</div>
            </div>
          </div>

          <div className="bg-surface-container-lowest/80 backdrop-blur px-5 py-4 rounded-xl shadow-sm flex items-center gap-4 text-left border border-surface-container-high">
            <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined text-[22px]">terminal</span>
            </div>
            <div>
              <div className="font-headline text-lg font-bold text-on-surface">100% código limpio</div>
              <div className="font-label text-xs text-on-surface-variant">Spring Data JPA &amp; DTOs</div>
            </div>
          </div>

          <div className="bg-surface-container-lowest/80 backdrop-blur px-5 py-4 rounded-xl shadow-sm flex items-center gap-4 text-left border border-surface-container-high">
            <div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
              <span className="material-symbols-outlined text-[22px]">cloud_sync</span>
            </div>
            <div>
              <div className="font-headline text-lg font-bold text-on-surface">Offline-First</div>
              <div className="font-label text-xs text-on-surface-variant">Multiplataforma Web &amp; Móvil</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
