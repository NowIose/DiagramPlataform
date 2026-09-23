import ProjectGrid from '../../components/dashboard/ProjectGrid';

export default function ProjectsPage() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-headline font-bold text-on-surface">Proyectos & Diagramas</h2>
        <p className="text-on-surface-variant font-body text-sm mt-1">
          Crea y administra tus espacios de modelado UML y Base de Datos.
        </p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full">
        {/* We make ProjectGrid take the full width here by overriding col-span in ProjectGrid or wrapping it */}
        <div className="xl:col-span-12">
           <ProjectGrid />
        </div>
      </div>
    </div>
  );
}
