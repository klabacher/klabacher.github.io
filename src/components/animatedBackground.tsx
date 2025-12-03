import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Wind, Moon, Sun, CloudRain, Zap, Star, MousePointer2 } from 'lucide-react';

// --- Tipos e Interfaces ---
type Palette = {
  skyTop: string;
  skyBottom: string;
  sun: string;
  mountainFar: string;
  mountainMid: string;
  mountainClose: string;
  ground: string;
  river: string;
  fog: string; // Hex para consistência na interpolação
  text: string;
};

type WeatherMode = 'day' | 'night' | 'storm';

// --- Paletas de Cores Corrigidas (Tudo Hex para o Lerp funcionar) ---
const PALETTES: Record<WeatherMode, Palette> = {
  day: {
    skyTop: '#ff9900',
    skyBottom: '#ffcc66',
    sun: '#ffddaa',
    mountainFar: '#d97f26',
    mountainMid: '#bf601a',
    mountainClose: '#7a2e12',
    ground: '#3d1604',
    river: '#ffcc00',
    fog: '#ffaa44', // Hex
    text: 'text-orange-100',
  },
  night: {
    skyTop: '#0a1a2a',
    skyBottom: '#1a0b2e',
    sun: '#eef2ff',
    mountainFar: '#111827',
    mountainMid: '#0f172a',
    mountainClose: '#020617',
    ground: '#000000',
    river: '#1e3a8a',
    fog: '#051020', // Hex
    text: 'text-indigo-100',
  },
  storm: {
    skyTop: '#2d2d2d',
    skyBottom: '#4a3b2a',
    sun: '#4a3b2a', // Cor do céu para "esconder" o sol sem usar rgba inválido
    mountainFar: '#374151',
    mountainMid: '#1f2937',
    mountainClose: '#111827',
    ground: '#0a0a0a',
    river: '#57534e',
    fog: '#282828', // Hex
    text: 'text-gray-200',
  },
};

