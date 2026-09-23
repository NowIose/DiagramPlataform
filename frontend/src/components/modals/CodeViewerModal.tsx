import { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { Project } from '../../types/project.types';

interface CodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  files: Record<string, string>;
  projectName: string;
}

export default function CodeViewerModal({ isOpen, onClose, project, files, projectName }: CodeViewerModalProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const count = parseInt(localStorage.getItem('generationsCount') || '0', 10);
      localStorage.setItem('generationsCount', (count + 1).toString());
      // Trigger a storage event so other components (like MetricsSection) update immediately
      window.dispatchEvent(new Event('storage'));
    }
  }, [isOpen]);

  if (!isOpen || !project) return null;

  const fileKeys = Object.keys(files).sort();

  // Seleccionar el primer archivo automáticamente
  if (!selectedFile && fileKeys.length > 0) {
    setSelectedFile(fileKeys[0]);
  }

  const handleDownload = async () => {
    const zip = new JSZip();
    Object.entries(files).forEach(([path, content]) => {
      zip.file(path, content);
    });
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${projectName.replace(/[^a-zA-Z0-9]/g, '_')}_backend.zip`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/40 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-6xl h-[85vh] rounded-3xl shadow-xl border border-surface-container overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-container-low flex items-center justify-between bg-surface-container-lowest shrink-0">
          <div>
            <h2 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">code_blocks</span>
              Visualizador de Código Generado
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Revisa los archivos de tu backend antes de descargarlos.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content (Sidebar + Editor) */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* File Tree Sidebar */}
          <div className="w-80 bg-surface-container-lowest border-r border-surface-container-low flex flex-col shrink-0 overflow-y-auto p-4">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">Archivos Generados</h3>
            <div className="flex flex-col gap-1">
              {fileKeys.map(filePath => {
                const parts = filePath.split('/');
                const fileName = parts[parts.length - 1];
                const isJava = fileName.endsWith('.java') || fileName.endsWith('.dart');
                const isYml = fileName.endsWith('.yml') || fileName.endsWith('.xml') || fileName.endsWith('.json');
                const icon = isJava ? 'data_object' : isYml ? 'settings_applications' : 'description';
                
                return (
                  <button
                    key={filePath}
                    onClick={() => setSelectedFile(filePath)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                      selectedFile === filePath 
                        ? 'bg-primary-container text-on-primary-container font-semibold' 
                        : 'text-on-surface hover:bg-surface-container'
                    }`}
                    title={filePath}
                  >
                    <span className="material-symbols-outlined text-[18px] opacity-70">{icon}</span>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[10px] text-on-surface-variant/70 font-mono truncate">{filePath.replace('/' + fileName, '')}</span>
                      <span className="truncate">{fileName}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 bg-[#1e1e1e] flex flex-col overflow-hidden relative">
            <div className="bg-[#2d2d2d] text-gray-300 px-4 py-2 text-xs font-mono flex items-center gap-2 border-b border-[#404040]">
              <span className="material-symbols-outlined text-[16px]">terminal</span>
              {selectedFile}
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-[#d4d4d4] font-mono text-[13px] leading-relaxed">
                <code>{selectedFile ? files[selectedFile] : 'Selecciona un archivo'}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-surface-container-low bg-surface-container-lowest flex items-center justify-end shrink-0 gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-label font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors">
            Cerrar
          </button>
          <button 
            onClick={handleDownload}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-label font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Descargar ZIP Completo
          </button>
        </div>

      </div>
    </div>
  );
}
