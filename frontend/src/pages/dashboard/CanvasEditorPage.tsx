import { useParams } from 'react-router-dom';
import { useState } from 'react';
import EditorLayout from '../../components/editor/EditorLayout';
import Canvas from '../../components/editor/Canvas';

export default function CanvasEditorPage() {
  const { id } = useParams();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // TODO: Obtener el estado real de React Flow y guardar en backend.
    setTimeout(() => {
      setIsSaving(false);
      alert('Guardado simulado con éxito');
    }, 1000);
  };

  return (
    <EditorLayout projectId={id || 'desconocido'} onSave={handleSave} isSaving={isSaving}>
      <Canvas />
    </EditorLayout>
  );
}
