import { useState } from 'react';
import MetricsSection from '../components/dashboard/MetricsSection';

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
      {/* Se removieron AIPromptBar y ActivitySidebar a petición del usuario ya que no habrá bitácora por el momento */}

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
