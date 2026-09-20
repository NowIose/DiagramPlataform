import { useState } from 'react';
import ProjectGrid from '../../components/dashboard/ProjectGrid';
import ToastNotification from '../../components/dashboard/ToastNotification';

export default function ProjectsPage() {
  const [toast, setToast] = useState({
    isVisible: false,
    title: '',
    message: '',
    icon: ''
  });

  const showToast = (title: string, message: string, icon: string = 'info') => {
    setToast({ isVisible: true, title, message, icon });
    setTimeout(() => {
      hideToast();
    }, 4000);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-headline font-bold text-on-surface">Proyectos & Diagramas</h2>
        <p className="text-on-surface-variant font-body text-sm mt-1">
          Crea y administra tus espacios de modelado UML y Base de Datos.
        </p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full">
        {/* We make ProjectGrid take the full width here by overriding col-span in ProjectGrid or wrapping it */}
        <div className="xl:col-span-12">
           <ProjectGrid onToast={showToast} />
        </div>
      </div>

      <ToastNotification 
        isVisible={toast.isVisible}
        title={toast.title}
        message={toast.message}
        icon={toast.icon}
        onClose={hideToast}
      />
    </div>
  );
}
