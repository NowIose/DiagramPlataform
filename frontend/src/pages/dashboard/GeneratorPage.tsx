import { useState } from 'react';
import GenerationProjectList from '../../components/dashboard/GenerationProjectList';
import GenerationConfigModal from '../../components/modals/GenerationConfigModal';
import CodeViewerModal from '../../components/modals/CodeViewerModal';
import type { Project } from '../../types/project.types';
import { ProjectService } from '../../services/project.service';
import { SpringBootGenerator } from '../../services/generators/springboot.generator';

export default function GeneratorPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string> | null>(null);
  const [projectConfig, setProjectConfig] = useState<any>(null);

  const handleConfigure = (project: Project) => {
    setSelectedProject(project);
  };

  const handleGenerate = async (config: any) => {
    if (!selectedProject) return;
    try {
      const fullProject = await ProjectService.getProjectById(selectedProject.id);
      const diagramData = fullProject.diagramData ? JSON.parse(fullProject.diagramData) : { nodes: [], edges: [] };
      
      const files = SpringBootGenerator.generateFiles(fullProject, diagramData.nodes || [], diagramData.edges || [], config);
      
      setProjectConfig(config);
      setGeneratedFiles(files);
      setSelectedProject(null); // Cerrar config modal
    } catch (error) {
      console.error("Error generating Spring Boot:", error);
      alert("Error al generar el backend. Asegúrate de tener elementos en tu diagrama.");
    }
  };

  return (
    <div className="h-full relative">
      <GenerationProjectList type="springboot" onConfigure={handleConfigure} />
      <GenerationConfigModal 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
        project={selectedProject} 
        mode="springboot"
        onGenerate={handleGenerate}
      />
      <CodeViewerModal
        isOpen={!!generatedFiles}
        onClose={() => setGeneratedFiles(null)}
        project={selectedProject || { name: projectConfig?.artifactId || 'backend' } as any}
        files={generatedFiles || {}}
        projectName={projectConfig?.artifactId || 'backend'}
      />
    </div>
  );
}
