export interface Plot {
  id: string;
  gridX: number;
  gridY: number;
  districtId: string;
  buildingId: string | null;
  isLocked: boolean;
  requiredWorldLevel: number;
  label: string;
}

export interface Building {
  id: string;
  name: string;
  description: string;
  category: string;
  requiredMissionId: string;
  requiredSkill: string;
  level: number;
  maxLevel: number;
  xpReward: number;
  creditReward: number;
  status: 'locked' | 'unlocked' | 'active';
  district: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
  };
  features: string[];
}

export interface WorldMission {
  id: string;
  title: string;
  description: string;
  skill: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  status: 'available' | 'in_progress' | 'completed' | 'locked';
  requirements: string[];
  rewardXP: number;
  rewardCredits: number;
  unlocksBuildingId: string;
  prerequisites: string[];
}

export interface District {
  id: string;
  name: string;
  themeColor: string;
  description: string;
  isUnlocked: boolean;
  requiredWorldLevel: number;
}

export const INITIAL_DISTRICTS: District[] = [
  {
    id: 'central',
    name: 'Genesis Core Plaza',
    themeColor: '#8B5CF6',
    description: 'The historic town square and foundation of your developer metropolis.',
    isUnlocked: true,
    requiredWorldLevel: 1,
  },
  {
    id: 'web_dev',
    name: 'Web Innovation District',
    themeColor: '#38BDF8',
    description: 'HTML & CSS creative studios shaping the digital skyline.',
    isUnlocked: true,
    requiredWorldLevel: 1,
  },
  {
    id: 'smart_city',
    name: 'Smart Infrastructure Sector',
    themeColor: '#34D399',
    description: 'JavaScript logic grids powering street automation and IoT energy nodes.',
    isUnlocked: false,
    requiredWorldLevel: 2,
  },
  {
    id: 'ai_data',
    name: 'Data & AI High-Tech Nexus',
    themeColor: '#F43F5E',
    description: 'Python algorithms, neural compute arrays, and cloud database repositories.',
    isUnlocked: false,
    requiredWorldLevel: 3,
  },
];

