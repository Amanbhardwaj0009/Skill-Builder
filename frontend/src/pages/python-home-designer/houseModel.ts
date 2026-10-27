export type WallOrientation = 'north' | 'south' | 'east' | 'west';

export type FloorMaterial = 'oak' | 'marble' | 'tile' | 'concrete' | 'carpet';

export type FurnitureType =
  | 'sofa'
  | 'bed'
  | 'table'
  | 'chair'
  | 'kitchen_counter'
  | 'wardrobe'
  | 'desk'
  | 'lamp';

export interface RoomConfig {
  id: string;
  name: string;
  x: number; // local X relative to house origin (meters)
  z: number; // local Z relative to house origin (meters)
  width: number; // width along X axis (meters)
  depth: number; // depth along Z axis (meters)
  wallColor: string;
  floorMaterial: FloorMaterial;
}

export interface DoorConfig {
  id: string;
  roomId: string;
  wall: WallOrientation;
  offset: number; // position along the wall
  width: number;
}

export interface WindowConfig {
  id: string;
  roomId: string;
  wall: WallOrientation;
  offset: number;
  width: number;
}

export interface FurnitureConfig {
  id: string;
  item: FurnitureType;
  roomId: string;
  x: number; // relative to room
  z: number; // relative to room
  rotation: number; // degrees
}

export interface SmartFeaturesConfig {
  solarPower: boolean;
  smartLighting: Record<string, boolean>; // roomId -> isSmartLit
}

export interface HouseConfig {
  width: number;
  depth: number;
  floors: number;
  roofStyle: 'pitched' | 'flat' | 'modern';
  rooms: RoomConfig[];
  doors: DoorConfig[];
  windows: WindowConfig[];
  furniture: FurnitureConfig[];
  smartFeatures?: SmartFeaturesConfig;
}

export interface ValidationIssue {
  type: 'error' | 'warning';
  message: string;
  roomId?: string;
}

export const DEFAULT_HOUSE: HouseConfig = {
  width: 12,
  depth: 10,
  floors: 1,
  roofStyle: 'modern',
  rooms: [
    {
      id: 'living_room',
      name: 'Living Room',
      x: 0,
      z: 0,
      width: 6,
      depth: 5,
      wallColor: '#E8DCC8',
      floorMaterial: 'oak',
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      x: 6,
      z: 0,
      width: 5,
      depth: 5,
      wallColor: '#D8E7F2',
      floorMaterial: 'tile',
    },
    {
      id: 'bedroom',
      name: 'Master Bedroom',
      x: 0,
      z: 5,
      width: 5,
      depth: 4.5,
      wallColor: '#E2D9F3',
      floorMaterial: 'carpet',
    },
  ],
  doors: [
    {
      id: 'door_entry',
      roomId: 'living_room',
      wall: 'south',
      offset: 2.5,
      width: 1.0,
    },
    {
      id: 'door_bed',
      roomId: 'bedroom',
      wall: 'north',
      offset: 2.0,
      width: 0.9,
    },
  ],
  windows: [
    {
      id: 'win_liv_1',
      roomId: 'living_room',
      wall: 'south',
      offset: 1.0,
      width: 1.5,
    },
    {
      id: 'win_bed_1',
      roomId: 'bedroom',
      wall: 'west',
      offset: 1.5,
      width: 1.5,
    },
    {
      id: 'win_kit_1',
      roomId: 'kitchen',
      wall: 'north',
      offset: 2.5,
      width: 1.4,
    },
  ],
  furniture: [
    {
      id: 'furn_sofa',
      item: 'sofa',
      roomId: 'living_room',
      x: 2.5,
      z: 2.5,
      rotation: 0,
    },
    {
      id: 'furn_table',
      item: 'table',
      roomId: 'living_room',
      x: 2.5,
      z: 1.2,
      rotation: 0,
    },
    {
      id: 'furn_bed',
      item: 'bed',
      roomId: 'bedroom',
      x: 2.2,
      z: 2.0,
      rotation: 90,
    },
    {
      id: 'furn_counter',
      item: 'kitchen_counter',
      roomId: 'kitchen',
      x: 2.5,
      z: 0.8,
      rotation: 0,
    },
  ],
  smartFeatures: {
    solarPower: false,
    smartLighting: {},
  },
};

/**
 * Validate a house configuration against physical boundaries and placement rules
 */
