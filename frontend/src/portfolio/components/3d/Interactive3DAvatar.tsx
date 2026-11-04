import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles, User, Camera, Upload, RefreshCw, Eye, ShieldCheck } from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';

// 3D Humanoid Model Component
const CharacterModel: React.FC = () => {
  const modelRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/developer-character.glb');

  const clonedScene = React.useMemo(() => {
    const s = scene.clone(true);
    s.traverse((node: any) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    return s;
  }, [scene]);

  useFrame((state) => {
    if (modelRef.current) {
      const t = state.clock.getElapsedTime();
      modelRef.current.position.y = -1.65 + Math.sin(t * 1.5) * 0.02;
    }
  });

  return (
    <group ref={modelRef} position={[0, -1.65, 0]} scale={1.8}>
      <primitive object={clonedScene} />

      {/* Cyber Neon Floor Rings */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.54, 48]} />
        <meshBasicMaterial color="#00f0ff" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.72, 48]} />
        <meshBasicMaterial color="#a855f7" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// Fallback Loader Inside Canvas
const CanvasLoader: React.FC = () => (
  <mesh position={[0, 0, 0]}>
    <boxGeometry args={[0.6, 0.6, 0.6]} />
    <meshStandardMaterial color="#00f0ff" wireframe />
  </mesh>
);

// 3D Character Canvas
const CharacterCanvas: React.FC = () => {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        camera={{ position: [0, 0.2, 3.4], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 4, 3]} intensity={1.8} color="#ffffff" />
        <pointLight position={[-2, 1, 2]} intensity={8} color="#00f0ff" />
        <pointLight position={[2, 0, 2]} intensity={8} color="#a855f7" />
        <pointLight position={[0, -2, -2]} intensity={5} color="#38bdf8" />

        <Suspense fallback={<CanvasLoader />}>
          <CharacterModel />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2 + 0.1}
          autoRotate={true}
          autoRotateSpeed={1.8}
        />

        <ContactShadows
          position={[0, -1.68, 0]}
          opacity={0.7}
          scale={3.5}
          blur={2.5}
          far={3}
          color="#000000"
        />
      </Canvas>
    </div>
  );
};

// Main Export with Toggle & Live Photo Upload
export const Interactive3DAvatar: React.FC = () => {
  const [viewMode, setViewMode] = useState<'3d-model' | '3d-photo'>('3d-photo');
  const [userPhoto, setUserPhoto] = useState<string>('/aman.jpg');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      soundEffects.playSuccess();
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setUserPhoto(base64);
        localStorage.setItem('aman_portfolio_photo', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* View Mode Switcher Pills */}
      <div className="flex items-center gap-2 mb-4 p-1 rounded-full glass-panel border border-white/10 z-20">
        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            setViewMode('3d-photo');
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
            viewMode === '3d-photo'
              ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>3D Hologram Photo</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            setViewMode('3d-model');
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
            viewMode === '3d-model'
              ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>3D Real Character</span>
        </button>
      </div>

      {/* Main 3D Card Container */}
      <div className="relative w-64 h-84 sm:w-72 sm:h-96 rounded-3xl p-1 bg-gradient-to-tr from-cyan-400 via-purple-500 to-blue-500 shadow-[0_0_40px_rgba(0,240,255,0.35)]">
        <div className="w-full h-full rounded-[22px] bg-[#060b18] overflow-hidden relative flex items-center justify-center border border-white/15">
          
          {viewMode === '3d-model' ? (
            /* Real 3D GLB Character Mode */
            <div className="w-full h-full relative">
              <CharacterCanvas />
              <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-black/70 border border-white/15 text-[10px] font-mono text-cyan-300 backdrop-blur-md shadow-lg">
                  ↺ Drag to Rotate 3D Model
                </span>
              </div>
            </div>
          ) : (
            /* 3D Holographic Photo Mode */
            <div className="w-full h-full relative group">
              {/* Aman's Photo with Sharp Framing */}
              <img
                src={userPhoto}
                alt="Aman Bhardwaj"
                className="w-full h-full object-cover object-[center_15%] transition-transform duration-700 group-hover:scale-106"
              />

              {/* Sci-fi Overlay Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060b18] via-transparent to-cyan-500/10 pointer-events-none" />

              {/* Glowing Cyber Holographic Scanline */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent h-12 w-full animate-scanline pointer-events-none" />

              {/* Cyber Frame Corner Brackets */}
              <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
              <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
              <div className="absolute bottom-12 left-2.5 w-4 h-4 border-b-2 border-l-2 border-purple-400 pointer-events-none" />
              <div className="absolute bottom-12 right-2.5 w-4 h-4 border-b-2 border-r-2 border-purple-400 pointer-events-none" />

              {/* Status Pill in photo */}
              <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl glass-panel border border-cyan-400/30 text-[10px] font-mono text-cyan-300 flex items-center justify-between backdrop-blur-md shadow-lg">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                  <span className="font-bold text-white tracking-wider">AMAN BHARDWAJ</span>
                </span>
                <span className="text-[9px] text-cyan-300 font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/30">
                  LIVE 3D
                </span>
              </div>

              {/* Quick Change Photo Button */}
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  fileInputRef.current?.click();
                }}
                className="absolute top-3 right-3 p-2 rounded-xl bg-black/75 hover:bg-black border border-white/20 text-cyan-300 hover:text-white transition-all shadow-lg flex items-center gap-1.5 text-xs font-mono"
                title="Change Photo"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline">Update</span>
              </button>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Helpful Subtitle */}
      <div className="mt-3 flex items-center gap-2 text-xs font-mono text-gray-400">
        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
        <span>Verified Developer Profile • 3D Real-Time Render</span>
      </div>
    </div>
  );
};
