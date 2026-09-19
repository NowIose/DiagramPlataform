import React from 'react';

export const WorkflowSection: React.FC = () => {
  return (
    <section className="w-full px-6 lg:px-12 py-24 bg-surface" id="documentacion">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-label text-xs uppercase tracking-widest text-primary font-bold">Flujo de Trabajo Acelerado</span>
          <h2 className="font-headline text-3xl sm:text-4xl text-on-surface font-normal mt-2 tracking-tight">
            De la Idea a Producción en 3 Pasos
          </h2>
          <p className="text-sm font-body text-on-surface-variant mt-3 leading-relaxed">
            Reduce semanas de diseño y setup de repositorio a solo unos minutos de refinamiento visual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="relative bg-surface-container-low rounded-2xl p-8 flex flex-col justify-between border border-surface-container">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-headline text-3xl font-bold text-primary/30">01</span>
                <span className="material-symbols-outlined text-primary text-[28px]">draw</span>
              </div>
              <h4 className="font-headline text-xl font-bold text-on-surface mb-3">Describe o Dibuja</h4>
              <p className="text-xs font-body text-on-surface-variant leading-relaxed mb-6">
                Dicta los requerimientos funcionales por voz o sube un boceto a mano alzada. Nuestra IA normaliza entidades, detecta atributos primitivos y propone cardinalidades 1:1, 1:N o N:M.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-3 rounded-xl text-xs font-mono text-on-surface-variant border border-surface-container">
              &gt; prompt: “Sistema de suscripciones con facturas recurrentes y reembolsos”
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative bg-surface-container-low rounded-2xl p-8 flex flex-col justify-between border border-surface-container">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-headline text-3xl font-bold text-tertiary/40">02</span>
                <span className="material-symbols-outlined text-tertiary text-[28px]">group_work</span>
              </div>
              <h4 className="font-headline text-xl font-bold text-on-surface mb-3">Colabora y Refina</h4>
              <p className="text-xs font-body text-on-surface-variant leading-relaxed mb-6">
                Conecta a los líderes técnicos y desarrolladores en el mismo lienzo. Aplica índices PostgreSQL, valida restricciones de integridad referencial y ajusta tipos de datos en vivo.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-3 rounded-xl flex items-center justify-between text-xs font-label border border-surface-container">
              <span className="text-on-surface font-medium">Validación de Esquema:</span>
              <span className="text-tertiary font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span> 0 Errores
              </span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative bg-surface-container-low rounded-2xl p-8 flex flex-col justify-between border border-surface-container">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-headline text-3xl font-bold text-secondary/40">03</span>
                <span className="material-symbols-outlined text-secondary text-[28px]">rocket_launch</span>
              </div>
              <h4 className="font-headline text-xl font-bold text-on-surface mb-3">Exporta el Repositorio</h4>
              <p className="text-xs font-body text-on-surface-variant leading-relaxed mb-6">
                Descarga un proyecto Maven o Gradle compilable con Docker Compose (PostgreSQL 16 listo), tests unitarios JUnit 5 preconfigurados y colecciones Postman/OpenAPI 3.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-3 rounded-xl flex items-center justify-between text-xs font-label text-primary font-mono font-bold border border-surface-container">
              <span>docker compose up -d</span>
              <span className="material-symbols-outlined text-[16px]">terminal</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
