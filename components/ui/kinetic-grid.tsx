'use client';

import * as React from 'react';
import { useRef, useEffect } from 'react';

interface KineticGridProps {
  parentRef: React.RefObject<HTMLElement | null>;
  className?: string;
}

interface Point {
  x0: number;
  y0: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export function KineticGrid({ parentRef, className }: KineticGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = parentRef.current;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check motion preferences and pointer type
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const isStatic = prefersReducedMotion || isCoarse;

    let width = 0;
    let height = 0;
    let dpr = 1;

    // Grid config per task 8 spec
    const CELL_SIZE = 72;
    const INFLUENCE_RADIUS = 180;
    const MAX_WARP = 12;
    const LERP_SPEED = 0.06;

    let points: Point[][] = [];
    const ripples: Ripple[] = [];
    const mouse = { x: -1000, y: -1000, active: false };

    // Resolve colors from computed CSS tokens
    let baseColor = 'rgba(240, 240, 240, 0.07)';
    let accentColor = 'rgba(198, 255, 26, 0.35)';
    let rippleColor = 'rgba(198, 255, 26, 0.12)';

    const updateColors = () => {
      try {
        const style = getComputedStyle(parent);
        const fg = style.getPropertyValue('--foreground').trim();
        const pri = style.getPropertyValue('--primary').trim();
        if (fg) {
          baseColor = `hsl(${fg} / 0.07)`;
        }
        if (pri) {
          accentColor = `hsl(${pri} / 0.35)`;
          rippleColor = `hsl(${pri} / 0.12)`;
        }
      } catch {
        // Fallback to defaults
      }
    };

    updateColors();

    const initGrid = () => {
      points = [];
      const cols = Math.ceil(width / CELL_SIZE) + 2;
      const rows = Math.ceil(height / CELL_SIZE) + 2;

      for (let r = 0; r < rows; r++) {
        const row: Point[] = [];
        for (let c = 0; c < cols; c++) {
          const x0 = (c - 0.5) * CELL_SIZE;
          const y0 = (r - 0.5) * CELL_SIZE;
          row.push({
            x0,
            y0,
            x: x0,
            y: y0,
            vx: 0,
            vy: 0,
          });
        }
        points.push(row);
      }
    };

    const handleResize = () => {
      const rect = parent.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      initGrid();

      if (isStatic) {
        drawStatic();
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;

      for (let r = 0; r < points.length; r++) {
        for (let c = 0; c < points[r].length; c++) {
          const pt = points[r][c];
          const fade = Math.max(0, 1 - Math.pow(pt.y0 / height, 1.4));
          if (fade <= 0.01) continue;

          ctx.strokeStyle = baseColor;
          ctx.globalAlpha = fade;

          if (c < points[r].length - 1) {
            const nextX = points[r][c + 1];
            ctx.beginPath();
            ctx.moveTo(pt.x0, pt.y0);
            ctx.lineTo(nextX.x0, nextX.y0);
            ctx.stroke();
          }

          if (r < points.length - 1) {
            const nextY = points[r + 1][c];
            ctx.beginPath();
            ctx.moveTo(pt.x0, pt.y0);
            ctx.lineTo(nextY.x0, nextY.y0);
            ctx.stroke();
          }

          // Node dot
          ctx.fillStyle = baseColor;
          ctx.beginPath();
          ctx.arc(pt.x0, pt.y0, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    // Listeners on parent only per spec
    const handlePointerMove = (e: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      ripples.push({
        x: clickX,
        y: clickY,
        radius: 0,
        maxRadius: 220,
        alpha: 0.12,
      });
    };

    parent.addEventListener('pointermove', handlePointerMove, { passive: true });
    parent.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    parent.addEventListener('click', handleClick, { passive: true });

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(parent);
    handleResize();

    let animId: number | null = null;
    let isVisible = true;

    const render = () => {
      try {
        if (!isVisible) return;

        ctx.clearRect(0, 0, width, height);

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.radius += 3.5;
        rip.alpha = Math.max(0, 0.12 * (1 - rip.radius / rip.maxRadius));
        if (rip.radius >= rip.maxRadius) {
          ripples.splice(i, 1);
        } else {
          ctx.strokeStyle = rippleColor;
          ctx.globalAlpha = rip.alpha;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Physics & grid drawing
      const rows = points.length;
      if (rows === 0) return;
      const cols = points[0].length;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const pt = points[r][c];

          let targetX = pt.x0;
          let targetY = pt.y0;

          if (mouse.active) {
            const dx = mouse.x - pt.x0;
            const dy = mouse.y - pt.y0;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < INFLUENCE_RADIUS && dist > 0) {
              const force = (1 - dist / INFLUENCE_RADIUS) * MAX_WARP;
              targetX -= (dx / dist) * force;
              targetY -= (dy / dist) * force;
            }
          }

          // Lerp position
          pt.x += (targetX - pt.x) * LERP_SPEED;
          pt.y += (targetY - pt.y) * LERP_SPEED;

          // Bottom edge fade-out calculation (fade alpha toward bottom)
          const bottomFade = Math.max(0, 1 - Math.pow(pt.y / height, 1.4));
          if (bottomFade <= 0.01) continue;

          // Check distance to mouse for active color highlight
          const distToMouse = mouse.active
            ? Math.hypot(mouse.x - pt.x, mouse.y - pt.y)
            : 9999;
          const isNearCursor = distToMouse < INFLUENCE_RADIUS;

          const strokeStyle = isNearCursor ? accentColor : baseColor;
          ctx.strokeStyle = strokeStyle;
          ctx.lineWidth = 1;
          ctx.globalAlpha = bottomFade;

          // Horizontal segment
          if (c < cols - 1) {
            const rightPt = points[r][c + 1];
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(rightPt.x, rightPt.y);
            ctx.stroke();
          }

          // Vertical segment
          if (r < rows - 1) {
            const bottomPt = points[r + 1][c];
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(bottomPt.x, bottomPt.y);
            ctx.stroke();
          }

          // Node dot
          ctx.fillStyle = strokeStyle;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, isNearCursor ? 1.5 : 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      } catch (err) {
        console.error('KineticGrid render error:', err);
      }
      animId = requestAnimationFrame(render);
    };

    // Pause when hero is out of view (IntersectionObserver)
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting && !document.hidden;
          if (isVisible && !isStatic && !animId) {
            animId = requestAnimationFrame(render);
          } else if (!isVisible && animId) {
            cancelAnimationFrame(animId);
            animId = null;
          }
        });
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(parent);

    // Pause when tab is hidden
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && !isStatic && !animId) {
        animId = requestAnimationFrame(render);
      } else if (!isVisible && animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (!isStatic) {
      animId = requestAnimationFrame(render);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      parent.removeEventListener('pointermove', handlePointerMove);
      parent.removeEventListener('pointerleave', handlePointerLeave);
      parent.removeEventListener('click', handleClick);
    };
  }, [parentRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className || 'absolute inset-0 pointer-events-none z-0'}
    />
  );
}
