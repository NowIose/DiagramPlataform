import React from 'react';

export const CanvasMockupSection: React.FC = () => {
  return (
    <section className="w-full px-6 lg:px-12 -mt-6 mb-24" id="canvas-demo">
      <div className="max-w-7xl mx-auto">
        <div className="bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden border border-surface-container-high">
          {/* Mockup Toolbar / Window Header */}
          <div className="bg-surface-container px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-error/70 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-tertiary-container inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-primary-fixed-dim inline-block"></span>
              </div>
              <span className="text-xs font-label text-on-surface-variant pl-2">diagramconnect / e-commerce-core.uml</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-label bg-surface-container-highest text-primary font-semibold">
                PostgreSQL 16 • Spring Boot 3.3
              </span>
            </div>

            {/* Active Collaborators Avatars & Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center -space-x-2">
                <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold ring-2 ring-surface-container-lowest" title="Sofia (Lead Dev)">
                  S
                </div>
                <div className="w-7 h-7 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center text-xs font-bold ring-2 ring-surface-container-lowest" title="Carlos (Architect)">
                  C
                </div>
                <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold ring-2 ring-surface-container-lowest" title="DiagramConnect Copilot">
                  AI
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-surface-container-high text-xs font-label text-on-surface font-medium flex items-center gap-1.5 hover:bg-surface-container-highest transition-colors">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">mic</span>
                  <span>Prompt de Voz</span>
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-label font-semibold flex items-center gap-1.5 hover:opacity-95 transition-opacity">
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  <span>Generar Spring Boot</span>
                </button>
              </div>
            </div>
          </div>

          {/* Canvas Studio Work Area */}
          <div className="relative bg-surface-container-low min-h-[580px] p-6 lg:p-8 overflow-x-auto">
            {/* Background Coordinate Dots */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern height="24" id="canvas-dots" patternUnits="userSpaceOnUse" width="24">
                    <circle cx="2" cy="2" fill="#737784" r="1.2"></circle>
                  </pattern>
                </defs>
                <rect fill="url(#canvas-dots)" height="100%" width="100%"></rect>
              </svg>
            </div>

            {/* SVG Relations Connectors Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden md:block" style={{ minWidth: '900px' }}>
              {/* Connector: User to Order (1:N) */}
              <path className="animate-pulse" d="M 280 180 C 340 180, 360 210, 420 210" fill="none" stroke="#094cb2" strokeDasharray="4 4" strokeWidth="2"></path>
              <circle cx="280" cy="180" fill="#094cb2" r="4"></circle>
              <circle cx="420" cy="210" fill="#094cb2" r="4"></circle>
              <text fill="#434653" fontFamily="Public Sans" fontSize="11" fontWeight="600" x="290" y="172">1</text>
              <text fill="#434653" fontFamily="Public Sans" fontSize="11" fontWeight="600" x="405" y="202">0..*</text>

              {/* Connector: Order to OrderItem (1:N) */}
              <path d="M 640 210 C 690 210, 710 210, 750 210" fill="none" stroke="#094cb2" strokeWidth="2"></path>
              <polygon fill="#094cb2" points="742,206 750,210 742,214"></polygon>

              {/* Connector: Product to OrderItem (1:N) */}
              <path d="M 860 380 C 860 330, 860 320, 860 290" fill="none" stroke="#094cb2" strokeWidth="2"></path>
            </svg>

            {/* Live Collaborative Cursors */}
            <div className="absolute z-30 pointer-events-none top-24 left-[260px] flex items-center gap-1.5 transition-all duration-300">
              <span className="material-symbols-outlined text-primary text-[20px] -rotate-45">navigation</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-label font-semibold bg-primary text-on-primary shadow-md">
                Sofia Dev • Editando UUID
              </span>
            </div>

            <div className="absolute z-30 pointer-events-none top-[340px] left-[520px] flex items-center gap-1.5 transition-all duration-300">
              <span className="material-symbols-outlined text-tertiary text-[20px] -rotate-45">navigation</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-label font-semibold bg-tertiary text-on-tertiary shadow-md">
                Carlos Arch • Añadiendo Payment
              </span>
            </div>

            {/* Nodes Layout Grid */}
            <div className="relative z-20 flex flex-wrap md:flex-nowrap gap-6 items-start justify-start max-w-full">
              {/* Node 1: User Entity */}
              <div className="w-64 bg-surface-container-lowest rounded-xl shadow-md overflow-hidden shrink-0 border border-surface-container">
                <div className="bg-primary/10 px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">table_chart</span>
                    <span className="font-headline font-bold text-sm text-primary">User</span>
                  </div>
                  <span className="text-[10px] font-label uppercase px-1.5 py-0.5 rounded bg-surface-container font-semibold text-on-surface-variant">
                    @Entity
                  </span>
                </div>
                <div className="p-3 space-y-1.5 font-label text-xs">
                  <div className="flex items-center justify-between py-1 bg-primary/5 px-2 rounded">
                    <span className="text-primary font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">key</span> id: UUID
                    </span>
                    <span className="text-on-surface-variant text-[11px]">PK</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2">
                    <span className="text-on-surface">email: String</span>
                    <span className="text-tertiary text-[10px] uppercase font-bold">unique</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2">
                    <span className="text-on-surface">fullName: String</span>
                    <span className="text-on-surface-variant text-[11px]">varchar(120)</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2">
                    <span className="text-on-surface">createdAt: Instant</span>
                    <span className="text-on-surface-variant text-[11px]">timestamp</span>
                  </div>
                </div>
              </div>

              {/* Node 2: Order Entity */}
              <div className="w-64 bg-surface-container-lowest rounded-xl shadow-lg ring-2 ring-primary/30 overflow-hidden shrink-0 border border-primary/20">
                <div className="bg-primary text-on-primary px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">table_chart</span>
                    <span className="font-headline font-bold text-sm">Order</span>
                  </div>
                  <span className="text-[10px] font-label uppercase px-1.5 py-0.5 rounded bg-on-primary/20 text-on-primary font-semibold">
                    Active Node
                  </span>
                </div>
                <div className="p-3 space-y-1.5 font-label text-xs">
                  <div className="flex items-center justify-between py-1 bg-primary/5 px-2 rounded">
                    <span className="text-primary font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">key</span> id: UUID
                    </span>
                    <span className="text-on-surface-variant text-[11px]">PK</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2 bg-secondary-fixed/30 rounded">
                    <span className="text-on-surface font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-secondary">link</span> userId: UUID
                    </span>
                    <span className="text-primary text-[10px] font-bold">FK • User</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2">
                    <span className="text-on-surface">orderStatus: Enum</span>
                    <span className="text-on-surface-variant text-[11px]">OrderStatus</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2">
                    <span className="text-on-surface">totalAmount: BigDecimal</span>
                    <span className="text-on-surface-variant text-[11px]">numeric(12,2)</span>
                  </div>
                </div>
              </div>

              {/* Node 3: OrderItem Entity */}
              <div className="w-64 bg-surface-container-lowest rounded-xl shadow-md overflow-hidden shrink-0 border border-surface-container">
                <div className="bg-surface-container-high px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">table_chart</span>
                    <span className="font-headline font-bold text-sm text-on-surface">OrderItem</span>
                  </div>
                  <span className="text-[10px] font-label uppercase px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-semibold">
                    @Entity
                  </span>
                </div>
                <div className="p-3 space-y-1.5 font-label text-xs">
                  <div className="flex items-center justify-between py-1 bg-primary/5 px-2 rounded">
                    <span className="text-primary font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">key</span> id: UUID
                    </span>
                    <span className="text-on-surface-variant text-[11px]">PK</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2">
                    <span className="text-on-surface">orderId: UUID</span>
                    <span className="text-primary text-[10px] font-bold">FK • Order</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2">
                    <span className="text-on-surface">productId: UUID</span>
                    <span className="text-primary text-[10px] font-bold">FK • Product</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2">
                    <span className="text-on-surface">quantity: Integer</span>
                    <span className="text-on-surface-variant text-[11px]">int4</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Node (Lower Row) */}
            <div className="relative z-20 mt-8 ml-0 md:ml-[540px] w-64 bg-surface-container-lowest rounded-xl shadow-md overflow-hidden border border-surface-container">
              <div className="bg-surface-container-high px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">table_chart</span>
                  <span className="font-headline font-bold text-sm text-on-surface">Product</span>
                </div>
                <span className="text-[10px] font-label uppercase px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-semibold">
                  @Entity
                </span>
              </div>
              <div className="p-3 space-y-1.5 font-label text-xs">
                <div className="flex items-center justify-between py-1 bg-primary/5 px-2 rounded">
                  <span className="text-primary font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">key</span> id: UUID
                  </span>
                  <span className="text-on-surface-variant text-[11px]">PK</span>
                </div>
                <div className="flex items-center justify-between py-1 px-2">
                  <span className="text-on-surface">sku: String</span>
                  <span className="text-tertiary text-[10px] font-bold uppercase">idx</span>
                </div>
                <div className="flex items-center justify-between py-1 px-2">
                  <span className="text-on-surface">unitPrice: BigDecimal</span>
                  <span className="text-on-surface-variant text-[11px]">numeric(10,2)</span>
                </div>
              </div>
            </div>

            {/* Floating Assistant Panel & Realtime Spring Boot Code Inspector */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-30">
              {/* AI Copilot Suggestion Box */}
              <div className="lg:col-span-5 bg-surface-container-lowest/95 backdrop-blur-md rounded-xl p-4 shadow-lg flex flex-col justify-between border border-surface-container">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-tertiary">
                      <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                      <span className="font-label text-xs font-bold uppercase tracking-wider">Copiloto de Arquitectura</span>
                    </div>
                    <span className="text-[11px] font-label text-on-surface-variant">Confianza 98%</span>
                  </div>
                  <p className="text-xs font-body text-on-surface leading-relaxed mb-3">
                    “He detectado que la entidad <code className="px-1.5 py-0.5 rounded bg-surface-container text-primary font-mono font-bold">Order</code> carece de mecanismo de liquidación. Se recomienda asociar <code className="px-1.5 py-0.5 rounded bg-surface-container text-primary font-mono font-bold">Payment</code> (1:1 o 1:N) con estados idempotentes.”
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label text-xs font-semibold hover:opacity-90 transition-opacity">
                    Aplicar Relación Sugerida
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant font-label text-xs font-medium hover:bg-surface-container-high transition-colors">
                    Descartar
                  </button>
                </div>
              </div>

              {/* Floating Real-Time Spring Boot Code Inspector */}
              <div className="lg:col-span-7 bg-inverse-surface rounded-xl p-4 shadow-lg text-inverse-on-surface">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed"></span>
                    <span className="font-mono text-xs font-semibold text-surface-dim">Order.java • Spring Boot 3 JPA Entity</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-inverse-on-surface font-medium">
                    Auto-generated in 12ms
                  </span>
                </div>
                <pre className="font-mono text-xs leading-relaxed overflow-x-auto text-surface-variant">
                  <code>
                    <span className="text-primary-fixed-dim">@Entity</span>{'\n'}
                    <span className="text-primary-fixed-dim">@Table</span>(name = <span className="text-tertiary-fixed">"orders"</span>){'\n'}
                    <span className="text-secondary-fixed">public class</span> <span className="text-surface-bright font-bold">Order</span> {'{\n'}
                    {'    '}<span className="text-primary-fixed-dim">@Id</span>{'\n'}
                    {'    '}<span className="text-primary-fixed-dim">@GeneratedValue</span>(strategy = GenerationType.UUID){'\n'}
                    {'    '}<span className="text-secondary-fixed">private</span> UUID id;{'\n\n'}
                    {'    '}<span className="text-primary-fixed-dim">@ManyToOne</span>(fetch = FetchType.LAZY){'\n'}
                    {'    '}<span className="text-primary-fixed-dim">@JoinColumn</span>(name = <span className="text-tertiary-fixed">"user_id"</span>, nullable = <span className="text-tertiary-fixed-dim">false</span>){'\n'}
                    {'    '}<span className="text-secondary-fixed">private</span> User user;{'\n\n'}
                    {'    '}<span className="text-primary-fixed-dim">@OneToMany</span>(mappedBy = <span className="text-tertiary-fixed">"order"</span>, cascade = CascadeType.ALL){'\n'}
                    {'    '}<span className="text-secondary-fixed">private</span> List&lt;OrderItem&gt; items = <span className="text-secondary-fixed">new</span> ArrayList&lt;&gt;();{'\n'}
                    {'}'}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
