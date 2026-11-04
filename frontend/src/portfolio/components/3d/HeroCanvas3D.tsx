import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Generate dynamic animated texture for the laptop screen
function useLaptopScreenTexture() {
  const canvas = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 640;
    return c;
  }, []);

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    return t;
  }, [canvas]);

  useEffect(() => {
    let animId: number;
    let step = 0;

    const codeLines = [
      "const developer = new AmanBhardwaj();",
      "developer.setStatus('Ready to Innovate');",
      "await developer.buildDigitalExperiences();",
      "import { FullStack, AI, ThreeJS } from 'skills';",
      "> ACM Student Chapter: Treasurer Active",
      "> Hackathon Sprint 48H: 2nd Place Secured",
      "> Compiling neural assets... [100% OK]",
      "> System ready. Welcome to my portfolio.",
    ];

    const renderCanvas = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Dark sci-fi gradient background
      const grad = ctx.createLinearGradient(0, 0, 1024, 640);
      grad.addColorStop(0, '#060B19');
      grad.addColorStop(0.5, '#0B1124');
      grad.addColorStop(1, '#050814');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 640);

      // Cyber grid lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 1024; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 640);
        ctx.stroke();
      }
      for (let y = 0; y < 640; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y);
        ctx.stroke();
      }

      // Header Bar
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(0, 0, 1024, 48);

      // Window controls
      ctx.fillStyle = '#FF5F56';
      ctx.beginPath(); ctx.arc(28, 24, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#FFBD2E';
      ctx.beginPath(); ctx.arc(52, 24, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#27C93F';
      ctx.beginPath(); ctx.arc(76, 24, 7, 0, Math.PI * 2); ctx.fill();

      // Title
      ctx.font = '600 16px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('aman@portfolio: ~/core/terminal.sh', 110, 30);

      // Status pill
      ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.fillRect(840, 12, 160, 24);
      ctx.strokeStyle = '#00F0FF';
      ctx.strokeRect(840, 12, 160, 24);
      ctx.fillStyle = '#00F0FF';
      ctx.font = '600 12px "JetBrains Mono", monospace';
      ctx.fillText('● SYSTEM ONLINE', 860, 28);

      // Code lines
      ctx.font = '19px "JetBrains Mono", monospace';
      codeLines.forEach((line, index) => {
        const yPos = 100 + index * 42;
        if (line.startsWith('>')) {
          ctx.fillStyle = '#00F0FF';
        } else if (line.startsWith('const') || line.startsWith('await')) {
          ctx.fillStyle = '#C084FC';
        } else if (line.startsWith('import')) {
          ctx.fillStyle = '#38BDF8';
        } else {
          ctx.fillStyle = '#F8FAFC';
        }
        ctx.fillText(`$ ${line}`, 40, yPos);
      });

      // Animated glowing waveform at bottom
      step += 0.05;
      ctx.strokeStyle = '#A855F7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < 1024; x += 10) {
        const y = 560 + Math.sin(x * 0.02 + step) * 20 + Math.cos(x * 0.04 - step) * 10;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Blinking cursor
      if (Math.sin(step * 4) > 0) {
        ctx.fillStyle = '#00F0FF';
        ctx.fillRect(40, 480, 14, 24);
      }

      texture.needsUpdate = true;
      animId = requestAnimationFrame(renderCanvas);
    };

    renderCanvas();
    return () => cancelAnimationFrame(animId);
  }, [canvas, texture]);

  return texture;
}

// 3D Futuristic Laptop Component
const FuturisticLaptop: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const screenTexture = useLaptopScreenTexture();
  const { mouse } = useThree();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Gentle floating motion
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 1.2) * 0.12;

    // Smooth mouse parallax tilt
    const targetRotY = mouse.x * 0.45;
    const targetRotX = -mouse.y * 0.25;
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 4, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 4, delta);
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} rotation={[0.1, -0.3, 0]}>
      {/* LAPTOP BASE */}
      <group position={[0, -0.1, 0]}>
        {/* Chassis bottom */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.16, 2.8]} />
          <meshStandardMaterial
            color="#0b1120"
            metalness={0.88}
            roughness={0.25}
          />
        </mesh>

        {/* Chassis edge neon accent */}
        <mesh position={[0, -0.06, 1.41]}>
          <boxGeometry args={[4.2, 0.02, 0.02]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>

        {/* Keyboard deck inset */}
        <mesh position={[0, 0.085, -0.3]}>
          <boxGeometry args={[3.8, 0.02, 1.6]} />
          <meshStandardMaterial color="#060913" roughness={0.7} />
        </mesh>

        {/* Glowing Keyboard key array representation */}
        <mesh position={[0, 0.096, -0.3]}>
          <planeGeometry args={[3.6, 1.4]} />
          <meshStandardMaterial
            color="#0a1226"
            emissive="#a855f7"
            emissiveIntensity={0.25}
            roughness={0.4}
          />
        </mesh>

        {/* Trackpad */}
        <mesh position={[0, 0.086, 0.82]}>
          <boxGeometry args={[1.4, 0.01, 0.9]} />
          <meshStandardMaterial
            color="#0e172a"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        {/* Trackpad glowing border line */}
        <mesh position={[0, 0.092, 0.82]}>
          <planeGeometry args={[1.42, 0.92]} />
          <meshBasicMaterial color="#38bdf8" wireframe />
        </mesh>
      </group>

      {/* LAPTOP LID / SCREEN */}
      <group position={[0, 0, -1.35]} rotation={[-0.32, 0, 0]}>
        {/* Back lid shell */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[4.2, 2.8, 0.12]} />
          <meshStandardMaterial
            color="#090e1a"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Back Logo (Glowing AB monogram) */}
        <mesh position={[0, 1.4, -0.07]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.3, 32]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={1.8}
          />
        </mesh>

        {/* Screen Bezel */}
        <mesh position={[0, 1.4, 0.065]}>
          <planeGeometry args={[4.05, 2.65]} />
          <meshStandardMaterial color="#030712" roughness={0.9} />
        </mesh>

        {/* Active Animated Display Screen */}
        <mesh position={[0, 1.4, 0.07]}>
          <planeGeometry args={[3.85, 2.45]} />
          <meshBasicMaterial map={screenTexture} toneMapped={false} />
        </mesh>

        {/* Camera dot */}
        <mesh position={[0, 2.68, 0.07]}>
          <circleGeometry args={[0.025, 16]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
      </group>
    </group>
  );
};

