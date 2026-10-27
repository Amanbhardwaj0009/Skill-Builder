import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import {
  HouseConfig,
  RoomConfig,
  FurnitureConfig,
  DoorConfig,
  WindowConfig,
  FloorMaterial,
} from './houseModel';
import {
  Eye,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Layers,
  RotateCcw,
  Sparkles,
  Compass,
} from 'lucide-react';

interface LiveHouseSimulator3DProps {
  house: HouseConfig;
  selectedRoomId: string | null;
  selectedFurnitureId?: string | null;
  onSelectRoom: (roomId: string) => void;
  onSelectFurniture?: (furnitureId: string) => void;
  isFloorPlanView: boolean;
  onToggleFloorPlan: () => void;
}

// Floor material shader colors
const FLOOR_COLORS: Record<FloorMaterial, string> = {
  oak: '#B47E43', // Warm golden oak hardwood
  marble: '#E2E8F0', // Polished white/gray marble
  tile: '#94A3B8', // Slate ceramic tile
  concrete: '#64748B', // Modern loft polished concrete
  carpet: '#475569', // Plush dark charcoal carpet
};

// Procedural 3D Furniture Component
const FurnitureItem: React.FC<{
  furniture: FurnitureConfig;
  room: RoomConfig;
  isSelected?: boolean;
  onSelect?: () => void;
}> = ({ furniture, room, isSelected, onSelect }) => {
  const worldX = room.x + furniture.x;
  const worldZ = room.z + furniture.z;
  const rotRad = (furniture.rotation * Math.PI) / 180;

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (onSelect) onSelect();
  };

  switch (furniture.item) {
    case 'sofa':
      return (
        <group position={[worldX, 0, worldZ]} rotation={[0, rotRad, 0]} onClick={handleClick}>
          {/* Main Cushion Base */}
          <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.6, 0.35, 0.8]} />
            <meshStandardMaterial
              color="#334155"
              roughness={0.7}
              emissive={isSelected ? '#38BDF8' : '#000000'}
              emissiveIntensity={isSelected ? 0.3 : 0}
            />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.5, -0.32]} castShadow>
            <boxGeometry args={[1.6, 0.45, 0.2]} />
            <meshStandardMaterial color="#1E293B" roughness={0.7} />
          </mesh>
          {/* Armrests */}
          <mesh position={[-0.75, 0.4, 0]} castShadow>
            <boxGeometry args={[0.15, 0.35, 0.8]} />
            <meshStandardMaterial color="#1E293B" roughness={0.7} />
          </mesh>
          <mesh position={[0.75, 0.4, 0]} castShadow>
            <boxGeometry args={[0.15, 0.35, 0.8]} />
            <meshStandardMaterial color="#1E293B" roughness={0.7} />
          </mesh>
        </group>
      );

    case 'bed':
      return (
        <group position={[worldX, 0, worldZ]} rotation={[0, rotRad, 0]} onClick={handleClick}>
          {/* Bed Frame */}
          <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.7, 0.3, 2.0]} />
            <meshStandardMaterial
              color="#78350F"
              roughness={0.4}
              emissive={isSelected ? '#38BDF8' : '#000000'}
              emissiveIntensity={isSelected ? 0.3 : 0}
            />
          </mesh>
          {/* Mattress */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[1.5, 0.22, 1.85]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.9} />
          </mesh>
          {/* Pillows */}
          <mesh position={[-0.45, 0.5, -0.65]} castShadow>
            <boxGeometry args={[0.5, 0.12, 0.35]} />
            <meshStandardMaterial color="#E2E8F0" />
          </mesh>
          <mesh position={[0.45, 0.5, -0.65]} castShadow>
            <boxGeometry args={[0.5, 0.12, 0.35]} />
            <meshStandardMaterial color="#E2E8F0" />
          </mesh>
        </group>
      );

    case 'kitchen_counter':
      return (
        <group position={[worldX, 0, worldZ]} rotation={[0, rotRad, 0]} onClick={handleClick}>
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.9, 0.7]} />
            <meshStandardMaterial
              color="#0F172A"
              roughness={0.3}
              metalness={0.4}
              emissive={isSelected ? '#38BDF8' : '#000000'}
              emissiveIntensity={isSelected ? 0.3 : 0}
            />
          </mesh>
          {/* Countertop */}
          <mesh position={[0, 0.92, 0]} castShadow>
            <boxGeometry args={[1.84, 0.05, 0.74]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.1} metalness={0.2} />
          </mesh>
        </group>
      );

    case 'table':
      return (
        <group position={[worldX, 0, worldZ]} rotation={[0, rotRad, 0]} onClick={handleClick}>
          {/* Table Top */}
          <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.4, 0.06, 0.9]} />
            <meshStandardMaterial
              color="#B45309"
              roughness={0.4}
              emissive={isSelected ? '#38BDF8' : '#000000'}
              emissiveIntensity={isSelected ? 0.3 : 0}
            />
          </mesh>
          {/* 4 Legs */}
          {[-0.6, 0.6].map((lx) =>
            [-0.38, 0.38].map((lz) => (
              <mesh key={`${lx}-${lz}`} position={[lx, 0.36, lz]} castShadow>
                <cylinderGeometry args={[0.03, 0.03, 0.72, 12]} />
                <meshStandardMaterial color="#1E293B" metalness={0.8} />
              </mesh>
            ))
          )}
        </group>
      );

    case 'lamp':
      return (
        <group position={[worldX, 0, worldZ]} onClick={handleClick}>
          {/* Base & Pole */}
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.06, 16]} />
            <meshStandardMaterial color="#1E293B" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 1.6, 12]} />
            <meshStandardMaterial color="#1E293B" metalness={0.9} />
          </mesh>
          {/* Shade & Light */}
          <mesh position={[0, 1.55, 0]}>
            <cylinderGeometry args={[0.25, 0.35, 0.3, 16]} />
            <meshStandardMaterial color="#FEF08A" emissive="#FEF08A" emissiveIntensity={0.6} />
          </mesh>
          <pointLight position={[0, 1.5, 0]} intensity={0.8} color="#FBBF24" distance={3.5} />
        </group>
      );

    case 'chair':
      return (
        <group position={[worldX, 0, worldZ]} rotation={[0, rotRad, 0]} onClick={handleClick}>
          <mesh position={[0, 0.42, 0]} castShadow>
            <boxGeometry args={[0.45, 0.05, 0.45]} />
            <meshStandardMaterial color="#B45309" />
          </mesh>
          <mesh position={[0, 0.72, -0.2]} castShadow>
            <boxGeometry args={[0.45, 0.55, 0.05]} />
            <meshStandardMaterial color="#78350F" />
          </mesh>
        </group>
      );

    case 'wardrobe':
      return (
        <group position={[worldX, 0, worldZ]} rotation={[0, rotRad, 0]} onClick={handleClick}>
          <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.0, 2.0, 0.6]} />
            <meshStandardMaterial color="#334155" roughness={0.5} />
          </mesh>
        </group>
      );

    case 'desk':
      return (
        <group position={[worldX, 0, worldZ]} rotation={[0, rotRad, 0]} onClick={handleClick}>
          <mesh position={[0, 0.73, 0]} castShadow>
            <boxGeometry args={[1.3, 0.06, 0.65]} />
            <meshStandardMaterial color="#1E293B" metalness={0.3} />
          </mesh>
        </group>
      );

    default:
      return (
        <mesh position={[worldX, 0.35, worldZ]} castShadow onClick={handleClick}>
          <boxGeometry args={[0.6, 0.7, 0.6]} />
          <meshStandardMaterial color="#64748B" />
        </mesh>
      );
  }
};

