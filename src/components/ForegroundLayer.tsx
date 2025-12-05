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
    <div className="flex items-center gap-3 text-left transition-transform duration-300 hover:scale-105 group/item cursor-default">
      {/* Container do Ícone */}
      <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-orange-400/80 shadow-[0_0_10px_rgba(249,115,22,0.1)] group-hover/item:text-orange-400 group-hover/item:border-orange-500/30 group-hover/item:shadow-[0_0_15px_rgba(249,115,22,0.2)] transition-all">
        {icon}
      </div>

      {/* Textos */}
      <div className="flex flex-col">
        <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase group-hover/item:text-gray-300 transition-colors">
          {label}
        </span>
        <span className="text-sm font-semibold text-gray-200 tracking-wide group-hover/item:text-white transition-colors">
          {value}
        </span>
      </div>
    </div>
  );
}

// Componente auxiliar SocialLink
function SocialLink({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 text-gray-300 transition-all duration-500 rounded-full bg-white/5 hover:bg-white/15 hover:text-white hover:scale-110 backdrop-blur-md border border-white/5 hover:border-orange-500/30 shadow-[0_0_10px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]"
    >
      {icon}
    </a>
  );
}

const useTypewriterOnce = (text: string, speed = 150) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
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
  // Usamos useRef para acessar o elemento DOM diretamente e aplicar transformações
  // sem causar re-renderizações do React, o que é muito mais performático.
  const contentRef = useRef<HTMLDivElement>(null);

  // Variáveis para guardar a posição alvo (onde o mouse está) e a posição atual (onde o elemento está)
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  // Fator de suavização (lerp). Quanto menor, mais suave e lento é o movimento.
  // 0.05 a 0.1 é um bom intervalo para um efeito "flutuante".
  const LERP_FACTOR = 0.08;

  // Intensidade do movimento. Negativo = oposto ao mouse (profundidade).
  const INTENSITY = -30;

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
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Normaliza a posição do mouse de -0.5 a 0.5
      const x = e.clientX / innerWidth - 0.5;
      const y = e.clientY / innerHeight - 0.5;

      // Define a nova posição alvo baseada na intensidade
      targetPos.current = {
        x: x * INTENSITY,
        y: y * INTENSITY,
      };
    };

    // Função de loop de animação
    const animate = () => {
      if (!contentRef.current) return;

      // Interpolação linear (Lerp) para suavizar o movimento entre a posição atual e a alvo
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * LERP_FACTOR;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * LERP_FACTOR;

      // Aplica a transformação diretamente no estilo do elemento
      // Usamos translate3d para forçar aceleração de hardware
      contentRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`;

      // Chama o próximo frame
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    // Inicia o loop de animação
    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId); // Limpa o loop ao desmontar
    };
  }, [INTENSITY]);

  const typingSurname = useTypewriterOnce('KLABACHER', 200);

  return (
    // Container principal com pointer-events-none para deixar clicar no fundo
    <div className="flex flex-col justify-between w-full h-full pointer-events-none">
      {/* --- HEADER --- */}
      {/* pointer-events-auto para permitir interação com links e botões do header */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between w-full p-6 pointer-events-auto z-50">
        <div className="px-4 py-2 font-bold tracking-tighter text-white border rounded-lg bg-white/5 border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.2)]">
          J. KLABACHER
        </div>

        {/* Navegação */}
        <nav className="flex gap-4">
          <SocialLink icon={<Github />} href="https://github.com/klabacher/" />
          <SocialLink
            icon={<LinkedinIcon size={20} />}
            href="https://www.linkedin.com/in/joaovitorklabacher/"
          />
          {/* <SocialLink icon={<Mail size={20} />} href="mailto:seuemail@exemplo.com" /> */}
        </nav>
      </header>

      {/* --- ELEMENTO CENTRAL (Com Parallax Suave) --- */}
      <main className="flex items-center justify-center grow w-full">
        <div ref={contentRef} className="pointer-events-auto will-change-transform">
          <div className="text-center group">
            <h1 className="flex flex-col items-center gap-6 text-5xl font-bold text-white drop-shadow-2xl">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-3xl -z-10 group-hover:bg-orange-500/40 transition-all duration-700"></div>
                <span className="p-6 transition-all duration-700 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05),0_0_30px_rgba(0,0,0,0.3)] group-hover:border-orange-500/50 group-hover:shadow-[inset_0_0_30px_rgba(249,115,22,0.1),0_0_50px_rgba(249,115,22,0.4)] block">
                  <Github
                    size={32}
                    className="text-gray-200 transition-colors duration-500 group-hover:text-orange-400 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]"
                  />
                </span>
              </div>

              <span className="tracking-[0.25em] text-lg text-transparent bg-clip-text bg-linear-to-b from-white via-white to-white/50 font-extrabold filter drop-shadow-lg">
                JOÃO VITOR
              </span>
              {/* tracking-[0.25em] text-transparent bg-clip-text bg-linear-to-b from-white via-white to-white/50 font-extrabold filter drop-shadow-lg */}
              <div className="flex items-center justify-center h-[1.2em]">
                <span className="cursor-blink tracking-[0.25em] border-r-2 border-orange-500 text-transparent bg-clip-text bg-linear-to-b from-white via-white to-white/50 font-extrabold filter drop-shadow-lg">
                  {typingSurname}
                </span>
              </div>
            </h1>

            <p className="mt-5 text-sm font-medium tracking-[0.4em] text-orange-300/80 uppercase border-t border-orange-500/30 pt-4 mx-10">
              Fullstack Developer
            </p>

            <section className="flex flex-wrap justify-center gap-8 mt-12 border-t border-white/10 pt-8 px-10 backdrop-blur-[2px]">
              <SkillItem icon={<Code2 size={20} />} label="Fullstack" value="Developer" />

              <SkillItem icon={<Sparkles size={20} />} label="Soluções" value="Inteligentes" />

              <SkillItem icon={<BrainCircuit size={20} />} label="I.A." value="Aplicada" />
            </section>
          </div>
        </div>
      </main>

      <div className="absolute bottom-10 w-full flex justify-center pb-4 z-50">
        {/* <p>MAIS SOBRE</p> */}
        <button
          onClick={handleScrollDown}
          className="group pointer-events-auto p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-bounce hover:bg-white/10 hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all duration-300"
          aria-label="Rolar para baixo"
        >
          <ChevronDown
            size={28}
            className="text-gray-400 group-hover:text-white transition-colors"
          />
        </button>
      </div>

      {/* Espaçador para equilibrar o layout verticalmente */}
      <div className="h-28" />
    </div>
  );
}
