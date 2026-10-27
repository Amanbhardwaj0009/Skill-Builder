import { HouseConfig, DEFAULT_HOUSE, validateHouse, ValidationIssue } from './houseModel';

export interface PythonExecutionResult {
  success: boolean;
  house: HouseConfig;
  output: string[];
  errors: string[];
  warnings: string[];
  executionTimeMs: number;
}

// In-browser Python House Class definition for Pyodide
const PYTHON_HOUSE_MODULE = `
import json
import sys
import types

class House:
    def __init__(self, width=12, depth=10, floors=1):
        self.width = float(width)
        self.depth = float(depth)
        self.floors = int(floors)
        self.roof_style = "modern"
        self.rooms = []
        self.doors = []
        self.windows = []
        self.furniture = []
        self.smart_features = {
            "solarPower": False,
            "smartLighting": {}
        }
        
    def add_room(self, name, x, z, width, depth):
        room_id = name.lower().replace(" ", "_")
        room = {
            "id": room_id,
            "name": name.replace("_", " ").title(),
            "x": float(x),
            "z": float(z),
            "width": float(width),
            "depth": float(depth),
            "wallColor": "#E8DCC8",
            "floorMaterial": "oak"
        }
        self.rooms.append(room)
        return room
        
    def add_door(self, room, wall="south", position=None, width=1.0):
        room_id = room.lower().replace(" ", "_")
        door_id = f"door_{len(self.doors) + 1}_{room_id}"
        offset = float(position) if position is not None else 1.5
        door = {
            "id": door_id,
            "roomId": room_id,
            "wall": wall.lower(),
            "offset": offset,
            "width": float(width)
        }
        self.doors.append(door)
        return door
        
    def add_window(self, room, wall="north", position=None, width=1.5):
        room_id = room.lower().replace(" ", "_")
        win_id = f"win_{len(self.windows) + 1}_{room_id}"
        offset = float(position) if position is not None else 1.5
        window = {
            "id": win_id,
            "roomId": room_id,
            "wall": wall.lower(),
            "offset": offset,
            "width": float(width)
        }
        self.windows.append(window)
        return window
        
    def set_wall_color(self, room, color):
        room_id = room.lower().replace(" ", "_")
        for r in self.rooms:
            if r["id"] == room_id:
                r["wallColor"] = str(color)
                break
                
    def set_floor_material(self, room, material):
        room_id = room.lower().replace(" ", "_")
        valid_materials = ["oak", "marble", "tile", "concrete", "carpet"]
        mat = material.lower()
        if mat not in valid_materials:
            print(f"Warning: Unknown material '{material}', defaulting to 'oak'. Supported: {valid_materials}")
            mat = "oak"
        for r in self.rooms:
            if r["id"] == room_id:
                r["floorMaterial"] = mat
                break
                
    def add_furniture(self, item, room, x=1.0, z=1.0, rotation=0):
        room_id = room.lower().replace(" ", "_")
        furn_id = f"furn_{len(self.furniture) + 1}_{item}"
        furn = {
            "id": furn_id,
            "item": item.lower(),
            "roomId": room_id,
            "x": float(x),
            "z": float(z),
            "rotation": float(rotation)
        }
        self.furniture.append(furn)
        return furn
        
    def set_roof_style(self, style):
        self.roof_style = style.lower()

    def enable_solar_power(self, enabled=True):
        self.smart_features["solarPower"] = bool(enabled)

    def set_smart_lighting(self, room, enabled=True):
        room_id = room.lower().replace(" ", "_")
        self.smart_features["smartLighting"][room_id] = bool(enabled)

    def calculate_budget(self):
        cost = sum(r["width"] * r["depth"] * 55 for r in self.rooms)
        mat_prices = {"oak": 35, "marble": 65, "tile": 25, "concrete": 15, "carpet": 20}
        cost += sum(r["width"] * r["depth"] * mat_prices.get(r["floorMaterial"], 35) for r in self.rooms)
        if self.floors >= 2:
            cost += 1500 * (self.floors - 1)
        cost += len(self.doors) * 180 + len(self.windows) * 150
        furn_prices = {"sofa": 450, "bed": 550, "table": 250, "chair": 90, "kitchen_counter": 600, "wardrobe": 380, "desk": 220, "lamp": 75}
        cost += sum(furn_prices.get(f["item"], 200) for f in self.furniture)
        if self.smart_features.get("solarPower"):
            cost += 1200
        active_lights = sum(1 for v in self.smart_features.get("smartLighting", {}).values() if v)
        cost += active_lights * 140
        return round(cost)
        
    def get_room_area(self, room):
        room_id = room.lower().replace(" ", "_")
        for r in self.rooms:
            if r["id"] == room_id:
                return r["width"] * r["depth"]
        return 0.0

    def to_json(self):
        return json.dumps({
            "width": self.width,
            "depth": self.depth,
            "floors": self.floors,
            "roofStyle": self.roof_style,
            "rooms": self.rooms,
            "doors": self.doors,
            "windows": self.windows,
            "furniture": self.furniture,
            "smartFeatures": self.smart_features
        })

# Register module for import statements
sq_module = types.ModuleType("skillquest_house")
sq_module.House = House
sys.modules["skillquest_house"] = sq_module
`;

