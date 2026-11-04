import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const HologramBeacon: React.FC = () => {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const satellitesGroup = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.8;
      const scale = 1 + Math.sin(t * 3) * 0.06;
      coreRef.current.scale.set(scale, scale, scale);
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.7;
      ring1Ref.current.rotation.y = t * 0.5;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.9;
      ring2Ref.current.rotation.z = t * 0.4;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -t * 0.6;
      ring3Ref.current.rotation.z = -t * 0.8;
    }

    if (satellitesGroup.current) {
      satellitesGroup.current.rotation.y = t * 0.6;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.2}>
      <group position={[0, 0, 0]}>
        {/* Glowing Center Core */}
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1, 2]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.8}
            wireframe
          />
        </mesh>

        {/* Inner solid energy ball */}
        <mesh scale={0.6}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#9333ea"
            emissiveIntensity={1.2}
            roughness={0.1}
          />
        </mesh>

        {/* Orbiting Gyro Rings */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[1.5, 0.03, 16, 64]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>

        <mesh ref={ring2Ref}>
          <torusGeometry args={[1.8, 0.025, 16, 64]} />
          <meshBasicMaterial color="#a855f7" />
        </mesh>

        <mesh ref={ring3Ref}>
          <torusGeometry args={[2.1, 0.02, 16, 64]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Orbiting Satellite Data Nodes */}
        <group ref={satellitesGroup}>
          {[0, 1, 2].map((i) => {
            const angle = (i / 3) * Math.PI * 2;
            const r = 2.4;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * r, Math.sin(angle) * 0.6, Math.sin(angle) * r]}
                scale={0.15}
              >
                <octahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive="#00f0ff"
                  emissiveIntensity={1.5}
                />
              </mesh>
            );
          })}
        </group>
      </group>
    </Float>
  );
};

export const FloatingContactCanvas3D: React.FC = () => {
  return (
    <div className="w-full h-full relative pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 3, 3]} intensity={15} color="#00f0ff" />
        <pointLight position={[-3, -3, 2]} intensity={15} color="#a855f7" />
        <HologramBeacon />
      </Canvas>
    </div>
  );
};
