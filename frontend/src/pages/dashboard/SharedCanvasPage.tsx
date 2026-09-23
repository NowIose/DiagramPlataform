import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  ConnectionMode
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import axios from 'axios';

// Usamos los mismos nodos para que se vea idéntico
import UmlClassNode from '../../components/editor/nodes/UmlClassNode';
import UmlNoteNode from '../../components/editor/nodes/UmlNoteNode';
import UmlCommentNode from '../../components/editor/nodes/UmlCommentNode';
import UmlEdge from '../../components/editor/edges/UmlEdge';

const nodeTypes = {
  umlClass: UmlClassNode,
  umlInterface: UmlClassNode,
  umlEnum: UmlClassNode,
  umlIntermediateClass: UmlClassNode,
  umlNote: UmlNoteNode,
  umlComment: UmlCommentNode
};

const edgeTypes = {
  umlEdge: UmlEdge
};

function SharedContent() {
  const { token } = useParams();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [projectName, setProjectName] = useState('Cargando...');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSharedProject = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
        const res = await axios.get(`${API_URL}/projects/shared/${token}`);
        setProjectName(res.data.name);
        
        if (res.data.diagramData) {
          const parsedData = JSON.parse(res.data.diagramData);
          setNodes(parsedData.nodes || []);
          setEdges(parsedData.edges || []);
        }
      } catch (err) {
        console.error(err);
        setError('Este proyecto no existe o ya no es público.');
      }
    };
    fetchSharedProject();
  }, [token]);

  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-surface-container-lowest">
        <div className="text-center">
          <span className="material-symbols-outlined text-[48px] text-error mb-2">lock</span>
          <h2 className="font-headline font-semibold text-xl text-on-surface">{error}</h2>
          <p className="text-sm text-on-surface-variant mt-2">Pide al propietario que vuelva a habilitar el enlace público.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-surface-container-lowest overflow-hidden">
      {/* Barra superior minimalista Read-Only */}
      <div className="h-14 shrink-0 border-b border-surface-container-low bg-surface px-4 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <h3 className="font-headline font-semibold text-sm text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-tertiary">public</span>
            {projectName}
          </h3>
          <span className="bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
            Solo Lectura
          </span>
        </div>
      </div>

      {/* Lienzo en modo Read-Only */}
      <div className="flex-1 bg-surface-container-lowest relative pointer-events-none">
        {/* Deshabilitar pointer-events en el contenedor evita interactuar con nodos/paneles, 
            pero queremos permitir zoom/pan. Mejor desactivamos hooks de edición en ReactFlow. */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          className="bg-surface-container-lowest pointer-events-auto"
        >
          {/* SVG Markers personalizados */}
          <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
              <marker id="uml-generalization" viewBox="0 0 20 20" refX="20" refY="10" markerWidth="15" markerHeight="15" orient="auto">
                <polygon points="0,2 20,10 0,18 0,2" fill="var(--color-surface-container-lowest)" stroke="var(--color-on-surface)" strokeWidth="1.5" />
              </marker>
              <marker id="uml-composition" viewBox="0 0 20 20" refX="20" refY="10" markerWidth="15" markerHeight="15" orient="auto-start-reverse">
                <polygon points="0,10 10,2 20,10 10,18 0,10" fill="var(--color-on-surface)" stroke="var(--color-on-surface)" strokeWidth="1.5" />
              </marker>
              <marker id="uml-aggregation" viewBox="0 0 20 20" refX="20" refY="10" markerWidth="15" markerHeight="15" orient="auto-start-reverse">
                <polygon points="0,10 10,2 20,10 10,18 0,10" fill="var(--color-surface-container-lowest)" stroke="var(--color-on-surface)" strokeWidth="1.5" />
              </marker>
            </defs>
          </svg>

          <Controls showInteractive={false} />
          <MiniMap />
          <Background gap={12} size={1} color="var(--color-surface-container-highest)" />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function SharedCanvasPage() {
  return (
    <ReactFlowProvider>
      <SharedContent />
    </ReactFlowProvider>
  );
}
