import React, { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { ProfileLighting } from './ProfileLighting';
import { CareerEnvironment3D } from './CareerEnvironment3D';
import { AnimatedCharacter, CharacterAnimationName } from './AnimatedCharacter';
import { CharacterControlsHUD } from './CharacterControlsHUD';
import { AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';

interface CharacterSceneProps {
  careerName: string;
  studentName?: string;
  onFallbackTo2D?: () => void;
}

// Internal Camera Rig to handle external HUD buttons (rotate, zoom, reset)
const CameraController: React.FC<{
  controlsRef: React.RefObject<OrbitControlsImpl>;
}> = ({ controlsRef }) => {
  return (
    <OrbitControls
      ref={controlsRef}
      target={[0, 1.0, 0]}
      minDistance={1.6}
      maxDistance={4.8}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2 - 0.05} // Never clip beneath floor
      enableDamping={true}
      dampingFactor={0.06}
      enablePan={false}
      rotateSpeed={0.7}
      zoomSpeed={0.8}
    />
  );
};

export const CharacterScene: React.FC<CharacterSceneProps> = ({
  careerName = 'Manufacturing Engineer',
  studentName = 'Alex',
  onFallbackTo2D,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [currentAnimation, setCurrentAnimation] = useState<CharacterAnimationName>('idle');
  const [interactiveDialogue, setInteractiveDialogue] = useState<string | null>(null);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglError('WebGL is disabled or unsupported on this device/browser.');
      }
    } catch (e: any) {
      setWebglError('Failed to initialize 3D graphics hardware acceleration.');
    }
  }, [retryKey]);

  // Dialogue lines for interactive clicks
  const dialogues: Record<string, string[]> = {
    'Manufacturing Engineer': [
      "All automated assembly cells are operating at peak 99.4% efficiency!",
      "I'm currently optimizing the conveyor cycle time and robotic arm calibration.",
      "Safety first! Protective helmet, hi-vis vest, and steel-toe boots locked in.",
      "Ready to deploy the new PLC logic update to the factory floor.",
    ],
    'Software Developer': [
      "Production build compiled with zero regressions! Ready for deployment.",
      "Refactoring algorithmic pipelines to reduce latency under 12ms.",
      "All automated test suites passing in the continuous integration runner.",
    ],
    'UI/UX Designer': [
      "Refining the design tokens and glassmorphic micro-interactions.",
      "User testing shows a 40% jump in mission completion velocity!",
    ],
    'Data Analyst': [
      "Query optimizations completed. Predictive maintenance models are converging.",
      "Telemetry indicates higher throughput across all manufacturing shifts.",
    ],
    'Cybersecurity Analyst': [
      "Zero-trust network protocols established. Industrial firewall fully fortified.",
      "No security anomalies detected on the operational technology network.",
    ],
  };

  const handleCharacterClick = () => {
    const list = dialogues[careerName] || dialogues['Manufacturing Engineer'];
    const randomDialogue = list[Math.floor(Math.random() * list.length)];
    setInteractiveDialogue(randomDialogue);

    // Trigger greeting gesture on click
    setCurrentAnimation('agree');

    setTimeout(() => {
      setInteractiveDialogue(null);
    }, 4500);
  };

  // Camera Control Handlers
  const handleRotateLeft = () => {
    if (controlsRef.current) {
      const azimuth = controlsRef.current.getAzimuthalAngle();
      controlsRef.current.setAzimuthalAngle(azimuth + 0.35);
      controlsRef.current.update();
    }
  };

  const handleRotateRight = () => {
    if (controlsRef.current) {
      const azimuth = controlsRef.current.getAzimuthalAngle();
      controlsRef.current.setAzimuthalAngle(azimuth - 0.35);
      controlsRef.current.update();
    }
  };

  const handleZoomIn = () => {
    if (controlsRef.current) {
      const dist = controlsRef.current.getDistance();
      controlsRef.current.minDistance = Math.max(1.6, dist - 0.4);
      controlsRef.current.update();
      // restore default constraint
      controlsRef.current.minDistance = 1.6;
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      const dist = controlsRef.current.getDistance();
      controlsRef.current.maxDistance = Math.min(4.8, dist + 0.4);
      controlsRef.current.update();
      // restore default constraint
      controlsRef.current.maxDistance = 4.8;
    }
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 1.0, 0);
      controlsRef.current.update();
    }
  };

  if (webglError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-3xl border border-rose-500/30 bg-[#0C1222]/90 p-8 text-center backdrop-blur-xl">
        <AlertTriangle className="h-12 w-12 text-rose-400 mb-3 animate-pulse" />
        <h3 className="text-base font-bold text-white">3D Graphics Hardware Acceleration Unavailable</h3>
        <p className="text-xs text-gray-400 mt-2 max-w-sm">{webglError}</p>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => {
              setWebglError(null);
              setRetryKey((k) => k + 1);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 transition"
          >
            <RefreshCw className="h-4 w-4" /> Retry 3D Engine
          </button>
          {onFallbackTo2D && (
            <button
              onClick={onFallbackTo2D}
              className="rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-xs font-bold text-gray-300 hover:text-white transition"
            >
              Switch to 2D Mode
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full select-none overflow-hidden rounded-3xl border border-purple-500/20 bg-[#070A14] shadow-2xl">
      {/* 3D Canvas */}
      <Canvas
        key={retryKey}
        shadows
        camera={{ position: [0, 1.4, 3.2], fov: 42 }}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#070A14']} />
        <fog attach="fog" args={['#070A14', 5, 16]} />

        <Suspense fallback={null}>
          <ProfileLighting careerName={careerName} />
          <CareerEnvironment3D careerName={careerName} />
          <AnimatedCharacter
            careerName={careerName}
            currentAnimation={currentAnimation}
            onAnimationEnd={() => setCurrentAnimation('idle')}
            onCharacterClick={handleCharacterClick}
          />
          <CameraController controlsRef={controlsRef} />
        </Suspense>
      </Canvas>

      {/* Floating 3D Character Inspection HUD Controls */}
      <CharacterControlsHUD
        currentAnimation={currentAnimation}
        onSetAnimation={setCurrentAnimation}
        onRotateLeft={handleRotateLeft}
        onRotateRight={handleRotateRight}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetCamera={handleResetCamera}
        interactiveDialogue={interactiveDialogue}
        studentName={studentName}
        careerName={careerName}
      />
    </div>
  );
};
