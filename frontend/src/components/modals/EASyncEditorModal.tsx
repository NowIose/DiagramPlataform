import React, { useRef, useState } from 'react';
import { XmiService } from '../../services/xmi.service';
import { EADiffService } from '../../services/ea-diff.service';
import type { EADiffChange }  from '../../services/ea-diff.service';

interface EASyncEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  localNodes: any[];
  localEdges: any[];
  onApplyChanges: (nodes: any[], edges: any[]) => void;
  projectName: string;
}

export default function EASyncEditorModal({ isOpen, onClose, localNodes, localEdges, onApplyChanges, projectName }: EASyncEditorModalProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [changes, setChanges] = useState<EADiffChange[]>([]);
  const [remoteEdgesState, setRemoteEdgesState] = useState<any[]>([]);
  const [showDiff, setShowDiff] = useState(false);

  if (!isOpen) return null;

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const text = await file.text();
      const diagramData = XmiService.importFromXMI(text);
      
      const diffs = EADiffService.compareDiagrams(localNodes, localEdges, diagramData.nodes, diagramData.edges);
      
      setRemoteEdgesState(diagramData.edges);
      setChanges(diffs);
      setShowDiff(true);
      
    } catch (error) {
      console.error("Error comparando XMI:", error);
      alert("Hubo un error al procesar el archivo XMI.");
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleExport = () => {
    try {
      const xmiString = XmiService.exportToXMI(localNodes, localEdges);
      const blob = new Blob([xmiString], { type: "text/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName.replace(/\\s+/g, '_')}_EA.xmi`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exportando:", error);
      alert("No se pudo exportar el diagrama.");
    }
  };

  const toggleChange = (index: number) => {
    const newChanges = [...changes];
    newChanges[index].selected = !newChanges[index].selected;
    setChanges(newChanges);
  };

  const applyMerge = () => {
    const { newNodes, newEdges } = EADiffService.applyChanges(localNodes, localEdges, remoteEdgesState, changes);
    onApplyChanges(newNodes, newEdges);
    setShowDiff(false);
    onClose();
  };

  const cancelMerge = () => {
    setShowDiff(false);
    setChanges([]);
    setRemoteEdgesState([]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface w-full max-w-2xl rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Cabecera */}
        <div className="p-4 border-b border-surface-container-highest flex items-center justify-between bg-surface-container-lowest">
          <h2 className="font-headline font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">sync_alt</span>
            Sincronización Inteligente EA
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {!showDiff ? (
          <>
            {/* Pestañas (Modo Inicial) */}
            <div className="flex border-b border-surface-container-highest">
              <button onClick={() => setActiveTab('import')} className={`flex-1 py-3 text-xs font-bold transition-colors ${activeTab === 'import' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:bg-surface-container-lowest'}`}>
                Importar y Fusionar (Merge)
              </button>
              <button onClick={() => setActiveTab('export')} className={`flex-1 py-3 text-xs font-bold transition-colors ${activeTab === 'export' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:bg-surface-container-lowest'}`}>
                Exportar (De aquí a EA)
              </button>
            </div>

            <div className="p-6 bg-surface-container-lowest min-h-[250px]">
              {activeTab === 'import' && (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <span className="material-symbols-outlined text-[48px] text-primary/50">call_merge</span>
                  <div>
                    <p className="text-sm font-semibold text-on-surface mb-1">Importar y Sincronizar Cambios</p>
                    <p className="text-xs text-on-surface-variant max-w-[350px] mx-auto">Selecciona un archivo .xmi. El sistema comparará el archivo con tu lienzo actual y te permitirá aceptar o rechazar los cambios individualmente.</p>
                  </div>
                  <input type="file" accept=".xml,.xmi" ref={fileInputRef} onChange={handleImport} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="mt-2 px-6 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-colors disabled:opacity-50">
                    {isLoading ? 'Analizando diferencias...' : 'Seleccionar Archivo XMI'}
                  </button>
                </div>
              )}

              {activeTab === 'export' && (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <span className="material-symbols-outlined text-[48px] text-primary/50">ios_share</span>
                  <div>
                    <p className="text-sm font-semibold text-on-surface mb-1">Exportar Diagrama Actual</p>
                    <p className="text-xs text-on-surface-variant max-w-[300px] mx-auto">Descarga tu diagrama actual en formato XMI para abrirlo en Enterprise Architect.</p>
                  </div>
                  <button onClick={handleExport} className="mt-2 px-6 py-2.5 bg-secondary text-on-secondary font-bold text-xs rounded-xl hover:bg-secondary-container hover:text-on-secondary-container transition-colors">
                    Descargar XMI
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-6 bg-surface-container-lowest flex flex-col max-h-[70vh]">
            <h3 className="text-lg font-bold mb-2">Advertencias y Revisión de Cambios</h3>
            <p className="text-sm text-on-surface-variant mb-4">Revisa las diferencias encontradas entre tu diagrama actual y el archivo importado. Desmarca lo que no desees aplicar.</p>
            
            <div className="flex-1 overflow-y-auto border border-surface-container-high rounded-xl p-2 bg-surface">
              {changes.length === 0 ? (
                <p className="p-4 text-center text-sm text-on-surface-variant">No se encontraron diferencias. Los diagramas son idénticos.</p>
              ) : (
                changes.map((change, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 hover:bg-surface-container-lowest border-b border-surface-container-highest last:border-0 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={change.selected} 
                      onChange={() => toggleChange(idx)} 
                      className="mt-1 w-4 h-4 cursor-pointer accent-primary"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        {change.type === 'ADD' && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded">NUEVA CLASE</span>}
                        {change.type === 'MODIFY' && <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded">MODIFICACIÓN</span>}
                        {change.type === 'DELETE' && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded">ELIMINAR</span>}
                        <span className="font-bold text-sm">{change.nodeName}</span>
                      </div>
                      <div className="mt-1 flex flex-col gap-1">
                        {change.changesDetail?.map((detail, dIdx) => (
                          <span key={dIdx} className="text-xs text-on-surface-variant font-mono">- {detail}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={cancelMerge} className="px-5 py-2.5 rounded-xl font-label font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors">
                Cancelar
              </button>
              <button 
                onClick={applyMerge}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-label font-bold shadow-xs transition-colors"
              >
                Inyectar Cambios Aprobados
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

