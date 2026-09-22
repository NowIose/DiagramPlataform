import React, { useState } from 'react';
import type { Node, Edge } from '@xyflow/react';
import PropertiesPanel from './PropertiesPanel';
import AIChatPanel from './AIChatPanel';

interface RightSidebarProps {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

export default function RightSidebar(props: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<'properties' | 'chat'>('properties');

  return (
    <div className="w-80 shrink-0 bg-surface border-l border-surface-container-low flex flex-col z-10 shadow-sm h-full overflow-hidden hidden lg:flex">
      {/* Pestañas (Tabs) superiores */}
      <div className="flex border-b border-surface-container-low bg-surface-container-lowest shrink-0">
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex-1 py-2 text-xs font-label font-bold border-b-2 transition-colors ${
            activeTab === 'properties'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          Propiedades
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 text-xs font-label font-bold border-b-2 transition-colors flex items-center justify-center gap-1 ${
            activeTab === 'chat'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">smart_toy</span>
          Copiloto IA
        </button>
      </div>

      {/* Contenido Dinámico */}
      <div className="flex-1 overflow-hidden relative">
        {/* Usamos display: none en vez de desmontar para no perder el estado del chat al cambiar de pestaña */}
        <div className={`absolute inset-0 ${activeTab === 'properties' ? 'block' : 'hidden'}`}>
          <div className="h-full overflow-y-auto">
             <PropertiesPanel {...props} />
          </div>
        </div>
        
        <div className={`absolute inset-0 ${activeTab === 'chat' ? 'flex flex-col' : 'hidden'}`}>
          {/* Le quitamos el width fijo al chat porque el padre ya lo controla */}
          <div className="w-full h-full flex flex-col">
            <AIChatPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
