import { useState, useEffect, useRef } from 'react';
import { X, Github, ExternalLink, ChevronDown, ChevronUp, Maximize2 } from 'lucide-react';
import { IconType } from '@icons-pack/react-simple-icons';
import { SmallIcon } from './IconMagic';

// --- Tipos de Dados ---
export interface ProjectImage {
  url: string;
  title: string;
  description: string;
}

export interface techInfo {
  name: string;
  icon: IconType; // manter assim para compatibilidade com react-simple-icons
}

export interface ProjectData {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string; // Markdown ou HTML text
  techStack: techInfo[];
  images: ProjectImage[];
  githubUrl?: string;
  liveUrl?: string;
}

interface ProjectModalProps {
  project: ProjectData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false); // Estado para Full Screen
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Controla animação de entrada/saída
  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>('[data-app-scroll]');
    const previousOverflow = scrollContainer?.style.overflow;
    let animationFrame = 0;
    let visibilityTimer = 0;

    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement | null;
      setIsVisible(true);
      animationFrame = requestAnimationFrame(() => {
        setIsAnimating(true);
        closeButtonRef.current?.focus();
      });
      if (scrollContainer) scrollContainer.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      visibilityTimer = window.setTimeout(() => setIsVisible(false), 300);
      previouslyFocusedElement.current?.focus();
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(visibilityTimer);
      if (scrollContainer) scrollContainer.style.overflow = previousOverflow ?? '';
    };
  }, [isOpen]);

  // Resetar estados internos
  useEffect(() => {
    if (project) {
      setCurrentImageIndex(0);
      setIsDescriptionExpanded(false);
      setIsFullScreen(false);
    }
  }, [project]);

  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullScreen) {
          setIsFullScreen(false);
        } else {
          onClose();
        }
      }
    };
    if (!isVisible) return;

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, isFullScreen, isVisible]);

  if (!isVisible || !project) return null;

  const currentImage = project.images[currentImageIndex];

  return (
    <>
      {/* --- Overlay Principal --- */}
      <div
        className={`fixed inset-0 z-9999 flex items-center justify-center p-2 sm:p-6 transition-all duration-300 ease-out ${
          isAnimating ? 'backdrop-blur-md bg-black/80' : 'backdrop-blur-none bg-black/0'
        }`}
        onClick={onClose}
      >
        {/* --- Container do Modal --- */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          className={`modal-panel relative flex w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f0f] shadow-2xl transition-all duration-500 sm:max-h-[90vh] sm:rounded-3xl cubic-bezier(0.34,1.56,0.64,1) ${
            isAnimating
              ? 'scale-100 opacity-100 translate-y-0'
              : 'scale-90 opacity-0 translate-y-10'
          }`}
          onClick={e => e.stopPropagation()}
        >
          {/* Header Fixo com Botão Fechar */}
          <div className="absolute top-4 right-4 z-20">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Fechar detalhes do projeto"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/10 bg-black/60 p-2 text-white backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* --- Conteúdo com Scroll --- */}
          <div
            className={`
              overflow-y-auto overscroll-contain flex-1
              /* Estilização da Scrollbar Principal */
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-[#0f0f0f]
              [&::-webkit-scrollbar-thumb]:bg-white/10
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:hover:bg-orange-500/30
              [&::-webkit-scrollbar-thumb]:transition-colors
            `}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-full">
              {/* --- COLUNA DA ESQUERDA: GALERIA --- */}
              <div className="flex flex-col justify-center bg-black/20 p-4 pt-16 sm:p-6 sm:pt-16 lg:col-span-7 lg:p-10">
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg group bg-[#0a0a0a]">
                  <img
                    src={currentImage?.url}
                    alt={currentImage?.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />

                  {/* Botão de Maximizar */}
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setIsFullScreen(true);
                    }}
                    aria-label="Expandir imagem"
                    className="absolute top-3 right-3 z-20 flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/10 bg-black/60 p-2 text-white opacity-100 shadow-lg transition-all duration-300 hover:scale-110 hover:border-orange-400 hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                    title="Expandir Imagem"
                  >
                    <Maximize2 size={20} />
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 translate-y-0 bg-linear-to-t from-black/90 via-black/60 to-transparent p-3 pr-16 transition-transform duration-300 pointer-events-none sm:translate-y-full sm:p-4 sm:group-hover:translate-y-0 sm:group-focus-within:translate-y-0">
                    <h4 className="text-sm font-bold text-white sm:text-lg">
                      {currentImage?.title}
                    </h4>
                    <p className="line-clamp-1 text-xs text-gray-300 sm:line-clamp-2 sm:text-sm">
                      {currentImage?.description}
                    </p>
                  </div>
                </div>

                {project.images.length > 1 && (
                  <div className="flex gap-3 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                    {project.images.map((img, index) => (
                      <button
                        type="button"
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        aria-label={`Mostrar imagem ${index + 1}: ${img.title}`}
                        aria-pressed={currentImageIndex === index}
                        className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          currentImageIndex === index
                            ? 'border-orange-500 scale-105 ring-2 ring-orange-500/20'
                            : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt=""
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* --- COLUNA DA DIREITA: DETALHES --- */}
              <div className="flex flex-col border-t border-white/5 bg-[#141414] p-5 sm:p-8 lg:col-span-5 lg:border-t-0 lg:border-l lg:p-10">
                <div className="mb-6">
                  <h2
                    id="project-modal-title"
                    className="mb-2 pr-10 text-2xl font-bold leading-tight text-white sm:text-3xl"
                  >
                    {project.title}
                  </h2>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {project.shortDescription}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {project.techStack.map(tech => (
                    <span
                      key={tech.name}
                      className="px-3 py-1 text-xs text-center font-semibold uppercase tracking-wider text-orange-300 bg-orange-500/10 border border-orange-500/20 rounded-full"
                    >
                      <SmallIcon name={tech.name} icon={tech.icon} size={14} />
                      <span className="ml-1.5">{tech.name}</span>
                    </span>
                  ))}
                </div>

                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                    >
                      <Github size={20} className="group-hover:rotate-12 transition-transform" />
                      <span>Repositório</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-linear-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold shadow-lg shadow-orange-900/20 transition-all duration-300 hover:shadow-orange-700/40 hover:-translate-y-1 group"
                    >
                      <ExternalLink
                        size={20}
                        className="group-hover:scale-110 transition-transform"
                      />
                      <span>Ver Projeto</span>
                    </a>
                  )}
                </div>

                <div className="w-full h-px bg-white/10 mb-6"></div>

                {/* --- Descrição Expansível Melhorada --- */}
                <div className="relative flex-1 flex flex-col min-h-0">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider opacity-90">
                    <Maximize2 size={16} className="text-orange-500" />
                    Detalhes do Projeto
                  </h3>

                  <div
                    className={`
                      relative transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]
                      ${
                        isDescriptionExpanded
                          ? 'max-h-[40vh] overflow-y-auto pr-3 opacity-100' // Padding para não colar na scrollbar
                          : 'max-h-24 overflow-hidden opacity-70'
                      }
                      /* Scrollbar Estilizada */
                      [&::-webkit-scrollbar]:w-1.5
                      [&::-webkit-scrollbar-track]:bg-white/5
                      [&::-webkit-scrollbar-track]:rounded-full
                      [&::-webkit-scrollbar-thumb]:bg-orange-500/20
                      [&::-webkit-scrollbar-thumb]:rounded-full
                      [&::-webkit-scrollbar-thumb]:hover:bg-orange-500/40
                    `}
                  >
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm font-light text-justify">
                      {project.fullDescription}
                    </p>

                    {/* Gradiente de Fade */}
                    {!isDescriptionExpanded && (
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-[#141414] to-transparent pointer-events-none" />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    aria-expanded={isDescriptionExpanded}
                    className="mt-4 self-start text-[10px] uppercase tracking-widest font-bold text-orange-400 hover:text-orange-300 flex items-center gap-2 transition-all hover:gap-3 outline-none group/btn"
                  >
                    {isDescriptionExpanded ? (
                      <>
                        Ler menos{' '}
                        <ChevronUp
                          size={14}
                          className="group-hover/btn:-translate-y-0.5 transition-transform"
                        />
                      </>
                    ) : (
                      <>
                        Ler mais{' '}
                        <ChevronDown
                          size={14}
                          className="group-hover/btn:translate-y-0.5 transition-transform"
                        />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Full Screen Overlay --- */}
      {isFullScreen && (
        <div
          className="fixed inset-0 z-10000 bg-black/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-300"
          onClick={() => setIsFullScreen(false)}
        >
          <button
            type="button"
            onClick={() => setIsFullScreen(false)}
            aria-label="Fechar imagem ampliada"
            className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 z-50 flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 p-2 text-white transition-all hover:rotate-90 hover:scale-110 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 sm:top-6 sm:right-6 sm:p-3"
          >
            <X size={32} />
          </button>

          <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
            <img
              src={currentImage?.url}
              alt={currentImage?.title}
              className="max-w-full max-h-full object-contain shadow-2xl rounded-sm transition-transform duration-300"
              onClick={e => e.stopPropagation()}
            />
          </div>

          <div
            className="w-full bg-linear-to-t from-black via-black/90 to-transparent px-4 pt-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center sm:px-6 sm:pt-12 sm:pb-10"
            onClick={e => e.stopPropagation()}
          >
            <div className="max-w-5xl mx-auto">
              <h3 className="text-orange-500 font-bold text-sm tracking-[0.25em] uppercase mb-3 opacity-90">
                {project.title}
              </h3>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                {currentImage?.title}
              </h2>
              <p className="text-gray-300 text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-light">
                {currentImage?.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
