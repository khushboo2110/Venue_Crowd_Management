import React, { useEffect, useRef } from "react";

/**
 * GEEK ROOM JIMS - Interactive Mouse-Tracking Halftone Canvas Engine Component
 * Renders dynamic pulsating halftone dot matrix with ambient radial spotlights
 */
export default function InteractiveHalftoneBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let mouse = { x: width / 2, y: height / 2, radius: 220 };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;
    let animId;

    function draw() {
      ctx.clearRect(0, 0, width, height);
      time += 0.025;

      const cols = Math.ceil(width / 32);
      const rows = Math.ceil(height / 32);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * 32 + 16;
          const y = j * 32 + 16;
          const dist = Math.hypot(mouse.x - x, mouse.y - y);

          let radius = 2 + Math.sin(time + (i * 0.2) + (j * 0.2)) * 1.5;

          // Dots swell dynamically near mouse cursor!
          if (dist < mouse.radius) {
            radius += (1 - dist / mouse.radius) * 6.5;
          }

          ctx.beginPath();
          ctx.arc(x, y, Math.min(radius, 9), 0, Math.PI * 2);
          ctx.fillStyle = (i + j) % 3 === 0 
            ? `rgba(255, 107, 0, ${0.18 + radius / 16})` 
            : `rgba(0, 240, 255, ${0.16 + radius / 16})`;
          ctx.fill();
        }
      }
      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Interactive Halftone Canvas */}
      <canvas
        ref={canvasRef}
        id="halftone-canvas"
        className="fixed top-0 left-0 w-full h-full z-[0] pointer-events-none opacity-80"
      />
      {/* Vector Halftone Matrix Grid */}
      <div className="bg-halftone-grid" />
      {/* Ambient Radial Spotlights */}
      <div className="ambient-lights" />
    </>
  );
}
