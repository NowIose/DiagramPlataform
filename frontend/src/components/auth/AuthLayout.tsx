import React, { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface font-body text-on-surface antialiased flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl mx-auto bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden my-auto border border-surface-container-high">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* Left Column: Architectural Branding & Product Intelligence */}
          <div className="lg:col-span-5 bg-gradient-to-br from-on-primary-fixed via-primary-container to-primary text-surface-container-lowest p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient architectural grid overlay background */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            ></div>
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-primary-fixed-dim/20 blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              {/* Back to Home & Logo */}
              <div className="flex items-center justify-between mb-8">
                <Link to={ROUTES.HOME} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-lowest/15 backdrop-blur-md flex items-center justify-center text-tertiary-fixed shadow-sm group-hover:bg-surface-container-lowest/25 transition-all">
                    <span className="material-symbols-outlined text-2xl">account_tree</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-headline font-bold text-xl tracking-tight text-surface-container-lowest">
                        Diagram<span className="text-primary-fixed">Connect</span>
                      </span>
                      <span className="inline-block w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse"></span>
                    </div>
                    <p className="font-label text-[10px] tracking-widest uppercase text-primary-fixed-dim/80 font-medium">
                      AI &amp; Collaborative Architect
                    </p>
                  </div>
                </Link>
              </div>

              {/* Main Value Proposition */}
              <div className="space-y-3 mb-8">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/10 backdrop-blur-md text-[11px] font-label font-medium tracking-wide text-primary-fixed">
                  <span className="material-symbols-outlined text-xs text-tertiary-fixed">auto_awesome</span>
                  Sistemas de Misión Crítica
                </span>
                <h2 className="font-headline text-2xl lg:text-3xl leading-snug font-semibold text-surface-container-lowest">
                  Tu arquitectura de software, colaborativa y asistida por IA.
                </h2>
              </div>

              {/* Feature Bullets */}
              <div className="space-y-4 font-body text-xs text-primary-fixed-dim">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-surface-container-lowest/15 flex items-center justify-center mt-0.5 text-primary-fixed shrink-0">
                    <span className="material-symbols-outlined text-xs">sync_saved_locally</span>
                  </div>
                  <p className="leading-relaxed">
                    <strong className="text-surface-container-lowest font-medium">Sincronización en tiempo real</strong> con cursores concurrentes y resolución de conflictos CRDT.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-surface-container-lowest/15 flex items-center justify-center mt-0.5 text-tertiary-fixed shrink-0">
                    <span className="material-symbols-outlined text-xs">bolt</span>
                  </div>
                  <p className="leading-relaxed">
                    <strong className="text-surface-container-lowest font-medium">Generación instantánea de Backend</strong> Spring Boot 3 + PostgreSQL DDL con un click.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-surface-container-lowest/15 flex items-center justify-center mt-0.5 text-primary-fixed shrink-0">
                    <span className="material-symbols-outlined text-xs">security</span>
                  </div>
                  <p className="leading-relaxed">
                    <strong className="text-surface-container-lowest font-medium">Acceso seguro empresarial</strong> con SSO/SAML, roles RBAC y trazabilidad auditable.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Floating Widget: Class Diagram linked to SQL script */}
            <div className="relative z-10 mt-8 pt-4 hidden sm:block">
              <div className="bg-inverse-surface/90 backdrop-blur-md p-3.5 rounded-lg shadow-2xl text-[11px] font-mono text-inverse-on-surface border border-white/10">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-error/70 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container/70 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-container inline-block"></span>
                    <span className="text-[10px] text-outline-variant font-label ml-1">Live Architect Sync</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-surface-container-lowest/10 text-tertiary-fixed font-label">
                    v2.4.0-rc
                  </span>
                </div>
                {/* Visual Node: Entity */}
                <div className="bg-surface-container-highest/10 p-2.5 rounded mb-2 border border-white/5">
                  <div className="flex items-center justify-between text-[10px] text-primary-fixed-dim font-bold pb-1 mb-1">
                    <span>«Entity» Customer</span>
                    <span className="material-symbols-outlined text-xs text-tertiary-fixed">memory</span>
                  </div>
                  <div className="text-[10px] text-outline-variant space-y-0.5 leading-tight">
                    <div>+ id : UUID &lt;PK&gt;</div>
                    <div>+ tenant_id : UUID</div>
                    <div>+ corporate_email : String</div>
                  </div>
                </div>
                {/* Visual Bridge link */}
                <div className="flex items-center gap-1.5 py-1 px-1 text-[10px] text-tertiary-fixed">
                  <span className="material-symbols-outlined text-xs rotate-90">alt_route</span>
                  <span>AI Engine: JPA → PostgreSQL Sync</span>
                </div>
                {/* SQL Preview */}
                <div className="bg-surface-container-lowest/5 p-2 rounded text-[10px] text-primary-fixed-dim leading-snug">
                  <span className="text-tertiary-fixed">CREATE TABLE</span> <span className="text-surface-container-lowest">customers</span> ({'\n'}
                  {'  '}id <span className="text-tertiary-fixed">UUID PRIMARY KEY</span>,{'\n'}
                  {'  '}tenant_id <span className="text-tertiary-fixed">UUID NOT NULL</span>{'\n'}
                  );
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Form (Login / Register) */}
          <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-between bg-surface-container-lowest">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
