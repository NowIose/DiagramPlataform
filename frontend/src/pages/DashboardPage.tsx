import { useState } from 'react';
import MetricsSection from '../components/dashboard/MetricsSection';
import AIPromptBar from '../components/dashboard/AIPromptBar';
import ProjectGrid from '../components/dashboard/ProjectGrid';
import ActivitySidebar from '../components/dashboard/ActivitySidebar';
import ToastNotification from '../components/dashboard/ToastNotification';

export default function DashboardPage() {
  const [toast, setToast] = useState({ isVisible: false, title: '', message: '', icon: '' });

  const showToast = (title: string, message: string, icon: string = 'check_circle') => {
    setToast({ isVisible: true, title, message, icon });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <>
      <MetricsSection />
      <AIPromptBar onToast={showToast} />
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full">
        <ProjectGrid onToast={showToast} />
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
