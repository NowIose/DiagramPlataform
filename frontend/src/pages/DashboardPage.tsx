import { useState } from 'react';
import MetricsSection from '../components/dashboard/MetricsSection';
import AIPromptBar from '../components/dashboard/AIPromptBar';
import ActivitySidebar from '../components/dashboard/ActivitySidebar';
import ToastNotification from '../components/dashboard/ToastNotification';

export default function DashboardPage() {
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
    <>
      <MetricsSection />
      <AIPromptBar onToast={showToast} />
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full mt-4">
        {/* Espacio reservado para futuros widgets (Ej: Gráficos de uso) */}
        <div className="xl:col-span-8 flex flex-col items-center justify-center bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-low p-8 text-center min-h-[400px]">
          <div className="w-16 h-16 bg-surface-container-high text-on-surface-variant rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[32px]">insights</span>
          </div>
          <h3 className="font-headline font-semibold text-on-surface text-lg">Resumen de Actividad</h3>
          <p className="text-sm text-on-surface-variant mt-2 max-w-md">
            Ve a la pestaña "Proyectos & Diagramas" en el menú lateral para gestionar tus modelos.
          </p>
        </div>
        <ActivitySidebar />
      </div>

      <ToastNotification 
        isVisible={toast.isVisible}
        title={toast.title}
        message={toast.message}
        icon={toast.icon}
        onClose={hideToast}
      />
    </>
  );
}
