import { useRef, useEffect, useCallback, useMemo } from 'react';

function hexToRgb(hex) {
  if (!hex) return { r: 0, g: 112, b: 243 };
  if (hex.startsWith('rgb')) {
    const matches = hex.match(/\d+/g);
    if (matches && matches.length >= 3) {
      return { r: Number(matches[0]), g: Number(matches[1]), b: Number(matches[2]) };
    }
  }
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    return {
      r: parseInt(cleanHex[0] + cleanHex[0], 16),
      g: parseInt(cleanHex[1] + cleanHex[1], 16),
      b: parseInt(cleanHex[2] + cleanHex[2], 16)
    };
  }
  const m = cleanHex.match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 112, b: 243 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16)
  };
}

export default function DotGridBackground({
  dotSize = 3.5,
  gap = 26,
  baseColor = '#94a3b8',
  activeColor = '#0070f3',
  proximity = 140,
  shockRadius = 220,
  shockStrength = 18,
  springConstant = 0.08,
  damping = 0.88,
  style = {}
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const animFrameIdRef = useRef(null);

  const pointerRef = useRef({
    x: -9999,
    y: -9999,
    lastX: -9999,
    lastY: -9999,
    lastTime: 0,
    vx: 0,
    vy: 0,
    speed: 0
  });

  const shockwavesRef = useRef([]);

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  // Build grid of dots based on canvas dimensions
  const buildGrid = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width === 0 || height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const cellSize = dotSize + gap;
    const cols = Math.ceil(width / cellSize) + 1;
    const rows = Math.ceil(height / cellSize) + 1;

    const gridW = (cols - 1) * cellSize;
    const gridH = (rows - 1) * cellSize;
    const offsetX = (width - gridW) / 2;
    const offsetY = (height - gridH) / 2;

    const newDots = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const originX = offsetX + c * cellSize;
        const originY = offsetY + r * cellSize;
        newDots.push({
          ox: originX,
          oy: originY,
          x: originX,
          y: originY,
          vx: 0,
          vy: 0
        });
      }
    }
    dotsRef.current = newDots;
  }, [dotSize, gap]);

  // Animation Loop (60-120fps physics simulation & rendering)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;
    const proxSq = proximity * proximity;

    const render = () => {
      if (!isRunning) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      const pointer = pointerRef.current;
      const dots = dotsRef.current;
      const shockwaves = shockwavesRef.current;

      // Update shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += sw.speed;
        sw.alpha -= 0.025;
        if (sw.alpha <= 0 || sw.radius > shockRadius * 1.5) {
          shockwaves.splice(i, 1);
        }
      }

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // 1. Calculate pointer interaction (repulsion & velocity transfer)
        const dx = dot.ox - pointer.x;
        const dy = dot.oy - pointer.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < proxSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / proximity);
          const nx = dx / dist;
          const ny = dy / dist;

          // Push dot away gently
          dot.vx += nx * force * 1.8;
          dot.vy += ny * force * 1.8;

          // Push in pointer velocity direction if fast
          if (pointer.speed > 80) {
            dot.vx += (pointer.vx * 0.008) * force;
            dot.vy += (pointer.vy * 0.008) * force;
          }
        }

        // 2. Calculate shockwave interaction
        for (let s = 0; s < shockwaves.length; s++) {
          const sw = shockwaves[s];
          const sdx = dot.ox - sw.x;
          const sdy = dot.oy - sw.y;
          const sDist = Math.sqrt(sdx * sdx + sdy * sdy);
          const waveDiff = Math.abs(sDist - sw.radius);

          if (waveDiff < 35 && sDist > 0) {
            const shockForce = (1 - waveDiff / 35) * sw.alpha * shockStrength;
            dot.vx += (sdx / sDist) * shockForce;
            dot.vy += (sdy / sDist) * shockForce;
          }
        }

        // 3. Spring physics back to origin
        const fx = (dot.ox - dot.x) * springConstant;
        const fy = (dot.oy - dot.y) * springConstant;
        dot.vx = (dot.vx + fx) * damping;
        dot.vy = (dot.vy + fy) * damping;
        dot.x += dot.vx;
        dot.y += dot.vy;

        // 4. Color interpolation based on proximity to pointer
        let fillStyle;
        if (distSq < proxSq) {
          const dist = Math.sqrt(distSq);
          const t = Math.max(0, 1 - dist / proximity);
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
          const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
          const alpha = 0.5 + t * 0.5;
          fillStyle = `rgba(${r},${g},${b},${alpha})`;
        } else {
          fillStyle = baseColor;
        }

        // 5. Draw dot
        ctx.beginPath();
        const currentRadius = distSq < proxSq 
          ? (dotSize / 2) * (1 + (1 - Math.sqrt(distSq) / proximity) * 0.5) 
          : (dotSize / 2);
        ctx.arc(dot.x, dot.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = fillStyle;
        ctx.fill();
      }

      ctx.restore();
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [baseColor, activeColor, baseRgb, activeRgb, proximity, dotSize, shockRadius, shockStrength, springConstant, damping]);

  // Handle pointer tracking & clicks
  useEffect(() => {
    buildGrid();

    const handleResize = () => {
      buildGrid();
    };

    const handlePointerMove = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      const now = performance.now();
      const p = pointerRef.current;
      const dt = p.lastTime ? Math.max(1, now - p.lastTime) : 16;
      const dx = clientX - p.lastX;
      const dy = clientY - p.lastY;

      p.vx = (dx / dt) * 1000;
      p.vy = (dy / dt) * 1000;
      p.speed = Math.hypot(p.vx, p.vy);
      p.lastX = clientX;
      p.lastY = clientY;
      p.lastTime = now;

      p.x = clientX - rect.left;
      p.y = clientY - rect.top;
    };

    const handlePointerLeave = () => {
      pointerRef.current.x = -9999;
      pointerRef.current.y = -9999;
    };

    const handleClick = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      if (clickX >= 0 && clickX <= rect.width && clickY >= 0 && clickY <= rect.height) {
        shockwavesRef.current.push({
          x: clickX,
          y: clickY,
          radius: 10,
          speed: 7,
          alpha: 1
        });
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('click', handleClick);

    let ro = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(buildGrid);
      ro.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('click', handleClick);
      if (ro) ro.disconnect();
    };
  }, [buildGrid]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
}
