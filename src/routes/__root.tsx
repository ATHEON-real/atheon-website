import React, { useRef, useState, useEffect } from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface InteractiveMeshProps {
  isMobile: boolean;
}

// --- 1. THE REFINED 3D INTERACTIVE MESH COMPONENT ---
const InteractiveMesh: React.FC<InteractiveMeshProps> = ({ isMobile }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.0015;
    meshRef.current.rotation.y += 0.0025;

    const targetX = (mouse.x * viewport.width) * 0.12;
    const targetY = (mouse.y * viewport.height) * 0.12;
    
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.05;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={meshRef} scale={isMobile ? 1.2 : 2.2}>
        <torusKnotGeometry args={[1, 0.32, 200, 16, 3, 4]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.25}
          chromaticAberration={0.06}
          anisotropy={0.2}
          distortion={0.25}
          distortionScale={0.15}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={0.4}
          attenuationColor="#ffffff"
          color="#f8fafc"
        />
      </mesh>
    </Float>
  );
};

// --- 2. MASTER ROUTE LAYOUT SHELL ---
function RootLayout() {
  const [isMobile, setIsMobile] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const acronymData = [
    { letter: 'A', word: 'Aesthetic', desc: 'Prioritizing pure, minimalist structural beauty.' },
    { letter: 'T', word: 'Technology', desc: 'Engineered with clean, performance-first frameworks.' },
    { letter: 'H', word: 'Harmony', desc: 'Balancing structural layouts with negative space.' },
    { letter: 'E', word: 'Evolution', desc: 'Continuously refining identity through iterative design.' },
    { letter: 'O', word: 'Order', desc: 'Mathematical precision mapped out across the screen.' },
    { letter: 'N', word: 'Nexus', desc: 'The central connection point of the digital experience.' }
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      
      {/* ─── INTRO SPLASH OVERLAY ─── */}
      <div 
        className={`fixed inset-0 w-full h-full min-h-screen bg-black flex flex-col justify-between p-6 md:p-16 z-50 transition-all duration-1000 ease-in-out select-none
          ${isDismissed ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'}`}
      >
        <div className="w-full flex justify-between items-center border-b border-white/10 pb-4 font-mono text-[10px] tracking-widest text-white/40">
          <span>SYSTEM RUNTIME // CORE</span>
          <span>ATHEON PROTOCOL OVERLAY</span>
        </div>

        <div className="max-w-5xl mx-auto w-full my-auto py-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white font-sans uppercase">
              ATHEON
            </h1>
            <p className="text-white/40 text-xs mt-4 font-light max-w-sm leading-relaxed font-mono">
              [ Conceptual Architecture Interface ] <br />
              Move your cursor or tilt your device to interface with the 3D structural core background.
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
          <span className="text-white/20 text-[9px] uppercase font-mono tracking-widest animate-pulse">Click to bypass initialization terminal</span>
        </div>
      </div>

      {/* ─── PERSISTENT 3D BACKGROUND LAYER ─── */}
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 bg-transparent select-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <directionalLight position={[-10, -10, -5]} intensity={0.4} color="#818cf8" />
          <pointLight position={[0, 4, 4]} intensity={0.8} />
          <InteractiveMesh isMobile={isMobile} />
          <Environment preset="studio" />
        </Canvas>
      </div>

      {/* ─── DYNAMIC OUTLET (RENDERS HOMEPAGE UNTOUCHED) ─── */}
      <div className="relative z-10 w-full min-h-screen pointer-events-auto bg-transparent">
        <Outlet />
      </div>

    </div>
  );
}

// Export the configured route object for TanStack Router compilation
export const Route = createRootRoute({
  component: RootLayout,
});