export const INITIAL_BUILDINGS: Record<string, Building> = {
  town_hall: {
    id: 'town_hall',
    name: 'Founders Town Hall',
    description: 'The administrative heart of your city. Oversees land zoning, civic projects, and milestone awards.',
    category: 'Civic Core',
    requiredMissionId: 'none',
    requiredSkill: 'Orientation',
    level: 1,
    maxLevel: 5,
    xpReward: 100,
    creditReward: 50,
    status: 'unlocked',
    district: 'central',
    colorScheme: {
      primary: '#6366F1',
      secondary: '#4F46E5',
      accent: '#A5B4FC',
      glow: 'rgba(99, 102, 241, 0.4)',
    },
    features: ['City Progress Dashboard', 'Tax & Credit Generation', 'Civic Archive'],
  },
  web_station: {
    id: 'web_station',
    name: 'Web Station',
    description: 'Gateway to the open web. High-bandwidth broadcast tower and foundational markup laboratory.',
    category: 'Web Development',
    requiredMissionId: 'm1_html_basics',
    requiredSkill: 'HTML5 Semantic Architecture',
    level: 1,
    maxLevel: 4,
    xpReward: 150,
    creditReward: 100,
    status: 'locked',
    district: 'web_dev',
    colorScheme: {
      primary: '#F97316',
      secondary: '#EA580C',
      accent: '#FDBA74',
      glow: 'rgba(249, 115, 22, 0.4)',
    },
    features: ['Semantic Markup Beacons', 'Hyperlink Mesh Grid', 'DOM Inspector Antenna'],
  },
  design_studio: {
    id: 'design_studio',
    name: 'Design Studio',
    description: 'Dynamic style laboratory. Transforms concrete structures with glass shaders, neon aesthetics, and responsive geometries.',
    category: 'Design & UI/UX',
    requiredMissionId: 'm2_css_styling',
    requiredSkill: 'CSS Styling & Box Model',
    level: 1,
    maxLevel: 4,
    xpReward: 150,
    creditReward: 100,
    status: 'locked',
    district: 'web_dev',
    colorScheme: {
      primary: '#EC4899',
      secondary: '#DB2777',
      accent: '#F472B6',
      glow: 'rgba(236, 72, 153, 0.4)',
    },
    features: ['Custom City Palette Engine', 'Flexbox Façade Shaders', 'Animation Windmills'],
  },
  smart_control: {
    id: 'smart_control',
    name: 'Smart City Control Centre',
    description: 'Central command grid. Operates event listeners, street signal synchronizers, and interactive public transport.',
    category: 'Interactive Systems',
    requiredMissionId: 'm3_js_interactive',
    requiredSkill: 'JavaScript DOM & Events',
    level: 1,
    maxLevel: 4,
    xpReward: 200,
    creditReward: 150,
    status: 'locked',
    district: 'smart_city',
    colorScheme: {
      primary: '#EAB308',
      secondary: '#CA8A04',
      accent: '#FDE047',
      glow: 'rgba(234, 179, 8, 0.4)',
    },
    features: ['Live Event Handlers', 'Streetlight Automation', 'Async Traffic Dispatcher'],
  },
  automation_factory: {
    id: 'automation_factory',
    name: 'Automation Factory',
    description: 'Heavy computational foundry. Deploys background worker pipelines, energy calculations, and robotics scripts.',
    category: 'Backend & Automation',
    requiredMissionId: 'm4_python_automation',
    requiredSkill: 'Python Logic & Loops',
    level: 1,
    maxLevel: 4,
    xpReward: 250,
    creditReward: 200,
    status: 'locked',
    district: 'smart_city',
    colorScheme: {
      primary: '#06B6D4',
      secondary: '#0891B2',
      accent: '#67E8F9',
      glow: 'rgba(6, 182, 212, 0.4)',
    },
    features: ['Automated Energy Balancer', 'Batch Production Lines', 'Robotic Assembly Pods'],
  },
  data_centre: {
    id: 'data_centre',
    name: 'Quantum Data Centre',
    description: 'Massive underground server bank securing relational records, time-series telemetry, and fast indexed storage.',
    category: 'Data & Storage',
    requiredMissionId: 'm5_database_management',
    requiredSkill: 'Databases & SQL',
    level: 1,
    maxLevel: 4,
    xpReward: 250,
    creditReward: 200,
    status: 'locked',
    district: 'ai_data',
    colorScheme: {
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      accent: '#C4B5FD',
      glow: 'rgba(139, 92, 246, 0.4)',
    },
    features: ['Relational Query Vault', 'Real-Time Replication Array', 'Cold Storage Crypt'],
  },
  comm_hub: {
    id: 'comm_hub',
    name: 'Communication Hub',
    description: 'High-frequency satellite uplink transmitting RESTful endpoints, webhook relays, and cross-city service bridges.',
    category: 'APIs & Networking',
    requiredMissionId: 'm6_api_connections',
    requiredSkill: 'REST APIs & Webhooks',
    level: 1,
    maxLevel: 4,
    xpReward: 300,
    creditReward: 250,
    status: 'locked',
    district: 'ai_data',
    colorScheme: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#6EE7B7',
      glow: 'rgba(16, 185, 129, 0.4)',
    },
    features: ['API Gateway Satellite', 'Telemetry Webhook Beacon', 'Rate Limiting Shield'],
  },
  ai_tower: {
    id: 'ai_tower',
    name: 'AI Research Tower',
    description: 'Soaring spire dedicated to deep neural representations, intelligent energy forecasting, and autonomous city guidance.',
    category: 'Artificial Intelligence',
    requiredMissionId: 'm7_ai_systems',
    requiredSkill: 'Machine Learning Foundations',
    level: 1,
    maxLevel: 4,
    xpReward: 350,
    creditReward: 300,
    status: 'locked',
    district: 'ai_data',
    colorScheme: {
      primary: '#F43F5E',
      secondary: '#E11D48',
      accent: '#FDA4AF',
      glow: 'rgba(244, 63, 94, 0.4)',
    },
    features: ['Predictive City Core', 'Autonomous Traffic Neural Net', 'Synthetic Intelligence Lab'],
  },
};

export const INITIAL_PLOTS: Plot[] = [
  // District: Central Core (Col 0-2, Row 0-2)
  { id: 'plot_center', gridX: 1, gridY: 1, districtId: 'central', buildingId: 'town_hall', isLocked: false, requiredWorldLevel: 1, label: 'Central Town Square' },
  { id: 'plot_west', gridX: 0, gridY: 1, districtId: 'web_dev', buildingId: null, isLocked: false, requiredWorldLevel: 1, label: 'Web District Lot 1' },
  { id: 'plot_north', gridX: 1, gridY: 0, districtId: 'web_dev', buildingId: null, isLocked: false, requiredWorldLevel: 1, label: 'Web District Lot 2' },
  { id: 'plot_east', gridX: 2, gridY: 1, districtId: 'smart_city', buildingId: null, isLocked: false, requiredWorldLevel: 2, label: 'Smart Grid Lot 1' },
  { id: 'plot_south', gridX: 1, gridY: 2, districtId: 'smart_city', buildingId: null, isLocked: false, requiredWorldLevel: 2, label: 'Smart Grid Lot 2' },
  { id: 'plot_nw', gridX: 0, gridY: 0, districtId: 'ai_data', buildingId: null, isLocked: true, requiredWorldLevel: 3, label: 'Data Haven Lot 1' },
  { id: 'plot_ne', gridX: 2, gridY: 0, districtId: 'ai_data', buildingId: null, isLocked: true, requiredWorldLevel: 3, label: 'Data Haven Lot 2' },
  { id: 'plot_sw', gridX: 0, gridY: 2, districtId: 'ai_data', buildingId: null, isLocked: true, requiredWorldLevel: 4, label: 'Innovation Point A' },
  { id: 'plot_se', gridX: 2, gridY: 2, districtId: 'ai_data', buildingId: null, isLocked: true, requiredWorldLevel: 4, label: 'Innovation Point B' },
];

