import { Position } from '@xyflow/react';

// Obtiene el centro absoluto del nodo
function getNodeCenter(node: any) {
  const position = node.internals?.positionAbsolute || node.position || { x: 0, y: 0 };
  const width = node.measured?.width || 192;
  const height = node.measured?.height || 100;
  return {
    x: position.x + width / 2,
    y: position.y + height / 2,
  };
}

// Calcula el punto de intersección exacto entre el centro del nodo origen y el centro del nodo destino con el borde (bounding box)
function getNodeIntersection(intersectionNode: any, targetNode: any) {
  const { width: intersectionNodeWidth, height: intersectionNodeHeight } = intersectionNode.measured || { width: 192, height: 100 };
  const intersectionNodePosition = intersectionNode.internals?.positionAbsolute || intersectionNode.position || { x: 0, y: 0 };
  const targetPosition = getNodeCenter(targetNode);

  const w = (intersectionNodeWidth ?? 192) / 2;
  const h = (intersectionNodeHeight ?? 100) / 2;

  const x2 = intersectionNodePosition.x + w;
  const y2 = intersectionNodePosition.y + h;
  const x1 = targetPosition.x;
  const y1 = targetPosition.y;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

// Retorna la posición cardinal aproximada en base al punto de intersección
function getEdgePosition(node: any, intersectionPoint: { x: number; y: number }) {
  const position = node.internals?.positionAbsolute || node.position || { x: 0, y: 0 };
  const width = node.measured?.width || 192;
  const height = node.measured?.height || 100;
  
  const nx = Math.round(position.x);
  const ny = Math.round(position.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) return Position.Left;
  if (px >= nx + width - 1) return Position.Right;
  if (py <= ny + 1) return Position.Top;
  if (py >= ny + height - 1) return Position.Bottom;

  return Position.Top;
}

export function getEdgeParams(source: any, target: any) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}
