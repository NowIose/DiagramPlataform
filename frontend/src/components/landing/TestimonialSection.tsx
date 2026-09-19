import React from 'react';

export const TestimonialSection: React.FC = () => {
  return (
    <section className="w-full px-6 lg:px-12 py-16 bg-surface-container-lowest">
      <div className="max-w-5xl mx-auto bg-surface-container-low rounded-2xl p-8 lg:p-12 shadow-sm flex flex-col md:flex-row items-center gap-8 border border-surface-container">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 shadow-md">
          <img
            className="w-full h-full object-cover"
            alt="Portrait of senior software engineering architect"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIkiUg4IYyDWfJkt1aLy4YA8n8dgyAj5ITzD4o4jd3GcccgZeV87nd5_5AdOgIR7Hhlyppc5QnfZOHDsB6w8jRmAOa6Lqdr0aygvzaiENF_zF_Yom86Qz6bjfhVfUwTHayF_yJ528jcNnTwqLW4OhN8M7gEmuxHi-yGBHUm-HLZ0T4_equ1OLT_BxyQutp82Lu4v6r4E7FnWw_BOoCE8KDcDsy-WhlcUp6Wjz41VzctFagY5uLusw"
          />
        </div>
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-1 text-tertiary">
            <span className="material-symbols-outlined text-[18px]">star</span>
            <span className="material-symbols-outlined text-[18px]">star</span>
            <span className="material-symbols-outlined text-[18px]">star</span>
            <span className="material-symbols-outlined text-[18px]">star</span>
            <span className="material-symbols-outlined text-[18px]">star</span>
          </div>
          <blockquote className="font-headline text-base sm:text-lg text-on-surface italic leading-relaxed">
            “DiagramConnect eliminó por completo la brecha entre las sesiones de arquitectura en pizarra y el primer pull request de backend. Generar entidades JPA impecables con migraciones Flyway desde un boceto nos ahorró más de 80 horas por microservicio.”
          </blockquote>
          <div className="text-xs font-label text-on-surface-variant">
            <strong className="text-on-surface font-semibold">Martín S. Velázquez</strong> • Staff Backend Engineer en Fintech Global Labs
          </div>
        </div>
      </div>
    </section>
  );
};
