import React, { useRef, useEffect, useMemo, useState } from 'react';
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
  const helmetGroupRef = useRef<THREE.Group>(null);

  // Select suitable authentic human model based on career specialization
  const isTechCasual =
    careerName === 'Software Developer' ||
    careerName === 'UI/UX Designer' ||
    careerName === 'Data Analyst';

  const modelPath = isTechCasual
    ? '/models/developer-character.glb'
    : '/models/engineer-character.glb';

  // Load realistic human rigged GLB
  const { scene } = useGLTF(modelPath);

  // Load animation clips from the profile animation bank
  const { animations } = useGLTF('/models/profile-character.glb');

  // Retarget animation tracks to match the human skeleton joint names (stripping mixamorig: prefix)
  const retargetedClips = useMemo(() => {
    if (!animations || animations.length === 0) return [];
    return animations.map((clip) => {
      const cloned = clip.clone();
      cloned.tracks = cloned.tracks.map((track) => {
        const clonedTrack = track.clone();
        let targetName = clonedTrack.name
          .replace(/^mixamorig:/, '')
          .replace(/^mixamorig/, '');

        // Map leaf end-effectors to human skeleton joints
        targetName = targetName.replace('HeadTop_End', 'HeadEnd');
        targetName = targetName.replace('LeftToe_End', 'LeftToeEnd');
        targetName = targetName.replace('RightToe_End', 'RightToeEnd');

        clonedTrack.name = targetName;
        return clonedTrack;
      });
      return cloned;
    });
  }, [animations]);

  // Hook animations to the human character model
  const { actions, mixer } = useAnimations(retargetedClips, groupRef);

  // Configure Realistic Human PBR Materials and attach accessories to skeleton bones
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;

          // Preserve authentic skin, face, clothing base color & normal textures
          // Ensure natural non-metallic human skin and fabric appearance (avoid golden mannequin!)
          mat.metalness = 0.05;
          mat.roughness = 0.65;
          mat.needsUpdate = true;
        }
      }

      // Locate Head bone for attaching accessories
      if (child.name === 'Head' || child.name === 'mixamorig:Head') {
        headBoneRef.current = child;
      }
    });

    // Parent the industrial safety helmet directly to Head bone so it rotates with head movement
    if (headBoneRef.current && helmetGroupRef.current) {
      if (helmetGroupRef.current.parent !== headBoneRef.current) {
        headBoneRef.current.add(helmetGroupRef.current);
      }
    }
  }, [scene, careerName, isTechCasual]);

  // Handle smooth animation crossfades
  const previousActionRef = useRef<string | null>(null);

  useEffect(() => {
    if (!actions) return;

    const actionKey = actions[currentAnimation] ? currentAnimation : 'idle';
    const activeAction = actions[actionKey];

    if (!activeAction) return;

    const prevKey = previousActionRef.current;
    const prevAction = prevKey && actions[prevKey] ? actions[prevKey] : null;

    if (prevAction && prevAction !== activeAction) {
      prevAction.fadeOut(0.35);
    }

    activeAction.reset();
    activeAction.fadeIn(0.35);

    // If it's a non-looping emote gesture ('agree' or 'headShake'), play once then return to idle
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

  // Show industrial safety helmet for Manufacturing Engineer & Cybersecurity specialist
  const showSafetyHelmet = !isTechCasual;

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
      {/* Authentic Rigged Humanoid Model with Realistic Skin, Eyes, Face & Clothing */}
      <primitive object={scene} />

      {/* Industrial Safety Hard Hat - Attached to Head Bone */}
      {showSafetyHelmet && (
        <group
          ref={helmetGroupRef}
          position={[0, 0.12, 0.02]}
          rotation={[0.08, 0, 0]}
          scale={[1.05, 1.05, 1.05]}
        >
          {/* Main Hard Hat Dome (Industrial High-Vis Safety Amber) */}
          <mesh castShadow receiveShadow position={[0, 0.03, -0.01]}>
            <sphereGeometry args={[0.13, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color="#F59E0B"
              roughness={0.25}
              metalness={0.2}
            />
          </mesh>
          {/* Reinforced Ridge Peak */}
          <mesh position={[0, 0.08, -0.01]} castShadow>
            <boxGeometry args={[0.035, 0.04, 0.22]} />
            <meshStandardMaterial color="#D97706" roughness={0.3} metalness={0.3} />
          </mesh>
          {/* Outer Protective Brim */}
          <mesh position={[0, 0.02, 0.02]} rotation={[-0.05, 0, 0]}>
            <cylinderGeometry args={[0.145, 0.15, 0.02, 32]} />
            <meshStandardMaterial color="#F59E0B" roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Front Reflective Silver Safety Badge */}
          <mesh position={[0, 0.05, 0.12]} rotation={[-0.08, 0, 0]}>
            <boxGeometry args={[0.08, 0.022, 0.01]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive="#FFFFFF"
              emissiveIntensity={0.25}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        </group>
      )}

      {/* High-Visibility Safety Harness Stripes on Torso (For Manufacturing Engineer) */}
      {!isTechCasual && (
        <group position={[0, 1.25, 0.01]}>
          {/* High-Vis Vest Cross Harness Band */}
          <mesh position={[-0.11, 0, 0.12]} rotation={[0, 0, -0.08]}>
            <boxGeometry args={[0.04, 0.38, 0.01]} />
            <meshStandardMaterial color="#EAB308" roughness={0.5} />
          </mesh>
          <mesh position={[0.11, 0, 0.12]} rotation={[0, 0, 0.08]}>
            <boxGeometry args={[0.04, 0.38, 0.01]} />
            <meshStandardMaterial color="#EAB308" roughness={0.5} />
          </mesh>
          {/* Horizontal Reflective Silver Safety Band */}
          <mesh position={[0, -0.12, 0.12]}>
            <boxGeometry args={[0.32, 0.03, 0.01]} />
            <meshStandardMaterial
              color="#E2E8F0"
              emissive="#FFFFFF"
              emissiveIntensity={0.3}
              metalness={0.8}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};

// Preload the authentic models
useGLTF.preload('/models/engineer-character.glb');
useGLTF.preload('/models/developer-character.glb');
useGLTF.preload('/models/profile-character.glb');