// 3D Door Component
const Door3D: React.FC<{ door: DoorConfig; room: RoomConfig }> = ({ door, room }) => {
  let pos: [number, number, number] = [0, 1.0, 0];
  let rotY = 0;

  switch (door.wall) {
    case 'south':
      pos = [room.x + Math.min(door.offset, room.width - 0.5), 1.0, room.z + room.depth];
      rotY = 0;
      break;
    case 'north':
      pos = [room.x + Math.min(door.offset, room.width - 0.5), 1.0, room.z];
      rotY = 0;
      break;
    case 'east':
      pos = [room.x + room.width, 1.0, room.z + Math.min(door.offset, room.depth - 0.5)];
      rotY = Math.PI / 2;
      break;
    case 'west':
      pos = [room.x, 1.0, room.z + Math.min(door.offset, room.depth - 0.5)];
      rotY = Math.PI / 2;
      break;
  }

  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      {/* Door Frame */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[door.width, 2.0, 0.06]} />
        <meshStandardMaterial color="#78350F" roughness={0.4} />
      </mesh>
      {/* Metallic Handle */}
      <mesh position={[door.width * 0.35, -0.05, 0.05]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};

// 3D Window Component
const Window3D: React.FC<{ windowConfig: WindowConfig; room: RoomConfig }> = ({
  windowConfig,
  room,
}) => {
  let pos: [number, number, number] = [0, 1.4, 0];
  let rotY = 0;

  switch (windowConfig.wall) {
    case 'south':
      pos = [room.x + Math.min(windowConfig.offset, room.width - 0.5), 1.4, room.z + room.depth];
      rotY = 0;
      break;
    case 'north':
      pos = [room.x + Math.min(windowConfig.offset, room.width - 0.5), 1.4, room.z];
      rotY = 0;
      break;
    case 'east':
      pos = [room.x + room.width, 1.4, room.z + Math.min(windowConfig.offset, room.depth - 0.5)];
      rotY = Math.PI / 2;
      break;
    case 'west':
      pos = [room.x, 1.4, room.z + Math.min(windowConfig.offset, room.depth - 0.5)];
      rotY = Math.PI / 2;
      break;
  }

  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      {/* Glass Pane */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[windowConfig.width, 1.1, 0.04]} />
        <meshStandardMaterial
          color="#38BDF8"
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.65}
        />
      </mesh>
      {/* Outer Border Frame */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(windowConfig.width, 1.1, 0.04)]} />
        <lineBasicMaterial color="#E2E8F0" linewidth={2} />
      </lineSegments>
    </group>
  );
};

