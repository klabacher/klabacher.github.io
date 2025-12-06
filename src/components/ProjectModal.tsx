import { useState, useEffect } from 'react';
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
  icon: IconType;
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
  const [isFullScreen, setIsFullScreen] = useState(false); // Novo estado para Full Screen

  // Controla animação de entrada/saída
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10); // Pequeno delay para permitir renderização
      document.body.style.overflow = 'hidden'; // Bloqueia scroll da página
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300); // Espera animação acabar
      document.body.style.overflow = 'unset'; // Libera scroll
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Resetar estados internos quando mudar de projeto
  useEffect(() => {
    if (project) {
      setCurrentImageIndex(0);
      setIsDescriptionExpanded(false);
      setIsFullScreen(false); // Garante que começa fechado
    }
  }, [project]);

  // Fechar com ESC (Atualizado para fechar FullScreen primeiro)
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
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, isFullScreen]);

  if (!isVisible || !project) return null;

  const currentImage = project.images[currentImageIndex];

  return (
    <>
      {/* --- Overlay (Fundo Escuro do Modal Principal) --- */}
      <div
        className={`fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ease-out ${
          isAnimating ? 'backdrop-blur-md bg-black/80' : 'backdrop-blur-none bg-black/0'
        }`}
        onClick={onClose} // Clicar fora fecha
      >
        {/* --- Container do Modal --- */}
        <div
          className={`relative w-full max-w-6xl max-h-[90vh] bg-[#0f0f0f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${
            isAnimating
              ? 'scale-100 opacity-100 translate-y-0'
              : 'scale-90 opacity-0 translate-y-10'
          }`}
          onClick={e => e.stopPropagation()} // Impede que clique dentro feche o modal
        >
          {/* Header Fixo com Botão Fechar */}
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/50 border border-white/10 text-white hover:bg-white/20 hover:scale-110 transition-all duration-200 backdrop-blur-md group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* --- Conteúdo com Scroll --- */}
          <div className="overflow-y-auto custom-scrollbar flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-full">
              {/* --- COLUNA DA ESQUERDA: GALERIA (lg:col-span-7) --- */}
              <div className="lg:col-span-7 bg-black/20 p-6 lg:p-10 flex flex-col justify-center">
                {/* Imagem Principal */}
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg group bg-[#0a0a0a]">
                  <img
                    src={currentImage?.url}
                    alt={currentImage?.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Botão de Maximizar (Novo) */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setIsFullScreen(true);
                    }}
                    className="absolute top-3 right-3 p-2 bg-black/60 border border-white/10 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-orange-500 hover:border-orange-400 hover:scale-110 z-20 shadow-lg"
                    title="Expandir Imagem"
                  >
                    <Maximize2 size={20} />
                  </button>

                  {/* Overlay da legenda da imagem */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/90 via-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
                    <h4 className="text-white font-bold text-lg">{currentImage?.title}</h4>
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {currentImage?.description}
                    </p>
                  </div>
                </div>

                {/* Thumbnails (Só mostra se tiver mais de 1 imagem) */}
                {project.images.length > 1 && (
                  <div className="flex gap-3 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                    {project.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          currentImageIndex === index
                            ? 'border-orange-500 scale-105 ring-2 ring-orange-500/20'
                            : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                        }`}
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* --- COLUNA DA DIREITA: DETALHES (lg:col-span-5) --- */}
              <div className="lg:col-span-5 p-8 lg:p-10 bg-[#141414] flex flex-col border-l border-white/5">
                {/* Título e Short Description */}
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                    {project.title}
                  </h2>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {project.shortDescription}
                  </p>
                </div>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.techStack.map(tech => (
                    <span
                      key={tech.name}
                      className="px-3 py-1 text-xs text-center font-semibold uppercase tracking-wider text-orange-300 bg-orange-500/10 border border-orange-500/20 rounded-full"
                    >
                      <SmallIcon name={tech.name} icon={tech.icon} size={24} />
                      {tech.name}
                    </span>
                  ))}
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-4 mb-8">
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

                {/* Descrição Expansível */}
                <div className="relative">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Maximize2 size={16} className="text-orange-500" />
                    Detalhes do Projeto
                  </h3>

                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out relative ${
                      isDescriptionExpanded ? 'max-h-[500px] opacity-100' : 'max-h-24 opacity-80'
                    }`}
                  >
                    <p className="text-gray-300 leading-7 whitespace-pre-line text-sm">
                      {project.fullDescription}
                    </p>

                    {/* Gradiente para esconder texto quando fechado */}
                    {!isDescriptionExpanded && (
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-[#141414] to-transparent pointer-events-none" />
                    )}
                  </div>

                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="mt-2 text-sm font-medium text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors outline-none"
                  >
                    {isDescriptionExpanded ? (
                      <>
                        <ChevronUp size={16} /> Ler menos
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} /> Ler mais
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Full Screen Image Overlay --- */}
      {isFullScreen && (
        <div
          className="fixed inset-0 z-10000 bg-black/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-300"
          onClick={() => setIsFullScreen(false)}
        >
          {/* Botão Fechar do FullScreen */}
          <button
            onClick={() => setIsFullScreen(false)}
            className="absolute top-6 right-6 p-3 bg-white/10 border border-white/10 hover:bg-white/20 text-white rounded-full transition-all z-50 hover:rotate-90 hover:scale-110"
          >
            <X size={32} />
          </button>

          {/* Container da Imagem Centralizada */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
            <img
              src={currentImage?.url}
              alt={currentImage?.title}
              className="max-w-full max-h-full object-contain shadow-2xl rounded-sm transition-transform duration-300"
              onClick={e => e.stopPropagation()} // Permite clicar na imagem sem fechar? (Opcional, removi para consistência com bg)
            />
          </div>

          {/* Footer com Informações */}
          <div
            className="w-full bg-gradient-to-t from-black via-black/90 to-transparent pt-12 pb-10 px-6 text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="max-w-5xl mx-auto">
              {/* Nome do Projeto */}
              <h3 className="text-orange-500 font-bold text-sm tracking-[0.25em] uppercase mb-3 opacity-90">
                {project.title}
              </h3>

              {/* Título da Imagem */}
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                {currentImage?.title}
              </h2>

              {/* Descrição da Imagem */}
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