export const INITIAL_MISSIONS: WorldMission[] = [
  {
    id: 'm1_html_basics',
    title: 'Build Your First Webpage',
    description: 'Architect a semantic HTML information portal for the city visitor center with header, main description, and navigation links.',
    skill: 'HTML',
    difficulty: 'Beginner',
    duration: '15 mins',
    status: 'available',
    requirements: [
      'Include a primary <h1> heading for the City Center',
      'Add a descriptive <p> paragraph about the city foundation',
      'Create an unordered <ul> list with at least 3 landmark links',
      'Include an image placeholder tag with alt text',
    ],
    rewardXP: 150,
    rewardCredits: 100,
    unlocksBuildingId: 'web_station',
    prerequisites: [],
  },
  {
    id: 'm2_css_styling',
    title: 'Design Your Buildings',
    description: 'Transform the raw brick architecture using modern CSS flexbox layouts, neon glow borders, and gradient color accents.',
    skill: 'CSS',
    difficulty: 'Beginner',
    duration: '20 mins',
    status: 'locked',
    requirements: [
      'Apply custom background gradient palette',
      'Implement flexbox layout for responsive building cards',
      'Add interactive hover states with soft transition',
      'Create a glowing border effect using box-shadow',
    ],
    rewardXP: 150,
    rewardCredits: 100,
    unlocksBuildingId: 'design_studio',
    prerequisites: ['m1_html_basics'],
  },
  {
    id: 'm3_js_interactive',
    title: 'Activate Smart City Systems',
    description: 'Write event-driven JavaScript functions to toggle the city streetlights, count visitor arrivals, and control traffic gates.',
    skill: 'JavaScript',
    difficulty: 'Intermediate',
    duration: '25 mins',
    status: 'locked',
    requirements: [
      'Attach click event listeners to city power switches',
      'Dynamically update the real-time population counter state',
      'Implement a toggle function to change nighttime street lighting',
      'Handle automated timer intervals for traffic cycle dispatch',
    ],
    rewardXP: 200,
    rewardCredits: 150,
    unlocksBuildingId: 'smart_control',
    prerequisites: ['m2_css_styling'],
  },
  {
    id: 'm4_python_automation',
    title: 'Create an Automation Factory',
    description: 'Write a Python automation routine that loops through building data structures to calculate total energy consumption and detect anomalies.',
    skill: 'Python',
    difficulty: 'Intermediate',
    duration: '30 mins',
    status: 'locked',
    requirements: [
      'Write a function that iterates through city building records',
      'Calculate cumulative megawatt energy consumption',
      'Implement threshold checks to flag overloaded transformers',
      'Return formatted diagnostic dictionary of city efficiency',
    ],
    rewardXP: 250,
    rewardCredits: 200,
    unlocksBuildingId: 'automation_factory',
    prerequisites: ['m3_js_interactive'],
  },
  {
    id: 'm5_database_management',
    title: 'Manage City Data',
    description: 'Filter, index, and query structured city records to monitor population migration, resource allocation, and zoning data.',
    skill: 'Databases',
    difficulty: 'Intermediate',
    duration: '25 mins',
    status: 'locked',
    requirements: [
      'Write queries to retrieve top energy-efficient structures',
      'Perform aggregate calculations for district citizen density',
      'Design structured schemas for city infrastructure telemetry',
    ],
    rewardXP: 250,
    rewardCredits: 200,
    unlocksBuildingId: 'data_centre',
    prerequisites: ['m4_python_automation'],
  },
  {
    id: 'm6_api_connections',
    title: 'Connect City Services',
    description: 'Integrate external meteorological and power telemetry APIs to synchronize real-time city weather and renewable solar power generation.',
    skill: 'APIs',
    difficulty: 'Advanced',
    duration: '30 mins',
    status: 'locked',
    requirements: [
      'Fetch asynchronous weather station telemetry via REST API',
      'Handle error boundaries and fallback mock data safely',
      'Disperse weather alerts to smart city street beacons',
    ],
    rewardXP: 300,
    rewardCredits: 250,
    unlocksBuildingId: 'comm_hub',
    prerequisites: ['m5_database_management'],
  },
  {
    id: 'm7_ai_systems',
    title: 'Add Intelligent Systems',
    description: 'Deploy machine-learning classification and heuristic algorithms to optimize automated traffic lights and forecast clean power needs.',
    skill: 'Artificial Intelligence',
    difficulty: 'Advanced',
    duration: '35 mins',
    status: 'locked',
    requirements: [
      'Train a lightweight predictive model for power consumption spikes',
      'Classify vehicle traffic density patterns across major avenues',
      'Generate automated AI recommendations for city council upgrades',
    ],
    rewardXP: 350,
    rewardCredits: 300,
    unlocksBuildingId: 'ai_tower',
    prerequisites: ['m6_api_connections'],
  },
];
