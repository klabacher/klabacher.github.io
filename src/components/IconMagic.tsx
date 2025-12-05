import React from 'react';
import { CircleHelp } from 'lucide-react';

export type SubStackItem = {
  icon: React.ElementType;
  name?: string;
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

function Icon({ component, size, text, subStack }: IconProps) {
  const real_size = size === 'big' ? 48 : size === 'small' ? 24 : size;
  const sub_size = 18;

  // Garante que sempre tenha um array
  const safeComponent =
    component.length > 0 ? component : [{ icon: CircleHelp, name: 'Undefined' }];

  // 1. Extrai o primeiro ícone para uma variável com Letra Maiúscula
  const FirstIcon = safeComponent[0].icon;

  return (
    <div className="flex flex-col justify-between items-center p-4 rounded-xl text-white border border-white/10 bg-zinc-900/80 shadow-lg font-sans transition-all hover:bg-zinc-800 hover:-translate-y-1 h-full min-h-[140px]">
      <div className="flex flex-col items-center grow justify-center w-full">
        {safeComponent.length === 1 ? (
          // CASO 1: Renderiza usando a variável Maiúscula (FirstIcon)
          <>
            <FirstIcon size={real_size} className="mb-2 text-white" />
            <h4 className="font-bold text-gray-200 text-center">{text || safeComponent[0].name}</h4>
          </>
        ) : (
          // CASO 2: Loop
          <div className="flex flex-row items-center justify-center gap-3">
            {safeComponent.map((item, index) => {
              // 2. Extrai o ícone do loop para uma variável Maiúscula também
              const CurrentIcon = item.icon;

              return (
                <React.Fragment key={index}>
                  <div className="flex flex-col items-center">
                    <CurrentIcon size={real_size} className="mb-1 text-white" />
                    <span className="text-xs text-gray-400 font-semibold">{item.name}</span>
                  </div>

                  {index < safeComponent.length - 1 && (
                    <span className="text-zinc-600 text-2xl font-light">+</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Texto descritivo geral se houver múltiplos */}
        {safeComponent.length > 1 && text && (
          <h4 className="font-bold text-gray-200 mt-3 text-sm">{text}</h4>
        )}
      </div>

      {/* --- Tech Stack (Parte Inferior) --- */}
      {subStack && subStack.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/5 w-full">
          <div className="flex flex-wrap justify-center gap-2">
            {subStack.map((item, index) => {
              // 3. Mesma regra para o subStack
              const SubIcon = item.icon;
              return (
                <div
                  key={index}
                  className="group relative flex items-center justify-center p-1.5 rounded bg-white/5 hover:bg-white/10 transition-colors"
                  title={item.name}
                >
                  <SubIcon
                    size={sub_size}
                    className="text-gray-400 group-hover:text-white transition-colors"
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

export default Icon;
