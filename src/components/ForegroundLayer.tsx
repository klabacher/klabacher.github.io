// src/components/ForegroundLayer.tsx
import React, { useRef, useEffect, useState } from 'react';
import {
  Github,
  // Mail,
  Code2, // Novo ícone para Fullstack
  Sparkles, // Novo ícone para Soluções
  BrainCircuit,
  LinkedinIcon,
  ChevronDown, // Novo ícone para IA
} from 'lucide-react';

// Componente auxiliar para os itens de habilidade
function SkillItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="group/item flex min-w-0 cursor-default flex-col items-center gap-1.5 text-center transition-transform duration-300 hover:scale-105 sm:flex-row sm:gap-3 sm:text-left">
      {/* Container do Ícone */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-orange-400/80 shadow-[0_0_10px_rgba(249,115,22,0.1)] transition-all group-hover/item:border-orange-500/30 group-hover/item:text-orange-400 group-hover/item:shadow-[0_0_15px_rgba(249,115,22,0.2)] sm:p-2.5">
        {icon}
      </div>

      {/* Textos */}
      <div className="flex min-w-0 flex-col items-center sm:items-start">
        <span className="text-[8px] font-bold tracking-wider text-gray-400 uppercase transition-colors group-hover/item:text-gray-300 sm:text-[10px] sm:tracking-widest">
          {label}
        </span>
        <span className="text-[11px] leading-tight font-semibold tracking-normal text-gray-200 transition-colors group-hover/item:text-white sm:text-sm sm:tracking-wide">
          {value}
        </span>
      </div>
    </div>
  );
}

// Componente auxiliar SocialLink
function SocialLink({ icon, href, label }: { icon: React.ReactNode; href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/5 bg-white/5 p-3 text-gray-300 shadow-[0_0_10px_rgba(0,0,0,0.2)] backdrop-blur-md transition-all duration-500 hover:scale-110 hover:border-orange-500/30 hover:bg-white/15 hover:text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
    >
      {icon}
    </a>
  );
}

const useTypewriterOnce = (text: string, speed = 150) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayText(text);
      return;
    }

    // Só continua agendando a próxima letra se ainda não terminou
    if (displayText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [displayText, text, speed]);

  return displayText;
};

export default function ForegroundLayer() {
  const contentRef = useRef<HTMLDivElement>(null);

  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  const handleScrollDown = () => {
    const nextSection = document.getElementById('about');

    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!finePointer || reducedMotion) return;

    let animationId = 0;
    let isAnimating = false;

    const animate = () => {
      if (!contentRef.current) {
        isAnimating = false;
        return;
      }

      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.08;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.08;

      contentRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`;

      const delta =
        Math.abs(targetPos.current.x - currentPos.current.x) +
        Math.abs(targetPos.current.y - currentPos.current.y);

      if (delta > 0.05) {
        animationId = requestAnimationFrame(animate);
      } else {
        isAnimating = false;
      }
    };

    const startAnimation = () => {
      if (!isAnimating) {
        isAnimating = true;
        animationId = requestAnimationFrame(animate);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = e.clientX / innerWidth - 0.5;
      const y = e.clientY / innerHeight - 0.5;

      targetPos.current = {
        x: x * -30,
        y: y * -30,
      };
      startAnimation();
    };

    const resetParallax = () => {
      targetPos.current = { x: 0, y: 0 };
      startAnimation();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('blur', resetParallax);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('blur', resetParallax);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const typingSurname = useTypewriterOnce('KLABACHER', 200);

  return (
    <div className="flex flex-col justify-between w-full h-full pointer-events-none">
      <header className="site-header fixed top-0 left-0 right-0 z-50 flex w-full items-center justify-between pointer-events-auto">
        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold tracking-tighter text-white shadow-[0_0_15px_rgba(0,0,0,0.2)] backdrop-blur-md sm:px-4 sm:text-base">
          J. KLABACHER
        </div>

        <nav className="flex gap-2 sm:gap-4" aria-label="Redes sociais">
          <SocialLink icon={<Github />} href="https://github.com/klabacher/" label="GitHub" />
          <SocialLink
            icon={<LinkedinIcon size={20} />}
            href="https://www.linkedin.com/in/joaovitorklabacher/"
            label="LinkedIn"
          />
        </nav>
      </header>

      <main className="hero-main flex w-full grow items-center justify-center px-4 pb-24 pt-24 sm:px-6">
        <div
          ref={contentRef}
          className="w-full max-w-3xl pointer-events-auto will-change-transform"
        >
          <div className="hero-content text-center group">
            <h1 className="flex flex-col items-center gap-4 text-4xl font-bold text-white drop-shadow-2xl sm:gap-6 sm:text-5xl">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-3xl -z-10 group-hover:bg-orange-500/40 transition-all duration-700"></div>
                <span className="block rounded-full border border-white/10 bg-white/5 p-5 shadow-[inset_0_0_20px_rgba(255,255,255,0.05),0_0_30px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-700 group-hover:border-orange-500/50 group-hover:shadow-[inset_0_0_30px_rgba(249,115,22,0.1),0_0_50px_rgba(249,115,22,0.4)] sm:p-6">
                  <Github
                    size={32}
                    className="text-gray-200 transition-colors duration-500 group-hover:text-orange-400 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]"
                  />
                </span>
              </div>

              <span className="text-base font-extrabold tracking-[0.2em] text-transparent bg-clip-text bg-linear-to-b from-white via-white to-white/50 filter drop-shadow-lg sm:text-lg sm:tracking-[0.25em]">
                JOÃO VITOR
              </span>
              <div className="flex items-center justify-center h-[1.2em]">
                <span className="cursor-blink min-w-[10ch] border-r-2 border-orange-500 text-center font-extrabold tracking-[0.16em] text-transparent bg-clip-text bg-linear-to-b from-white via-white to-white/50 filter drop-shadow-lg max-[299px]:text-[2rem] max-[299px]:tracking-[0.1em] sm:tracking-[0.25em]">
                  {typingSurname}
                </span>
              </div>
            </h1>

            <p className="mx-2 mt-5 border-t border-orange-500/30 pt-4 text-xs font-medium uppercase tracking-[0.25em] text-orange-300/80 sm:mx-10 sm:text-sm sm:tracking-[0.4em]">
              Fullstack Developer
            </p>

            <section className="mt-7 grid grid-cols-3 items-start justify-center gap-2 border-t border-white/10 px-0 pt-5 backdrop-blur-[2px] sm:mt-12 sm:gap-8 sm:px-10 sm:pt-8">
              <SkillItem icon={<Code2 size={20} />} label="Fullstack" value="Developer" />

              <SkillItem icon={<Sparkles size={20} />} label="Soluções" value="Inteligentes" />

              <SkillItem icon={<BrainCircuit size={20} />} label="I.A." value="Aplicada" />
            </section>
          </div>
        </div>
      </main>

      <div className="absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 flex w-full justify-end pr-[max(1rem,env(safe-area-inset-right))] pb-2 sm:bottom-6 sm:pb-4 md:justify-center md:pr-0">
        <button
          onClick={handleScrollDown}
          className="group flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 p-2.5 backdrop-blur-md animate-bounce pointer-events-auto transition-all duration-300 hover:border-orange-500/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 sm:p-3"
          aria-label="Rolar para baixo"
        >
          <ChevronDown
            size={28}
            className="text-gray-400 group-hover:text-white transition-colors"
          />
        </button>
      </div>

      <div className="h-28" />
    </div>
  );
}