// Surrounding Interactive 3D Geometric Objects
const FloatingCyberShapes: React.FC = () => {
  const torusRef = useRef<THREE.Mesh>(null);
  const dodecaRef = useRef<THREE.Mesh>(null);
  const octaRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const miniCubesGroup = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.4;
      torusRef.current.rotation.y = t * 0.6;
    }
    if (dodecaRef.current) {
      dodecaRef.current.rotation.x = t * 0.5;
      dodecaRef.current.rotation.z = t * 0.3;
    }
    if (octaRef.current) {
      octaRef.current.rotation.y = t * 0.7;
      octaRef.current.rotation.z = t * 0.4;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.3;
      ringRef.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.5) * 0.1;
    }
    if (miniCubesGroup.current) {
      miniCubesGroup.current.rotation.y = t * 0.2;
    }
  });

  return (
    <>
      {/* Floating Glowing Dodecahedron (Top Right) */}
      <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
        <mesh ref={dodecaRef} position={[3.2, 1.8, -1]} scale={0.7}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#7c3aed"
            emissiveIntensity={0.6}
            wireframe
          />
        </mesh>
      </Float>

      {/* Floating Glowing Torus (Left) */}
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1.8}>
        <mesh ref={torusRef} position={[-3.3, 0.8, -0.5]} scale={0.65}>
          <torusGeometry args={[1, 0.28, 16, 64]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
            wireframe
          />
        </mesh>
      </Float>

      {/* Octahedron Gem (Bottom Right) */}
      <Float speed={1.8} rotationIntensity={1.4} floatIntensity={1.2}>
        <mesh ref={octaRef} position={[2.9, -1.5, 0.5]} scale={0.6}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={0.4}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </Float>

      {/* Orbiting Cyber Ring */}
      <mesh ref={ringRef} position={[0, -0.2, 0]} scale={2.8}>
        <ringGeometry args={[1.5, 1.54, 64]} />
        <meshBasicMaterial
          color="#a855f7"
          side={THREE.DoubleSide}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Orbiting Mini Data Cubes */}
      <group ref={miniCubesGroup} position={[0, 0, 0]}>
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i / 5) * Math.PI * 2;
          const radius = 3.6;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * radius, (i % 2) * 0.8 - 0.4, Math.sin(angle) * radius]}
              scale={0.18}
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? "#00f0ff" : "#a855f7"}
                emissive={i % 2 === 0 ? "#00f0ff" : "#a855f7"}
                emissiveIntensity={0.8}
              />
            </mesh>
          );
        })}
      </group>
    </>
  );
};

// Subtle Floating Cyber Dust / Particles
const CyberDust: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const count = 350;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cyan = new THREE.Color('#00f0ff');
    const purple = new THREE.Color('#a855f7');
    const blue = new THREE.Color('#38bdf8');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;

      const chosen = Math.random() > 0.5 ? (Math.random() > 0.5 ? cyan : purple) : blue;
      col[i * 3] = chosen.r;
      col[i * 3 + 1] = chosen.g;
      col[i * 3 + 2] = chosen.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.02) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Main Canvas Export
export const HeroCanvas3D: React.FC = () => {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        camera={{ position: [0, 0.4, 5.8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        {/* Cinematic Neon Lighting */}
        <ambientLight intensity={0.4} />
        
        {/* Main top-left cyan spotlight */}
        <pointLight position={[-4, 4, 3]} intensity={18} color="#00f0ff" distance={14} />
        
        {/* Right purple fill light */}
        <pointLight position={[4, 2, 2]} intensity={20} color="#a855f7" distance={14} />
        
        {/* Rim back-light for high-contrast edges */}
        <directionalLight position={[0, -2, -3]} intensity={5} color="#38bdf8" />

        {/* 3D Laptop */}
        <FuturisticLaptop />

        {/* Floating Geometric Elements */}
        <FloatingCyberShapes />

        {/* Ambient Particle Field */}
        <CyberDust />

        {/* Ground Soft Ambient Shadow */}
        <ContactShadows
          position={[0, -1.9, 0]}
          opacity={0.65}
          scale={10}
          blur={2.4}
          far={4}
          color="#000000"
        />
      </Canvas>
    </div>
  );
};
