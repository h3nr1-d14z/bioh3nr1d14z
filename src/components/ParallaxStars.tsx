// ParallaxStars.tsx
'use client';

import React, { useRef, useEffect } from "react";

const STAR_COUNT = 120;
const STAR_SPEED = 0.15;
const STAR_SIZE = [1, 2, 3];

function randomBetween(a: number, b: number) {
  return Math.random() * (b - a) + a;
}

function createStar(canvas: HTMLCanvasElement) {
  return {
    x: randomBetween(0, canvas.width),
    y: randomBetween(0, canvas.height),
    z: randomBetween(0.2, 1),
    size: STAR_SIZE[Math.floor(Math.random() * STAR_SIZE.length)],
    opacity: randomBetween(0.5, 1),
  };
}

// Define a type for Star
interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
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
    canvas.width = width;
    canvas.height = height;
    stars.current = Array.from({ length: STAR_COUNT }, () => createStar(canvas));

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const star of stars.current) {
        ctx.save();
        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * star.z, 0, 2 * Math.PI);
        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#fff";
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
      animationRef.current = requestAnimationFrame(draw);
    }
    draw();
    function handleResize() {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
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
