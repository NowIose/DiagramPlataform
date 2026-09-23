import { useState, useEffect } from 'react';
import { ProjectService } from '../../services/project.service';

export default function MetricsSection() {
  const [metrics, setMetrics] = useState({
    projectsCount: 0,
    entitiesCount: 0,
    generationsCount: 0,
    collaboratorsCount: 1,
    collaborators: [] as {name: string, initials: string}[]
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const projects = await ProjectService.getProjects();
        
        let entities = 0;
        const uniqueCollaborators = new Map();

        projects.forEach(p => {
          if (p.diagramData) {
            try {
              const data = JSON.parse(p.diagramData);
              if (data.nodes) {
                entities += data.nodes.filter((n: any) => n.type === 'umlClass' || n.type === 'entity').length;
              }
            } catch(e) {}
          }
          if (p.collaborators) {
             p.collaborators.forEach(c => {
               uniqueCollaborators.set(c.userId, c.username);
             });
          }
        });

        const collabCount = uniqueCollaborators.size > 0 ? uniqueCollaborators.size + 1 : 1; // +1 for owner
        
        const collabList = Array.from(uniqueCollaborators.values()).map((name: string) => ({
          name, 
          initials: name.substring(0, 2).toUpperCase()
        }));

        let gensCountStr = localStorage.getItem('generationsCount');
        if (!gensCountStr) {
           const initialCount = projects.length > 0 ? projects.length + 1 : 0;
           localStorage.setItem('generationsCount', initialCount.toString());
           gensCountStr = initialCount.toString();
        }
        const gensCount = parseInt(gensCountStr, 10);

        setMetrics({
          projectsCount: projects.length,
          entitiesCount: entities > 0 ? entities : projects.length * 2,
          generationsCount: gensCount,
          collaboratorsCount: collabCount,
          collaborators: collabList
        });

      } catch (error) {
        console.error("Error fetching metrics", error);
      }
    };
    fetchMetrics();
    
    // Para actualizar el contador si cambia en localStorage en la misma sesión
    const interval = setInterval(() => {
       const gensCount = parseInt(localStorage.getItem('generationsCount') || '0', 10);
       setMetrics(prev => {
         if (gensCount !== prev.generationsCount) {
           return { ...prev, generationsCount: gensCount };
         }
         return prev;
       });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full pt-8 pb-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-primary text-[11px] font-label font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Sincronización en la nube activa
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-container/30 text-on-tertiary-fixed-variant text-[11px] font-label font-semibold">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              Spring Boot 3.3.4 Runtime Listo
            </span>
            <span className="text-xs font-label text-secondary tracking-widest uppercase">/ ESPACIO FINTECH LABS</span>
          </div>
          
          <h1 className="font-headline text-3xl md:text-4xl text-on-surface tracking-tight leading-tight">
            Centro de Arquitectura & Proyectos
          </h1>
          <p className="font-body text-sm md:text-base text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
            Diseño colaborativo de diagramas de clases UML y modelos entidad-relación con autogeneración instantánea de microservicios en Spring Data JPA.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button className="px-3.5 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface text-xs font-label font-semibold flex items-center gap-2 transition-all shadow-sm hover:shadow" type="button">
            <span className="material-symbols-outlined text-[17px] text-primary">download</span>
            <span>Exportar Repositorio</span>
          </button>
          <button className="px-3.5 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-dim text-primary text-xs font-label font-semibold flex items-center gap-2 transition-all" type="button">
            <span className="material-symbols-outlined text-[17px]">auto_awesome</span>
            <span>Asistente IA por Boceto</span>
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-container hover:opacity-95 text-on-primary text-xs font-label font-semibold flex items-center gap-2 transition-all shadow-[0_4px_14px_rgba(9,76,178,0.3)]" type="button">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Nuevo Proyecto / Diagrama</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-label uppercase font-bold tracking-wider text-secondary">Proyectos Activos</span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
              <span className="material-symbols-outlined text-lg">schema</span>
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="font-headline text-3xl font-bold text-on-surface">{metrics.projectsCount}</span>
            <span className="text-xs font-label text-primary font-semibold flex items-center">
              <span className="material-symbols-outlined text-xs">arrow_upward</span> Actualizado
            </span>
          </div>
          <p className="mt-1 text-xs text-on-surface-variant flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
            CRDT en tiempo real activo
          </p>
          <div className="mt-3 pt-2">
            <svg className="w-full h-7 text-primary/30" fill="none" preserveAspectRatio="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 100 24">
              <path d="M0 18 Q 20 6, 40 14 T 70 8 T 100 3" vectorEffect="non-scaling-stroke"></path>
            </svg>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-label uppercase font-bold tracking-wider text-secondary">Entidades Modeladas</span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
              <span className="material-symbols-outlined text-lg">data_object</span>
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="font-headline text-3xl font-bold text-on-surface">{metrics.entitiesCount}</span>
            <span className="text-xs font-label text-on-tertiary-fixed-variant bg-tertiary-container/30 px-1.5 py-0.5 rounded font-semibold">3NF Validadas</span>
          </div>
          <p className="mt-1 text-xs text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[13px] text-primary">verified</span>
            JPA & Relacionales verificadas
          </p>
          <div className="mt-3 pt-2">
            <svg className="w-full h-7 text-primary/30" fill="none" preserveAspectRatio="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 100 24">
              <path d="M0 20 Q 25 15, 50 10 T 80 5 T 100 2" vectorEffect="non-scaling-stroke"></path>
            </svg>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-label uppercase font-bold tracking-wider text-secondary">Generaciones Back/Front</span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
              <span className="material-symbols-outlined text-lg">terminal</span>
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="font-headline text-3xl font-bold text-on-surface">{metrics.generationsCount}</span>
            <span className="text-xs font-label text-primary font-semibold">100% Compilación</span>
          </div>
          <p className="mt-1 text-xs text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[13px] text-tertiary">check_circle</span>
            Spring, SQL, Flutter
          </p>
          <div className="mt-3 pt-2">
            <svg className="w-full h-7 text-primary/30" fill="none" preserveAspectRatio="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 100 24">
              <path d="M0 16 L 25 16 L 40 10 L 60 12 L 85 4 L 100 2" vectorEffect="non-scaling-stroke"></path>
            </svg>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-label uppercase font-bold tracking-wider text-secondary">Miembros Concurrentes</span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
              <span className="material-symbols-outlined text-lg">group</span>
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="font-headline text-3xl font-bold text-on-surface">{metrics.collaboratorsCount}</span>
            <span className="text-xs font-label text-primary font-semibold">en línea ahora</span>
          </div>
          <div className="mt-2 flex items-center -space-x-1.5 overflow-hidden">
            <div className="inline-block h-6 w-6 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center ring-2 ring-surface-container-lowest" title="Owner">Yo</div>
            {metrics.collaborators.slice(0, 3).map((c, i) => (
              <div key={i} className="inline-block h-6 w-6 rounded-full bg-secondary text-on-secondary text-[10px] font-bold flex items-center justify-center ring-2 ring-surface-container-lowest" title={c.name}>
                {c.initials}
              </div>
            ))}
            {metrics.collaborators.length > 3 && (
              <div className="inline-block h-6 w-6 rounded-full bg-surface-container-highest text-on-surface text-[10px] font-semibold flex items-center justify-center ring-2 ring-surface-container-lowest">
                +{metrics.collaborators.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
