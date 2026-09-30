export interface EADiffAttribute {
  name: string;
  type: string;
  isPrimaryKey: boolean;
}

export interface EADiffChange {
  type: 'ADD' | 'MODIFY' | 'DELETE';
  nodeName: string;
  remoteNode?: any;
  localNode?: any;
  changesDetail?: string[];
  selected: boolean;
}

export class EADiffService {
  /**
   * Compara los nodos locales con los remotos importados desde EA.
   * Retorna una lista de cambios propuestos.
   */
  static compareDiagrams(localNodes: any[], _localEdges: any[], remoteNodes: any[], _remoteEdges: any[]): EADiffChange[] {
    const changes: EADiffChange[] = [];
    
    const localMap = new Map<string, any>();
    localNodes.forEach(n => {
      const name = n.data?.label?.trim().toLowerCase();
      if (name) localMap.set(name, n);
    });

    const remoteMap = new Map<string, any>();
    remoteNodes.forEach(n => {
      const name = n.data?.label?.trim().toLowerCase();
      if (name) remoteMap.set(name, n);
    });

    // Encontrar Adds y Modifys
    remoteNodes.forEach(rNode => {
      const name = rNode.data?.label?.trim().toLowerCase();
      if (!name) return;

      const lNode = localMap.get(name);
      if (!lNode) {
        changes.push({
          type: 'ADD',
          nodeName: rNode.data.label,
          remoteNode: rNode,
          selected: true,
          changesDetail: ['Clase completamente nueva detectada en EA.']
        });
      } else {
        // Comparar atributos
        const rAttrs = rNode.data.attributes || [];
        const lAttrs = lNode.data.attributes || [];
        const details: string[] = [];

        rAttrs.forEach((ra: any) => {
          const la = lAttrs.find((a: any) => a.name.toLowerCase() === ra.name.toLowerCase());
          if (!la) {
            details.push(`Nuevo atributo: +${ra.name} (${ra.type})`);
          } else if (la.type !== ra.type) {
            details.push(`Atributo cambiado: ~${ra.name} (${la.type} -> ${ra.type})`);
          }
        });

        lAttrs.forEach((la: any) => {
           const ra = rAttrs.find((a: any) => a.name.toLowerCase() === la.name.toLowerCase());
           if (!ra) {
              details.push(`Atributo eliminado en EA: -${la.name}`);
           }
        });

        if (details.length > 0) {
          changes.push({
            type: 'MODIFY',
            nodeName: rNode.data.label,
            remoteNode: rNode,
            localNode: lNode,
            selected: true,
            changesDetail: details
          });
        }
      }
    });

    // (Opcional) Detectar eliminaciones - Clases locales que no están en EA
    localNodes.forEach(lNode => {
      const name = lNode.data?.label?.trim().toLowerCase();
      if (name && !remoteMap.has(name)) {
        changes.push({
          type: 'DELETE',
          nodeName: lNode.data.label,
          localNode: lNode,
          selected: false, // Por defecto no borramos
          changesDetail: ['Esta clase existe en tu diagrama pero no en el archivo importado de EA.']
        });
      }
    });

    return changes;
  }

  /**
   * Integra los cambios aprobados en los arreglos actuales.
   */
  static applyChanges(localNodes: any[], localEdges: any[], remoteNodes: any[], remoteEdges: any[], changes: EADiffChange[]): { newNodes: any[], newEdges: any[] } {
    let resultNodes = [...localNodes];
    let resultEdges = [...localEdges];

    // Mapa de IDs remotos a IDs locales para reconectar los edges
    const remoteIdToLocalId = new Map<string, string>();

    // 1. Mapear TODOS los nodos remotos a los locales correspondientes por nombre (incluso los no modificados)
    const localMap = new Map<string, any>();
    localNodes.forEach(n => {
      const name = n.data?.label?.trim().toLowerCase();
      if (name) localMap.set(name, n);
    });

    remoteNodes.forEach(rNode => {
      const name = rNode.data?.label?.trim().toLowerCase();
      if (name && localMap.has(name)) {
        // La clase existe localmente, asocia el ID de EA al ID local actual
        remoteIdToLocalId.set(rNode.id, localMap.get(name).id);
      } else {
        // La clase es nueva (ADD)
        remoteIdToLocalId.set(rNode.id, rNode.id);
      }
    });

    // 2. Aplicar los cambios en nodos (ADD, MODIFY, DELETE)
    changes.filter(c => c.selected).forEach(change => {
      if (change.type === 'ADD') {
        resultNodes.push(change.remoteNode);
      } 
      else if (change.type === 'MODIFY') {
        const index = resultNodes.findIndex(n => n.id === change.localNode.id);
        if (index !== -1) {
          const mergedNode = {
            ...change.localNode,
            data: {
              ...change.localNode.data,
              attributes: change.remoteNode.data.attributes || [],
              methods: change.remoteNode.data.methods || []
            }
          };
          resultNodes[index] = mergedNode;
        }
      }
      else if (change.type === 'DELETE') {
        resultNodes = resultNodes.filter(n => n.id !== change.localNode.id);
        resultEdges = resultEdges.filter(e => e.source !== change.localNode.id && e.target !== change.localNode.id);
      }
    });

    // Inyectar edges remotos que pertenezcan a nodos ADDED o MODIFIED
    // Los edges remotos tienen source/target usando los IDs del remoteNodes.
    // Tenemos que actualizarlos a los IDs locales si mapeamos alguno.
    remoteEdges.forEach(rEdge => {
      const localSource = remoteIdToLocalId.get(rEdge.source);
      const localTarget = remoteIdToLocalId.get(rEdge.target);

      // Si ambos extremos del edge existen en nuestro mapeo aprobado, lo agregamos (si no existe ya)
      if (localSource && localTarget) {
        // Verificar si ya existe un edge similar
        const exists = resultEdges.some(e => 
          (e.source === localSource && e.target === localTarget) ||
          (e.source === localTarget && e.target === localSource)
        );
        if (!exists) {
          resultEdges.push({
            ...rEdge,
            id: 'edge_' + Math.random().toString(36).substring(2, 9),
            source: localSource,
            target: localTarget
          });
        }
      }
    });

    return { newNodes: resultNodes, newEdges: resultEdges };
  }
}


