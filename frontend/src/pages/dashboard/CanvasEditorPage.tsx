import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ReactFlowProvider, useReactFlow } from '@xyflow/react';
import EditorLayout from '../../components/editor/EditorLayout';
import Canvas from '../../components/editor/Canvas';
import ToastNotification from '../../components/dashboard/ToastNotification';
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
    if (!window.confirm("¿Estás seguro de guardar los cambios?")) {
      return;
    }

    setIsSaving(true);
    try {
      const flowData = toObject();
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/projects/${id}/diagram`, JSON.stringify(flowData), {
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

  return (
    <>
      <EditorLayout projectId={id || 'desconocido'} onSave={handleSave} isSaving={isSaving}>
        <Canvas projectId={id} />
      </EditorLayout>
      <ToastNotification 
        title={toast.title}
        message={toast.message}
        icon={toast.icon}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({...prev, isVisible: false}))}
      />
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