let pyodideInstance: any = null;
let isPyodideLoading = false;

/**
 * Attempt to initialize Pyodide in browser if network is accessible
 */
export async function initPyodide(): Promise<any> {
  if (pyodideInstance) return pyodideInstance;
  if (typeof window === 'undefined') return null;

  if ((window as any).loadPyodide) {
    pyodideInstance = await (window as any).loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
    });
    return pyodideInstance;
  }

  // Inject CDN script asynchronously
  if (!isPyodideLoading) {
    isPyodideLoading = true;
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
    script.async = true;
    script.onload = async () => {
      try {
        if ((window as any).loadPyodide) {
          pyodideInstance = await (window as any).loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
          });
          console.log('✅ [Python Engine] Pyodide initialized successfully!');
        }
      } catch (err) {
        console.warn('Pyodide CDN initialization deferred; using zero-latency engine.', err);
      }
    };
    document.head.appendChild(script);
  }

  return pyodideInstance;
}

/**
 * Execute student Python code and extract resulting HouseConfig
 */
export async function executePythonCode(code: string): Promise<PythonExecutionResult> {
  const startTime = performance.now();
  const output: string[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  // Try Pyodide WebAssembly first if loaded
  if (pyodideInstance) {
    try {
      pyodideInstance.runPython(`
import sys
import io
sys.stdout = io.StringIO()
${PYTHON_HOUSE_MODULE}
`);

      // Run student code
      pyodideInstance.runPython(code);

      // Extract stdout
      const stdOutStr = pyodideInstance.runPython('sys.stdout.getvalue()');
      if (stdOutStr) {
        output.push(...stdOutStr.split('\n').filter((l: string) => l.trim().length > 0));
      }

      // Check if 'home' or a House object exists
      const jsonRes = pyodideInstance.runPython(`
if 'home' in locals() and isinstance(home, House):
    home.to_json()
else:
    # search for any instance of House in locals
    h_inst = next((v for v in locals().values() if isinstance(v, House)), None)
    h_inst.to_json() if h_inst else ""
`);

      if (jsonRes && jsonRes.length > 0) {
        const parsed = JSON.parse(jsonRes);
        const validation = validateHouse(parsed);
        validation.forEach((v) => {
          if (v.type === 'error') errors.push(v.message);
          else warnings.push(v.message);
        });

        return {
          success: errors.length === 0,
          house: parsed,
          output,
          errors,
          warnings,
          executionTimeMs: Math.round(performance.now() - startTime),
        };
      }
    } catch (pyErr: any) {
      errors.push(`Python Runtime Exception: ${pyErr.message || String(pyErr)}`);
      return {
        success: false,
        house: DEFAULT_HOUSE,
        output,
        errors,
        warnings,
        executionTimeMs: Math.round(performance.now() - startTime),
      };
    }
  }

  // Fast Resilient Python Interpreter for zero-latency instant offline capability
  try {
    const simulatedHouse = runSimulatedPython(code, output, warnings, errors);
    const validation = validateHouse(simulatedHouse);
    validation.forEach((v) => {
      if (v.type === 'error') errors.push(v.message);
      else warnings.push(v.message);
    });

    return {
      success: errors.length === 0,
      house: simulatedHouse,
      output,
      errors,
      warnings,
      executionTimeMs: Math.round(performance.now() - startTime),
    };
  } catch (err: any) {
    errors.push(`Syntax / Execution Error: ${err.message || String(err)}`);
    return {
      success: false,
      house: DEFAULT_HOUSE,
      output,
      errors,
      warnings,
      executionTimeMs: Math.round(performance.now() - startTime),
    };
  }
}

/**
 * Deterministic Python syntax interpreter for House API operations
 */
function runSimulatedPython(
  code: string,
  output: string[],
  warnings: string[],
  errors: string[]
): HouseConfig {
  const house: HouseConfig = {
    width: 12,
    depth: 10,
    floors: 1,
    roofStyle: 'modern',
    rooms: [],
    doors: [],
    windows: [],
    furniture: [],
    smartFeatures: {
      solarPower: false,
      smartLighting: {},
    },
  };

  const lines = code.split('\n');
  const variables: Record<string, any> = {};

  // Simple token parser for python variables and method calls
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine || rawLine.startsWith('#')) continue;

    // Handle print()
    const printMatch = rawLine.match(/print\s*\((.*)\)/);
    if (printMatch) {
      try {
        const content = printMatch[1].replace(/["']/g, '');
        output.push(content);
      } catch (e) {}
      continue;
    }

    // Handle House instantiation: home = House(width=12, depth=10, floors=1)
    const houseInitMatch = rawLine.match(/House\s*\((.*)\)/);
    if (houseInitMatch) {
      const argsStr = houseInitMatch[1];
      const widthMatch = argsStr.match(/width\s*=\s*(\d+(\.\d+)?)/);
      const depthMatch = argsStr.match(/depth\s*=\s*(\d+(\.\d+)?)/);
      const floorsMatch = argsStr.match(/floors\s*=\s*(\d+)/);

      if (widthMatch) house.width = parseFloat(widthMatch[1]);
      if (depthMatch) house.depth = parseFloat(depthMatch[1]);
      if (floorsMatch) house.floors = parseInt(floorsMatch[1], 10);
      continue;
    }

    // Handle add_room
    if (rawLine.includes('.add_room(')) {
      const args = extractArgs(rawLine, lines, i);
      const name = parseArgString(args[0]) || 'Room';
      const x = parseArgNumber(args[1], 0);
      const z = parseArgNumber(args[2], 0);
      const width = parseArgNumber(args[3], 4);
      const depth = parseArgNumber(args[4], 4);

      house.rooms.push({
        id: name.toLowerCase().replace(/\s+/g, '_'),
        name: name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        x,
        z,
        width,
        depth,
        wallColor: '#E8DCC8',
        floorMaterial: 'oak',
      });
      continue;
    }

    // Handle add_door
    if (rawLine.includes('.add_door(')) {
      const args = extractArgs(rawLine, lines, i);
      const room = parseArgString(args[0]) || '';
      const wall = (parseArgNamed(args, 'wall') || parseArgString(args[1]) || 'south') as any;
      const width = parseFloat(parseArgNamed(args, 'width') || '1.0') || 1.0;
      const offset = parseFloat(parseArgNamed(args, 'position') || '1.5') || 1.5;

      house.doors.push({
        id: `door_${house.doors.length + 1}_${room}`,
        roomId: room.toLowerCase().replace(/\s+/g, '_'),
        wall,
        offset,
        width,
      });
      continue;
    }

    // Handle add_window
    if (rawLine.includes('.add_window(')) {
      const args = extractArgs(rawLine, lines, i);
      const room = parseArgString(args[0]) || '';
      const wall = (parseArgNamed(args, 'wall') || parseArgString(args[1]) || 'north') as any;
      const width = parseFloat(parseArgNamed(args, 'width') || '1.5') || 1.5;
      const offset = parseFloat(parseArgNamed(args, 'position') || '1.5') || 1.5;

      house.windows.push({
        id: `win_${house.windows.length + 1}_${room}`,
        roomId: room.toLowerCase().replace(/\s+/g, '_'),
        wall,
        offset,
        width,
      });
      continue;
    }

    // Handle set_wall_color
    if (rawLine.includes('.set_wall_color(')) {
      const args = extractArgs(rawLine, lines, i);
      const room = parseArgString(args[0]) || '';
      const color = parseArgString(args[1]) || '#E8DCC8';
      const rId = room.toLowerCase().replace(/\s+/g, '_');
      const target = house.rooms.find((r) => r.id === rId);
      if (target) target.wallColor = color;
      continue;
    }

    // Handle set_floor_material
    if (rawLine.includes('.set_floor_material(')) {
      const args = extractArgs(rawLine, lines, i);
      const room = parseArgString(args[0]) || '';
      const material = (parseArgString(args[1]) || 'oak') as any;
      const rId = room.toLowerCase().replace(/\s+/g, '_');
      const target = house.rooms.find((r) => r.id === rId);
      if (target) target.floorMaterial = material;
      continue;
    }

    // Handle add_furniture
    if (rawLine.includes('.add_furniture(')) {
      const args = extractArgs(rawLine, lines, i);
      const item = (parseArgString(args[0]) || 'sofa') as any;
      const room = parseArgString(args[1]) || '';
      const x = parseArgNumber(args[2], 1.5);
      const z = parseArgNumber(args[3], 1.5);
      const rot = parseFloat(parseArgNamed(args, 'rotation') || '0') || 0;

      house.furniture.push({
        id: `furn_${house.furniture.length + 1}_${item}`,
        item,
        roomId: room.toLowerCase().replace(/\s+/g, '_'),
        x,
        z,
        rotation: rot,
      });
      continue;
    }

    // Handle set_roof_style
    if (rawLine.includes('.set_roof_style(')) {
      const args = extractArgs(rawLine, lines, i);
      const style = parseArgString(args[0]).toLowerCase();
      if (style === 'pitched' || style === 'flat' || style === 'modern') {
        house.roofStyle = style as any;
      }
      continue;
    }

    // Handle enable_solar_power
    if (rawLine.includes('.enable_solar_power(')) {
      house.smartFeatures!.solarPower = !rawLine.toLowerCase().includes('false');
      continue;
    }

    // Handle set_smart_lighting
    if (rawLine.includes('.set_smart_lighting(')) {
      const args = extractArgs(rawLine, lines, i);
      const room = parseArgString(args[0]) || '';
      const rId = room.toLowerCase().replace(/\s+/g, '_');
      const enabled = !args[1] || !args[1].toLowerCase().includes('false');
      house.smartFeatures!.smartLighting[rId] = enabled;
      continue;
    }
  }

  // Support list of room tuples parsed for for-loops
  if (house.rooms.length === 0 && code.includes('for ') && code.includes('in ')) {
    const tupleRegex = /\(\s*["']([^"']+)["']\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)/g;
    let match;
    while ((match = tupleRegex.exec(code)) !== null) {
      const name = match[1];
      const x = parseFloat(match[2]);
      const z = parseFloat(match[3]);
      const width = parseFloat(match[4]);
      const depth = parseFloat(match[5]);
      house.rooms.push({
        id: name.toLowerCase().replace(/\s+/g, '_'),
        name: name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        x,
        z,
        width,
        depth,
        wallColor: '#E8DCC8',
        floorMaterial: 'oak',
      });
    }
  }

  // If no rooms were specified in the code, use fallback default
  if (house.rooms.length === 0) {
    return DEFAULT_HOUSE;
  }

  return house;
}

function extractArgs(line: string, allLines: string[], lineIdx: number): string[] {
  let combined = line;
  if (!combined.includes(')')) {
    for (let k = lineIdx + 1; k < Math.min(allLines.length, lineIdx + 8); k++) {
      combined += ' ' + allLines[k].trim();
      if (allLines[k].includes(')')) break;
    }
  }

  const openParen = combined.indexOf('(');
  const closeParen = combined.lastIndexOf(')');
  if (openParen === -1 || closeParen === -1) return [];

  const inner = combined.substring(openParen + 1, closeParen);
  return inner.split(',').map((s) => s.trim());
}

function parseArgString(arg?: string): string {
  if (!arg) return '';
  const match = arg.match(/["'](.*?)["']/);
  return match ? match[1] : arg.trim();
}

function parseArgNumber(arg?: string, fallback: number = 0): number {
  if (!arg) return fallback;
  const cleaned = arg.replace(/[a-zA-Z_=]/g, '').trim();
  const val = parseFloat(cleaned);
  return isNaN(val) ? fallback : val;
}

function parseArgNamed(args: string[], key: string): string | null {
  for (const a of args) {
    if (a.startsWith(`${key}=`) || a.startsWith(`${key} =`)) {
      const parts = a.split('=');
      if (parts.length > 1) {
        return parts[1].replace(/["']/g, '').trim();
      }
    }
  }
  return null;
}