export function validateHouse(house: HouseConfig): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (house.width <= 0 || house.depth <= 0) {
    issues.push({
      type: 'error',
      message: `House dimensions must be positive numbers. Got width=${house.width}, depth=${house.depth}.`,
    });
  }

  // Check each room fits inside perimeter
  for (const r of house.rooms) {
    if (r.width <= 0 || r.depth <= 0) {
      issues.push({
        type: 'error',
        roomId: r.id,
        message: `Room "${r.name}" has invalid dimensions (${r.width}x${r.depth}m). Dimensions must be > 0.`,
      });
    }

    if (r.x < 0 || r.z < 0) {
      issues.push({
        type: 'error',
        roomId: r.id,
        message: `Room "${r.name}" has negative coordinates (x=${r.x}, z=${r.z}).`,
      });
    }

    if (r.x + r.width > house.width || r.z + r.depth > house.depth) {
      issues.push({
        type: 'error',
        roomId: r.id,
        message: `Room "${r.name}" extends beyond house boundary (${house.width}x${house.depth}m). Room reaches x=${
          r.x + r.width
        }, z=${r.z + r.depth}.`,
      });
    }
  }

  // Check room overlaps
  for (let i = 0; i < house.rooms.length; i++) {
    for (let j = i + 1; j < house.rooms.length; j++) {
      const r1 = house.rooms[i];
      const r2 = house.rooms[j];

      const overlapX = r1.x < r2.x + r2.width && r1.x + r1.width > r2.x;
      const overlapZ = r1.z < r2.z + r2.depth && r1.z + r1.depth > r2.z;

      if (overlapX && overlapZ) {
        issues.push({
          type: 'warning',
          roomId: r1.id,
          message: `Room "${r1.name}" overlaps with "${r2.name}". Consider adjusting coordinates.`,
        });
      }
    }
  }

  // Check doors and windows reference valid rooms
  for (const d of house.doors) {
    if (!house.rooms.some((r) => r.id === d.roomId)) {
      issues.push({
        type: 'error',
        message: `Door references non-existent room ID "${d.roomId}".`,
      });
    }
  }

  for (const w of house.windows) {
    if (!house.rooms.some((r) => r.id === w.roomId)) {
      issues.push({
        type: 'error',
        message: `Window references non-existent room ID "${w.roomId}".`,
      });
    }
  }

  return issues;
}

/**
 * Itemized unit prices for simulated construction budget (Mission 7)
 */
export const BUDGET_PRICING = {
  sqMeterConstruction: 55, // $55 per m² of interior floor area
  floorMaterials: {
    oak: 35,
    marble: 65,
    tile: 25,
    concrete: 15,
    carpet: 20,
  } as Record<FloorMaterial, number>,
  furniture: {
    sofa: 450,
    bed: 550,
    table: 250,
    chair: 90,
    kitchen_counter: 600,
    wardrobe: 380,
    desk: 220,
    lamp: 75,
  } as Record<string, number>,
  doors: 180,
  windows: 150,
  solarArray: 1200,
  smartLightPerRoom: 140,
  secondFloorBase: 1500,
};

export interface HouseBudgetReport {
  constructionCost: number;
  materialsCost: number;
  openingsCost: number;
  furnitureCost: number;
  smartTechCost: number;
  totalCost: number;
}

/**
 * Calculate the simulated estimated budget cost of a house configuration
 */
export function calculateHouseBudget(house: HouseConfig): HouseBudgetReport {
  let constructionCost = 0;
  let materialsCost = 0;

  for (const r of house.rooms) {
    const area = r.width * r.depth;
    constructionCost += area * BUDGET_PRICING.sqMeterConstruction;
    const matPrice = BUDGET_PRICING.floorMaterials[r.floorMaterial] || BUDGET_PRICING.floorMaterials.oak;
    materialsCost += area * matPrice;
  }

  if (house.floors >= 2) {
    constructionCost += BUDGET_PRICING.secondFloorBase * (house.floors - 1);
  }

  const openingsCost =
    house.doors.length * BUDGET_PRICING.doors + house.windows.length * BUDGET_PRICING.windows;

  let furnitureCost = 0;
  for (const f of house.furniture) {
    furnitureCost += BUDGET_PRICING.furniture[f.item] || 200;
  }

  let smartTechCost = 0;
  if (house.smartFeatures?.solarPower) {
    smartTechCost += BUDGET_PRICING.solarArray;
  }
  if (house.smartFeatures?.smartLighting) {
    const activeRooms = Object.values(house.smartFeatures.smartLighting).filter(Boolean).length;
    smartTechCost += activeRooms * BUDGET_PRICING.smartLightPerRoom;
  }

  const totalCost = Math.round(
    constructionCost + materialsCost + openingsCost + furnitureCost + smartTechCost
  );

  return {
    constructionCost: Math.round(constructionCost),
    materialsCost: Math.round(materialsCost),
    openingsCost: Math.round(openingsCost),
    furnitureCost: Math.round(furnitureCost),
    smartTechCost: Math.round(smartTechCost),
    totalCost,
  };
}

