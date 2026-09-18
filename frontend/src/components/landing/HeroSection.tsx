import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Button } from '../common/Button';
import { Sparkles, ArrowRight, Layers, Cpu } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Plataforma de Modelado Colaborativo e Inteligencia Artificial</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          Diseña diagramas colaborativos y genera tu backend en{' '}
          <span className="text-indigo-600 dark:text-indigo-400">Spring Boot</span> al instante
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
          Edita Diagramas de Clases y Modelos Relacionales en tiempo real con tu equipo, refactoriza mediante voz/prompts con IA y genera código limpio listo para producción.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to={ROUTES.REGISTER}>
            <Button size="lg" className="flex items-center gap-2">
              Comenzar Gratis <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to={ROUTES.LOGIN}>
            <Button variant="outline" size="lg">
              Iniciar Sesión
            </Button>
          </Link>
        </div>

        {/* Feature badges preview */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3">
            <Layers className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Lienzo Multiusuario</h4>
              <p className="text-xs text-slate-500">Colaboración en tiempo real por WebSockets</p>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3">
            <Cpu className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">IA Multimodal</h4>
              <p className="text-xs text-slate-500">Refactorización por Voz, Prompts y Fotos</p>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Spring Boot CodeGen</h4>
              <p className="text-xs text-slate-500">Generación automática de Entidades y DTOs</p>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3">
            <Layers className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Offline Mobile</h4>
              <p className="text-xs text-slate-500">App Flutter con modelo SLM local</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
