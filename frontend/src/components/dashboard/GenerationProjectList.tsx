import { useState, useEffect } from 'react';
import { ProjectService } from '../../services/project.service';
import type { Project } from '../../types/project.types';

interface GenerationProjectListProps {
  type: 'sql' | 'springboot';
  onConfigure: (project: Project) => void;
}

export default function GenerationProjectList({ type, onConfigure }: GenerationProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const data = await ProjectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  const title = type === 'sql' ? 'Generador de Entidades & Modelos SQL' : 'Generador Spring Boot';
  const description = type === 'sql' 
    ? 'Selecciona un proyecto para exportar su estructura como un script DDL de PostgreSQL.'
    : 'Selecciona un proyecto para sintetizar un backend funcional en Java con Spring Boot 3.';
  const btnLabel = type === 'sql' ? 'Configurar DDL' : 'Configurar Backend';
  const icon = type === 'sql' ? 'database' : 'local_fire_department';

  return (
    <section className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-headline font-bold text-on-surface mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[28px]">{icon}</span>
          {title}
        </h2>
        <p className="text-on-surface-variant font-body">{description}</p>
      </div>

      <div className="bg-surface-container-lowest p-3 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input 
            type="text" 
            placeholder="Buscar proyecto..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-low text-sm rounded-xl pl-10 pr-4 py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-10 bg-surface-container-lowest rounded-2xl border border-surface-container-low border-dashed">
              <span className="material-symbols-outlined text-[48px] text-surface-container-highest mb-3 block">search_off</span>
              <p className="text-on-surface-variant">No se encontraron proyectos.</p>
            </div>
          ) : (
            filteredProjects.map(project => (
              <div key={project.id} className="bg-surface-container-lowest border border-surface-container-low rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-headline text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                      {project.name}
                    </h4>
                    {project.currentUserRole === 'OWNER' && (
                      <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container text-[10px] font-label font-bold">Propietario</span>
                    )}
                  </div>
                  <p className="text-sm text-on-surface-variant mb-3">{project.description || "Sin descripción"}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs font-label text-secondary">
                    <span className="flex items-center gap-1 bg-surface-container px-2 py-1 rounded-lg">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      Modificado: {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 bg-surface-container px-2 py-1 rounded-lg">
                      <span className="material-symbols-outlined text-[14px]">account_circle</span>
                      Propietario: {project.ownerUsername}
                    </span>
                  </div>
                </div>
                
                <button 
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-label font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0" 
                  type="button"
                  onClick={() => onConfigure(project)}
                >
                  <span className="material-symbols-outlined text-[18px]">settings</span>
                  {btnLabel}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
