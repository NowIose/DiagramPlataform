export default function ToolboxPanel() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-16 sm:w-64 shrink-0 bg-surface border-r border-surface-container-low flex flex-col z-10 shadow-sm h-full">
      <div className="p-3 border-b border-surface-container-lowest">
        <h4 className="text-xs font-label font-bold text-on-surface hidden sm:block">Herramientas UML</h4>
      </div>
      <div className="p-3 flex-1 overflow-y-auto flex flex-col gap-3">
        
        {/* Clase */}
        <div 
          className="p-3 bg-surface-container-lowest border border-surface-container-highest rounded-lg cursor-grab hover:border-primary hover:shadow-sm transition-all flex flex-col items-center sm:items-start"
          onDragStart={(event) => onDragStart(event, 'umlClass')}
          draggable
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[18px] text-primary">data_object</span>
            <span className="text-sm font-semibold text-on-surface hidden sm:block">Clase (Entity)</span>
          </div>
          <p className="text-[10px] text-on-surface-variant hidden sm:block leading-tight">
            Modelo base con atributos y métodos.
          </p>
        </div>

        {/* Interfaz */}
        <div 
          className="p-3 bg-surface-container-lowest border border-surface-container-highest rounded-lg cursor-grab hover:border-primary hover:shadow-sm transition-all flex flex-col items-center sm:items-start"
          onDragStart={(event) => onDragStart(event, 'umlInterface')}
          draggable
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[18px] text-tertiary">code_blocks</span>
            <span className="text-sm font-semibold text-on-surface hidden sm:block">Interfaz</span>
          </div>
          <p className="text-[10px] text-on-surface-variant hidden sm:block leading-tight">
            Para repositorios y servicios.
          </p>
        </div>

        {/* Enum */}
        <div 
          className="p-3 bg-surface-container-lowest border border-surface-container-highest rounded-lg cursor-grab hover:border-primary hover:shadow-sm transition-all flex flex-col items-center sm:items-start"
          onDragStart={(event) => onDragStart(event, 'umlEnum')}
          draggable
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[18px] text-secondary">list_alt</span>
            <span className="text-sm font-semibold text-on-surface hidden sm:block">Enum</span>
          </div>
          <p className="text-[10px] text-on-surface-variant hidden sm:block leading-tight">
            Valores constantes predefinidos.
          </p>
        </div>

      </div>
    </div>
  );
}
