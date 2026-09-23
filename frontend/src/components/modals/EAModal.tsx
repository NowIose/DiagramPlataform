import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { XmiService } from '../../services/xmi.service';

interface EAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EAModal({ isOpen, onClose }: EAModalProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Cargar proyectos para la pestaña de exportar
  useEffect(() => {
    if (isOpen && activeTab === 'export') {
      fetchProjects();
    }
  }, [isOpen, activeTab]);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
      const res = await axios.get(`${API_URL}/projects`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (e) {
      console.error("Error cargando proyectos:", e);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const text = await file.text();
      // 1. Convertir XMI a formato de React Flow
      const diagramData = XmiService.importFromXMI(text);
      
      // 2. Crear un nuevo proyecto en el backend con este diagrama
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
      
      const newProjectData = {
        name: file.name.replace('.xml', '').replace('.xmi', '') || 'Diagrama Importado',
        description: 'Importado desde Enterprise Architect',
        public: false
      };

      const res = await axios.post(`${API_URL}/projects`, newProjectData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const projectId = res.data.id;

      // 3. Guardar el diagrama en el nuevo proyecto
      const flowObject = { nodes: diagramData.nodes, edges: diagramData.edges, viewport: { x: 0, y: 0, zoom: 1 } };
      await axios.put(`${API_URL}/projects/${projectId}/diagram`, flowObject, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // 4. Redirigir al editor
      onClose();
      navigate(`/editor/${projectId}`);
      
    } catch (error) {
      console.error("Error importando:", error);
      alert("Hubo un error al procesar el archivo XMI.");
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleExport = async (projectId: string, projectName: string) => {
    try {
      // 1. Obtener diagrama
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
      const res = await axios.get(`${API_URL}/projects/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      let diagramData = { nodes: [], edges: [] };
      if (res.data.diagramData) {
        diagramData = typeof res.data.diagramData === 'string' ? JSON.parse(res.data.diagramData) : res.data.diagramData;
      }

      // 2. Convertir a XMI
      const xmiString = XmiService.exportToXMI(diagramData.nodes || [], diagramData.edges || []);

      // 3. Descargar archivo
      const blob = new Blob([xmiString], { type: "text/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName.replace(/\s+/g, '_')}_EA.xmi`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Error exportando:", error);
      alert("No se pudo exportar el proyecto.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Cabecera */}
        <div className="p-4 border-b border-surface-container-highest flex items-center justify-between bg-surface-container-lowest">
          <h2 className="font-headline font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">sync_alt</span>
            Integración Enterprise Architect
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Pestañas */}
        <div className="flex border-b border-surface-container-highest">
          <button onClick={() => setActiveTab('import')} className={`flex-1 py-3 text-xs font-bold transition-colors ${activeTab === 'import' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:bg-surface-container-lowest'}`}>
            Importar (EA hacia aquí)
          </button>
          <button onClick={() => setActiveTab('export')} className={`flex-1 py-3 text-xs font-bold transition-colors ${activeTab === 'export' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:bg-surface-container-lowest'}`}>
            Exportar (De aquí a EA)
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 bg-surface-container-lowest min-h-[250px]">
          {activeTab === 'import' && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <span className="material-symbols-outlined text-[48px] text-primary/50">upload_file</span>
              <div>
                <p className="text-sm font-semibold text-on-surface mb-1">Importar archivo XMI/XML</p>
                <p className="text-xs text-on-surface-variant max-w-[250px] mx-auto">Selecciona un archivo exportado desde Enterprise Architect para crear un nuevo diagrama.</p>
              </div>
              <input type="file" accept=".xml,.xmi" ref={fileInputRef} onChange={handleImport} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="mt-2 px-6 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-colors disabled:opacity-50">
                {isLoading ? 'Procesando...' : 'Seleccionar Archivo'}
              </button>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="flex flex-col h-full">
              <p className="text-xs text-on-surface-variant mb-4">Selecciona uno de tus proyectos para descargarlo en formato compatible con Enterprise Architect (XMI).</p>
              <div className="flex-1 overflow-y-auto max-h-[200px] flex flex-col gap-2 border border-surface-container-highest rounded-lg p-2 bg-surface">
                {projects.length === 0 ? (
                  <p className="text-xs text-center p-4 text-on-surface-variant">No tienes proyectos disponibles.</p>
                ) : (
                  projects.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2 hover:bg-surface-container-lowest rounded-md transition-colors border border-transparent hover:border-surface-container-highest">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="material-symbols-outlined text-primary text-[18px]">account_tree</span>
                        <span className="text-xs font-semibold truncate">{p.name}</span>
                      </div>
                      <button onClick={() => handleExport(p.id, p.name)} className="p-1.5 bg-secondary-container text-on-secondary-container rounded-lg hover:opacity-80 transition-opacity" title="Descargar XMI">
                        <span className="material-symbols-outlined text-[16px] block">download</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
