import { useState, useEffect } from 'react';
import { ProjectService } from '../../services/project.service';
import type { Project } from '../../types/project.types';
import ShareModal from '../../components/editor/ShareModal';

export default function CollaboratorsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [projectToInvite, setProjectToInvite] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const data = await ProjectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects for collaborators:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'OWNER': return 'Propietario';
      case 'EDITOR': return 'Editor';
      case 'VIEWER': return 'Lector';
      default: return role;
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'OWNER': return 'bg-primary-container text-on-primary-container';
      case 'EDITOR': return 'bg-tertiary-container text-on-tertiary-container';
      case 'VIEWER': return 'bg-surface-container-high text-on-surface';
      default: return 'bg-surface-container text-on-surface';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-headline font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">group</span>
          Colaboradores & Permisos
        </h2>
        <p className="text-on-surface-variant font-body text-sm mt-1">
          Administra el acceso a tus proyectos y visualiza los miembros de tu equipo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-surface-container-lowest rounded-2xl">
            <p className="text-on-surface-variant">No tienes proyectos activos aún.</p>
          </div>
        ) : (
          projects.map(project => {
            // Unificamos el propietario con la lista de colaboradores para listarlos juntos
            const allMembers: { userId: number; username: string; role: string }[] = [];
            
            // Propietario siempre primero
            allMembers.push({
              userId: project.ownerId || -1,
              username: project.ownerUsername || 'Propietario Desconocido',
              role: 'OWNER'
            });

            // Agregamos el resto de colaboradores
            if (project.collaborators) {
              project.collaborators.forEach(c => {
                if (c.username !== project.ownerUsername) {
                   allMembers.push({
                     userId: c.userId,
                     username: c.username,
                     role: c.role
                   });
                }
              });
            }

            return (
              <div key={project.id} className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-surface-container-low flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-5 border-b border-surface-container-low pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-2xl">folder_shared</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline font-bold text-on-surface truncate text-lg">{project.name}</h3>
                    <p className="text-xs text-on-surface-variant truncate mt-0.5">{project.description || 'Sin descripción'}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <h4 className="text-[10px] font-label font-bold text-secondary uppercase tracking-wider mb-3">Miembros del equipo ({allMembers.length})</h4>
                  <div className="max-h-[220px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                    {allMembers.map((member, index) => (
                      <div key={member.userId + '-' + index} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container-low transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full font-bold text-[11px] flex items-center justify-center ${member.role === 'OWNER' ? 'bg-primary text-on-primary' : 'bg-secondary-container text-on-secondary-container'}`}>
                            {member.username.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-on-surface">{member.username}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-label font-bold px-3 py-1 rounded-full ${getRoleBadgeClass(member.role)}`}>
                          {getRoleLabel(member.role)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {project.currentUserRole === 'OWNER' && (
                  <div className="mt-5 pt-4 border-t border-surface-container-low">
                    <button 
                      onClick={() => {
                        setProjectToInvite(project);
                        setIsInviteModalOpen(true);
                      }}
                      className="w-full py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-primary text-sm font-label font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">person_add</span>
                      Invitar Colaborador
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {projectToInvite && (
        <ShareModal 
          isOpen={isInviteModalOpen}
          onClose={() => {
            setIsInviteModalOpen(false);
            loadProjects();
          }}
          projectId={projectToInvite.id.toString()}
          shareToken={projectToInvite.shareToken}
          isPublic={projectToInvite.public}
        />
      )}
    </div>
  );
}
