// src/components/AnimatedBackground.tsx
import { useRef, useEffect, useMemo } from 'react';
import { selectTheme } from '@store/slices/appSlice';
import { useSelector } from 'react-redux';

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
  fog: string;
  text: string;
};

type WeatherMode = 'day' | 'night' | 'storm';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  type: 'rain' | 'firefly';
}

interface Tree {
  x: number;
  scale: number;
  type: 'dead' | 'pine';
}

interface AnimState {
  lerpFactor: number;
  targetMode: WeatherMode;
  currentMode: WeatherMode;
  lastColors: Palette;
  particles: Particle[];
  lightningOpacity: number;
  time: number;
}

// // --- Paletas de Cores Antiga ---
// const PALETTES: Record<WeatherMode, Palette> = {
//   day: {
//     skyTop: '#ff9900',
//     skyBottom: '#ffcc66',
//     sun: '#ffddaa',
//     mountainFar: '#d97f26',
//     mountainMid: '#bf601a',
//     mountainClose: '#7a2e12',
//     ground: '#3d1604',
//     river: '#ffcc00',
//     fog: '#ffaa44',
//     text: 'text-orange-100',
//   },
//   night: {
//     skyTop: '#0a1a2a',
//     skyBottom: '#1a0b2e',
//     sun: '#eef2ff',
//     mountainFar: '#111827',
//     mountainMid: '#0f172a',
//     mountainClose: '#020617',
//     ground: '#000000',
//     river: '#1e3a8a',
//     fog: '#051020',
//     text: 'text-indigo-100',
//   },
//   storm: {
//     skyTop: '#2d2d2d',
//     skyBottom: '#4a3b2a',
//     sun: '#4a3b2a',
//     mountainFar: '#374151',
//     mountainMid: '#1f2937',
//     mountainClose: '#111827',
//     ground: '#0a0a0a',
//     river: '#57534e',
//     fog: '#282828',
//     text: 'text-gray-200',
//   },
// };

const PALETTES: Record<WeatherMode, Palette> = {
  day: {
    // Mudamos de Laranja (Quente) para Azul Céu (Frio/Suave)
    skyTop: '#ff9900', // Azul vibrante mas calmo #3b82f6 - ceu aberto - #ff9900 - final de tarde
    skyBottom: '#93c5fd', // Azul claro suave perto do horizonte
    sun: '#ffddaa', // Sol amarelo bem claro (quase branco)
    mountainFar: '#64748b', // Slate (azulado acinzentado) para profundidade
    mountainMid: '#475569',
    mountainClose: '#334155',
    ground: '#1e293b', // Chão escuro azulado
    river: '#60a5fa', // Rio refletindo o céu azul
    fog: '#bfdbfe', // Neblina azulada clara
    text: 'text-blue-100', // Texto combinando
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
    fog: '#051020',
    text: 'text-indigo-100',
  },
  storm: {
    skyTop: '#2d2d2d',
    skyBottom: '#4a3b2a',
    sun: '#4a3b2a',
    mountainFar: '#374151',
    mountainMid: '#1f2937',
    mountainClose: '#111827',
    ground: '#0a0a0a',
    river: '#57534e',
    fog: '#282828',
    text: 'text-gray-200',
  },
};

// --- Utilitários ---
const colorToRgb = (color: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  const rgb = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i.exec(color);

  if (rgb) {
    return { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]) };
  }

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

const lerpColor = (a: string, b: string, t: number) => {
  const c1 = colorToRgb(a);
  const c2 = colorToRgb(b);
  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b_val = Math.round(c1.b + (c2.b - c1.b) * t);
  return `rgb(${r},${g},${b_val})`;
};

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

// --- Geração Procedural ---
const generateTerrain = (segments: number, roughness: number) => {
  const points = [];
  let y = 0;
  for (let i = 0; i <= segments; i++) {
    y += randomRange(-roughness, roughness);
    if (y > 80) y -= roughness * 2;
    if (y < -80) y += roughness * 2;
    points.push(y);
  }
  return points;
};

const generateTrees = (count: number, width: number): Tree[] => {
  return Array.from({ length: count }).map(() => ({
    x: randomRange(-200, width + 200),
    scale: randomRange(0.8, 1.8),
    type: Math.random() > 0.8 ? 'dead' : 'pine',
  }));
};

// --- Componente Principal ---

