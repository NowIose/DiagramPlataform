export default function UmlNoteNode({ data, selected }: any) {
  return (
    <div className={`w-40 min-h-[80px] p-3 bg-[#fff7d1] border border-[#f0e49e] text-surface-container-highest font-sans text-xs shadow-sm relative transition-all ${selected ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
      {/* Dog-ear fold */}
      <div className="absolute top-0 right-0 w-0 h-0 border-t-[12px] border-l-[12px] border-t-white border-l-[#e6da91]"></div>
      
      <div className="whitespace-pre-wrap break-words text-[#5c5633]">{data.text || 'Nueva nota...'}</div>
    </div>
  );
}
