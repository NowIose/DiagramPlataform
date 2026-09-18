import React from 'react';
import { Users, Mic, Code2, Smartphone, FileSpreadsheet, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Edición Colaborativa en Tiempo Real',
    description: 'Trabaja concurrentemente en diagramas de clases y relacionales con tu equipo usando WebSockets (STOMP/SockJS).',
  },
  {
    icon: Mic,
    title: 'Asistente de IA Multimodal',
    description: 'Modifica diagramas por comandos de voz o texto, y convierte fotos de bocetos hechos a mano en objetos editables.',
  },
  {
    icon: Code2,
    title: 'Generación Automática de Backend',
    description: 'Convierte tus modelos en un proyecto Spring Boot 3 funcional con arquitectura en capas, DTOs y scripts DDL para PostgreSQL.',
  },
  {
    icon: Smartphone,
    title: 'Cliente Móvil Offline-First',
    description: 'App en Flutter con modelos comprimidos locales para continuar modelando sin conexión a internet.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Interoperabilidad Empresarial',
    description: 'Importa y exporta modelos XMI/XML compatibles con Enterprise Architect.',
  },
  {
    icon: ShieldCheck,
    title: 'Seguridad y Autenticación',
    description: 'Autenticación dual segura con JWT, BCrypt y soporte para Google OAuth2.',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900 border-t border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Todo lo que necesitas para acelerar el desarrollo de software
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Diseñado según los más altos estándares de ingeniería y asistencia por Inteligencia Artificial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
