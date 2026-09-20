export default function EntitiesPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-low p-8 text-center">
      <div className="w-20 h-20 bg-primary-container text-on-primary-container rounded-3xl flex items-center justify-center mb-6 shadow-sm">
        <span className="material-symbols-outlined text-[40px]">database</span>
      </div>
      <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">Entidades & Modelos</h2>
      <p className="text-on-surface-variant font-body max-w-md">
        Próximamente: Aquí podrás gestionar globalmente todas las entidades de tus proyectos, ver relaciones huérfanas y diccionarios de datos.
      </p>
    </div>
  );
}
