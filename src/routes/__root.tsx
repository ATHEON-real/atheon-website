import React, { useState, useEffect, useRef } from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';

// --- 1. PURE NATIVE HTML5 3D CANVAS INTERACTIVE MATRIX ---
const Pure3DBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Generate fixed 3D mathematical nodes
    const numPoints = window.innerWidth < 768 ? 40 : 90;
    const points: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < numPoints; i++) {
      const theta = Math.acos(Math.random() * 2 - 1);
      const phi = Math.random() * Math.PI * 2;
      const radius = 220; // Size of the 3D core
      points.push({
        x: radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(theta),
      });
    }

    // Track mouse coordinates
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX - window.innerWidth / 2) * 0.005;
      mouseRef.current.targetY = (e.clientY - window.innerHeight / 2) * 0.005;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Core 3D Rotation Angles
    let angleX = 0.002;
    let angleY = 0.003;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth interpolation for mouse tracking
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const currentAngleX = angleX + mouseRef.current.y * 0.01;
      const currentAngleY = angleY + mouseRef.current.x * 0.01;

      const cosX = Math.cos(currentAngleX);
      const sinX = Math.sin(currentAngleX);
      const cosY = Math.cos(currentAngleY);
      const sinY = Math.sin(currentAngleY);

      // Project 3D Space Coordinates cleanly onto a 2D viewport Matrix
      const projectedPoints = points.map((p) => {
        // Rotate X
        let y1 = p.y * cosX - p.z * sinX;
        let z1 = p.y * sinX + p.z * cosX;
        // Rotate Y
        let x2 = p.x * cosY + z1 * sinY;
        let z2 = -p.x * sinY + z1 * cosY;

        // Perspective projection scalar
        const perspective = 500 / (500 + z2);
        return {
          x: x2 * perspective + width / 2,
          y: y1 * perspective + height / 2,
          opacity: (500 - z2) / 700, // Depth shading maps
        };
      });

      // Draw spatial matrix connection vectors
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projectedPoints.length; i++) {
        for (let j = i + 1; j < projectedPoints.length; j++) {
          const dist = Math.hypot(
            projectedPoints[i].x - projectedPoints[j].x,
            projectedPoints[i].y - projectedPoints[j].y
          );

          if (dist < (window.innerWidth < 768 ? 75 : 110)) {
            const alpha = (1 - dist / (window.innerWidth < 768 ? 75 : 110)) * projectedPoints[i].opacity * 0.25;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(projectedPoints[i].x, projectedPoints[i].y);
            ctx.lineTo(projectedPoints[j].x, projectedPoints[j].y);
            ctx.stroke();
          }
        }
      }

      // Render nodes
      projectedPoints.forEach((p) => {
        ctx.fillStyle = \rgba(255, 255, 255, ${p.opacity * 0.6})`;`
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Slowly drift baseline core rotations
      angleX += 0.001;
      angleY += 0.0015;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-transparent" />;
};

// --- 2. MASTER SITE FRAME CONTAINER ---
function RootLayout() {
  const [isDismissed, setIsDismissed] = useState(false);

  const acronymData = [
    { letter: 'A', word: 'Aesthetic', desc: 'Prioritizing pure, minimalist structural beauty.' },
    { letter: 'T', word: 'Technology', desc: 'Engineered with clean, performance-first frameworks.' },
    { letter: 'H', word: 'Harmony', desc: 'Balancing structural layouts with negative space.' },
    { letter: 'E', word: 'Evolution', desc: 'Continuously refining identity through innovative design.' },
    { letter: 'O', word: 'Order', desc: 'Mathematical precision mapped out across the screen.' },
    { letter: 'N', word: 'Nexus', desc: 'The central connection point of the digital experience.' }
  ];

  useEffect(() => {
    if (!isDismissed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDismissed]);

  return (
    <div className="relative min-h-screen bg-black text-white w-full overflow-x-hidden">
      
      {/* ─── INTRO SPLASH OVERLAY PANEL ─── */}
      <div 
        className={`fixed inset-0 w-full h-full min-h-screen bg-black flex flex-col justify-between p-6 md:p-16 z-50 transition-all duration-1000 ease-in-out select-none
          ${isDismissed ? 'opacity-0 pointer-events-none scale-105 invisible' : 'opacity-100'}`}
      >
        <div className="w-full flex justify-between items-center border-b border-white/10 pb-4 font-mono text-[10px] tracking-widest text-white/40">
          <span>SYSTEM RUNTIME // ENGINE V2</span>
          <span>ATHEON CORE INITIALIZATION</span>
        </div>

        <div className="max-w-5xl mx-auto w-full my-auto py-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white font-sans uppercase">
              ATHEON
            </h1>
            <p className="text-white/40 text-xs mt-4 font-light max-w-sm leading-relaxed font-mono">
              [ Conceptual Architecture Interface ] <br />
              Move your cursor across the visual matrix to warp the background structural grid network.
            </p>
          </div>

          <div className="space-y-4 border-l border-white/10 pl-6 lg:pl-12">
            {acronymData.map((item, index) => (
              <div key={index} className="flex items-start space-x-4 group">
                <span className="text-sm md:text-base font-bold font-mono text-white bg-white/5 border border-white/10 w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded transition-all duration-300 group-hover:bg-white group-hover:text-black">
                  {item.letter}
                </span>
                <div>
                  <h4 className="text-white font-bold text-xs md:text-sm tracking-widest uppercase font-mono">
                    {item.word}
                  </h4>
                  <p className="text-white/40 text-[11px] md:text-xs font-light mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full flex flex-col items-center space-y-3">
          <button
            onClick={() => setIsDismissed(true)}
            className="group relative px-10 py-4 bg-white text-black text-xs uppercase font-mono tracking-widest overflow-hidden transition-all duration-300 border border-white hover:text-white rounded-none cursor-pointer"
          >
            <span className="relative z-10 font-bold">Initialize Experience</span>
            <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0" />
          </button>
          <span className="text-white/20 text-[9px] uppercase font-mono tracking-widest animate-pulse">Click to enter interface shell</span>
        </div>
      </div>

      {/* ─── PERSISTENT 3D GEOMETRIC BACKGROUND ─── */}
      <Pure3DBackground />

      {/* ─── NATIVE HOMEPAGE CONTENT INJECTION PORTAL ─── */}
      <div className="relative z-10 w-full min-h-screen pointer-events-auto bg-transparent">
        <Outlet />
      </div>

    </div>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
