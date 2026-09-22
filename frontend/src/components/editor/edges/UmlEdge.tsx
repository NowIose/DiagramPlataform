import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, Position, useStore } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';

export default function UmlEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  selected,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const relationType = (data?.relationType as string) || 'umlAssociation';
  const roleName = data?.roleName as string;
  const sourceMultiplicity = data?.sourceMultiplicity as string;
  const targetMultiplicity = data?.targetMultiplicity as string;
  const assocNodeId = data?.associatedNodeId as string;

  // React Flow current page URL for markers
  const currentUrl = typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '';

  let strokeDasharray = undefined;
  let edgeMarkerEnd = undefined;
  let edgeMarkerStart = undefined;
  
  const isAssocClass = relationType === 'umlAssociationClass';

  if (relationType === 'umlGeneralization' || relationType === 'umlRealization') {
    edgeMarkerEnd = `url(${currentUrl}#uml-generalization)`;
    if (relationType === 'umlRealization') {
      strokeDasharray = '5,5';
    }
  } else if (relationType === 'umlComposition') {
    edgeMarkerStart = `url(${currentUrl}#uml-composition)`;
  } else if (relationType === 'umlAggregation') {
    edgeMarkerStart = `url(${currentUrl}#uml-aggregation)`;
  } else if (isAssocClass) {
    strokeDasharray = undefined; // Línea base sólida
    edgeMarkerEnd = undefined;
  } else {
    // Association por defecto (Línea simple sin flecha)
    edgeMarkerEnd = undefined;
  }

  const strokeWidth = selected ? 2.5 : 1.5;
  const stroke = selected ? 'var(--color-primary)' : 'var(--color-on-surface)';

  // Lookup the associated node dynamically using the store
  const assocNode = useStore((s) => {
    if (s.nodeLookup) return s.nodeLookup.get(assocNodeId);
    return s.nodes.find((n) => n.id === assocNodeId);
  });

  let nx = 0;
  let ny = 0;
  if (assocNode) {
    const pos = (assocNode as any).internals?.positionAbsolute || assocNode.position || { x: 0, y: 0 };
    const w = assocNode.measured?.width || 192; // typical class node width
    const h = assocNode.measured?.height || 100;
    nx = pos.x + w / 2;
    ny = pos.y + h / 2;
  }

  // Helper para ubicar los labels cerca de las puntas
  const getOffset = (pos: Position) => {
    const dist = 15;
    if (pos === Position.Top) return { x: 10, y: -dist - 10 };
    if (pos === Position.Bottom) return { x: 10, y: dist };
    if (pos === Position.Left) return { x: -dist - 20, y: -20 };
    if (pos === Position.Right) return { x: dist + 5, y: -20 };
    return { x: 0, y: 0 };
  };

  const sOffset = getOffset(sourcePosition);
  const tOffset = getOffset(targetPosition);

  return (
    <>
      <BaseEdge 
        id={id}
        path={edgePath} 
        markerEnd={edgeMarkerEnd} 
        markerStart={edgeMarkerStart}
        style={{ ...style, strokeWidth, stroke, strokeDasharray }} 
      />

      {isAssocClass && assocNode && (
        <line 
          x1={labelX} y1={labelY} 
          x2={nx} y2={ny} 
          stroke="var(--color-on-surface)" strokeWidth="1.5" strokeDasharray="5,5" 
        />
      )}
      
      <EdgeLabelRenderer>
        {roleName && !isAssocClass && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="bg-surface-container-lowest px-1 rounded text-[10px] font-mono text-on-surface border border-surface-container-highest shadow-sm"
          >
            {roleName}
          </div>
        )}
        
        {sourceMultiplicity && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${sourceX + sOffset.x}px, ${sourceY + sOffset.y}px)`,
              pointerEvents: 'all',
            }}
            className="bg-surface-container-lowest/80 px-1 rounded text-[10px] font-mono text-primary font-bold shadow-sm"
          >
            {sourceMultiplicity}
          </div>
        )}

        {targetMultiplicity && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${targetX + tOffset.x}px, ${targetY + tOffset.y}px)`,
              pointerEvents: 'all',
            }}
            className="bg-surface-container-lowest/80 px-1 rounded text-[10px] font-mono text-primary font-bold shadow-sm"
          >
            {targetMultiplicity}
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
}
