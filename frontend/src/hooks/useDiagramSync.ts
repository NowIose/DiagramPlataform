import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useReactFlow } from '@xyflow/react';

export function useDiagramSync(projectId: string | undefined, isViewer: boolean) {
  const stompClientRef = useRef<Client | null>(null);
  const { setNodes, setEdges, toObject } = useReactFlow();
  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    if (!projectId) return;

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
    const wsUrl = API_URL.replace('/api', '/ws-diagram');
    
    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      onConnect: () => {
        client.subscribe(`/topic/project.${projectId}`, (message) => {
          try {
            const parsedData = JSON.parse(message.body);
            // Marcar como actualización remota para evitar re-enviar este mismo cambio
            isRemoteUpdate.current = true;
            if (parsedData.nodes) {
              setNodes((prevNodes) => {
                return parsedData.nodes.map((newNode: any) => {
                  const localNode = prevNodes.find((n) => n.id === newNode.id);
                  if (localNode) {
                    return { ...newNode, selected: localNode.selected };
                  }
                  return { ...newNode, selected: false };
                });
              });
            }
            if (parsedData.edges) {
              setEdges((prevEdges) => {
                return parsedData.edges.map((newEdge: any) => {
                  const localEdge = prevEdges.find((e) => e.id === newEdge.id);
                  if (localEdge) {
                    return { ...newEdge, selected: localEdge.selected };
                  }
                  return { ...newEdge, selected: false };
                });
              });
            }
            
            // Restablecer la bandera después de que React procese el render
            setTimeout(() => {
              isRemoteUpdate.current = false;
            }, 100);
          } catch (error) {
            console.error('Error parsing remote diagram sync', error);
          }
        });
      }
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [projectId, setNodes, setEdges]);

  // Función para emitir cambios (usar debounce en el componente principal)
  const broadcastChange = () => {
    if (isViewer || isRemoteUpdate.current || !stompClientRef.current?.connected) return;
    
    const flowData = toObject();
    stompClientRef.current.publish({
      destination: `/app/diagram.sync.${projectId}`,
      body: JSON.stringify(flowData)
    });
  };

  return { broadcastChange, isRemoteUpdate };
}
