import { useState } from 'react';
import { useOnSelectionChange } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';

interface PropertiesPanelProps {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

export default function PropertiesPanel({ nodes, setNodes, edges, setEdges }: PropertiesPanelProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      setSelectedNodeId(nodes.length === 1 ? nodes[0].id : null);
      setSelectedEdgeId(edges.length === 1 ? edges[0].id : null);
    },
  });

  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;
  const selectedEdge = selectedEdgeId ? edges.find(e => e.id === selectedEdgeId) : null;

  const updateEdgeData = (key: string, value: any) => {
    setEdges((eds) => 
      eds.map((edge) => {
        if (edge.id === selectedEdge?.id) {
          return { ...edge, data: { ...edge.data, [key]: value } };
        }
        return edge;
      })
    );
  };

  if (!selectedNode && !selectedEdge) {
    return (
      <div className="w-64 shrink-0 bg-surface border-l border-surface-container-low flex flex-col z-10 shadow-sm hidden lg:flex h-full">
        <div className="p-3 border-b border-surface-container-lowest">
          <h4 className="text-xs font-label font-bold text-on-surface">Propiedades</h4>
        </div>
        <div className="p-4 text-center mt-10">
          <span className="material-symbols-outlined text-surface-container-highest text-[40px] mb-2">tune</span>
          <p className="text-xs text-on-surface-variant">Selecciona un elemento para editarlo</p>
        </div>
      </div>
    );
  }

  if (selectedEdge) {
    return (
      <div className="w-64 shrink-0 bg-surface border-l border-surface-container-low flex flex-col z-10 shadow-sm hidden lg:flex h-full overflow-y-auto">
        <div className="p-3 border-b border-surface-container-lowest sticky top-0 bg-surface z-10">
          <h4 className="text-xs font-label font-bold text-on-surface">Relación</h4>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Tipo de Relación</label>
            <select 
              value={(selectedEdge.data?.relationType as string) || 'umlAssociation'} 
              onChange={(e) => updateEdgeData('relationType', e.target.value)}
              className="w-full bg-surface-container-lowest text-xs text-on-surface p-2 rounded border border-surface-container-highest outline-none focus:border-primary transition-colors"
            >
              <option value="umlAssociation">Asociación</option>
              <option value="umlGeneralization">Herencia</option>
              <option value="umlRealization">Implementación</option>
              <option value="umlAggregation">Agregación</option>
              <option value="umlComposition">Composición</option>
              <option value="umlAssociationClass">Clase Intermedia</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Cardinalidad Origen</label>
            <select 
              value={(selectedEdge.data?.sourceMultiplicity as string) || ''} 
              onChange={(e) => updateEdgeData('sourceMultiplicity', e.target.value)}
              className="w-full bg-surface-container-lowest text-xs text-on-surface p-2 rounded border border-surface-container-highest outline-none focus:border-primary transition-colors"
            >
              <option value="">(Ninguna)</option>
              <option value="1">1 (Uno)</option>
              <option value="0..1">0..1 (Cero o uno)</option>
              <option value="*">* (Muchos)</option>
              <option value="0..*">0..* (Cero a muchos)</option>
              <option value="1..*">1..* (Uno a muchos)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Cardinalidad Destino</label>
            <select 
              value={(selectedEdge.data?.targetMultiplicity as string) || ''} 
              onChange={(e) => updateEdgeData('targetMultiplicity', e.target.value)}
              className="w-full bg-surface-container-lowest text-xs text-on-surface p-2 rounded border border-surface-container-highest outline-none focus:border-primary transition-colors"
            >
              <option value="">(Ninguna)</option>
              <option value="1">1 (Uno)</option>
              <option value="0..1">0..1 (Cero o uno)</option>
              <option value="*">* (Muchos)</option>
              <option value="0..*">0..* (Cero a muchos)</option>
              <option value="1..*">1..* (Uno a muchos)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Nombre / Rol</label>
            <input 
              type="text" 
              value={(selectedEdge.data?.roleName as string) || ''} 
              onChange={(e) => updateEdgeData('roleName', e.target.value)}
              placeholder="ej: tiene, administra"
              className="w-full bg-surface-container-lowest text-xs text-on-surface p-2 rounded border border-surface-container-highest outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>
    );
  }

  const { id, type, data } = selectedNode!;

  const updateData = (newData: Record<string, any>) => {
    setNodes((nds) => 
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );
  };

  if (type === 'umlNote' || type === 'umlComment') {
    return (
      <div className="w-64 shrink-0 bg-surface border-l border-surface-container-low flex flex-col z-10 shadow-sm hidden lg:flex h-full overflow-y-auto">
        <div className="p-3 border-b border-surface-container-lowest sticky top-0 bg-surface z-10 flex items-center justify-between">
          <h4 className="text-xs font-label font-bold text-on-surface">Propiedades</h4>
          <span className="text-[10px] font-mono bg-surface-container-highest text-on-surface-variant px-1 rounded">{type}</span>
        </div>
        
        <div className="p-4 flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Contenido</label>
            <textarea 
              value={(data.text as string) || ''} 
              onChange={(e) => updateData({ text: e.target.value })}
              className="w-full min-h-[150px] bg-surface-container-lowest text-xs text-on-surface p-2 rounded border border-surface-container-highest outline-none focus:border-primary transition-colors resize-y"
              placeholder="Escribe tu nota aquí..."
            />
          </div>
        </div>
      </div>
    );
  }

  const updateListItem = (listName: 'attributes' | 'methods', index: number, field: string, value: string) => {
    const list = Array.isArray(data[listName]) ? [...data[listName]] : [];
    list[index] = { ...list[index], [field]: value };
    updateData({ [listName]: list });
  };

  const addToList = (listName: 'attributes' | 'methods', defaultValue: any) => {
    const list = Array.isArray(data[listName]) ? [...data[listName]] : [];
    list.push(defaultValue);
    updateData({ [listName]: list });
  };

  const removeFromList = (listName: 'attributes' | 'methods', index: number) => {
    const list = Array.isArray(data[listName]) ? [...data[listName]] : [];
    list.splice(index, 1);
    updateData({ [listName]: list });
  };

  return (
    <div className="w-80 shrink-0 bg-surface border-l border-surface-container-low flex flex-col z-10 shadow-sm h-full overflow-y-auto">
      <div className="p-3 border-b border-surface-container-lowest bg-surface-container-lowest sticky top-0 z-20">
        <h4 className="text-xs font-label font-bold text-on-surface flex items-center justify-between">
          <span>Propiedades</span>
          <span className="text-[10px] font-mono text-primary bg-primary-container px-1.5 py-0.5 rounded">
            {type?.replace('uml', '')}
          </span>
        </h4>
      </div>

      <div className="p-4 flex flex-col gap-6">
        {/* Nombre */}
        <div>
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Nombre de la Clase</label>
          <input 
            type="text" 
            value={data.label as string} 
            onChange={(e) => updateData({ label: e.target.value })}
            className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-lg px-3 py-1.5 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>

        {/* Atributos */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Atributos</label>
            <button onClick={() => addToList('attributes', { visibility: '-', name: 'nuevoAtributo', type: 'String' })} className="text-primary hover:bg-surface-container-high p-1 rounded-md transition-colors flex items-center text-[10px] gap-1 font-semibold">
              <span className="material-symbols-outlined text-[14px]">add</span> Añadir
            </button>
          </div>
          
          <div className="flex flex-col gap-2">
            {(Array.isArray(data.attributes) ? data.attributes : []).map((attr: any, idx) => (
              <div key={idx} className="flex gap-1 items-center bg-surface-container-lowest p-1 rounded-md border border-surface-container-highest">
                {/* Visibilidad */}
                <select 
                  value={attr.visibility} 
                  onChange={(e) => updateListItem('attributes', idx, 'visibility', e.target.value)}
                  className="bg-transparent text-xs text-on-surface-variant outline-none font-mono cursor-pointer"
                  title="Visibilidad"
                >
                  <option value="-">- Privado</option>
                  <option value="+">+ Público</option>
                  <option value="#"># Protegido</option>
                  <option value="~">~ Paquete</option>
                </select>
                
                {/* Nombre */}
                <input 
                  type="text" 
                  value={attr.name} 
                  placeholder="nombre"
                  onChange={(e) => updateListItem('attributes', idx, 'name', e.target.value)}
                  className="w-20 flex-1 bg-transparent text-xs font-mono text-on-surface outline-none border-b border-transparent focus:border-primary"
                />
                <span className="text-on-surface-variant">:</span>
                
                {/* Tipo de Dato (Datalist) */}
                <input 
                  type="text" 
                  list="java-types"
                  value={attr.type} 
                  placeholder="String"
                  onChange={(e) => updateListItem('attributes', idx, 'type', e.target.value)}
                  className="w-16 flex-1 bg-transparent text-xs font-mono text-primary outline-none border-b border-transparent focus:border-primary"
                />
                
                <button onClick={() => removeFromList('attributes', idx)} className="text-error hover:bg-error-container p-1 rounded-md transition-colors shrink-0">
                  <span className="material-symbols-outlined text-[14px] block">close</span>
                </button>
              </div>
            ))}
            {(!Array.isArray(data.attributes) || data.attributes.length === 0) && (
              <p className="text-[10px] text-secondary italic text-center py-2">Sin atributos</p>
            )}
          </div>
        </div>

        {/* Métodos (Sólo si no es Enum) */}
        {type !== 'umlEnum' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Métodos</label>
              <button onClick={() => addToList('methods', { visibility: '+', name: 'nuevoMetodo()', returnType: 'void' })} className="text-primary hover:bg-surface-container-high p-1 rounded-md transition-colors flex items-center text-[10px] gap-1 font-semibold">
                <span className="material-symbols-outlined text-[14px]">add</span> Añadir
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {(Array.isArray(data.methods) ? data.methods : []).map((method: any, idx) => (
                <div key={idx} className="flex gap-1 items-center bg-surface-container-lowest p-1 rounded-md border border-surface-container-highest">
                  {/* Visibilidad */}
                  <select 
                    value={method.visibility} 
                    onChange={(e) => updateListItem('methods', idx, 'visibility', e.target.value)}
                    className="bg-transparent text-xs text-on-surface-variant outline-none font-mono cursor-pointer"
                  >
                    <option value="+">+ Público</option>
                    <option value="-">- Privado</option>
                    <option value="#"># Protegido</option>
                  </select>
                  
                  {/* Nombre */}
                  <input 
                    type="text" 
                    value={method.name} 
                    placeholder="metodo()"
                    onChange={(e) => updateListItem('methods', idx, 'name', e.target.value)}
                    className="w-20 flex-1 bg-transparent text-xs font-mono text-on-surface outline-none border-b border-transparent focus:border-primary"
                  />
                  <span className="text-on-surface-variant">:</span>
                  
                  {/* Tipo de Retorno */}
                  <input 
                    type="text" 
                    list="java-types"
                    value={method.returnType} 
                    placeholder="void"
                    onChange={(e) => updateListItem('methods', idx, 'returnType', e.target.value)}
                    className="w-16 flex-1 bg-transparent text-xs font-mono text-primary outline-none border-b border-transparent focus:border-primary"
                  />
                  
                  <button onClick={() => removeFromList('methods', idx)} className="text-error hover:bg-error-container p-1 rounded-md transition-colors shrink-0">
                    <span className="material-symbols-outlined text-[14px] block">close</span>
                  </button>
                </div>
              ))}
              {(!Array.isArray(data.methods) || data.methods.length === 0) && (
                <p className="text-[10px] text-secondary italic text-center py-2">Sin métodos</p>
              )}
            </div>
          </div>
        )}

      </div>
      
      {/* Datalist Reusable para autocompletado de Tipos Java */}
      <datalist id="java-types">
        <option value="String" />
        <option value="Long" />
        <option value="Integer" />
        <option value="Double" />
        <option value="Boolean" />
        <option value="Date" />
        <option value="LocalDateTime" />
        <option value="List<>" />
        <option value="void" />
      </datalist>
    </div>
  );
}
