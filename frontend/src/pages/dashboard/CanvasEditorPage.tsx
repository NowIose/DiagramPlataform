import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ReactFlowProvider, useReactFlow } from '@xyflow/react';
import EditorLayout from '../../components/editor/EditorLayout';
import Canvas from '../../components/editor/Canvas';
import ToastNotification from '../../components/dashboard/ToastNotification';
import ShareModal from '../../components/editor/ShareModal';
import axios from 'axios';

function EditorContent() {
  const { id } = useParams();
  const [isSaving, setIsSaving] = useState(false);
  const { toObject } = useReactFlow();
  
  const [toast, setToast] = useState({ isVisible: false, title: '', message: '', icon: 'info' });

  const showToast = (title: string, message: string, icon: string) => {
    setToast({ isVisible: true, title, message, icon });
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // standard beforeunload message
      e.returnValue = 'Si sales sin guardar se perdera el ultimo progreso';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleSave = async () => {
    if (projectData?.currentUserRole === 'VIEWER') {
      showToast('Modo Observador', 'No puedes editar o mover objetos, solo eres observador.', 'visibility');
      return;
    }

    if (!window.confirm("¿Estás seguro de guardar los cambios?")) {
      return;
    }

    setIsSaving(true);
    try {
      const flowData = toObject();
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      await axios.put(`${API_URL}/projects/${id}/diagram`, JSON.stringify(flowData), {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      showToast('Guardado', 'Diagrama guardado exitosamente', 'check_circle');
    } catch (error) {
      console.error(error);
      showToast('Error', 'No se pudo guardar el diagrama', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);

  useEffect(() => {
    // Optionally fetch basic project data here to know if it's already public
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
        const res = await axios.get(`${API_URL}/projects/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setProjectData(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchProject();
  }, [id]);

  return (
    <>
      <EditorLayout 
        projectId={id || 'desconocido'} 
        onSave={handleSave} 
        onShare={() => setIsShareModalOpen(true)} 
        isSaving={isSaving}
        projectData={projectData}
      >
        <Canvas projectId={id} currentUserRole={projectData?.currentUserRole} />
      </EditorLayout>
      <ToastNotification 
        title={toast.title}
        message={toast.message}
        icon={toast.icon}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({...prev, isVisible: false}))}
      />
      
      {isShareModalOpen && (
        <ShareModal 
          projectId={id!} 
          isOpen={isShareModalOpen} 
          onClose={() => setIsShareModalOpen(false)} 
          shareToken={projectData?.shareToken}
          isPublic={projectData?.public}
        />
      )}
    </>
  );
}

export default function CanvasEditorPage() {
  return (
    <ReactFlowProvider>
      <EditorContent />
    </ReactFlowProvider>
  );
}
