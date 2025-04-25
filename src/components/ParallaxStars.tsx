// ParallaxStars.tsx
'use client';

import React, { useRef, useEffect } from "react";

const STAR_COUNT = 120;
const STAR_SPEED = 0.15;
const STAR_SIZE = [1, 2, 3];

// Add color palette for stars
const STAR_COLORS = ["#fff", "#b3e5fc", "#e1f5fe", "#f0f9ff", "#a7ffeb"];

function randomBetween(a: number, b: number) {
  return Math.random() * (b - a) + a;
}

// Update Star type: twinkleSpeed and twinklePhase are required
interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

function createStar(canvas: HTMLCanvasElement): Star {
  return {
    x: randomBetween(0, canvas.width),
    y: randomBetween(0, canvas.height),
    z: randomBetween(0.2, 1),
    size: STAR_SIZE[Math.floor(Math.random() * STAR_SIZE.length)],
    opacity: randomBetween(0.5, 1),
    twinkleSpeed: randomBetween(0.005, 0.02),
    twinklePhase: Math.random() * Math.PI * 2,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]
  };
}

// Type for shooting star
interface ShootingStar {
  x: number;
  y: number;
  angle: number;
  len: number;
  speed: number;
  progress: number;
}

export default function ParallaxStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const stars = useRef<Star[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars.current = Array.from({ length: STAR_COUNT }, () => createStar(canvas));
    let shootingStar: ShootingStar | null = null;
    let shootingStarTimer = 0;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      // Twinkling stars
      for (const star of stars.current) {
        // twinkleSpeed and twinklePhase are now always defined
        star.opacity += Math.sin(Date.now() * star.twinkleSpeed + star.twinklePhase) * 0.01;
        star.opacity = Math.max(0.3, Math.min(1, star.opacity));
        ctx.save();
        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * star.z, 0, 2 * Math.PI);
        ctx.fillStyle = star.color;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = 8 * star.z;
        ctx.fill();
        ctx.restore();
        star.y += STAR_SPEED * star.z * 2;
        if (star.y > height) {
          star.x = randomBetween(0, width);
          star.y = 0;
          star.z = randomBetween(0.2, 1);
        }
      }
      // Cinematic shooting star: always starts just above the top edge, travels diagonally across the canvas
      if (!shootingStar && Math.random() < 0.002 && shootingStarTimer < Date.now()) {
        // Start just above the top edge, random X
        const startX = randomBetween(width * 0.1, width * 0.9);
        const startY = -40; // just above the canvas
        // End at the bottom or right edge
        const endX = startX + randomBetween(width * 0.3, width * 0.7);
        const endY = height + 80; // just below the canvas
        const dx = endX - startX;
        const dy = endY - startY;
        const angle = Math.atan2(dy, dx);
        const distance = Math.sqrt(dx * dx + dy * dy);
        shootingStar = {
          x: startX,
          y: startY,
          angle,
          len: distance,
          speed: randomBetween(1.2, 2.2), // slower, more cinematic
          progress: 0,
        };
        shootingStarTimer = Date.now() + 2000 + Math.random() * 3000;
      }
      if (shootingStar) {
        // Draw a fading, colored tail with a subtle color shift
        const tailLen = 180;
        const steps = 22;
        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          const fade = 1 - t;
          const sx = shootingStar.x + Math.cos(shootingStar.angle) * (shootingStar.progress - t * tailLen);
          const sy = shootingStar.y + Math.sin(shootingStar.angle) * (shootingStar.progress - t * tailLen);
          ctx.save();
          ctx.globalAlpha = 0.16 * fade;
          // Subtle color shift: white to blue to cyan
          const r = 200 + 55 * fade;
          const g = 240 + 15 * fade;
          const b = 255;
          ctx.strokeStyle = `rgba(${r},${g},${b},1)`;
          ctx.shadowColor = `rgba(0,255,255,${0.18 * fade})`;
          ctx.shadowBlur = 14 * fade;
          ctx.lineWidth = 2 + 2 * fade;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx - Math.cos(shootingStar.angle) * 10, sy - Math.sin(shootingStar.angle) * 10);
          ctx.stroke();
          ctx.restore();
        }
        // Draw the bright head with a particle burst
        const headX = shootingStar.x + Math.cos(shootingStar.angle) * shootingStar.progress;
        const headY = shootingStar.y + Math.sin(shootingStar.angle) * shootingStar.progress;
        ctx.save();
        ctx.globalAlpha = 0.98;
        ctx.beginPath();
        ctx.arc(headX, headY, 4.2, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#b3e5fc';
        ctx.shadowBlur = 38;
        ctx.fill();
        // Particle burst (cosmic sparkle)
        for (let p = 0; p < 7; p++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 7 + Math.random() * 10;
          const px = headX + Math.cos(angle) * dist;
          const py = headY + Math.sin(angle) * dist;
          ctx.beginPath();
          ctx.arc(px, py, 0.8 + Math.random() * 1.2, 0, 2 * Math.PI);
          ctx.globalAlpha = 0.18 + Math.random() * 0.12;
          ctx.fillStyle = `rgba(180,255,255,1)`;
          ctx.shadowColor = '#b3e5fc';
          ctx.shadowBlur = 8;
          ctx.fill();
        }
        ctx.restore();
        shootingStar.progress += shootingStar.speed;
        if (
          headX < -100 || headX > width + 100 || headY < -100 || headY > height + 100
        ) {
          shootingStar = null;
        }
      }
      animationRef.current = requestAnimationFrame(draw);
    }
    draw();
    function handleResize() {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars.current = Array.from({ length: STAR_COUNT }, () => createStar(canvas));
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[-1]"
      aria-hidden="true"
    />
  );
}
