import React from 'react';
import * as THREE from 'three';

interface CareerEnvironment3DProps {
  careerName?: string;
}

export const CareerEnvironment3D: React.FC<CareerEnvironment3DProps> = ({ careerName }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Reflective Tournament Lobby Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[36, 36]} />
        <meshStandardMaterial
          color="#0F172A"
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>

      {/* Perspective Floor Grid */}
      <gridHelper args={[28, 28, '#38BDF8', '#334155']} position={[0, 0.005, 0]} />

      {/* 2. Character Standing Pedestal / High-Tech Stage */}
      <group position={[0, 0.015, 0]}>
        {/* Main Solid Metallic Base Disc */}
        <mesh position={[0, 0.01, 0]} receiveShadow>
          <cylinderGeometry args={[1.15, 1.25, 0.03, 48]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Outer Glowing Energy Neon Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <ringGeometry args={[1.12, 1.18, 64]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>

        {/* Inner Accent Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.031, 0]}>
          <ringGeometry args={[0.7, 0.74, 48]} />
          <meshBasicMaterial color="#8B5CF6" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>

        {/* Contact Shadow Decal directly anchoring character feet */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.032, 0]}>
          <circleGeometry args={[0.55, 32]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.65} />
        </mesh>
      </group>

      {/* 3. Layered Background Architecture (Hangar / Tech Facility) */}
      {/* Main Back Wall with Panel Paneling */}
      <mesh position={[0, 4.5, -6.5]} receiveShadow>
        <planeGeometry args={[30, 11]} />
        <meshStandardMaterial color="#111827" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Center Illuminated Architectural Bay Frame */}
      <group position={[0, 4.0, -6.4]}>
        {/* Central Geometric Hologram Accent Backplate */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[7.0, 7.5]} />
          <meshStandardMaterial
            color="#1E293B"
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>
        {/* Cyan Neon Border Frame */}
        <lineSegments position={[0, 0, 0.02]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(6.9, 7.4)]} />
          <lineBasicMaterial color="#38BDF8" linewidth={2} />
        </lineSegments>
      </group>

      {/* Left Wall */}
      <mesh position={[-9.5, 4.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[22, 11]} />
        <meshStandardMaterial color="#0F172A" roughness={0.7} metalness={0.5} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[9.5, 4.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[22, 11]} />
        <meshStandardMaterial color="#0F172A" roughness={0.7} metalness={0.5} />
      </mesh>

      {/* 4. Structural Gantry Towers & Lighting Columns */}
      {/* Left Heavy Structural Column */}
      <group position={[-5.0, 4.0, -4.5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.7, 9, 0.7]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Vertical Neon Light Strip (Cyan) */}
        <mesh position={[0.36, 0, 0.36]}>
          <boxGeometry args={[0.06, 7.5, 0.06]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>
      </group>

      {/* Right Heavy Structural Column */}
      <group position={[5.0, 4.0, -4.5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.7, 9, 0.7]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Vertical Neon Light Strip (Purple) */}
        <mesh position={[-0.36, 0, 0.36]}>
          <boxGeometry args={[0.06, 7.5, 0.06]} />
          <meshBasicMaterial color="#A855F7" />
        </mesh>
      </group>

      {/* Overhead Gantry Crossbeam Truss */}
      <group position={[0, 7.2, -4.5]}>
        <mesh castShadow>
          <boxGeometry args={[11.5, 0.6, 0.6]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Overhead Horizontal Cyan Strip */}
        <mesh position={[0, -0.32, 0.28]}>
          <boxGeometry args={[10.5, 0.08, 0.08]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>
      </group>

      {/* 5. Background Tech Racks & Automated Machinery Consoles */}
      {/* Left Tech Console Array */}
      <group position={[-4.2, 0.9, -3.2]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.8, 0.9]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Ambient Indicator Screen */}
        <mesh position={[0, 0.45, 0.46]}>
          <planeGeometry args={[1.2, 0.6]} />
          <meshBasicMaterial color="#0284C7" />
        </mesh>
      </group>

      {/* Right Tech Console Array */}
      <group position={[4.2, 0.9, -3.2]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.8, 0.9]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Ambient Indicator Screen */}
        <mesh position={[0, 0.45, 0.46]}>
          <planeGeometry args={[1.2, 0.6]} />
          <meshBasicMaterial color="#7C3AED" />
        </mesh>
      </group>
    </group>
  );
};