export default function AnimatedBackground() {
  const mode = useSelector(selectTheme);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // OTIMIZAÇÃO DE PERFORMANCE:
  // Trocamos useState por useRef para o mouse.
  // Isso evita re-renderizar o componente inteiro a cada movimento do mouse.
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  // Otimização: useRef para dimensões evita re-renders desnecessários no resize se não usarmos no JSX
  const dimensions = useRef({ w: 0, h: 0, dpr: 1 });

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
  const animState = useRef<AnimState>({
    lerpFactor: 0,
    targetMode: 'day',
    currentMode: 'day',
    lastColors: PALETTES.day,
    particles: [],
    lightningOpacity: 0,
    time: 0,
  });

  useEffect(() => {
    animState.current.lastColors = getCurrentPalette(animState.current);
    animState.current.currentMode = animState.current.targetMode;
    animState.current.targetMode = mode;
    animState.current.lerpFactor = 0;
  }, [mode]);

  const getCurrentPalette = (state: AnimState) => {
    const t = Math.min(state.lerpFactor, 1);
    const start = state.lastColors;
    const end = PALETTES[state.targetMode];

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
      fog: lerpColor(start.fog, end.fog, t),
      text: end.text,
    };
  };

  // Resize Handler
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let resizeFrame = 0;

    const handleResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        const { width, height } = container.getBoundingClientRect();
        const w = Math.max(1, Math.round(width));
        const h = Math.max(1, Math.round(height));
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        if (
          dimensions.current.w === w &&
          dimensions.current.h === h &&
          dimensions.current.dpr === dpr
        ) {
          return;
        }

        dimensions.current = { w, h, dpr };
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
      });
    };

    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(handleResize);
    observer?.observe(container);
    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      cancelAnimationFrame(resizeFrame);
      observer?.disconnect();
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    const handlePointerMove = (event: PointerEvent) => {
      mousePos.current = {
        x: event.clientX / Math.max(window.innerWidth, 1),
        y: event.clientY / Math.max(window.innerHeight, 1),
      };
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // Loop de Renderização
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let lastFrameTime = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const lowPowerDevice = coarsePointer || (navigator.hardwareConcurrency || 8) <= 4;
    const targetFps = reducedMotion ? 10 : lowPowerDevice ? 30 : 60;
    const frameInterval = 1000 / targetFps;

    const render = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(render);

      if (document.hidden || timestamp - lastFrameTime < frameInterval - 0.5) return;

      const elapsed = lastFrameTime === 0 ? frameInterval : timestamp - lastFrameTime;
      lastFrameTime = timestamp;
      const frameScale = Math.min(elapsed / (1000 / 60), 3);

      // Usa os valores da ref
      const { w: width, h: height, dpr } = dimensions.current;
      if (width === 0) return; // Evita erro inicial

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      animState.current.time += 0.01 * frameScale;
      animState.current.lerpFactor += 0.02 * frameScale;
      if (animState.current.lerpFactor > 1) animState.current.lerpFactor = 1;

      const palette = getCurrentPalette(animState.current);

      // Lê a posição do mouse da REF
      const mx = mousePos.current.x - 0.5;
      const my = mousePos.current.y - 0.5;

      ctx.clearRect(0, 0, width, height);

      // 0. CÉU
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, palette.skyTop);
      gradient.addColorStop(1, palette.skyBottom);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Estrelas
      if (animState.current.targetMode === 'night' || animState.current.currentMode === 'night') {
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

      // 2. MONTANHAS
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

      // 3. MONTANHAS MÉDIAS
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

      // 5. PRIMEIRO PLANO
      const offsetCloseX = mx * 150;
      const offsetCloseY = my * 40;
      drawPowerLines(ctx, width, height, offsetCloseX, offsetCloseY);

      // 6. PARTÍCULAS
      const areaRatio = Math.min(1, (width * height) / (1920 * 1080));
      const particleLimit = reducedMotion
        ? 0
        : Math.round((lowPowerDevice ? 260 : 650) * Math.max(0.45, areaRatio));
      handleParticles(ctx, width, height, animState.current, mode, frameScale, particleLimit);

      // Relâmpago
      if (mode === 'storm') {
        if (!reducedMotion && Math.random() > 0.99 && animState.current.lightningOpacity <= 0) {
          animState.current.lightningOpacity = 0.8;
        }
        if (animState.current.lightningOpacity > 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${animState.current.lightningOpacity})`;
          ctx.fillRect(0, 0, width, height);
          animState.current.lightningOpacity -= 0.05 * frameScale;
        }
      }

      // 7. NEBLINA
      ctx.save();
      ctx.globalAlpha = mode === 'storm' ? 0.6 : 0.3;
      ctx.fillStyle = palette.fog;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    };

    animationFrameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrameId);
  }, [mode, terrainData]); // Removemos mousePos e dimensions das dependências pois agora são refs

  return (
    <div ref={containerRef} className="relative z-0 h-full w-full overflow-hidden bg-gray-500">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block" />

      {/* --- CORREÇÃO DO OVERLAY --- */}
      {/* 1. Usamos z-10 para garantir que fique acima do Canvas (que é z-auto por padrão) */}
      {/* 2. Aumentamos a opacidade para bg-black/40 para ser visível contra o sol forte */}
      {/* 3. pointer-events-none obrigatório para não bloquear o mouseMove do container pai */}
      {mode === 'day' && <div className="absolute inset-0 z-10 pointer-events-none bg-black/40" />}
    </div>
  );
}

// --- Funções Auxiliares (Types Updated) ---

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
  ctx.moveTo(-200, h + 100);

  const totalW = w + 400;
  const startX = -200 + offsetX;

  for (let i = 0; i < points.length; i++) {
    const x = startX + i * (totalW / (points.length - 1));
    const y = yBase - points[i] * (scaleY / 50);

    if (i === 0) ctx.lineTo(x, y);
    else {
      ctx.lineTo(x, y);
    }
  }

  ctx.lineTo(w + 200, h + 100);
  ctx.fill();
}

function drawTrees(
  ctx: CanvasRenderingContext2D,
  trees: Tree[],
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

  const visibleTrees = trees.filter(tree => {
    const x = tree.x + offsetX;
    return x > -50 && x < w + 50;
  });

  visibleTrees.forEach(tree => {
    const x = tree.x + offsetX;
    const y = yBase + tree.scale * 10;
    const h = 40 * tree.scale;
    const wTree = 8 * tree.scale;

    ctx.beginPath();
    ctx.moveTo(x - wTree, y);
    ctx.lineTo(x + wTree, y);
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

  ctx.beginPath();
  ctx.moveTo(poleX - 6, poleBaseY);
  ctx.lineTo(poleX + 6, poleBaseY);
  ctx.lineTo(poleX + 3, poleTopY);
  ctx.lineTo(poleX - 3, poleTopY);
  ctx.fill();

  ctx.fillRect(poleX - 25, poleTopY + 20, 50, 6);
  ctx.fillRect(poleX - 15, poleTopY + 60, 30, 6);

  ctx.beginPath();
  ctx.lineWidth = 1.5;
  ctx.moveTo(poleX - 20, poleTopY + 20);
  ctx.bezierCurveTo(poleX - 200, poleTopY + 150, -100, h * 0.6, -200, h * 0.5);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(poleX + 20, poleTopY + 20);
  ctx.bezierCurveTo(poleX + 150, poleTopY + 50, w + 100, poleTopY - 50, w + 200, poleTopY);
  ctx.stroke();
}

function handleParticles(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  state: AnimState,
  mode: WeatherMode,
  frameScale: number,
  particleLimit: number
) {
  const isStorm = mode === 'storm';
  const isNight = mode === 'night';

  if ((!isStorm && !isNight) || particleLimit <= 0) {
    state.particles = [];
    return;
  }

  if (isStorm) {
    if (state.particles.length < particleLimit) {
      for (let i = 0; i < 5; i++) {
        state.particles.push({
          x: Math.random() * (w + 400) - 200,
          y: -50,
          vx: -3 + Math.random(),
          vy: 20 + Math.random() * 10,
          life: 100,
          type: 'rain',
        });
      }
    }
  } else if (isNight) {
    if (state.particles.length < Math.min(60, particleLimit)) {
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

  const rainColor = 'rgba(200, 220, 255, 0.5)';
  ctx.lineWidth = 1.5;

  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];

    if (isStorm && p.type !== 'rain') {
      state.particles.splice(i, 1);
      continue;
    }
    if (isNight && p.type !== 'firefly') {
      state.particles.splice(i, 1);
      continue;
    }

    p.x += p.vx * frameScale;
    p.y += p.vy * frameScale;
    p.life -= frameScale;

    if (p.type === 'rain') {
      ctx.strokeStyle = rainColor;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.vx * 1.5, p.y + p.vy * 1.5);
      ctx.stroke();

      if (p.y > h || p.life <= 0) {
        p.y = -20;
        p.x = Math.random() * (w + 400) - 200;
        p.life = 100;
      }
    } else {
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
