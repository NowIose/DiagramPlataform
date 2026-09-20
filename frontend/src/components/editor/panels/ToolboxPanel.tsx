interface ToolboxPanelProps {
  selectedEdgeType: string;
  setSelectedEdgeType: (type: string) => void;
}

export default function ToolboxPanel({ selectedEdgeType, setSelectedEdgeType }: ToolboxPanelProps) {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const getEdgeBtnClass = (type: string) => {
    return `p-2 border rounded-lg cursor-pointer transition-all flex flex-col items-center sm:items-start ${
      selectedEdgeType === type 
        ? 'bg-primary-container border-primary text-on-primary-container shadow-sm' 
        : 'bg-surface-container-lowest border-surface-container-highest text-on-surface-variant hover:border-primary'
    }`;
  };

  return (
    <div className="w-16 sm:w-64 shrink-0 bg-surface border-r border-surface-container-low flex flex-col z-10 shadow-sm h-full overflow-y-auto">
      <div className="p-3 border-b border-surface-container-lowest sticky top-0 bg-surface z-10">
        <h4 className="text-xs font-label font-bold text-on-surface hidden sm:block">Componentes (Arrastrar)</h4>
      </div>
      
      <div className="p-3 flex flex-col gap-3 border-b border-surface-container-low">
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
        </div>

        {/* Nota */}
        <div 
          className="p-3 bg-[#fff7d1] border border-[#f0e49e] rounded-lg cursor-grab hover:border-primary hover:shadow-sm transition-all flex flex-col items-center sm:items-start"
          onDragStart={(event) => onDragStart(event, 'umlNote')}
          draggable
        >
          <div className="flex items-center gap-2 mb-1 text-[#5c5633]">
            <span className="material-symbols-outlined text-[18px]">sticky_note_2</span>
            <span className="text-sm font-semibold hidden sm:block">Nota</span>
          </div>
        </div>

        {/* Comentario */}
        <div 
          className="p-3 bg-transparent border border-dashed border-surface-container-highest rounded-lg cursor-grab hover:border-primary hover:shadow-sm transition-all flex flex-col items-center sm:items-start"
          onDragStart={(event) => onDragStart(event, 'umlComment')}
          draggable
        >
          <div className="flex items-center gap-2 mb-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
            <span className="text-sm font-semibold hidden sm:block">Comentario</span>
          </div>
        </div>
      </div>

      <div className="p-3 border-b border-surface-container-lowest sticky top-0 bg-surface z-10">
        <h4 className="text-xs font-label font-bold text-on-surface hidden sm:block">Relaciones (Seleccionar)</h4>
      </div>
      
      <div className="p-3 flex flex-col gap-2 flex-1">
        
        <div className={getEdgeBtnClass('umlAssociation')} onClick={() => setSelectedEdgeType('umlAssociation')}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">horizontal_rule</span>
            <span className="text-xs font-semibold hidden sm:block">Asociación</span>
          </div>
        </div>

        <div className={getEdgeBtnClass('umlGeneralization')} onClick={() => setSelectedEdgeType('umlGeneralization')}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">account_tree</span>
            <span className="text-xs font-semibold hidden sm:block">Herencia</span>
          </div>
        </div>

        <div className={getEdgeBtnClass('umlRealization')} onClick={() => setSelectedEdgeType('umlRealization')}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">polyline</span>
            <span className="text-xs font-semibold hidden sm:block">Implementación</span>
          </div>
        </div>

        <div className={getEdgeBtnClass('umlAggregation')} onClick={() => setSelectedEdgeType('umlAggregation')}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">change_history</span>
            <span className="text-xs font-semibold hidden sm:block">Agregación</span>
          </div>
        </div>

        <div className={getEdgeBtnClass('umlComposition')} onClick={() => setSelectedEdgeType('umlComposition')}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">diamond</span>
            <span className="text-xs font-semibold hidden sm:block">Composición</span>
          </div>
        </div>

        <div className={getEdgeBtnClass('umlAssociationClass')} onClick={() => setSelectedEdgeType('umlAssociationClass')}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">join_inner</span>
            <span className="text-xs font-semibold hidden sm:block">Clase Intermedia</span>
          </div>
        </div>

      </div>
    </div>
  );
}
