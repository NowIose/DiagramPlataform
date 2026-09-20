import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function Sidebar() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
      isActive 
        ? 'bg-primary-container text-on-primary-container font-medium shadow-[0_1px_6px_rgba(9,76,178,0.15)]' 
        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
    }`;

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col pt-5 pb-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="px-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            alt="DiagramConnect logo" 
            className="h-8 w-auto object-contain" 
            src="https://lh3.googleusercontent.com/aida/AEtjO1X36txHdgJmTl5iSf5Y7simJ-EMxpWaDL3QCjBCpCZOAKnUieqbh_1mlzeAd6pY3PpRoyzWlgwYnAwiaB-E5n3fJbHHluD0uRyYg0XZwVGx-myyIC22Y5pgpRc_77MJXqIvBJjsUG3qdXpLRs0HE77UdxuR1FgDy6BAHP5W6gaywUF2H8K8kvWc_hQC6zIjpjSob1t7rIgNBZC71NuR6SAFggWQnLfVl6mXpjWAU7CF3GH-Pnq0Wth9kg" 
          />
          <span className="font-headline font-semibold text-lg tracking-tight text-on-surface">DiagramConnect</span>
        </div>
        <span className="text-[10px] font-label uppercase tracking-widest px-1.5 py-0.5 rounded bg-tertiary-container text-on-tertiary-container font-semibold">AI PRO</span>
      </div>
      
      <div className="px-4 mb-5">
        <button className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-left cursor-pointer" type="button">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-on-primary text-xs font-bold">FB</div>
            <div className="truncate">
              <p className="text-xs font-semibold text-on-surface truncate">Equipo Backend Core</p>
              <p className="text-[11px] text-on-surface-variant truncate">FinTech Labs</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant text-base">unfold_more</span>
        </button>
      </div>

      <div className="px-4 mb-2">
        <p className="px-3 text-[10px] font-label font-bold uppercase tracking-wider text-secondary">Arquitectura & Diseño</p>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <NavLink to={ROUTES.DASHBOARD} end className={navLinkClass}>
          <span className="material-symbols-outlined text-[20px]">space_dashboard</span>
          <span>Panel General (Métricas)</span>
        </NavLink>
        <NavLink to={`${ROUTES.DASHBOARD}/projects`} className={navLinkClass}>
          <span className="material-symbols-outlined text-[20px]">account_tree</span>
          <span>Proyectos & Diagramas</span>
        </NavLink>
        <NavLink to={`${ROUTES.DASHBOARD}/entities`} className={navLinkClass}>
          <span className="material-symbols-outlined text-[20px]">database</span>
          <span>Entidades & Modelos</span>
        </NavLink>
        <NavLink to={`${ROUTES.DASHBOARD}/generator`} className={navLinkClass}>
          <span className="material-symbols-outlined text-[20px]">terminal</span>
          <span>Generador Spring Boot</span>
        </NavLink>
        <NavLink to={`${ROUTES.DASHBOARD}/templates`} className={navLinkClass}>
          <span className="material-symbols-outlined text-[20px]">grid_view</span>
          <span>Plantillas de Arquitectura</span>
        </NavLink>
        <NavLink to={`${ROUTES.DASHBOARD}/collaborators`} className={navLinkClass}>
          <span className="material-symbols-outlined text-[20px]">group</span>
          <span>Colaboradores & Permisos</span>
        </NavLink>
      </nav>

      <div className="px-3 pt-3 mt-auto space-y-1 bg-surface-container-low">
        <div className="px-3 py-1">
          <p className="text-[10px] font-label font-bold uppercase tracking-wider text-secondary">Sistema</p>
        </div>
        <NavLink to={`${ROUTES.DASHBOARD}/settings`} className={navLinkClass}>
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span>Configuración del Espacio</span>
        </NavLink>
        <NavLink to={`${ROUTES.DASHBOARD}/docs`} className={navLinkClass}>
          <span className="material-symbols-outlined text-[20px]">help</span>
          <span>Soporte / Docs</span>
        </NavLink>
      </div>
    </aside>
  );
}
