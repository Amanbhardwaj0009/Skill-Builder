import { HouseConfig, calculateHouseBudget } from './houseModel';

export interface MissionRequirement {
  id: string;
  label: string;
  check: (house: HouseConfig, output: string[]) => boolean;
  hint: string;
}

export interface MissionDefinition {
  id: number;
  title: string;
  tagline: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xpReward: number;
  creditsReward: number;
  unlockedItem: string;
  description: string;
  learningPoints: string[];
  starterCode: string;
  solutionCode: string;
  hints: [string, string, string]; // 3-tier progressive hints
  requirements: MissionRequirement[];
}

export const MISSIONS_DATA: MissionDefinition[] = [
  {
    id: 1,
    title: 'Build the Basic House',
    tagline: 'Variables & Objects',
    difficulty: 'Beginner',
    xpReward: 200,
    creditsReward: 150,
    unlockedItem: 'Modern Wooden Villa Foundation',
    description:
      'Create your very first residential structure! Define the house perimeter and add living room, kitchen, and bedroom spaces with entry doors and daylight windows.',
    learningPoints: ['Variables & Instantiation', 'Method Invocation', 'Numeric Coordinates', 'Physical Boundaries'],
    starterCode: `from skillquest_house import House

# Mission 1: Build the Basic House
# Step 1: Create a house boundary (width >= 10, depth >= 8)
home = House(width=12, depth=10, floors=1)

# Step 2: Add living room, kitchen, and bedroom
home.add_room("living_room", x=0, z=0, width=6, depth=5)
home.add_room("kitchen", x=6, z=0, width=5, depth=5)
home.add_room("bedroom", x=0, z=5, width=5, depth=4.5)

# Step 3: Add entrance door and windows
home.add_door("living_room", wall="south", position=2.5, width=1.0)
home.add_window("living_room", wall="south", position=1.0, width=1.5)
home.add_window("bedroom", wall="west", position=1.5, width=1.5)

print("Home blueprint compiled successfully!")
`,
    solutionCode: `from skillquest_house import House

home = House(width=12, depth=10, floors=1)
home.add_room("living_room", x=0, z=0, width=6, depth=5)
home.add_room("kitchen", x=6, z=0, width=5, depth=5)
home.add_room("bedroom", x=0, z=5, width=5, depth=4.5)

home.add_door("living_room", wall="south", position=2.5, width=1.0)
home.add_window("living_room", wall="south", position=1.0, width=1.5)
home.add_window("bedroom", wall="west", position=1.5, width=1.5)
`,
    hints: [
      'Use home = House(width, depth) to define the lot size. Ensure width >= 10 and depth >= 8.',
      'Call home.add_room(name, x, z, width, depth) for living_room, kitchen, and bedroom.',
      'Place doors with home.add_door("living_room", wall="south") and at least two windows with home.add_window().',
    ],
    requirements: [
      {
        id: 'req_boundary',
        label: 'House plot boundary >= 10x8 meters',
        check: (h) => h.width >= 10 && h.depth >= 8,
        hint: 'Set House(width=12, depth=10) or larger.',
      },
      {
        id: 'req_rooms',
        label: 'Include living_room, kitchen, and bedroom',
        check: (h) =>
          h.rooms.some((r) => r.id.includes('living')) &&
          h.rooms.some((r) => r.id.includes('kitchen')) &&
          h.rooms.some((r) => r.id.includes('bed')),
        hint: 'Use add_room() to create each of the 3 specified rooms.',
      },
      {
        id: 'req_fit',
        label: 'All rooms fit within perimeter boundaries',
        check: (h) =>
          h.rooms.length > 0 &&
          h.rooms.every((r) => r.x >= 0 && r.z >= 0 && r.x + r.width <= h.width && r.z + r.depth <= h.depth),
        hint: 'Ensure room position + dimensions do not exceed house width/depth.',
      },
      {
        id: 'req_door',
        label: 'At least 1 entrance door placed',
        check: (h) => h.doors.length >= 1,
        hint: 'Use home.add_door("living_room", wall="south").',
      },
      {
        id: 'req_windows',
        label: 'At least 2 windows installed',
        check: (h) => h.windows.length >= 2,
        hint: 'Use home.add_window(...) on at least two rooms.',
      },
    ],
  },
  {
    id: 2,
    title: 'Design the Floor Plan',
    tagline: 'Lists & For Loops',
    difficulty: 'Beginner',
    xpReward: 250,
    creditsReward: 180,
    unlockedItem: 'Architectural Blueprint Drafter',
    description:
      'Scale your architectural design efficiently! Instead of manually repeating room declarations, store room specifications in a Python list of tuples and use a for-loop to construct the entire 4-room layout.',
    learningPoints: ['Python Tuples & Lists', 'For Loops', 'Tuple Unpacking', 'Algorithmic Layouts'],
    starterCode: `from skillquest_house import House

# Mission 2: Design Floor Plan using Lists and Loops
home = House(width=14, depth=10, floors=1)

# Define rooms as list of tuples: (name, x, z, width, depth)
rooms_data = [
    ("living_room", 0, 0, 7, 5),
    ("kitchen",     7, 0, 5, 5),
    ("bedroom",     0, 5, 6, 4.5),
    ("study_room",  6, 5, 6, 4.5),
]

# TODO: Write a for loop to unpack and add each room
for name, x, z, width, depth in rooms_data:
    home.add_room(name, x, z, width, depth)

# Add basic exterior doors
home.add_door("living_room", wall="south", position=3.0)

print(f"Generated {len(home.rooms)} rooms via Python loop!")
`,
    solutionCode: `from skillquest_house import House

home = House(width=14, depth=10, floors=1)

rooms_data = [
    ("living_room", 0, 0, 7, 5),
    ("kitchen",     7, 0, 5, 5),
    ("bedroom",     0, 5, 6, 4.5),
    ("study_room",  6, 5, 6, 4.5),
]

for name, x, z, width, depth in rooms_data:
    home.add_room(name, x, z, width, depth)

home.add_door("living_room", wall="south", position=3.0)
`,
    hints: [
      'Create a list containing 4 room tuples: (name, x, z, width, depth).',
      'Use "for name, x, z, width, depth in rooms_data:" to iterate over each room.',
      'Inside the loop, call home.add_room(name, x=x, z=z, width=width, depth=depth).',
    ],
    requirements: [
      {
        id: 'req_room_count',
        label: 'Construct at least 4 distinct rooms',
        check: (h) => h.rooms.length >= 4,
        hint: 'Add study_room or bathroom in addition to the 3 basic rooms.',
      },
      {
        id: 'req_study_or_bath',
        label: 'Includes a study room or dining space',
        check: (h) => h.rooms.some((r) => r.id.includes('study') || r.id.includes('dining') || r.id.includes('bath')),
        hint: 'Add ("study_room", 6, 5, 6, 4.5) to the list.',
      },
      {
        id: 'req_no_overlap',
        label: 'Total interior area exceeds 45 m²',
        check: (h) => h.rooms.reduce((acc, r) => acc + r.width * r.depth, 0) >= 45,
        hint: 'Ensure room dimensions add up to 45m² or more.',
      },
      {
        id: 'req_boundary_fit',
        label: 'All 4+ rooms fit inside house lot',
        check: (h) => h.rooms.every((r) => r.x + r.width <= h.width && r.z + r.depth <= h.depth),
        hint: 'Check that maximum X and Z coordinates remain within width and depth.',
      },
    ],
  },
  {
    id: 3,
    title: 'Windows & Doors Alignment',
    tagline: 'Wall Orientations & Alignments',
    difficulty: 'Intermediate',
    xpReward: 300,
    creditsReward: 200,
    unlockedItem: 'Panoramic French Glass Doors',
    description:
      'A great home needs optimal ventilation and natural sunlight. Place exterior doors and windows on specific wall orientations ("north", "south", "east", "west") with validated offsets.',
    learningPoints: ['Wall Orientations', 'Offset Math', 'Conditional Openings', 'Architectural Airflow'],
    starterCode: `from skillquest_house import House

# Mission 3: Windows & Doors Alignment
home = House(width=14, depth=10)

home.add_room("living_room", 0, 0, 7, 5)
home.add_room("kitchen",     7, 0, 6, 5)
home.add_room("master_bed",  0, 5, 7, 5)
home.add_room("guest_bed",   7, 5, 6, 5)

# Place entrance and patio doors
home.add_door("living_room", wall="south", position=3.5, width=1.2)
home.add_door("kitchen",     wall="east",  position=2.5, width=1.0)

# Place sunlight windows across all 4 cardinal directions
home.add_window("living_room", wall="south", position=1.0, width=1.8)
home.add_window("kitchen",     wall="north", position=2.0, width=1.4)
home.add_window("master_bed",  wall="west",  position=2.0, width=1.6)
home.add_window("guest_bed",   wall="east",  position=2.0, width=1.4)

print(f"Placed {len(home.doors)} doors and {len(home.windows)} windows!")
`,
    solutionCode: `from skillquest_house import House

home = House(width=14, depth=10)
home.add_room("living_room", 0, 0, 7, 5)
home.add_room("kitchen",     7, 0, 6, 5)
home.add_room("master_bed",  0, 5, 7, 5)
home.add_room("guest_bed",   7, 5, 6, 5)

home.add_door("living_room", wall="south", position=3.5, width=1.2)
home.add_door("kitchen",     wall="east",  position=2.5, width=1.0)

home.add_window("living_room", wall="south", position=1.0, width=1.8)
home.add_window("kitchen",     wall="north", position=2.0, width=1.4)
home.add_window("master_bed",  wall="west",  position=2.0, width=1.6)
home.add_window("guest_bed",   wall="east",  position=2.0, width=1.4)
`,
    hints: [
      'Each wall parameter must be one of: "north", "south", "east", "west".',
      'Install at least 2 doors: e.g. one on "south" wall and one on "east" wall.',
      'Install at least 4 windows spanning multiple orientations (north, south, east, west).',
    ],
    requirements: [
      {
        id: 'req_two_doors',
        label: 'Place at least 2 doors on different walls',
        check: (h) => {
          if (h.doors.length < 2) return false;
          const walls = new Set(h.doors.map((d) => d.wall));
          return walls.size >= 2;
        },
        hint: 'Add doors facing south and east.',
      },
      {
        id: 'req_four_windows',
        label: 'Install at least 4 windows across different walls',
        check: (h) => {
          if (h.windows.length < 4) return false;
          const walls = new Set(h.windows.map((w) => w.wall));
          return walls.size >= 3;
        },
        hint: 'Place windows on at least 3 distinct wall orientations.',
      },
      {
        id: 'req_valid_offsets',
        label: 'All openings placed within valid room wall spans',
        check: (h) =>
          h.doors.every((d) => d.offset > 0) &&
          h.windows.every((w) => w.offset > 0),
        hint: 'Position offsets should be positive numbers (e.g. position=2.0).',
      },
    ],
  },
  {
    id: 4,
    title: 'Interior Design & Custom Furniture',
    tagline: 'Colors, Materials & Furniture Placement',
    difficulty: 'Intermediate',
    xpReward: 350,
    creditsReward: 250,
    unlockedItem: 'Scandinavian Designer Furniture Suite',
    description:
      'Transform empty rooms into stylish living spaces! Style wall colors with hex codes, assign realistic flooring materials (oak, marble, tile, carpet), and place furniture (sofa, bed, table, counter, lamp) with coordinates and rotations.',
    learningPoints: ['String Formatting & Hex Colors', 'Material Palettes', 'Local Coordinates', 'Object Placement'],
    starterCode: `from skillquest_house import House

# Mission 4: Interior Design & Custom Furniture
home = House(width=12, depth=10)

home.add_room("living_room", 0, 0, 6, 5)
home.add_room("kitchen",     6, 0, 5, 5)
home.add_room("bedroom",     0, 5, 6, 4.5)

# Style wall colors
home.set_wall_color("living_room", "#F5EBE0")
home.set_wall_color("kitchen",     "#E3F2FD")
home.set_wall_color("bedroom",     "#E8EAF6")

# Style floor materials: oak, marble, tile, concrete, carpet
home.set_floor_material("living_room", "oak")
home.set_floor_material("kitchen",     "tile")
home.set_floor_material("bedroom",     "carpet")

# Add furniture with room coordinates (x, z) and rotation in degrees
home.add_furniture("sofa",            "living_room", x=2.5, z=2.5, rotation=0)
home.add_furniture("table",           "living_room", x=2.5, z=1.2, rotation=0)
home.add_furniture("lamp",            "living_room", x=4.8, z=4.0, rotation=45)
home.add_furniture("kitchen_counter", "kitchen",     x=2.5, z=0.8, rotation=0)
home.add_furniture("bed",             "bedroom",     x=2.5, z=2.2, rotation=90)

print(f"Furnished home with {len(home.furniture)} designer pieces!")
`,
    solutionCode: `from skillquest_house import House

home = House(width=12, depth=10)
home.add_room("living_room", 0, 0, 6, 5)
home.add_room("kitchen",     6, 0, 5, 5)
home.add_room("bedroom",     0, 5, 6, 4.5)

home.set_wall_color("living_room", "#F5EBE0")
home.set_wall_color("kitchen",     "#E3F2FD")
home.set_wall_color("bedroom",     "#E8EAF6")

home.set_floor_material("living_room", "oak")
home.set_floor_material("kitchen",     "tile")
home.set_floor_material("bedroom",     "carpet")

home.add_furniture("sofa",            "living_room", x=2.5, z=2.5, rotation=0)
home.add_furniture("table",           "living_room", x=2.5, z=1.2, rotation=0)
home.add_furniture("lamp",            "living_room", x=4.8, z=4.0, rotation=45)
home.add_furniture("kitchen_counter", "kitchen",     x=2.5, z=0.8, rotation=0)
home.add_furniture("bed",             "bedroom",     x=2.5, z=2.2, rotation=90)
`,
    hints: [
      'Call home.set_wall_color(room_name, hex_code) to color each room.',
      'Use home.set_floor_material(room_name, material) with oak, marble, tile, or carpet.',
      'Add at least 4 furniture items using home.add_furniture("sofa", "living_room", x=2.5, z=2.5).',
    ],
    requirements: [
      {
        id: 'req_materials',
        label: 'Apply at least 2 distinct floor materials (e.g. oak & carpet)',
        check: (h) => {
          const mats = new Set(h.rooms.map((r) => r.floorMaterial));
          return mats.size >= 2;
        },
        hint: 'Use set_floor_material with different materials on different rooms.',
      },
      {
        id: 'req_custom_colors',
        label: 'Customize wall colors for all rooms',
        check: (h) => h.rooms.length >= 3 && h.rooms.every((r) => r.wallColor && r.wallColor.startsWith('#')),
        hint: 'Use set_wall_color() with hex colors like "#F5EBE0".',
      },
      {
        id: 'req_furniture_count',
        label: 'Place at least 4 pieces of furniture',
        check: (h) => h.furniture.length >= 4,
        hint: 'Add sofa, table, bed, kitchen_counter, or lamp.',
      },
      {
        id: 'req_sofa_bed',
        label: 'Includes both a sofa and a bed',
        check: (h) =>
          h.furniture.some((f) => f.item === 'sofa') &&
          h.furniture.some((f) => f.item === 'bed'),
        hint: 'Add a sofa to the living room and a bed to the bedroom.',
      },
    ],
  },
  {
    id: 5,
    title: 'Create a Two-Floor Home',
    tagline: 'Multi-Level Architecture',
    difficulty: 'Advanced',
    xpReward: 400,
    creditsReward: 300,
    unlockedItem: 'Helical Floating Staircase & Rooftop Terrace',
    description:
      'Double your living space! Build a modern two-story home. Configure floors=2 on the House constructor and set a stylish pitched or modern roof.',
    learningPoints: ['Multi-Story Coordinates', 'Roof Geometries', 'Structural Stacking', 'Vertical Circulation'],
    starterCode: `from skillquest_house import House

# Mission 5: Create a Two-Floor Home
home = House(width=12, depth=10, floors=2)
home.set_roof_style("pitched")

# Ground Floor Rooms
home.add_room("living_room", 0, 0, 6, 5)
home.add_room("kitchen",     6, 0, 5, 5)
home.add_room("dining_room", 6, 5, 5, 4.5)

# Ground Floor openings
home.add_door("living_room", wall="south", position=2.5)
home.add_window("living_room", wall="south", position=1.0)
home.add_window("kitchen", wall="north", position=2.5)

# Ground Floor Furniture
home.add_furniture("sofa", "living_room", x=2.5, z=2.5)
home.add_furniture("table", "dining_room", x=2.5, z=2.0)

print("Two-story residence compiled with pitched roof style!")
`,
    solutionCode: `from skillquest_house import House

home = House(width=12, depth=10, floors=2)
home.set_roof_style("pitched")

home.add_room("living_room", 0, 0, 6, 5)
home.add_room("kitchen",     6, 0, 5, 5)
home.add_room("dining_room", 6, 5, 5, 4.5)

home.add_door("living_room", wall="south", position=2.5)
home.add_window("living_room", wall="south", position=1.0)
home.add_window("kitchen", wall="north", position=2.5)

home.add_furniture("sofa", "living_room", x=2.5, z=2.5)
home.add_furniture("table", "dining_room", x=2.5, z=2.0)
`,
    hints: [
      'Initialize House with floors=2: home = House(width=12, depth=10, floors=2).',
      'Set the roof style using home.set_roof_style("pitched") or "modern".',
      'Build out at least 3 ground level rooms with doors and windows.',
    ],
    requirements: [
      {
        id: 'req_floors_two',
        label: 'House structure configured with 2 floors (floors=2)',
        check: (h) => h.floors >= 2,
        hint: 'Pass floors=2 into House(width, depth, floors=2).',
      },
      {
        id: 'req_pitched_roof',
        label: 'Pitched or modern architectural roof profile configured',
        check: (h) => h.roofStyle === 'pitched' || h.roofStyle === 'modern',
        hint: 'Call home.set_roof_style("pitched").',
      },
      {
        id: 'req_3_rooms_floors',
        label: 'At least 3 interior functional rooms instantiated',
        check: (h) => h.rooms.length >= 3,
        hint: 'Add living room, kitchen, and dining room or bedroom.',
      },
    ],
  },
  {
    id: 6,
    title: 'Smart Home Automation',
    tagline: 'IoT Logic & Energy Settings',
    difficulty: 'Advanced',
    xpReward: 450,
    creditsReward: 350,
    unlockedItem: 'Cyberpunk Smart Grid & Solar Array',
    description:
      'Upgrade your home into an energy-efficient futuristic smart dwelling! Write Python logic to toggle smart ambient lighting, activate solar power, and run automated temperature/energy routines.',
    learningPoints: ['Conditional Logic', 'Boolean Flags', 'Automation Algorithms', 'Green Building Standards'],
    starterCode: `from skillquest_house import House

# Mission 6: Smart Home Automation
home = House(width=12, depth=10, floors=1)

home.add_room("living_room", 0, 0, 6, 5)
home.add_room("kitchen",     6, 0, 5, 5)
home.add_room("bedroom",     0, 5, 5, 4.5)

home.add_door("living_room", wall="south")
home.add_window("living_room", wall="south")
home.add_window("bedroom", wall="west")

# Smart Home IoT configurations
home.enable_solar_power(True)
home.set_smart_lighting("living_room", True)
home.set_smart_lighting("bedroom", True)

# Automated Energy check function
def optimize_energy(room_name, is_night):
    if is_night:
        home.set_smart_lighting(room_name, True)
        print(f"Smart Automation: Night ambient mode enabled for {room_name}")
    else:
        home.set_smart_lighting(room_name, False)
        print(f"Smart Automation: Daytime eco mode enabled for {room_name}")

optimize_energy("living_room", is_night=True)
optimize_energy("bedroom", is_night=True)

print("Smart Home IoT automation matrix active!")
`,
    solutionCode: `from skillquest_house import House

home = House(width=12, depth=10, floors=1)

home.add_room("living_room", 0, 0, 6, 5)
home.add_room("kitchen",     6, 0, 5, 5)
home.add_room("bedroom",     0, 5, 5, 4.5)

home.add_door("living_room", wall="south")
home.add_window("living_room", wall="south")
home.add_window("bedroom", wall="west")

home.enable_solar_power(True)
home.set_smart_lighting("living_room", True)
home.set_smart_lighting("bedroom", True)
`,
    hints: [
      'Call home.enable_solar_power(True) to connect rooftop solar panels.',
      'Enable smart lighting in at least 2 rooms with home.set_smart_lighting(room, True).',
      'Use a Python function with if/else conditionals to model automated logic.',
    ],
    requirements: [
      {
        id: 'req_solar',
        label: 'Rooftop solar power array activated',
        check: (h) => h.smartFeatures?.solarPower === true,
        hint: 'Call home.enable_solar_power(True).',
      },
      {
        id: 'req_smart_lighting',
        label: 'Smart ambient lighting configured on >= 2 rooms',
        check: (h) => {
          if (!h.smartFeatures?.smartLighting) return false;
          const activeLights = Object.values(h.smartFeatures.smartLighting).filter(Boolean);
          return activeLights.length >= 2;
        },
        hint: 'Call home.set_smart_lighting("living_room", True) and for bedroom.',
      },
    ],
  },
  {
    id: 7,
    title: 'Work Within a Budget',
    tagline: 'Arithmetic & Resource Allocation',
    difficulty: 'Advanced',
    xpReward: 500,
    creditsReward: 400,
    unlockedItem: 'Master Architect Golden Trophy',
    description:
      'Real-world engineering balances design with budget! You have a simulated budget limit of $15,000. Balance your room areas, material finishes, and furniture choices without going over budget.',
    learningPoints: ['Cost Modeling', 'Arithmetic Computation', 'Budget Optimization', 'Tradeoff Analysis'],
    starterCode: `from skillquest_house import House

# Mission 7: Work Within a Budget
# Simulated Budget Limit: $15,000
BUDGET_LIMIT = 15000

home = House(width=12, depth=10, floors=1)

# Carefully planned room areas
home.add_room("living_room", 0, 0, 5.5, 4.5)
home.add_room("kitchen",     5.5, 0, 4.5, 4.5)
home.add_room("bedroom",     0, 4.5, 5.0, 4.0)

# Cost-effective materials
home.set_floor_material("living_room", "oak")      # $30/m²
home.set_floor_material("kitchen",     "tile")     # $25/m²
home.set_floor_material("bedroom",     "carpet")   # $20/m²

# Key openings
home.add_door("living_room", wall="south")
home.add_window("living_room", wall="south")
home.add_window("bedroom", wall="west")

# Curated furniture selection
home.add_furniture("sofa",    "living_room", x=2.0, z=2.0)
home.add_furniture("bed",     "bedroom",     x=2.0, z=2.0)
home.add_furniture("counter", "kitchen",     x=2.0, z=0.8)

# Smart eco feature
home.enable_solar_power(True)

# Calculate simulated estimated cost
cost = home.calculate_budget()
remaining = BUDGET_LIMIT - cost
print(f"Estimated Simulated Cost: \${cost:,.2f}")
print(f"Remaining Budget: \${remaining:,.2f}")

if cost <= BUDGET_LIMIT:
    print("Project is approved within budget!")
else:
    print("Warning: Project exceeds budget!")
`,
    solutionCode: `from skillquest_house import House

BUDGET_LIMIT = 15000
home = House(width=12, depth=10, floors=1)

home.add_room("living_room", 0, 0, 5.5, 4.5)
home.add_room("kitchen",     5.5, 0, 4.5, 4.5)
home.add_room("bedroom",     0, 4.5, 5.0, 4.0)

home.set_floor_material("living_room", "oak")
home.set_floor_material("kitchen",     "tile")
home.set_floor_material("bedroom",     "carpet")

home.add_door("living_room", wall="south")
home.add_window("living_room", wall="south")
home.add_window("bedroom", wall="west")

home.add_furniture("sofa", "living_room", x=2.0, z=2.0)
home.add_furniture("bed", "bedroom", x=2.0, z=2.0)

home.enable_solar_power(True)
`,
    hints: [
      'Each square meter of construction and finish adds to the simulated cost.',
      'Check your estimated cost in the Building Inspector tab under "Budget Tracker".',
      'Keep the total calculated cost under $15,000 by optimizing room dimensions.',
    ],
    requirements: [
      {
        id: 'req_budget_limit',
        label: 'Total simulated cost is under the $15,000 budget limit',
        check: (h) => {
          const { totalCost } = calculateHouseBudget(h);
          return totalCost > 0 && totalCost <= 15000;
        },
        hint: 'Reduce room dimensions slightly or choose tile/carpet instead of marble.',
      },
      {
        id: 'req_full_rooms',
        label: 'Includes living room, kitchen, and bedroom',
        check: (h) =>
          h.rooms.some((r) => r.id.includes('living')) &&
          h.rooms.some((r) => r.id.includes('kitchen')) &&
          h.rooms.some((r) => r.id.includes('bed')),
        hint: 'Ensure all 3 essential living spaces are built.',
      },
      {
        id: 'req_budget_furniture',
        label: 'Furnished with at least a sofa and bed',
        check: (h) =>
          h.furniture.some((f) => f.item === 'sofa') &&
          h.furniture.some((f) => f.item === 'bed'),
        hint: 'Add essential furniture pieces within budget.',
      },
    ],
  },
];
