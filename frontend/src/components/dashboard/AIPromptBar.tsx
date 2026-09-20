export default function AIPromptBar({ onToast }: { onToast: (title: string, message: string, icon: string) => void }) {
  return (
    <section className="w-full mb-10">
      <div className="bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-low p-5 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center shadow-md shrink-0">
              <span className="material-symbols-outlined text-[22px]">psychology</span>
            </div>
            <div>
              <h3 className="font-headline text-sm md:text-base font-semibold text-on-surface">Diseño Rápido con IA de Microservicios</h3>
              <p className="text-xs text-on-surface-variant">Genera un modelo relacional o diagrama de clases estructurado a partir de texto libre o boceto.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-bright text-xs font-label text-on-surface flex items-center gap-1 shadow-sm" type="button">
              <span className="material-symbols-outlined text-sm text-primary">mic</span> Voz
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-bright text-xs font-label text-on-surface flex items-center gap-1 shadow-sm" type="button">
              <span className="material-symbols-outlined text-sm text-primary">image</span> Subir Boceto
            </button>
          </div>
        </div>

        <div className="mt-4 relative">
          <input 
            className="w-full bg-surface-container-lowest rounded-xl pl-4 pr-32 py-3 text-xs md:text-sm text-on-surface placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary shadow-inner" 
            id="ai-prompt-input" 
            placeholder="Ejemplo: Diseñar microservicio para liquidación bancaria con idempotencia, ledger inmutable y auditoría de eventos..." 
            type="text" 
          />
          <button 
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-label font-semibold flex items-center gap-1.5 transition-all" 
            type="button"
            onClick={() => onToast('Generando Arquitectura IA', 'Analizando entidades y relaciones...', 'auto_fix_high')}
          >
            <span>Generar</span>
            <span className="material-symbols-outlined text-sm">auto_fix_high</span>
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-label text-secondary uppercase font-bold tracking-wider">Plantillas rápidas:</span>
          {["E-commerce Checkout", "Sistema de Pagos Multi-tenant", "Autenticación OAuth2 / JWT", "Inventario y Logística"].map(label => (
            <button key={label} className="text-xs px-2.5 py-1 rounded-full bg-surface-container-lowest hover:bg-surface-bright text-on-surface-variant hover:text-primary transition-colors font-medium" type="button">
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
