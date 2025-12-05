import React from 'react';
import { CircleHelp } from 'lucide-react';

// --- Tipos ---
export type SubStackItem = {
  icon: React.ElementType;
  name: string;
};

export type MainStackItem = {
  icon: React.ElementType;
  name: string;
};

interface IconProps {
  size: 'big' | 'small' | number;
  text?: string;
  component: MainStackItem[];
  subStack?: SubStackItem[];
}

// --- Componente de Tooltip ---
const Tooltip = ({ text }: { text: string }) => (
  <div className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out z-50">
    <div className="relative bg-zinc-800 text-zinc-200 text-xs font-medium py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap border border-zinc-700/50">
      {text}
      {/* Setinha */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800 border-r border-b border-zinc-700/50 rotate-45"></div>
    </div>
  </div>
);

function IconMagic({ component, size, text, subStack }: IconProps) {
  const real_size = size === 'big' ? 48 : size === 'small' ? 24 : size;
  const sub_size = 20;

  const safeComponent =
    component.length > 0 ? component : [{ icon: CircleHelp, name: 'Undefined' }];

  const FirstIcon = safeComponent[0].icon;

  return (
    <div className="group/card flex flex-col justify-between items-center p-5 rounded-2xl text-white border border-white/5 bg-zinc-900/60 shadow-2xl backdrop-blur-sm font-sans transition-all duration-300 hover:bg-zinc-900/80 hover:border-white/10 hover:-translate-y-1 h-full min-h-40">
      {/* --- Área Principal --- */}
      <div className="flex flex-col items-center grow justify-center w-full mb-2">
        {safeComponent.length === 1 ? (
          // =================================================
          // CASO 1: Ícone Único (Correção aplicada aqui)
          // =================================================
          <>
            {/* Adicionado 'group relative' e o Tooltip aqui */}
            <div className="group relative p-3 bg-white/5 rounded-2xl mb-3 group-hover/card:bg-white/10 transition-colors cursor-help">
              <Tooltip text={safeComponent[0].name} />
              <FirstIcon size={real_size} className="text-gray-100" />
            </div>

            <h4 className="font-bold text-lg text-gray-100 text-center tracking-tight">
              {text || safeComponent[0].name}
            </h4>
          </>
        ) : (
          // =================================================
          // CASO 2: Múltiplos Ícones (Correção aplicada aqui)
          // =================================================
          <div className="flex flex-col items-center">
            <div className="flex flex-row items-center justify-center gap-3 mb-3">
              {safeComponent.map((item, index) => {
                const CurrentIcon = item.icon;
                return (
                  <React.Fragment key={index}>
                    {/* Adicionado 'group relative' e o Tooltip em cada ícone do loop */}
                    <div className="group relative flex flex-col items-center cursor-help">
                      <Tooltip text={item.name} />

                      <div className="p-2.5 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                        <CurrentIcon size={real_size * 0.9} className="text-gray-100" />
                      </div>
                    </div>

                    {index < safeComponent.length - 1 && (
                      <span className="text-zinc-600 text-xl font-light">+</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            {text && (
              <h4 className="font-bold text-lg text-gray-100 text-center tracking-tight">{text}</h4>
            )}
          </div>
        )}
      </div>

      {/* --- Tech Stack (Ícones Pequenos) --- */}
      {subStack && subStack.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/5 w-full flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-2">
            {subStack.map((item, index) => {
              const SubIcon = item.icon;
              return (
                <div
                  key={index}
                  className="group relative flex items-center justify-center p-2 rounded-lg bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/10 transition-all duration-200 cursor-help"
                >
                  <Tooltip text={item.name} />
                  <SubIcon
                    size={sub_size}
                    className="text-zinc-500 group-hover:text-zinc-200 transition-colors"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default IconMagic;
