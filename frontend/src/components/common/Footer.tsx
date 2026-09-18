import React from 'react';
import { Network } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Network className="w-5 h-5 text-indigo-400" />
          <span>DiagramConect Platform</span>
        </div>
        <p>© {new Date().getFullYear()} DiagramConect. Plataforma Colaborativa de Modelado de Software con IA.</p>
        <div className="flex gap-4">
          <span className="hover:underline cursor-pointer">Términos</span>
          <span className="hover:underline cursor-pointer">Privacidad</span>
          <span className="hover:underline cursor-pointer">Contacto</span>
        </div>
      </div>
    </footer>
  );
};
