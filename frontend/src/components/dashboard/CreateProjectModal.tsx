import { useState } from 'react';
import { ProjectService } from '../../services/project.service';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await ProjectService.createProject({
        name: name.trim(),
        description: description.trim()
      });
      
      setName('');
      setDescription('');
      onSuccess(); // Refreshes grid and closes modal
    } catch (error) {
      console.error(error);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div 
        className="bg-surface-container-lowest w-full max-w-md rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="px-6 py-5 border-b border-surface-container-low flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">account_tree</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-on-surface text-lg">Nuevo Proyecto</h3>
              <p className="text-[11px] font-label text-secondary">Diseño UML o Relacional</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="projectName" className="block text-xs font-label font-bold text-on-surface mb-1.5 uppercase tracking-wider">
                Nombre del Proyecto <span className="text-error">*</span>
              </label>
              <input
                id="projectName"
                type="text"
                autoFocus
                placeholder="Ej. Sistema de E-Commerce"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-container text-on-surface text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant/50"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="projectDesc" className="block text-xs font-label font-bold text-on-surface mb-1.5 uppercase tracking-wider">
                Descripción (Opcional)
              </label>
              <textarea
                id="projectDesc"
                placeholder="Breve detalle sobre la arquitectura o propósito..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-surface-container text-on-surface text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant/50 resize-none"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-label font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-label font-semibold bg-primary text-on-primary hover:bg-primary/90 shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                  Creando...
                </>
              ) : (
                'Crear Proyecto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
