import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider
} from '@xyflow/react';
import type { Connection, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import UmlClassNode from './nodes/UmlClassNode';
import PropertiesPanel from './panels/PropertiesPanel';

const nodeTypes = {
  umlClass: UmlClassNode,
  umlInterface: UmlClassNode, // Reusamos por ahora o podemos crear específicos
  umlEnum: UmlClassNode
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
  }
];

const initialEdges: Edge[] = [];

let idCounter = 100;
const getId = () => `node_${idCounter++}`;

function CanvasFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
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

      // Proyecta la posición de la pantalla a las coordenadas del Canvas (zoom, pan)
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { 
          label: type === 'umlClass' ? 'NewClass' : type === 'umlInterface' ? 'NewInterface' : 'NewEnum',
          attributes: [{ visibility: '-', name: 'newAttribute', type: 'String' }],
          methods: type !== 'umlEnum' ? [{ visibility: '+', name: 'newMethod()', returnType: 'void' }] : undefined
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  return (
    <div className="flex w-full h-full">
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
          fitView
          className="bg-surface-container-lowest"
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} color="var(--color-surface-container-highest)" />
        </ReactFlow>
      </div>
      
      <PropertiesPanel nodes={nodes} setNodes={setNodes} />
    </div>
  );
}

export default function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasFlow />
    </ReactFlowProvider>
  );
}
