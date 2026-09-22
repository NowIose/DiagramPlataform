import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import NotificationDropdown from './NotificationDropdown';
import EAModal from '../modals/EAModal';

export default function Header() {
  const { logout } = useAuth();
  const [isEAModalOpen, setIsEAModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-72 right-0 h-16 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)] z-40 flex items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <div className="relative w-96">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
            <input 
              className="w-full bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant text-xs rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary shadow-[0_1px_4px_rgba(0,0,0,0.02)] transition-all" 
              placeholder="Buscar diagramas, clases, tablas o microservicios (⌘K)..." 
              type="text" 
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsEAModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-high hover:bg-surface-dim text-primary text-xs font-semibold font-label transition-colors" 
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">sync_alt</span>
              <span>Importar / Exportar (EA)</span>
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-primary to-primary-container hover:opacity-95 text-on-primary text-xs font-semibold font-label shadow-[0_2px_8px_rgba(9,76,178,0.25)] transition-all" type="button">
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Nuevo Diagrama</span>
            </button>
          </div>
          
          <div className="h-4 w-[1px] bg-surface-container-highest mx-1"></div>
          
          <NotificationDropdown />
          
          <button onClick={logout} title="Cerrar sesión" className="w-8 h-8 rounded-full bg-primary hover:bg-primary-container transition-colors flex items-center justify-center cursor-pointer">
            <span className="material-symbols-outlined text-on-primary text-[18px]">logout</span>
          </button>
        </div>
      </header>
      <EAModal isOpen={isEAModalOpen} onClose={() => setIsEAModalOpen(false)} />
    </>
  );
}
