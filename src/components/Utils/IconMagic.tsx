import React from 'react';
import { CircleHelp } from 'lucide-react';

// --- Mapa de Cores das Tecnologias ---
const techColorMap: Record<string, string> = {
  // Frontend
  React: '#61DAFB',
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Vite: '#646CFF',
  Redux: '#764ABC',
  'Tailwind CSS': '#06B6D4',
  'React Router': '#CA4245',

  // Backend & Data
  Python: '#3776AB',
  Pandas: '#3776AB',
  NumPy: '#013243',
  Langgraph: '#E17253',
  LangChain: '#1C3C3C',
  OpenAI: '#10A37F',
  'Google Gemini': '#8E75B2',

  // DevOps / Tools
  Docker: '#2496ED',
  Git: '#F05032',
  Devbox: '#FDBA74',
  Vitest: '#6E9F18',
  Jest: '#C21325',
};

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
  // Z-index alto (z-50) e whitespace-nowrap garantem que fique acima e não quebre linha
  <div className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover/icon:opacity-100 transition-all duration-300 ease-out z-9999">
    <div className="relative bg-zinc-800 text-zinc-200 text-xs font-medium py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap border border-zinc-700/50">
      {text}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800 border-r border-b border-zinc-700/50 rotate-45"></div>
    </div>
  </div>
);

// --- Componente Principal ---
function IconMagic({ component, size, text, subStack }: IconProps) {
  const real_size = size === 'big' ? 48 : size === 'small' ? 24 : size;
  const sub_size = 20;

  const safeComponent =
    component.length > 0 ? component : [{ icon: CircleHelp, name: 'Undefined' }];

  const mainTechName = safeComponent[0].name;
  const mainTechColor = techColorMap[mainTechName] || '#ffffff';
  const MainIcon = safeComponent[0].icon;

  return (
    <div className="group/card flex flex-col justify-between items-center p-5 rounded-2xl text-white border border-white/5 bg-zinc-900/60 shadow-2xl backdrop-blur-sm font-sans transition-all duration-300 hover:bg-zinc-900/90 hover:border-white/10 hover:-translate-y-1 h-full min-h-40 relative">
      <div
        className="absolute inset-0 opacity-0 group-hover/card:opacity-5 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ backgroundColor: mainTechColor }}
      />

      <div className="flex flex-col items-center grow justify-center w-full mb-2 z-10">
        {safeComponent.length === 1 ? (
          <>
            <div className="group/icon relative p-3 bg-white/5 rounded-2xl mb-3 group-hover/card:bg-white/10 transition-colors cursor-help">
              <Tooltip text={safeComponent[0].name} />

              <MainIcon
                size={real_size}
                className="text-gray-200 transition-all duration-300 group-hover/card:scale-110"
                style={{ filter: `drop-shadow(0 0 0 transparent)` }}
              />

              <MainIcon
                size={real_size}
                className="absolute top-3 left-3 opacity-0 group-hover/card:opacity-100 transition-all duration-300 scale-110"
                style={{
                  color: mainTechColor,
                  filter: `drop-shadow(0 0 10px ${mainTechColor})`,
                }}
              />
            </div>
            <h4 className="font-bold text-lg text-gray-100 text-center tracking-tight group-hover/card:text-white">
              {text || safeComponent[0].name}
            </h4>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex flex-row items-center justify-center gap-3 mb-3">
              {safeComponent.map((item, index) => {
                const CurrentIcon = item.icon;
                const techColor = techColorMap[item.name] || '#fff';
                return (
                  <React.Fragment key={index}>
                    <div className="group/icon relative flex flex-col items-center cursor-help">
                      <Tooltip text={item.name} />
                      <div className="relative p-2.5 bg-white/5 rounded-xl group-hover/card:bg-white/10 transition-colors">
                        <CurrentIcon
                          size={real_size * 0.9}
                          className="text-gray-200 group-hover/icon:opacity-0 transition-opacity duration-200"
                        />
                        <CurrentIcon
                          size={real_size * 0.9}
                          className="absolute top-2.5 left-2.5 opacity-0 group-hover/icon:opacity-100 transition-all duration-300 scale-110"
                          style={{
                            color: techColor,
                            filter: `drop-shadow(0 0 8px ${techColor})`,
                          }}
                        />
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

      {subStack && subStack.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/5 w-full flex flex-col items-center z-10">
          <div className="flex flex-wrap justify-center gap-2">
            {subStack.map((item, index) => {
              const SubIcon = item.icon;
              const techColor = techColorMap[item.name] || '#fff';
              return (
                <div
                  key={index}
                  className="group/icon relative flex items-center justify-center p-2 rounded-lg bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/10 transition-all duration-200 cursor-help"
                >
                  <Tooltip text={item.name} />
                  <SubIcon
                    size={sub_size}
                    className="text-zinc-500 transition-all duration-300 group-hover/icon:opacity-0"
                  />
                  <SubIcon
                    size={sub_size}
                    className="absolute opacity-0 group-hover/icon:opacity-100 transition-all duration-300 transform group-hover/icon:scale-110"
                    style={{
                      color: techColor,
                      filter: `drop-shadow(0 0 5px ${techColor})`,
                    }}
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

// --- Componente 2: SmallIcon ---
function SmallIcon({
  icon: Icon,
  size,
  name,
}: {
  icon: React.ElementType;
  size: number;
  name: string;
}) {
  const techColor = techColorMap[name] || '#fff';
  return (
    <div className="inline-block align-middle mr-1.5 group/small relative">
      <Icon
        size={size}
        className="text-zinc-400 transition-all duration-300 group-hover/small:text-white"
      />
      <Icon
        size={size}
        className="absolute top-0 left-0 opacity-0 group-hover/small:opacity-100 transition-all duration-300"
        style={{
          color: techColor,
          filter: `drop-shadow(0 0 4px ${techColor})`,
        }}
      />
    </div>
  );
}

// --- Componente 3: TechTag (Versão Badge) ---
function TechTag({ icon: Icon, name }: { icon: React.ElementType; name: string }) {
  const techColor = techColorMap[name] || '#e4e4e7';

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all duration-300 hover:brightness-125 select-none"
      style={{
        borderColor: `${techColor}40`,
        backgroundColor: `${techColor}15`,
        color: techColor,
      }}
    >
      <Icon size={14} style={{ color: techColor }} />
      <span style={{ opacity: 0.9 }}>{name}</span>
    </div>
  );
}

export default IconMagic;
export { SmallIcon, TechTag, Tooltip };
