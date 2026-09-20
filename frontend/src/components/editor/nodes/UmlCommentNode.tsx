export default function UmlCommentNode({ data, selected }: any) {
  return (
    <div className={`p-2 min-w-[100px] text-center text-on-surface font-sans text-xs transition-all ${selected ? 'border border-dashed border-primary bg-primary/10' : 'border border-transparent'}`}>
      <div className="whitespace-pre-wrap break-words">{data.text || 'Nuevo comentario'}</div>
    </div>
  );
}
