import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';

export type CharacterAnimationName = 'idle' | 'agree' | 'headShake' | 'walk' | 'run';

interface AnimatedCharacterProps {
  careerName: string;
  currentAnimation: CharacterAnimationName;
  onAnimationEnd?: () => void;
  onCharacterClick?: () => void;
}

export const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({
  careerName = 'Manufacturing Engineer',
  currentAnimation = 'idle',
  onAnimationEnd,
  onCharacterClick,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headBoneRef = useRef<THREE.Object3D | null>(null);
  const handBoneRef = useRef<THREE.Object3D | null>(null);

  // Load rigged humanoid GLB
  const { scene, animations } = useGLTF('/models/profile-character.glb');
  const { actions, mixer } = useAnimations(animations, groupRef);

  // Career Theme Color Mapping
  const careerPalettes: Record<
    string,
    { primary: string; secondary: string; accent: string; helmet: string }
  > = {
    'Manufacturing Engineer': {
      primary: '#EAB308', // Industrial Hi-Vis Safety Yellow
      secondary: '#1E293B', // Slate utility trousers
      accent: '#E2E8F0', // Reflective silver bands
      helmet: '#F59E0B', // Safety Orange/Amber Helmet
    },
    'Software Developer': {
      primary: '#0284C7', // Cyber Deep Cyan
      secondary: '#0F172A', // Dark Charcoal
      accent: '#38BDF8', // Neon Sky Blue
      helmet: '#0EA5E9',
    },
    'UI/UX Designer': {
      primary: '#8B5CF6', // Electric Purple
      secondary: '#18181B', // Graphite
      accent: '#C084FC', // Violet
      helmet: '#A855F7',
    },
    'Data Analyst': {
      primary: '#10B981', // Emerald
      secondary: '#111827', // Obsidian
      accent: '#34D399', // Mint
      helmet: '#059669',
    },
    'Cybersecurity Analyst': {
      primary: '#F43F5E', // Crimson Defense
      secondary: '#090D16', // Stealth Navy
      accent: '#FDA4AF', // Rose
      helmet: '#E11D48',
    },
  };

  const currentPalette = careerPalettes[careerName] || careerPalettes['Manufacturing Engineer'];

  // Apply materials and locate key skeleton attachment bones
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
          mat.roughness = 0.45;
          mat.metalness = 0.25;

          // Differentiate body parts by mesh name or material slot
          if (mesh.name.toLowerCase().includes('001') || mesh.name.toLowerCase().includes('body')) {
            mat.color = new THREE.Color(currentPalette.secondary);
          } else {
            mat.color = new THREE.Color(currentPalette.primary);
          }
          mesh.material = mat;
        }
      }

      // Attach bones
      if (child.name === 'mixamorig:Head') {
        headBoneRef.current = child;
      }
      if (child.name === 'mixamorig:RightHand' || child.name === 'mixamorig:LeftHand') {
        if (!handBoneRef.current) handBoneRef.current = child;
      }
    });
  }, [scene, careerName, currentPalette]);

  // Handle smooth animation crossfades
  const previousActionRef = useRef<string | null>(null);

  useEffect(() => {
    if (!actions) return;

    // Fallback mapping if exact action name differs
    const actionKey = actions[currentAnimation] ? currentAnimation : 'idle';
    const activeAction = actions[actionKey];

    if (!activeAction) return;

    const prevKey = previousActionRef.current;
    const prevAction = prevKey && actions[prevKey] ? actions[prevKey] : null;

    if (prevAction && prevAction !== activeAction) {
      prevAction.fadeOut(0.3);
    }

    activeAction.reset();
    activeAction.fadeIn(0.3);

    // If it's a non-looping emote (like 'agree' or 'headShake'), play once then return to idle
    if (currentAnimation === 'agree' || currentAnimation === 'headShake') {
      activeAction.setLoop(THREE.LoopOnce, 1);
      activeAction.clampWhenFinished = true;

      const onFinished = () => {
        if (onAnimationEnd) onAnimationEnd();
      };

      mixer.addEventListener('finished', onFinished);
      activeAction.play();

      return () => {
        mixer.removeEventListener('finished', onFinished);
      };
    } else {
      activeAction.setLoop(THREE.LoopRepeat, Infinity);
      activeAction.play();
    }

    previousActionRef.current = actionKey;
  }, [currentAnimation, actions, mixer, onAnimationEnd]);

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        if (onCharacterClick) onCharacterClick();
      }}
    >
      {/* 3D Rigged Humanoid Model */}
      <primitive object={scene} scale={[1, 1, 1]} />

      {/* Career Equipment 3D Accessories: Attached to character */}
      {/* 1. Industrial Safety Hard Hat / Helmet */}
      <group position={[0, 1.62, 0.02]} rotation={[0, 0, 0]}>
        {/* Main Dome */}
        <mesh castShadow receiveShadow position={[0, 0.08, -0.02]}>
          <sphereGeometry args={[0.165, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color={currentPalette.helmet}
            roughness={0.2}
            metalness={0.4}
          />
        </mesh>
        {/* Helmet Brim */}
        <mesh position={[0, 0.08, 0.03]} rotation={[-0.1, 0, 0]}>
          <cylinderGeometry args={[0.185, 0.185, 0.02, 32]} />
          <meshStandardMaterial
            color={currentPalette.helmet}
            roughness={0.2}
            metalness={0.4}
          />
        </mesh>
        {/* Reflective Front Safety Band */}
        <mesh position={[0, 0.12, 0.13]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.18, 0.025, 0.02]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#FFFFFF"
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* 2. Industrial Diagnostic Tablet in hand */}
      <group position={[0.32, 0.95, 0.22]} rotation={[0.4, 0.6, -0.2]}>
        {/* Tablet Casing */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.22, 0.02, 0.32]} />
          <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Active Diagnostic Screen */}
        <mesh position={[0, 0.012, 0]}>
          <planeGeometry args={[0.19, 0.28]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>
        {/* Glowing Screen Indicator LED */}
        <mesh position={[0.08, 0.015, -0.13]}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>
      </group>
    </group>
  );
};

// Preload the model asset
useGLTF.preload('/models/profile-character.glb');
