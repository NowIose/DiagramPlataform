import { Handle, Position } from '@xyflow/react';

export default function UmlClassNode({ data, selected, type }: any) {
  // Configuración según el tipo de nodo
  let stereotype = '';
  let bgColor = 'bg-surface-container-lowest';
  let headerColor = 'bg-surface-container-low text-on-surface';
  
  if (selected) {
    headerColor = 'bg-primary-container text-on-primary-container';
    if (type === 'umlInterface') headerColor = 'bg-tertiary-container text-on-tertiary-container';
    if (type === 'umlEnum') headerColor = 'bg-secondary-container text-on-secondary-container';
  }

  if (type === 'umlInterface') stereotype = '<<interface>>';
  if (type === 'umlEnum') stereotype = '<<enumeration>>';

  return (
    <div className={`border-2 rounded-md shadow-sm w-48 font-mono text-xs overflow-hidden transition-colors ${bgColor} ${selected ? (type==='umlInterface'?'border-tertiary': type==='umlEnum'?'border-secondary':'border-primary') : 'border-surface-container-highest'}`}>
      
      {/* Handles para conectar flechas */}
      <Handle type="target" position={Position.Top} className={`w-2 h-2 border-none ${type==='umlInterface'?'bg-tertiary': type==='umlEnum'?'bg-secondary':'bg-primary'}`} />
      <Handle type="source" position={Position.Bottom} className={`w-2 h-2 border-none ${type==='umlInterface'?'bg-tertiary': type==='umlEnum'?'bg-secondary':'bg-primary'}`} />

      {/* Header (Nombre de la Clase) */}
      <div className={`p-2 text-center border-b border-surface-container-highest flex flex-col ${headerColor}`}>
        {stereotype && <span className="text-[10px] font-normal opacity-80">{stereotype}</span>}
        <span className="font-bold">{data.label || 'NewNode'}</span>
      </div>

      {/* Atributos */}
      <div className="p-2 border-b border-surface-container-highest bg-surface-container-lowest text-on-surface-variant min-h-[30px] flex flex-col gap-0.5">
        {data.attributes?.map((attr: any, idx: number) => (
          <div key={idx} className="flex items-center gap-1">
            <span className="opacity-70">{attr.visibility || '-'}</span>
            <span>{attr.name}</span>
            {attr.type && <span className="opacity-70">: {attr.type}</span>}
          </div>
        ))}
      </div>

      {/* Métodos (Ocultos para Enums) */}
      {type !== 'umlEnum' && (
        <div className="p-2 bg-surface-container-lowest text-on-surface-variant min-h-[30px] flex flex-col gap-0.5">
          {data.methods?.map((method: any, idx: number) => (
            <div key={idx} className="flex items-center gap-1">
              <span className="opacity-70">{method.visibility || '+'}</span>
              <span>{method.name}</span>
              {method.returnType && <span className="opacity-70">: {method.returnType}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
