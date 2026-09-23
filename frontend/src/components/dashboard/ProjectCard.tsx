import { useNavigate } from 'react-router-dom';

export interface ProjectCardProps {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  tagText: string;
  tagClass: string;
  entitiesTitle: string;
  entities: string[];
  metaTags: { icon: string; text: string }[];
  collaborators: { init: string; color: string }[];
}

export default function ProjectCard({
  id, title, subtitle, icon, tagText, tagClass, entitiesTitle, entities, metaTags, collaborators
}: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <div className="project-card bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden">
      {tagText.includes('En vivo') && (
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-primary to-primary-container"></div>
      )}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-surface-container text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
            </span>
            <div>
              <h4 className="font-headline text-base font-semibold text-on-surface group-hover:text-primary transition-colors">
                {title}
              </h4>
              <p className="text-[11px] font-label text-secondary">{subtitle}</p>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-label font-bold flex items-center gap-1 ${tagClass}`}>
            {tagText.includes('En vivo') && <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span>}
            {tagText.replace('En vivo', ' En vivo')}
          </span>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-surface-container-low">
          <span className="text-[10px] font-label text-secondary uppercase font-bold tracking-wider block mb-2">{entitiesTitle}</span>
          <div className="flex flex-wrap gap-1.5">
            {entities.map((ent, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-surface-container-lowest text-[11px] font-mono text-primary shadow-sm">{ent}</span>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 items-center text-xs">
          {metaTags.map((meta, i) => (
            <span key={i} className="text-on-surface-variant flex items-center gap-1 text-[11px]">
              <span className="material-symbols-outlined text-[14px] text-primary">{meta.icon}</span> {meta.text}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-4 flex items-center justify-between border-t-0 bg-surface-container-low/40 -mx-5 -mb-5 px-5 py-3 rounded-b-2xl">
        <div className="flex items-center -space-x-1.5">
          {collaborators.map((col, i) => (
            <div key={i} className={`w-6 h-6 rounded-full ${col.color} text-[10px] flex items-center justify-center font-bold`}>{col.init}</div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-dim text-primary text-xs font-label font-semibold flex items-center gap-1 transition-colors cursor-pointer" 
            type="button"
            onClick={() => navigate(`/dashboard/projects/${id}/editor`)}
          >
            <span className="material-symbols-outlined text-[14px]">draw</span> Abrir Lienzo
          </button>
          <button 
            className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-label font-semibold flex items-center gap-1 shadow-xs transition-colors cursor-pointer" 
            type="button"
            onClick={() => navigate('/dashboard/entities', { state: { projectIdToGenerate: id } })}
          >
            <span className="material-symbols-outlined text-[14px]">code</span> Generar
          </button>
        </div>
      </div>
    </div>
  );
}