// Rooftop Solar Panel Array Component
const SolarPanelArray: React.FC<{ house: HouseConfig }> = ({ house }) => {
  return (
    <group position={[house.width / 2, 2.7, house.depth / 2]}>
      <mesh rotation={[-0.2, 0, 0]} position={[0, 0, 0]} castShadow>
        <boxGeometry args={[Math.min(house.width * 0.7, 6), 0.1, 2.5]} />
        <meshStandardMaterial
          color="#1E3A8A"
          roughness={0.2}
          metalness={0.7}
          emissive="#3B82F6"
          emissiveIntensity={0.2}
        />
      </mesh>
      <Text position={[0, 0.25, 0]} fontSize={0.3} color="#93C5FD">
        Solar Photovoltaic Grid
      </Text>
    </group>
  );
};

// 3D Room Renderer (Floor, Cutaway Perimeter Walls, Label)
const Room3D: React.FC<{
  room: RoomConfig;
  isSelected: boolean;
  onSelect: () => void;
  isFloorPlan: boolean;
  isSmartLit?: boolean;
}> = ({ room, isSelected, onSelect, isFloorPlan, isSmartLit }) => {
  const wallHeight = isFloorPlan ? 0.3 : 2.4;
  const wallThick = 0.15;
  const halfW = room.width / 2;
  const halfD = room.depth / 2;
  const centerX = room.x + halfW;
  const centerZ = room.z + halfD;

  const floorColor = FLOOR_COLORS[room.floorMaterial] || FLOOR_COLORS.oak;

  return (
    <group position={[centerX, 0, centerZ]}>
      {/* Floor Slab */}
      <mesh
        position={[0, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <planeGeometry args={[room.width, room.depth]} />
        <meshStandardMaterial
          color={floorColor}
          roughness={0.3}
          metalness={0.1}
          emissive={isSelected ? '#38BDF8' : '#000000'}
          emissiveIntensity={isSelected ? 0.25 : 0}
        />
      </mesh>

      {/* Smart Ambient Ceiling Lighting */}
      {isSmartLit && (
        <pointLight position={[0, 1.8, 0]} intensity={1.4} color="#FDE047" distance={4.5} />
      )}

      {/* Selection Border Line */}
      {isSelected && (
        <lineSegments position={[0, 0.03, 0]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(room.width, room.depth)]} />
          <lineBasicMaterial color="#38BDF8" linewidth={3} />
        </lineSegments>
      )}

      {/* Cutaway Architectural Walls */}
      {/* North Wall */}
      <mesh position={[0, wallHeight / 2, -halfD + wallThick / 2]} castShadow receiveShadow>
        <boxGeometry args={[room.width, wallHeight, wallThick]} />
        <meshStandardMaterial color={room.wallColor} roughness={0.6} />
      </mesh>
      {/* West Wall */}
      <mesh position={[-halfW + wallThick / 2, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallThick, wallHeight, room.depth]} />
        <meshStandardMaterial color={room.wallColor} roughness={0.6} />
      </mesh>
      {/* East Wall (Low Cutaway for Interior Visibility) */}
      <mesh
        position={[halfW - wallThick / 2, (wallHeight * 0.45) / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[wallThick, wallHeight * 0.45, room.depth]} />
        <meshStandardMaterial color={room.wallColor} roughness={0.6} />
      </mesh>
      {/* South Wall (Low Cutaway for Viewing Angle) */}
      <mesh
        position={[0, (wallHeight * 0.45) / 2, halfD - wallThick / 2]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[room.width, wallHeight * 0.45, wallThick]} />
        <meshStandardMaterial color={room.wallColor} roughness={0.6} />
      </mesh>

      {/* Room Name Floating Text Billboard */}
      <group position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text
          fontSize={0.4}
          color="#F8FAFC"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#080B14"
        >
          {room.name}
        </Text>
        <Text
          position={[0, -0.45, 0]}
          fontSize={0.25}
          color="#38BDF8"
          anchorX="center"
          anchorY="middle"
        >
          {`${(room.width * room.depth).toFixed(1)} m²`}
        </Text>
      </group>
    </group>
  );
};

export const LiveHouseSimulator3D: React.FC<LiveHouseSimulator3DProps> = ({
  house,
  selectedRoomId,
  selectedFurnitureId,
  onSelectRoom,
  onSelectFurniture,
  isFloorPlanView,
  onToggleFloorPlan,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Center coordinates of the house for camera targeting
  const houseCenterX = house.width / 2;
  const houseCenterZ = house.depth / 2;

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(houseCenterX, 0.8, houseCenterZ);
      controlsRef.current.update();
    }
  };

  const handleZoom = (delta: number) => {
    if (controlsRef.current) {
      const dist = controlsRef.current.getDistance();
      controlsRef.current.minDistance = Math.max(2, dist + delta);
      controlsRef.current.update();
      controlsRef.current.minDistance = 2;
    }
  };

  return (
    <div className="relative w-full h-[540px] md:h-[620px] rounded-3xl border border-purple-500/25 bg-[#090D1A] overflow-hidden shadow-2xl select-none">
      {/* HUD Top Info Bar */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-2 rounded-xl border border-purple-500/30 bg-[#121B2D]/90 px-3 py-1.5 backdrop-blur-md">
          <Compass className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-bold text-gray-200">
            {house.width}m × {house.depth}m Home Perimeter
          </span>
          <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-bold text-purple-300">
            {house.rooms.length} Rooms
          </span>
        </div>
      </div>

      {/* Floating 3D / 2D Floor Plan Toggle & Camera HUD */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={onToggleFloorPlan}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold backdrop-blur-md transition shadow-md ${
            isFloorPlanView
              ? 'border-cyan-400 bg-cyan-600/30 text-cyan-200 shadow-glow-cyan/20'
              : 'border-gray-800 bg-[#121B2D]/90 text-gray-300 hover:text-white'
          }`}
          title="Toggle 2D Floor Plan Projection"
        >
          <Layers className="h-4 w-4 text-cyan-400" />
          <span>{isFloorPlanView ? '2D Floor Plan' : '3D Perspective'}</span>
        </button>
      </div>

      {/* Camera Controls Bar (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-2xl border border-gray-800 bg-[#121B2D]/90 p-1.5 backdrop-blur-md shadow-xl">
        <button
          onClick={() => handleZoom(-1.5)}
          className="rounded-xl p-2 text-gray-400 hover:bg-purple-600/20 hover:text-white transition"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleZoom(1.5)}
          className="rounded-xl p-2 text-gray-400 hover:bg-purple-600/20 hover:text-white transition"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <div className="h-4 w-[1px] bg-gray-800 mx-0.5" />
        <button
          onClick={handleResetCamera}
          className="rounded-xl p-2 text-gray-400 hover:bg-purple-600/20 hover:text-white transition"
          title="Reset Camera Framing"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{
          position: isFloorPlanView
            ? [houseCenterX, 22, houseCenterZ + 0.01]
            : [houseCenterX + 8, 11, houseCenterZ + 12],
          fov: isFloorPlanView ? 38 : 45,
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#070A14']} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={0.65} color="#E0E7FF" />
        <directionalLight
          position={[14, 20, 16]}
          intensity={1.3}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-camera-left={-15}
          shadow-camera-right={15}
          shadow-camera-top={15}
          shadow-camera-bottom={-15}
        />
        <directionalLight position={[-10, 12, -10]} intensity={0.5} color="#818CF8" />

        {/* Ground Terrain Foundation */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[houseCenterX, -0.05, houseCenterZ]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color="#0A0F1D" roughness={0.8} />
        </mesh>
        <gridHelper
          args={[36, 36, '#38BDF8', '#1E293B']}
          position={[houseCenterX, -0.04, houseCenterZ]}
        />

        {/* Concrete Home Foundation Slab */}
        <mesh position={[houseCenterX, 0.01, houseCenterZ]} receiveShadow>
          <boxGeometry args={[house.width + 0.6, 0.08, house.depth + 0.6]} />
          <meshStandardMaterial color="#1E293B" roughness={0.5} metalness={0.2} />
        </mesh>

        {/* Rooms */}
        {house.rooms.map((room) => (
          <Room3D
            key={room.id}
            room={room}
            isSelected={selectedRoomId === room.id}
            onSelect={() => onSelectRoom(room.id)}
            isFloorPlan={isFloorPlanView}
            isSmartLit={Boolean(house.smartFeatures?.smartLighting?.[room.id])}
          />
        ))}

        {/* Doors */}
        {house.doors.map((door) => {
          const room = house.rooms.find((r) => r.id === door.roomId);
          if (!room) return null;
          return <Door3D key={door.id} door={door} room={room} />;
        })}

        {/* Windows */}
        {house.windows.map((win) => {
          const room = house.rooms.find((r) => r.id === win.roomId);
          if (!room) return null;
          return <Window3D key={win.id} windowConfig={win} room={room} />;
        })}

        {/* Furniture Items */}
        {house.furniture.map((furn) => {
          const room = house.rooms.find((r) => r.id === furn.roomId);
          if (!room) return null;
          return (
            <FurnitureItem
              key={furn.id}
              furniture={furn}
              room={room}
              isSelected={selectedFurnitureId === furn.id}
              onSelect={() => onSelectFurniture && onSelectFurniture(furn.id)}
            />
          );
        })}

        {/* Rooftop Solar Panels */}
        {house.smartFeatures?.solarPower && <SolarPanelArray house={house} />}

        {/* Second Floor Upper Story Visualization */}
        {house.floors >= 2 && (
          <group position={[houseCenterX, 2.5, houseCenterZ]}>
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[house.width * 0.95, 0.1, house.depth * 0.95]} />
              <meshStandardMaterial
                color="#334155"
                opacity={0.65}
                transparent
                roughness={0.3}
              />
            </mesh>
            <Text
              position={[0, 0.3, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.35}
              color="#A78BFA"
            >
              Level 2 - Upper Story
            </Text>
          </group>
        )}

        {/* Orbit Camera Controls */}
        <OrbitControls
          ref={controlsRef}
          target={[houseCenterX, 0.8, houseCenterZ]}
          minDistance={3}
          maxDistance={32}
          maxPolarAngle={isFloorPlanView ? 0.01 : Math.PI / 2 - 0.05}
          enableDamping
          dampingFactor={0.06}
        />
      </Canvas>
    </div>
  );
};
