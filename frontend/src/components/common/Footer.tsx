import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-lowest mt-20 shadow-[0_-1px_12px_rgba(0,0,0,0.03)] border-t border-surface-container">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold shadow-sm">
                <span className="material-symbols-outlined text-[18px]">hub</span>
              </div>
              <span className="font-headline text-base font-bold text-on-surface">DiagramConnect</span>
            </div>
            <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed font-body">
              Entorno de ingeniería colaborativa guiado por IA para la síntesis de diagramas de dominio, modelos PostgreSQL y microservicios listos para producción en Spring Boot 3.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-label bg-surface-container text-tertiary">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                Cloud Native Stack
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-label bg-surface-container text-on-surface-variant">
                PostgreSQL 16 · JPA
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-label text-xs uppercase tracking-wider text-tertiary font-semibold mb-4">Plataforma &amp; Core</h4>
            <ul className="space-y-2.5 text-sm font-body">
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Modelador UML / Clases</li>
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Generador DDL PostgreSQL</li>
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Exportador Spring Boot Starter</li>
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Sincronización en Tiempo Real</li>
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Copiloto de Arquitectura</li>
            </ul>
          </div>

          <div>
            <h4 className="font-label text-xs uppercase tracking-wider text-tertiary font-semibold mb-4">Arquitectura &amp; Docs</h4>
            <ul className="space-y-2.5 text-sm font-body">
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Guía de Inicio Rápido</li>
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Especificación de Esquemas</li>
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Buenas Prácticas DDD</li>
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">API GraphQL &amp; REST</li>
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">CI/CD Pipelines</li>
            </ul>
          </div>

          <div>
            <h4 className="font-label text-xs uppercase tracking-wider text-tertiary font-semibold mb-4">Empresa &amp; Soporte</h4>
            <ul className="space-y-2.5 text-sm font-body">
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Casos de Éxito Cloud</li>
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Seguridad &amp; Gobernanza</li>
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Privacidad de Datos IA</li>
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Estado del Servicio</li>
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Contacto de Ingeniería</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 bg-surface-container-low rounded-xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-label text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} DiagramConnect Inc. Diseñado para arquitectos de software e ingeniería de backend.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-on-surface transition-colors cursor-pointer">Términos de Servicio</span>
            <span className="hover:text-on-surface transition-colors cursor-pointer">Políticas de Seguridad</span>
            <span className="hover:text-on-surface transition-colors cursor-pointer">Telemetry Status</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
