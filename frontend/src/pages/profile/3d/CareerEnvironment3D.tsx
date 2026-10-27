import React from 'react';
import * as THREE from 'three';

interface CareerEnvironment3DProps {
  careerName?: string;
}

export const CareerEnvironment3D: React.FC<CareerEnvironment3DProps> = ({ careerName }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Reflective Industrial Factory Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color="#0A0E1A"
          roughness={0.25}
          metalness={0.8}
        />
      </mesh>

      {/* Grid Floor Overlay for perspective depth */}
      <gridHelper args={[24, 24, '#38BDF8', '#1E293B']} position={[0, 0.005, 0]} />

      {/* Character Standing Pedestal Ring */}
      <group position={[0, 0.01, 0]}>
        {/* Outer subtle ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.95, 1.05, 64]} />
          <meshBasicMaterial color="#8B5CF6" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
        {/* Inner glow disk */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.55, 48]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
        {/* Subtle ground shadow disk directly under character */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]}>
          <circleGeometry args={[0.7, 32]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* 2. Background Industrial Architecture */}
      {/* Rear Main Wall */}
      <mesh position={[0, 4, -6]} receiveShadow>
        <planeGeometry args={[26, 10]} />
        <meshStandardMaterial color="#0B1020" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-8, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#080C18" roughness={0.7} metalness={0.5} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[8, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#080C18" roughness={0.7} metalness={0.5} />
      </mesh>

      {/* 3. Structural Gantry Pillars */}
      {/* Left Pillar */}
      <mesh position={[-4.5, 3.5, -4]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 8, 0.6]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Right Pillar */}
      <mesh position={[4.5, 3.5, -4]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 8, 0.6]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Overhead Crossbeam Truss */}
      <mesh position={[0, 6, -4]} castShadow>
        <boxGeometry args={[10, 0.5, 0.5]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Cyan Light Strip on Overhead Truss */}
      <mesh position={[0, 5.7, -4]}>
        <boxGeometry args={[8.8, 0.08, 0.08]} />
        <meshBasicMaterial color="#38BDF8" />
      </mesh>

      {/* Purple Neon Vertical Light Strips on Pillars */}
      <mesh position={[-4.18, 3.5, -3.98]}>
        <boxGeometry args={[0.04, 6.5, 0.04]} />
        <meshBasicMaterial color="#A855F7" />
      </mesh>
      <mesh position={[4.18, 3.5, -3.98]}>
        <boxGeometry args={[0.04, 6.5, 0.04]} />
        <meshBasicMaterial color="#A855F7" />
      </mesh>

      {/* 4. Industrial Automated Terminal Machinery (Left Background) */}
      <group position={[-3.8, 0.75, -3]}>
        {/* Machine Base */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.6, 1.5, 1.2]} />
          <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Terminal Screen Display */}
        <mesh position={[0, 0.3, 0.61]} rotation={[-0.15, 0, 0]}>
          <planeGeometry args={[1.1, 0.6]} />
          <meshBasicMaterial color="#0284C7" />
        </mesh>
        {/* Status Warning LEDs */}
        <mesh position={[-0.5, 0.82, 0.4]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>
        <mesh position={[-0.3, 0.82, 0.4]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>
      </group>

      {/* 5. Robotic Assembly / Power Distribution Cell (Right Background) */}
      <group position={[3.8, 0.9, -3]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.65, 0.75, 1.8, 24]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Core Glowing Energy Core */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.6, 24]} />
          <meshBasicMaterial color="#A855F7" transparent opacity={0.85} />
        </mesh>
        {/* Protection cage ring */}
        <mesh position={[0, 0.1, 0]}>
          <torusGeometry args={[0.7, 0.04, 16, 32]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* 6. Distant Industrial Windows (Back Wall) */}
      <group position={[0, 4.5, -5.9]}>
        {[-3, 0, 3].map((xOffset, i) => (
          <mesh key={i} position={[xOffset, 0, 0]}>
            <planeGeometry args={[2.2, 2.6]} />
            <meshStandardMaterial
              color="#1E1B4B"
              emissive="#312E81"
              emissiveIntensity={0.4}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
