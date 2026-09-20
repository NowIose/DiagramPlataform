import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import ToolboxPanel from './panels/ToolboxPanel';

interface EditorLayoutProps {
  projectId: string;
  children: ReactNode;
  onSave: () => void;
  isSaving: boolean;
}

export default function EditorLayout({ projectId, children, onSave, isSaving }: EditorLayoutProps) {
  const navigate = useNavigate();

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
              Proyecto ID: {projectId}
            </h3>
            <p className="text-[10px] text-secondary">React Flow Editor</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={onSave}
            disabled={isSaving}
            className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary text-xs font-label font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[14px]">save</span> 
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Contenedor central */}
      <div className="flex-1 flex overflow-hidden relative">
        <ToolboxPanel />

        {/* Lienzo central (React Flow) */}
        <div className="flex-1 bg-surface-container-lowest relative">
          {children}
        </div>
      </div>
    </div>
  );
}
