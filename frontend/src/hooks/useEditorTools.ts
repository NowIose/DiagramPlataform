import { useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';

export function useEditorTools() {
  const { setNodes, setEdges, getNodes } = useReactFlow();

  // Herramienta 1: Agregar un nodo
  const addNode = useCallback((type: string, label: string, x?: number, y?: number) => {
    const id = `node-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    // Si no dan coordenadas, lo ponemos en un lugar semi-aleatorio
    const posX = x !== undefined ? x : Math.random() * 200 + 100;
    const posY = y !== undefined ? y : Math.random() * 200 + 100;

    setNodes((nds) => [
      ...nds,
      {
        id,
        type, // ej. 'umlClass', 'umlNote'
        position: { x: posX, y: posY },
        data: { label, attributes: [], methods: [] }
      }
    ]);
    
    return `Nodo '${label}' creado exitosamente con ID: ${id}`;
  }, [setNodes]);

  // Herramienta 2: Conectar dos nodos
  const connectNodes = useCallback((sourceId: string, targetId: string, relationType = 'umlAssociation', sourceMultiplicity = '', targetMultiplicity = '') => {
    const id = `edge-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    setEdges((eds) => [
      ...eds,
      {
        id,
        source: sourceId,
        target: targetId,
        type: 'umlEdge',
        data: { relationType, sourceMultiplicity, targetMultiplicity }
      }
    ]);
    
    return `Nodos conectados exitosamente con relación ${relationType} (${sourceMultiplicity} a ${targetMultiplicity})`;
  }, [setEdges]);

  // Herramienta 3: Eliminar un nodo
  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    
    return `Nodo ${nodeId} eliminado correctamente`;
  }, [setNodes, setEdges]);

  // Herramienta 4: Añadir Atributo a una Clase
  const addAttribute = useCallback((nodeId: string, visibility: string, name: string, dataType: string) => {
    setNodes((nds) => nds.map((n) => {
      if (n.id === nodeId) {
        const currentAttrs = Array.isArray(n.data?.attributes) ? n.data.attributes : [];
        return { ...n, data: { ...n.data, attributes: [...currentAttrs, { visibility, name, type: dataType }] } };
      }
      return n;
    }));
    return `Atributo '${visibility}${name}:${dataType}' agregado al nodo ${nodeId}`;
  }, [setNodes]);

  // Herramienta 5: Añadir Método a una Clase
  const addMethod = useCallback((nodeId: string, visibility: string, name: string, returnType: string) => {
    setNodes((nds) => nds.map((n) => {
      if (n.id === nodeId) {
        const currentMethods = Array.isArray(n.data?.methods) ? n.data.methods : [];
        return { ...n, data: { ...n.data, methods: [...currentMethods, { visibility, name, returnType }] } };
      }
      return n;
    }));
    return `Método '${visibility}${name}():${returnType}' agregado al nodo ${nodeId}`;
  }, [setNodes]);

  // Esta función empaqueta todo para que la IA la consuma
  return {
    addNode,
    connectNodes,
    deleteNode,
    addAttribute,
    addMethod,
    // Aquí puedes crear una función que devuelva el resumen del lienzo
    getDiagramSummary: () => {
      const nodes = getNodes().map(n => ({ id: n.id, label: n.data?.label, type: n.type }));
      return JSON.stringify(nodes);
    }
  };
}
