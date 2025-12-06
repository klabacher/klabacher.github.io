import React, { useState, useEffect } from 'react';
import { Sun, Moon, Zap } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTheme, setMode, selectModalOpen } from '../../store/slices/appSlice';

type WeatherMode = 'day' | 'night' | 'storm';

export default function WeatherControls() {
  const dispatch = useDispatch();
  const mode = useSelector(selectTheme);
  const isModalOpen = useSelector(selectModalOpen);
  const [hovering, setHovering] = useState(false);
  const [isSecondScreen, setIsSecondScreen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSecondScreen(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    const target = document.getElementById('about');
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, []);

  const setModeInner = (newMode: WeatherMode) => {
    dispatch(setMode(newMode));
  };

  // --- Classes Dinâmicas ---

  // Posição: Canto superior direito (horizontal) ou Lateral esquerda (vertical)
  const positionClasses = isSecondScreen ? 'bottom-3 left-3 flex-row' : 'top-1/3 left-3 flex-col';
  // Visibilidade: Some se o modal estiver aberto
  const visibilityClasses = isModalOpen
    ? 'opacity-0 pointer-events-none translate-y-[-10px] scale-90'
    : 'opacity-100 translate-y-0 scale-100';

  // Estilo do Container: Ajuste de sombra/fundo baseado no modo
  const containerStyle =
    mode === 'day'
      ? 'bg-black/40 border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.15)]'
      : 'bg-white/5 border-white/10 hover:bg-white/10';

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={`
        fixed z-200 p-1.5 rounded-2xl border backdrop-blur-md transition-all duration-500 ease-out
        ${positionClasses}
        ${visibilityClasses} 
        ${containerStyle}
      `}
    >
      <div
        className={`flex gap-1.5 transition-all duration-500 ${isSecondScreen ? 'flex-row' : 'flex-col'}`}
      >
        <ControlBtn
          label="Dia"
          active={mode === 'day'}
          onClick={() => setModeInner('day')}
          icon={<Sun size={16} className={mode === 'day' ? 'text-orange-200' : 'text-gray-400'} />}
          wide={hovering && !isSecondScreen}
          activeColor="bg-orange-500/20 border-orange-500/30 text-orange-100"
        />
        <ControlBtn
          label="Noite"
          active={mode === 'night'}
          onClick={() => setModeInner('night')}
          icon={
            <Moon size={16} className={mode === 'night' ? 'text-indigo-200' : 'text-gray-400'} />
          }
          wide={hovering && !isSecondScreen}
          activeColor="bg-indigo-500/30 border-indigo-500/30 text-indigo-100"
        />
        <ControlBtn
          label="Tempestade"
          active={mode === 'storm'}
          onClick={() => setModeInner('storm')}
          icon={
            <Zap size={16} className={mode === 'storm' ? 'text-yellow-200' : 'text-gray-400'} />
          }
          wide={hovering && !isSecondScreen}
          activeColor="bg-yellow-500/20 border-yellow-500/30 text-yellow-100"
        />
      </div>
    </div>
  );
}

function ControlBtn({
  label,
  active,
  onClick,
  icon,
  wide = false,
  activeColor,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  wide: boolean;
  activeColor: string;
}) {
  return (
    <button
      onClick={onClick}
      title={!wide ? label : undefined} // Tooltip nativo se não estiver expandido
      className={`
        relative group flex items-center justify-center p-2 rounded-xl transition-all duration-300 border
        ${active ? `${activeColor} shadow-inner` : 'bg-transparent border-transparent hover:bg-white/10 text-gray-400'}
      `}
    >
      {/* Ícone */}
      <div className="relative z-10 flex items-center justify-center">{icon}</div>

      {/* Texto Expansível (Apenas vertical) */}
      <div
        className={`
          overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]
          ${wide ? 'w-20 opacity-100 ml-2' : 'w-0 opacity-0 ml-0'}
        `}
      >
        <span className="text-xs font-medium whitespace-nowrap block text-left">{label}</span>
      </div>
    </button>
  );
}