// --- Utilitários ---
const hexToRgb = (hex: string) => {
  // Fallback para preto se hex for inválido
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

const lerpColor = (a: string, b: string, t: number) => {
  const c1 = hexToRgb(a);
  const c2 = hexToRgb(b);
  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b_val = Math.round(c1.b + (c2.b - c1.b) * t);
  return `rgb(${r},${g},${b_val})`;
};

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

// --- Geração Procedural de Dados Melhorada ---
const generateTerrain = (segments: number, roughness: number) => {
  const points = [];
  let y = 0;
  for (let i = 0; i <= segments; i++) {
    // Ruído mais agressivo para montanhas visíveis
    y += randomRange(-roughness, roughness);
    // Soft clamp para manter naturalidade
    if (y > 80) y -= roughness * 2;
    if (y < -80) y += roughness * 2;
    points.push(y);
  }
  return points;
};

const generateTrees = (count: number, width: number) => {
  return Array.from({ length: count }).map(() => ({
    x: randomRange(-200, width + 200), // Espalhar além da tela
    scale: randomRange(0.8, 1.8),
    type: Math.random() > 0.8 ? 'dead' : 'pine',
  }));
};

// --- Componente Principal ---

export default function App() {
  // set global state with weather mode - Redux
  const [mode, setMode] = useState<WeatherMode>('day');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

  // Dados persistentes do terreno
  const terrainData = useMemo(
    () => ({
      far: generateTerrain(30, 40),
      mid: generateTerrain(40, 50),
      treesFar: generateTrees(80, 2500),
      treesMid: generateTrees(50, 2500),
      stars: Array.from({ length: 150 }).map(() => ({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2,
      })),
    }),
    []
  );

  // Estado de animação
  const animState = useRef({
    lerpFactor: 0,
    targetMode: 'day' as WeatherMode,
    currentMode: 'day' as WeatherMode,
    lastColors: PALETTES.day,
    particles: [] as {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      type: 'rain' | 'firefly';
    }[],
    lightningOpacity: 0,
    time: 0,
  });

  useEffect(() => {
    animState.current.lastColors = getCurrentPalette(animState.current);
    animState.current.currentMode = animState.current.targetMode;
    animState.current.targetMode = mode;
    animState.current.lerpFactor = 0;
  }, [mode]);

  const getCurrentPalette = (state: any) => {
    const t = Math.min(state.lerpFactor, 1);
    const start = PALETTES[state.currentMode];
    const end = PALETTES[state.targetMode];

    // Fallback de segurança
    if (!start || !end) return PALETTES.day;

    return {
      skyTop: lerpColor(start.skyTop, end.skyTop, t),
      skyBottom: lerpColor(start.skyBottom, end.skyBottom, t),
      sun: lerpColor(start.sun, end.sun, t),
      mountainFar: lerpColor(start.mountainFar, end.mountainFar, t),
      mountainMid: lerpColor(start.mountainMid, end.mountainMid, t),
      mountainClose: lerpColor(start.mountainClose, end.mountainClose, t),
      ground: lerpColor(start.ground, end.ground, t),
      river: lerpColor(start.river, end.river, t),
      fog: lerpColor(start.fog, end.fog, t), // Agora interpolamos o fog também
      text: end.text,
    };
  };

  // Resize Handler
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvasRef.current.width = w;
        canvasRef.current.height = h;
        setDimensions({ w, h });
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Loop de Renderização
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.w === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      animState.current.time += 0.01;
      animState.current.lerpFactor += 0.02;
      if (animState.current.lerpFactor > 1) animState.current.lerpFactor = 1;

      const palette = getCurrentPalette(animState.current);
      const width = canvas.width;
      const height = canvas.height;

      const mx = mousePos.x - 0.5;
      const my = mousePos.y - 0.5;

      ctx.clearRect(0, 0, width, height);

      // 0. CÉU
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, palette.skyTop);
      gradient.addColorStop(1, palette.skyBottom);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Estrelas
      if (animState.current.targetMode === 'night' || animState.current.currentMode === 'night') {
        // Opacidade baseada no modo noturno
        const isNightTarget = animState.current.targetMode === 'night';
        const t = animState.current.lerpFactor;
        const starOpacity = isNightTarget ? t : 1 - t;

        if (starOpacity > 0.01) {
          ctx.fillStyle = `rgba(255, 255, 255, ${starOpacity})`;
          terrainData.stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x * width, star.y * height * 0.6, star.size, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      }

      // 1. SOL / LUA
      const isNight = animState.current.targetMode === 'night';
      const sunYBase = isNight ? height * 0.15 : height * 0.35;
      const sunX = width * 0.5 + mx * 30;
      const sunY = sunYBase + my * 30;

      // Glow do Sol
      ctx.fillStyle = palette.sun;
      if (!isNight && animState.current.targetMode !== 'storm') {
        ctx.shadowBlur = 80;
        ctx.shadowColor = palette.sun;
      } else if (isNight) {
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#ffffff';
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      ctx.arc(sunX, sunY, isNight ? 40 : 120, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 2. MONTANHAS DISTANTES
      const offsetFarX = mx * 40;
      const offsetFarY = my * 10;
      drawMountainLayer(
        ctx,
        width,
        height,
        terrainData.far,
        palette.mountainFar,
        height * 0.5 + offsetFarY,
        offsetFarX,
        100
      );

      // 3. MONTANHAS MÉDIAS + ÁRVORES
      const offsetMidX = mx * 80;
      const offsetMidY = my * 20;
      const midYBase = height * 0.65 + offsetMidY;

      drawMountainLayer(
        ctx,
        width,
        height,
        terrainData.mid,
        palette.mountainMid,
        midYBase,
        offsetMidX,
        120
      );
      drawTrees(
        ctx,
        terrainData.treesFar,
        width,
        midYBase,
        palette.mountainMid,
        offsetMidX,
        animState.current.time,
        mode === 'storm'
      );

      // 4. RIO
      const riverOffset = mx * 120;
      ctx.fillStyle = palette.river;
      ctx.beginPath();
      ctx.moveTo(width * 0.45 + riverOffset, midYBase);
      ctx.bezierCurveTo(
        width * 0.55 + riverOffset,
        height * 0.75,
        width * 0.35 - riverOffset,
        height * 0.85,
        width * 0.5 - riverOffset * 1.5,
        height
      );
      ctx.lineTo(width * 0.8 - riverOffset * 2, height);
      ctx.bezierCurveTo(
        width * 0.65 - riverOffset,
        height * 0.85,
        width * 0.75 + riverOffset,
        height * 0.75,
        width * 0.55 + riverOffset,
        midYBase
      );
      ctx.fill();

      // 5. PRIMEIRO PLANO (Penhasco e Postes)
      const offsetCloseX = mx * 150;
      const offsetCloseY = my * 40;

      // // Penhasco Esquerdo
      // ctx.fillStyle = palette.ground;
      // ctx.beginPath();
      // ctx.moveTo(-200 - offsetCloseX, height + 100);
      // ctx.lineTo(-100 - offsetCloseX, height * 0.3 + offsetCloseY);
      // ctx.lineTo(width * 0.35 - offsetCloseX, height * 0.45 + offsetCloseY);
      // ctx.lineTo(width * 0.1 - offsetCloseX, height + 100);
      // ctx.fill();

      // Postes
      drawPowerLines(ctx, width, height, offsetCloseX, offsetCloseY);

      // 6. PARTICULAS
      handleParticles(ctx, width, height, animState.current, mode);

      // Relâmpago
      if (mode === 'storm') {
        if (Math.random() > 0.99 && animState.current.lightningOpacity <= 0) {
          animState.current.lightningOpacity = 0.8;
        }
        if (animState.current.lightningOpacity > 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${animState.current.lightningOpacity})`;
          ctx.fillRect(0, 0, width, height);
          animState.current.lightningOpacity -= 0.05;
        }
      }

      // 7. NEBLINA FRONTAL (Overlay final para atmosfera)
      const fogGrad = ctx.createLinearGradient(0, height * 0.4, 0, height);
      // Usar a cor interpolada do fog com opacidade variável
      // Como lerpColor retorna rgb(...), precisamos injetar o alpha manualmente manipulando a string ou usando globalAlpha
      ctx.save();
      ctx.globalAlpha = mode === 'storm' ? 0.6 : 0.3;
      ctx.fillStyle = palette.fog; // Agora é uma cor sólida interpolada RGB
      // Para gradiente com alpha, seria ideal converter, mas vamos usar um truque visual:
      // Desenhar o rect com GlobalAlpha deve bastar para o efeito "washed out"
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [mode, terrainData, mousePos, dimensions]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    });
  };

  // Hovering controls trigger setState
  const [hovering, setHovering] = useState(false);
  return (
    <div
      className="w-screen h-screen relative bg-gray-500 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <canvas ref={canvasRef} className="block absolute top-0 left-0" />

      <div
        // Hovering logic
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={`absolute w-auto h-auto top-1/3 left-2 p-2 rounded-md text-white border border-white/10 shadow-2xl font-sans transition-all z-10 select-none ${
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
            onClick={() => setMode('day')}
            icon={<Sun size={18} className="text-orange-300" />}
            wide={hovering}
          />
          <ControlBtn
            label="Noite"
            sub="Vagalumes"
            active={mode === 'night'}
            onClick={() => setMode('night')}
            icon={<Moon size={18} className="text-indigo-300" />}
            wide={hovering}
          />
          <ControlBtn
            label="Tempestade"
            sub="Chuva Intensa"
            active={mode === 'storm'}
            onClick={() => setMode('storm')}
            icon={<Zap size={18} className="text-yellow-300" />}
            wide={hovering}
          />
        </div>
      </div>
    </div>
  );
}

// --- Funções de Desenho Corrigidas ---

function drawMountainLayer(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  points: number[],
  color: string,
  yBase: number,
  offsetX: number,
  scaleY: number
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  // Começar do canto inferior esquerdo
  ctx.moveTo(-200, h + 100);

  const totalW = w + 400; // Margem extra para parallax
  const startX = -200 + offsetX;

  for (let i = 0; i < points.length; i++) {
    const x = startX + i * (totalW / (points.length - 1));
    // Aplicar curva suave
    const y = yBase - points[i] * (scaleY / 50);

    if (i === 0) ctx.lineTo(x, y);
    else {
      // Suavização simples (Bezier quadrático entre pontos) seria ideal, mas linha reta funciona para low-poly style
      ctx.lineTo(x, y);
    }
  }

  // Fechar polígono no canto inferior direito
  ctx.lineTo(w + 200, h + 100);
  ctx.fill();
}

function drawTrees(
  ctx: CanvasRenderingContext2D,
  trees: any[],
  w: number,
  yBase: number,
  color: string,
  offsetX: number,
  time: number,
  isStorm: boolean
) {
  ctx.fillStyle = color;
  const windBase = Math.sin(time * 2);
  const wind = windBase * (isStorm ? 15 : 4);

  // Otimização: desenhar apenas árvores visíveis
  const visibleTrees = trees.filter(t => {
    const x = t.x + offsetX;
    return x > -50 && x < w + 50;
  });

  visibleTrees.forEach(tree => {
    const x = tree.x + offsetX;
    // Pequena variação na altura Y para não parecerem todos na mesma linha
    const y = yBase + tree.scale * 10;

    const h = 40 * tree.scale;
    const wTree = 8 * tree.scale;

    ctx.beginPath();
    // Tronco/Base
    ctx.moveTo(x - wTree, y);
    ctx.lineTo(x + wTree, y);

    // Ponta balançando
    // Adicionar variação de fase baseada na posição X para o vento não ser uniforme
    const treeWind = wind + Math.sin(time * 3 + x * 0.01) * 3;

    ctx.lineTo(x + treeWind, y - h);
    ctx.fill();
  });
}

function drawPowerLines(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  offsetX: number,
  offsetY: number
) {
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 3;
  ctx.fillStyle = '#080808';

  const poleX = w * 0.85 + offsetX;
  const poleBaseY = h + 100;
  const poleTopY = h * 0.4 + offsetY;

  // Poste Principal
  ctx.beginPath();
  ctx.moveTo(poleX - 6, poleBaseY);
  ctx.lineTo(poleX + 6, poleBaseY);
  ctx.lineTo(poleX + 3, poleTopY);
  ctx.lineTo(poleX - 3, poleTopY);
  ctx.fill();

  // Travessas
  ctx.fillRect(poleX - 25, poleTopY + 20, 50, 6);
  ctx.fillRect(poleX - 15, poleTopY + 60, 30, 6);

  // Fios
  ctx.beginPath();
  ctx.lineWidth = 1.5;
  // Fio 1 (Topo esq)
  ctx.moveTo(poleX - 20, poleTopY + 20);
  ctx.bezierCurveTo(poleX - 200, poleTopY + 150, -100, h * 0.6, -200, h * 0.5);
  ctx.stroke();

  // Fio 2 (Topo dir)
  ctx.beginPath();
  ctx.moveTo(poleX + 20, poleTopY + 20);
  ctx.bezierCurveTo(poleX + 150, poleTopY + 50, w + 100, poleTopY - 50, w + 200, poleTopY);
  ctx.stroke();
}

function handleParticles(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  state: any,
  mode: WeatherMode
) {
  // Configuração
  const isStorm = mode === 'storm';
  const isNight = mode === 'night';

  if (!isStorm && !isNight) {
    state.particles = []; // Limpar se for dia
    return;
  }

  // Spawn
  if (isStorm) {
    if (state.particles.length < 800) {
      for (let i = 0; i < 5; i++) {
        // Spawnar multiplos por frame
        state.particles.push({
          x: Math.random() * (w + 400) - 200, // Margem para vento
          y: -50,
          vx: -3 + Math.random(),
          vy: 20 + Math.random() * 10,
          life: 100,
          type: 'rain',
        });
      }
    }
  } else if (isNight) {
    if (state.particles.length < 60) {
      if (Math.random() > 0.92) {
        state.particles.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.6 + h * 0.4,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.5,
          life: 300 + Math.random() * 200,
          type: 'firefly',
        });
      }
    }
  }

  // Update & Draw
  const rainColor = 'rgba(200, 220, 255, 0.5)';

  ctx.lineWidth = 1.5;

  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];

    // Limpeza de tipos errados
    if (isStorm && p.type !== 'rain') {
      state.particles.splice(i, 1);
      continue;
    }
    if (isNight && p.type !== 'firefly') {
      state.particles.splice(i, 1);
      continue;
    }

    p.x += p.vx;
    p.y += p.vy;
    p.life--;

    if (p.type === 'rain') {
      ctx.strokeStyle = rainColor;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.vx * 1.5, p.y + p.vy * 1.5);
      ctx.stroke();

      if (p.y > h || p.life <= 0) {
        p.y = -20;
        p.x = Math.random() * (w + 400) - 200;
      }
    } else {
      // Vagalume
      p.vx += (Math.random() - 0.5) * 0.05;
      p.vy += (Math.random() - 0.5) * 0.05;

      const flicker = Math.abs(Math.sin(state.time * 3 + i));
      const alpha = Math.min(1, p.life / 50) * flicker;

      ctx.fillStyle = `rgba(200, 255, 100, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();

      if (p.life <= 0 || p.x < -50 || p.x > w + 50) state.particles.splice(i, 1);
    }
  }
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
  // show sub and label with wide true
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
