import React from 'react';

export const CapabilitiesSection: React.FC = () => {
  return (
    <section className="w-full px-6 lg:px-12 py-20 bg-surface-container-low" id="arquitectura">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-label text-xs uppercase tracking-widest text-tertiary font-bold">Ingeniería sin fricción</span>
            <h2 className="font-headline text-3xl sm:text-4xl text-on-surface font-normal mt-2 tracking-tight">
              Capacidades Centrales para Equipos Backend
            </h2>
          </div>
          <p className="text-sm font-body text-on-surface-variant max-w-md leading-relaxed">
            Diseñado bajo los estándares de Domain-Driven Design (DDD) y las mejores prácticas de microservicios en Java y bases de datos relacionales ACID.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="capacidades">
          {/* Card 1 */}
          <div className="bg-surface-container-lowest rounded-2xl p-7 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-surface-container">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[26px]">hub</span>
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface mb-3">Modelado Concurrente en Tiempo Real</h3>
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                Edición simultánea libre de bloqueos con detección semántica de conflictos, cursores visuales identificados por rol y control de versiones ramificado estilo Git para arquitectos.
              </p>
            </div>
            <div className="pt-6 mt-6 flex items-center gap-2 text-xs font-label text-primary font-semibold">
              <span>Algoritmo CRDT • 0ms lag</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-container-lowest rounded-2xl p-7 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-surface-container">
            <div>
              <div className="w-12 h-12 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[26px]">mic_double</span>
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface mb-3">Entrada Multimodal Inteligente</h3>
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                Transforma notas de voz espontáneas, prompts de requerimientos funcionales o fotos de bocetos en servilletas en diagramas de clases formales normalizados en 3NF.
              </p>
            </div>
            <div className="pt-6 mt-6 flex items-center gap-2 text-xs font-label text-tertiary font-semibold">
              <span>Visión OCR + Audio Transcriber</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-surface-container-lowest rounded-2xl p-7 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-surface-container">
            <div>
              <div className="w-12 h-12 rounded-xl bg-secondary/10 text-on-surface flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[26px]">code_blocks</span>
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface mb-3">Generación Spring Boot + PostgreSQL</h3>
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                Síntesis instantánea de entidades JPA, repositorios Spring Data, DTOs con validación Jakarta, controladores REST reactivos y scripts DDL con migraciones automáticas Flyway.
              </p>
            </div>
            <div className="pt-6 mt-6 flex items-center gap-2 text-xs font-label text-on-surface font-semibold">
              <span>Spring Boot 3.3 • PostgreSQL 16</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-surface-container-lowest rounded-2xl p-7 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-surface-container">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary-container/15 text-primary flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[26px]">devices_fold</span>
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface mb-3">Cliente Móvil Offline-First</h3>
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                Modela tus estructuras en iPad, tablet Android o smartphone incluso sin conexión a internet. Sincronización bi-direccional instantánea apenas detecta conectividad.
              </p>
            </div>
            <div className="pt-6 mt-6 flex items-center gap-2 text-xs font-label text-primary font-semibold">
              <span>Local SQLite • Auto-Sync</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
