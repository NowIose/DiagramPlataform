export default function ActivitySidebar() {
  return (
    <aside className="xl:col-span-4 flex flex-col gap-6">
      <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">history_edu</span>
            <h3 className="font-headline text-sm font-semibold text-on-surface">Actividad Reciente del Equipo</h3>
          </div>
          <span className="text-[10px] font-label text-secondary uppercase tracking-wider font-bold">En Vivo</span>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">CA</div>
            <div className="flex-1 text-xs">
              <p className="text-on-surface">
                <span className="font-semibold">Carlos Arch</span> modificó la relación <code className="px-1 py-0.5 rounded bg-surface-container text-primary font-mono text-[11px]">1:N</code> entre <strong className="text-on-surface">Order</strong> y <strong className="text-on-surface">OrderItem</strong>.
              </p>
              <span className="text-[10px] text-secondary font-label mt-1 block">Hace 4 minutos • E-Commerce Core</span>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">psychology</span>
            </div>
            <div className="flex-1 text-xs">
              <p className="text-on-surface">
                <span className="font-semibold text-tertiary">IA Asistente</span> sugirió crear un índice B-Tree en <code className="px-1 py-0.5 rounded bg-surface-container text-primary font-mono text-[11px]">customer_id</code> para reducir latencia p99.
              </p>
              <div className="mt-1.5 flex gap-2">
                <button className="px-2 py-0.5 rounded bg-surface-container-high text-primary text-[10px] font-label font-semibold hover:bg-surface-dim" type="button">Aplicar cambio</button>
                <button className="px-2 py-0.5 rounded text-secondary text-[10px] font-label hover:underline" type="button">Descartar</button>
              </div>
              <span className="text-[10px] text-secondary font-label mt-1 block">Hace 18 minutos</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-primary text-on-primary text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">SO</div>
            <div className="flex-1 text-xs">
              <p className="text-on-surface">
                <span className="font-semibold">Sofia Lead</span> generó y empaquetó el backend Spring Boot <code className="px-1 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono text-[11px]">v2.1.0-RELEASE</code>.
              </p>
              <span className="text-[10px] text-secondary font-label mt-1 block">Hace 42 minutos • Auth Identity Service</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 text-center">
          <button className="text-xs font-label text-primary font-semibold hover:underline flex items-center justify-center gap-1 mx-auto" type="button">
            <span>Ver historial de auditoría completo</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary text-lg">tune</span>
          <h3 className="font-headline text-sm font-semibold text-on-surface">Configuraciones Rápidas</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="max-w-[80%]">
              <p className="text-xs font-semibold text-on-surface">Sincronización Offline-First</p>
              <p className="text-[11px] text-on-surface-variant">Guarda cambios en SQLite local.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input defaultChecked className="sr-only peer" type="checkbox" />
              <div className="w-9 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="max-w-[80%]">
              <p className="text-xs font-semibold text-on-surface">Generación Flyway SQL</p>
              <p className="text-[11px] text-on-surface-variant">Crea migraciones versionadas V{`{n}`}__.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input defaultChecked className="sr-only peer" type="checkbox" />
              <div className="w-9 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
        
        <div className="mt-5 pt-3">
          <button className="w-full py-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface text-xs font-label font-semibold transition-colors flex items-center justify-center gap-2" type="button">
            <span className="material-symbols-outlined text-[16px]">settings_suggest</span>
            <span>Administrar Ajustes Avanzados</span>
          </button>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-surface-container to-surface-container-high p-4 rounded-2xl text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="font-label font-bold uppercase tracking-wider text-secondary text-[10px]">Stack Detectado</span>
          <span className="material-symbols-outlined text-primary text-[16px]">inventory_2</span>
        </div>
        <div className="font-mono text-[11px] text-on-surface space-y-1">
          <p><span className="text-secondary">• Java:</span> OpenJDK 21 (LTS)</p>
          <p><span className="text-secondary">• Framework:</span> Spring Boot 3.3.4</p>
          <p><span className="text-secondary">• ORM:</span> Hibernate 6.5 / Spring Data JPA</p>
          <p><span className="text-secondary">• Docs:</span> SpringDoc OpenAPI 2.6</p>
        </div>
      </div>
    </aside>
  );
}
