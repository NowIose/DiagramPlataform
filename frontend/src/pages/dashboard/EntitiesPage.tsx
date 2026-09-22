import { useState } from 'react';
import GenerationProjectList from '../../components/dashboard/GenerationProjectList';
import GenerationConfigModal from '../../components/modals/GenerationConfigModal';
import CodeViewerModal from '../../components/modals/CodeViewerModal';
import type { Project } from '../../types/project.types';
import { ProjectService } from '../../services/project.service';
import { SqlGenerator } from '../../services/generators/sql.generator';

export default function EntitiesPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string> | null>(null);

  const handleConfigure = (project: Project) => {
    setSelectedProject(project);
  };

  const handleGenerate = async (config: any) => {
    if (!selectedProject) return;
    try {
      const fullProject = await ProjectService.getProjectById(selectedProject.id);
      const diagramData = fullProject.diagramData ? JSON.parse(fullProject.diagramData) : { nodes: [], edges: [] };
      
      const files = SqlGenerator.generateFiles(fullProject, diagramData.nodes || [], diagramData.edges || [], config);
      
      setGeneratedFiles(files);
      setSelectedProject(null); // Cerrar config modal
    } catch (error) {
      console.error("Error generating SQL:", error);
      alert("Error al generar el SQL. Asegúrate de tener elementos en tu diagrama.");
    }
  };

  return (
    <div className="h-full relative">
      <GenerationProjectList type="sql" onConfigure={handleConfigure} />
      <GenerationConfigModal 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
        project={selectedProject} 
        mode="sql"
        onGenerate={handleGenerate}
      />
      <CodeViewerModal
        isOpen={!!generatedFiles}
        onClose={() => setGeneratedFiles(null)}
        project={selectedProject || { name: 'db_script' } as any}
        files={generatedFiles || {}}
        projectName={'database_script'}
      />
    </div>
  );
}
