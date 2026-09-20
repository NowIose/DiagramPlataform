import { useState } from 'react';
import ProjectCard, { type ProjectCardProps } from './ProjectCard';

const MOCK_PROJECTS: (ProjectCardProps & { category: string })[] = [
  {
    id: "1",
    title: "E-Commerce Core & Checkout",
    subtitle: "UML Clases + Relacional (PostgreSQL 16)",
    icon: "shopping_bag",
    tagText: "En vivo",
    tagClass: "bg-tertiary-container/30 text-on-tertiary-fixed-variant",
    entitiesTitle: "Entidades Principales:",
    entities: ["Order", "Payment", "InventoryItem", "Customer", "+12 más"],
    metaTags: [
      { icon: "layers", text: "16 Entidades" },
      { icon: "bolt", text: "Spring Boot 3.3" },
      { icon: "sync", text: "Flyway v1.4" }
    ],
    collaborators: [
      { init: "SO", color: "bg-primary text-on-primary" },
      { init: "CA", color: "bg-primary-container text-on-primary-container" },
      { init: "DA", color: "bg-tertiary-container text-on-tertiary-container" }
    ],
    category: "uml erd",
    onToast: () => {}
  },
  {
    id: "2",
    title: "Fintech Payments & Ledger",
    subtitle: "Modelo Relacional DDD (Multi-Tenant)",
    icon: "account_balance",
    tagText: "ACID Estricto",
    tagClass: "bg-surface-container text-secondary",
    entitiesTitle: "Características Clave:",
    entities: ["Particionado de transacciones", "Ledger inmutable"],
    metaTags: [
      { icon: "table_chart", text: "24 Tablas ACID" },
      { icon: "integration_instructions", text: "Spring Data JPA" },
      { icon: "dock", text: "Docker Compose" }
    ],
    collaborators: [
      { init: "CA", color: "bg-primary text-on-primary" },
      { init: "EL", color: "bg-secondary text-on-secondary" }
    ],
    category: "erd microservices",
    onToast: () => {}
  },
  // We can add the rest, let's keep it concise or add 2 more
  {
    id: "3",
    title: "Auth & Identity Service",
    subtitle: "Microservicio OAuth2 & Keycloak",
    icon: "verified_user",
    tagText: "Producción",
    tagClass: "bg-primary-fixed text-on-primary-fixed",
    entitiesTitle: "Entidades Principales:",
    entities: ["UserAccount", "RolePermission", "RefreshToken"],
    metaTags: [
      { icon: "class", text: "8 Clases Core" },
      { icon: "key", text: "Tokens JWT RSA" },
      { icon: "memory", text: "Redis Cache" }
    ],
    collaborators: [
      { init: "SO", color: "bg-primary text-on-primary" }
    ],
    category: "uml microservices",
    onToast: () => {}
  }
];

export default function ProjectGrid({ onToast }: { onToast: (t: string, m: string, i: string) => void }) {
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filteredProjects = MOCK_PROJECTS.filter(p => filter === 'all' || p.category.includes(filter));

  return (
    <section className="xl:col-span-8 flex flex-col">
      <div className="bg-surface-container-lowest p-3 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button onClick={() => setFilter('all')} className={`px-3.5 py-1.5 rounded-xl text-xs font-label font-semibold transition-all shrink-0 ${filter === 'all' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>Todos los Proyectos</button>
          <button onClick={() => setFilter('uml')} className={`px-3.5 py-1.5 rounded-xl text-xs font-label font-semibold transition-all shrink-0 ${filter === 'uml' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>Diagramas UML</button>
          <button onClick={() => setFilter('erd')} className={`px-3.5 py-1.5 rounded-xl text-xs font-label font-semibold transition-all shrink-0 ${filter === 'erd' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>Modelos ERD</button>
          <button onClick={() => setFilter('microservices')} className={`px-3.5 py-1.5 rounded-xl text-xs font-label font-semibold transition-all shrink-0 ${filter === 'microservices' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>Plantillas Spring</button>
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-label text-secondary hidden sm:inline">Ordenar por:</span>
          <select className="bg-surface-container-low text-xs font-label rounded-lg px-2.5 py-1.5 text-on-surface focus:outline-none cursor-pointer">
            <option>Recientes</option>
            <option>Más editados</option>
            <option>Por nombre</option>
          </select>
          <div className="h-4 w-[1px] bg-surface-container-highest"></div>
          <div className="flex items-center bg-surface-container-low p-0.5 rounded-lg">
            <button onClick={() => setView('grid')} className={`p-1 rounded ${view === 'grid' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'}`}>
              <span className="material-symbols-outlined text-[16px] block">grid_view</span>
            </button>
            <button onClick={() => setView('list')} className={`p-1 rounded ${view === 'list' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'}`}>
              <span className="material-symbols-outlined text-[16px] block">view_list</span>
            </button>
          </div>
        </div>
      </div>

      <div className={view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-5" : "flex flex-col gap-4"}>
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} {...project} onToast={onToast} />
        ))}
        
        <button className="bg-surface-container-low/60 hover:bg-surface-container-low rounded-2xl p-6 transition-all flex flex-col items-center justify-center text-center group cursor-pointer min-h-[260px] shadow-sm hover:shadow" onClick={() => onToast('Nuevo Lienzo', 'Selecciona el arquetipo de base de datos para comenzar.', 'note_add')} type="button">
          <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm mb-3">
            <span className="material-symbols-outlined text-[28px]">add</span>
          </div>
          <h4 className="font-headline text-base font-semibold text-on-surface">Crear Nuevo Espacio de Modelado</h4>
          <p className="text-xs text-on-surface-variant max-w-xs mt-1 leading-relaxed">
            Inicia un lienzo en blanco o usa arquetipos Domain-Driven Design listos para Spring Data y PostgreSQL.
          </p>
          <span className="mt-4 px-3 py-1 rounded-lg bg-surface-container-high text-primary text-xs font-label font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">auto_awesome</span> Asistente guiado
          </span>
        </button>
      </div>
    </section>
  );
}
