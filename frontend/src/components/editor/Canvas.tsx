import { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ConnectionMode
} from '@xyflow/react';
import type { Connection, Edge, Node } from '@xyflow/react';
import axios from 'axios';
import '@xyflow/react/dist/style.css';
import UmlClassNode from './nodes/UmlClassNode';
import UmlNoteNode from './nodes/UmlNoteNode';
import UmlCommentNode from './nodes/UmlCommentNode';
import UmlEdge from './edges/UmlEdge';
import PropertiesPanel from './panels/PropertiesPanel';
import ToolboxPanel from './panels/ToolboxPanel';

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

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'umlClass',
    position: { x: 250, y: 100 },
    data: { 
      label: 'User', 
      attributes: [
        { visibility: '-', name: 'id', type: 'Long' },
        { visibility: '-', name: 'username', type: 'String' },
        { visibility: '-', name: 'email', type: 'String' }
      ],
      methods: [
        { visibility: '+', name: 'login()', returnType: 'boolean' },
        { visibility: '+', name: 'logout()', returnType: 'void' }
      ]
    },
  },
  {
    id: '2',
    type: 'umlClass',
    position: { x: 250, y: 350 },
    data: { 
      label: 'Role', 
      attributes: [
        { visibility: '-', name: 'id', type: 'Long' },
        { visibility: '-', name: 'name', type: 'String' }
      ],
      methods: []
    },
  }
];

const initialEdges: Edge[] = [];

let idCounter = 100;
const getId = () => `node_${idCounter++}`;
let edgeCounter = 1;
const getEdgeId = () => `edge_${edgeCounter++}`;

interface CanvasProps {
  projectId?: string;
}

export default function Canvas({ projectId }: CanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition, getNode } = useReactFlow();
  
  // Estado para saber qué línea dibujar
  const [selectedEdgeType, setSelectedEdgeType] = useState('umlAssociation');

  // Cargar datos reales de la base de datos
  useEffect(() => {
    if (!projectId) return;

    const fetchProjectData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:8080/api/projects/${projectId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.data.diagramData) {
          const parsedData = JSON.parse(res.data.diagramData);
          if (parsedData.nodes) setNodes(parsedData.nodes);
          if (parsedData.edges) setEdges(parsedData.edges);
          
          // Actualizar idCounter y edgeCounter para que los nuevos IDs no choquen con los existentes
          if (parsedData.nodes?.length > 0) {
            const maxNodeId = Math.max(...parsedData.nodes.map((n: any) => {
              const num = parseInt(n.id.replace('node_', ''));
              return isNaN(num) ? 0 : num;
            }));
            idCounter = maxNodeId + 1;
          }
          if (parsedData.edges?.length > 0) {
            const maxEdgeId = Math.max(...parsedData.edges.map((e: any) => {
              const num = parseInt(e.id.replace('edge_', ''));
              return isNaN(num) ? 0 : num;
            }));
            edgeCounter = maxEdgeId + 1;
          }
        }
      } catch (error) {
        console.error('Error fetching diagram data', error);
      }
    };

    fetchProjectData();
  }, [projectId, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      if (selectedEdgeType === 'umlAssociationClass') {
        const srcNode = getNode(params.source!);
        const tgtNode = getNode(params.target!);
        const midX = ((srcNode?.position.x || 0) + (tgtNode?.position.x || 0)) / 2;
        const midY = ((srcNode?.position.y || 0) + (tgtNode?.position.y || 0)) / 2;

        const newClassId = getId();
        const newNode: Node = {
          id: newClassId,
          type: 'umlIntermediateClass',
          position: { x: midX, y: midY - 150 },
          data: {
            label: 'ClaseIntermedia',
            attributes: [{ visibility: '-', name: 'id', type: 'Long' }],
            methods: []
          }
        };
        setNodes((nds) => nds.concat(newNode));

        const newEdge: Edge = {
          ...params,
          id: getEdgeId(),
          type: 'umlEdge',
          data: { relationType: selectedEdgeType, associatedNodeId: newClassId }
        };
        setEdges((eds) => addEdge(newEdge, eds));
      } else {
        let newEdge: Edge = {
          ...params,
          id: getEdgeId(),
          type: 'umlEdge',
          data: { relationType: selectedEdgeType }
        };
        setEdges((eds) => addEdge(newEdge, eds));
      }
    },
    [setEdges, setNodes, selectedEdgeType, getNode]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let initData: any = {};
      if (type === 'umlNote' || type === 'umlComment') {
        initData = { text: 'Doble clic o edita en el panel', isDecorative: true };
      } else {
        initData = { 
          label: type === 'umlClass' ? 'NewClass' : type === 'umlInterface' ? 'NewInterface' : 'NewEnum',
          attributes: type !== 'umlEnum' ? [{ visibility: '-', name: 'newAttribute', type: 'String' }] : [],
          methods: type !== 'umlEnum' ? [{ visibility: '+', name: 'newMethod()', returnType: 'void' }] : undefined,
          isDecorative: false
        };
      }

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: initData,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  return (
    <div className="flex w-full h-full">
      <ToolboxPanel selectedEdgeType={selectedEdgeType} setSelectedEdgeType={setSelectedEdgeType} />
      
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          className="bg-surface-container-lowest"
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
              <marker id="uml-association" viewBox="0 0 20 20" refX="20" refY="10" markerWidth="15" markerHeight="15" orient="auto">
                <polyline points="0,2 20,10 0,18" fill="none" stroke="var(--color-on-surface)" strokeWidth="1.5" />
              </marker>
            </defs>
          </svg>

          <Controls />
          <MiniMap />
          <Background gap={12} size={1} color="var(--color-surface-container-highest)" />
        </ReactFlow>
      </div>
      
      <PropertiesPanel nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges} />
    </div>
  );
}
