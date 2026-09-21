import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface EditorLayoutProps {
  projectId: string;
  children: ReactNode;
  onSave: () => void;
  onShare: () => void;
  isSaving: boolean;
  projectData?: any;
}

export default function EditorLayout({ projectId, children, onSave, onShare, isSaving, projectData }: EditorLayoutProps) {
  const navigate = useNavigate();

  const isViewer = projectData?.currentUserRole === 'VIEWER';

  return (
    <div className="flex flex-col h-screen w-screen bg-surface-container-lowest overflow-hidden">
      {/* Barra superior */}
      <div className="h-14 shrink-0 border-b border-surface-container-low bg-surface px-4 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard/projects')}
            className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors"
            title="Volver al Dashboard"
          >
            <span className="material-symbols-outlined text-[20px] block">arrow_back</span>
          </button>
          <div className="h-4 w-[1px] bg-surface-container-highest"></div>
          <div>
            <h3 className="font-headline font-semibold text-sm text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-primary">account_tree</span>
              {projectData?.name || `Proyecto ID: ${projectId}`}
            </h3>
            <p className="text-[10px] text-secondary">
              {isViewer ? 'Solo lectura' : 'React Flow Editor'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Avatares de Colaboradores */}
          {projectData?.collaborators && projectData.collaborators.length > 0 && (
            <div className="flex items-center -space-x-2 mr-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px] border-2 border-surface" title={`Propietario: ${projectData.ownerUsername}`}>
                {projectData.ownerUsername.charAt(0).toUpperCase()}
              </div>
              {projectData.collaborators.map((c: any) => (
                <div key={c.userId} className="w-6 h-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold text-[10px] border-2 border-surface relative group" title={`${c.username} (${c.role})`}>
                  {c.avatarUrl ? (
                    <img src={c.avatarUrl} alt={c.username} className="w-full h-full rounded-full" />
                  ) : (
                    c.username.charAt(0).toUpperCase()
                  )}
                </div>
              ))}
            </div>
          )}

          {!isViewer && (
            <button 
              onClick={onShare}
              className="px-3 py-1.5 rounded-lg bg-tertiary/10 hover:bg-tertiary/20 text-tertiary text-xs font-label font-semibold flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">group_add</span>
              Compartir
            </button>
          )}
          
          {!isViewer && (
            <button 
              onClick={onSave}
              disabled={isSaving}
              className={`px-3 py-1.5 rounded-lg text-xs font-label font-semibold flex items-center gap-1 transition-all ${
                isSaving 
                  ? 'bg-surface-container text-on-surface-variant cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container shadow-[0_2px_8px_rgba(9,76,178,0.25)]'
              }`}
            >
              <span className={`material-symbols-outlined text-[16px] ${isSaving ? 'animate-spin' : ''}`}>
                {isSaving ? 'sync' : 'save'}
              </span>
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>
          )}
        </div>
      </div>

      {/* Contenedor central */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Lienzo central (React Flow y sus paneles) */}
        <div className="flex-1 bg-surface-container-lowest relative">
          {children}
        </div>
      </div>
    </div>
  );
}
