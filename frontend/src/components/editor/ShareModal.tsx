import { useState, useEffect } from 'react';
import axios from 'axios';

interface UserSearchResult {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
  projectStatus?: string;
}

interface ShareModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  shareToken?: string;
  isPublic?: boolean;
}

export default function ShareModal({ projectId, isOpen, onClose, shareToken, isPublic = false }: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<'invite' | 'link'>('invite');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState('EDITOR');
  const [isSearching, setIsSearching] = useState(false);
  const [currentIsPublic, setCurrentIsPublic] = useState(isPublic);
  const [currentShareToken, setCurrentShareToken] = useState(shareToken);
  const [feedback, setFeedback] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setFeedback(null);
    }
  }, [isOpen]);

  // Búsqueda de usuarios con debounce
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
        const res = await axios.get(`${API_URL}/users/search?q=${searchQuery}&projectId=${projectId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setSearchResults(res.data);
      } catch (error) {
        console.error("Error buscando usuarios", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, projectId]);

  const handleInvite = async (username: string) => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      await axios.post(`${API_URL}/projects/${projectId}/collaborators`, {
        email: username, 
        role: selectedRole
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setFeedback({ msg: `Usuario ${username} invitado exitosamente`, type: 'success' });
      // Update the user's status locally
      setSearchResults(prev => prev.map(u => u.username === username ? { ...u, projectStatus: 'PENDING' } : u));
    } catch (error: any) {
      let errorMsg = 'Error al invitar usuario';
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (typeof error.response?.data === 'string') {
        errorMsg = error.response.data;
      }
      setFeedback({ msg: errorMsg, type: 'error' });
    }
  };

  const handleGenerateLink = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      const res = await axios.post(`${API_URL}/projects/${projectId}/share`, {
        isPublic: !currentIsPublic
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCurrentIsPublic(res.data.public);
      setCurrentShareToken(res.data.shareToken);
    } catch (error: any) {
      let errorMsg = 'Error actualizando enlace';
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (typeof error.response?.data === 'string') {
        errorMsg = error.response.data;
      }
      setFeedback({ msg: errorMsg, type: 'error' });
    }
  };

  const copyToClipboard = () => {
    if (currentShareToken) {
      const link = `${window.location.origin}/shared/${currentShareToken}`;
      navigator.clipboard.writeText(link);
      setFeedback({ msg: 'Enlace copiado al portapapeles', type: 'success' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Cabecera */}
        <div className="flex items-center justify-between p-4 border-b border-surface-container-high">
          <h2 className="font-headline font-semibold text-lg text-on-surface">Compartir Proyecto</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full p-1 transition-colors">
            <span className="material-symbols-outlined block">close</span>
          </button>
        </div>

        {/* Pestañas */}
        <div className="flex border-b border-surface-container-high px-4 gap-4">
          <button 
            className={`py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'invite' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
            onClick={() => setActiveTab('invite')}
          >
            Invitar por nombre
          </button>
          <button 
            className={`py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'link' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
            onClick={() => setActiveTab('link')}
          >
            Enlace público
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 min-h-[200px]">
          {feedback && (
            <div className={`p-3 mb-4 rounded-lg text-sm flex items-center gap-2 ${feedback.type === 'success' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'}`}>
              <span className="material-symbols-outlined text-[18px]">
                {feedback.type === 'success' ? 'check_circle' : 'error'}
              </span>
              {feedback.msg}
            </div>
          )}

          {activeTab === 'invite' && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 relative">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                  <input 
                    type="text" 
                    placeholder="Busca por nombre de usuario..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-surface-container text-sm text-on-surface rounded-lg border border-surface-container-highest focus:border-primary focus:outline-none transition-colors"
                  />
                  {isSearching && <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary animate-spin text-[16px]">sync</span>}
                </div>
                <select 
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="bg-surface-container border border-surface-container-highest text-on-surface text-sm rounded-lg px-2 py-2 focus:outline-none focus:border-primary"
                >
                  <option value="EDITOR">Puede editar</option>
                  <option value="VIEWER">Puede ver</option>
                </select>
              </div>

              {/* Lista de Resultados */}
              {searchResults.length > 0 && (
                <div className="flex flex-col border border-surface-container-highest rounded-lg overflow-hidden bg-surface-container-lowest max-h-48 overflow-y-auto">
                  {searchResults.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 border-b border-surface-container-highest last:border-0 hover:bg-surface-container-low transition-colors">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.username} className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-on-surface">{user.username}</span>
                          <span className="text-[10px] text-on-surface-variant">{user.email}</span>
                        </div>
                      </div>
                      
                      {user.projectStatus === 'OWNER' && <span className="text-[10px] font-bold text-tertiary bg-tertiary/10 px-2 py-1 rounded">Propietario</span>}
                      {user.projectStatus === 'COLLABORATOR' && <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded">Colaborador</span>}
                      {user.projectStatus === 'PENDING' && (
                        <button onClick={() => handleInvite(user.username)} className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-1 rounded hover:bg-secondary/20 transition-colors" title="Re-invitar">
                          Pendiente (Reenviar)
                        </button>
                      )}
                      {(!user.projectStatus || user.projectStatus === 'NONE') && (
                        <button 
                          onClick={() => handleInvite(user.username)}
                          className="text-xs font-semibold bg-primary text-on-primary px-3 py-1.5 rounded-full hover:bg-primary/90 transition-colors"
                        >
                          Invitar
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'link' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between bg-surface-container p-4 rounded-xl">
                <div>
                  <h4 className="font-semibold text-on-surface text-sm">Cualquiera con el enlace</h4>
                  <p className="text-xs text-on-surface-variant">Podrá visualizar el diagrama sin iniciar sesión</p>
                </div>
                <button 
                  onClick={handleGenerateLink}
                  className={`w-10 h-6 rounded-full relative transition-colors ${currentIsPublic ? 'bg-primary' : 'bg-surface-container-highest'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${currentIsPublic ? 'left-5' : 'left-1'}`} />
                </button>
              </div>

              {currentIsPublic && currentShareToken && (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={`${window.location.origin}/shared/${currentShareToken}`}
                    className="flex-1 bg-surface-container-lowest text-xs text-on-surface-variant p-2.5 rounded-lg border border-surface-container-highest outline-none"
                  />
                  <button 
                    onClick={copyToClipboard}
                    className="bg-surface-container-highest hover:bg-surface-container-high text-on-surface px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    Copiar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
