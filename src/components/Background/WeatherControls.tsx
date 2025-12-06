// src/components/WeatherControls.tsx
import React, { useState } from 'react';
import { Sun, Moon, Zap } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTheme, setMode } from '../../store/slices/appSlice';

type WeatherMode = 'day' | 'night' | 'storm';

export default function WeatherControls() {
  const dispatch = useDispatch();
  const mode = useSelector(selectTheme);
  const [hovering, setHovering] = useState(false);

  const setModeInner = (newMode: WeatherMode) => {
    dispatch(setMode(newMode));
  };

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={`fixed top-1/3 left-2 p-2 rounded-md text-white border border-white/10 shadow-2xl font-sans transition-all z-50 select-none ${
        mode === 'day'
          ? 'bg-black/50 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]'
          : 'bg-transparent border-transparent hover:bg-white/5'
      }`}
    >
      <div className="space-y-2">
        <ControlBtn
          label="Dia"
          sub="Luz do Sol"
          active={mode === 'day'}
          onClick={() => setModeInner('day')}
          icon={<Sun size={18} className="text-orange-300" />}
          wide={hovering}
        />
        <ControlBtn
          label="Noite"
          sub="Vagalumes"
          active={mode === 'night'}
          onClick={() => setModeInner('night')}
          icon={<Moon size={18} className="text-indigo-300" />}
          wide={hovering}
        />
        <ControlBtn
          label="Tempestade"
          sub="Chuva Intensa"
          active={mode === 'storm'}
          onClick={() => setModeInner('storm')}
          icon={<Zap size={18} className="text-yellow-300" />}
          wide={hovering}
        />
      </div>
    </div>
  );
}

function ControlBtn({
  label,
  sub,
  active,
  onClick,
  icon,
  wide = false,
}: {
  label?: string;
  sub?: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  wide: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-auto p-2 rounded-xl flex items-center gap-2 transition-all duration-500 border ${
        active
          ? 'bg-white/10 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]'
          : 'bg-transparent border-transparent hover:bg-white/5'
      }`}
    >
      <div className={`p-2 rounded-lg ${active ? 'bg-orange-500/20' : 'bg-gray-800'}`}>{icon}</div>
      {wide && (
        <div className="text-left">
          {label && <div className="text-sm font-medium">{label}</div>}
          {sub && <div className="text-sm text-gray-400">{sub}</div>}
        </div>
      )}
    </button>
  );
}
