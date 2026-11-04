export interface SkillItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools';
  proficiencyTag: string; // e.g. "Advanced", "Proficient", "Core", "Building"
  icon: string;
  description: string;
  color: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  tags: string[];
  category: string;
  image: string;
  githubUrl: string;
  liveUrl: string;
  highlights: string[];
  metrics?: { label: string; value: string }[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
  badge: string;
  color: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  event: string;
  institution: string;
  date: string;
  description: string;
  rankBadge: string;
  type: 'hackathon' | 'research' | 'academic';
  icon: string;
}

export interface EducationItem {
  degree: string;
  field: string;
  institution: string;
  location: string;
  period: string;
  expectedGraduation: string;
  highlights: string[];
  coursework: string[];
}

export interface PersonalInfo {
  name: string;
  avatar: string;
  greeting: string;
  role: string;
  secondaryRole: string;
  bio: string;
  aboutStory: string;
  location: string;
  college: string;
  status: string;
  socials: {
    github: string;
    linkedin: string;
    instagram: string;
    email: string;
  };
  interests: string[];
  stats: { label: string; value: string; suffix?: string }[];
}

export const portfolioData: {
  personal: PersonalInfo;
  education: EducationItem;
  skills: SkillItem[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  achievements: AchievementItem[];
} = {
  personal: {
    name: "Aman Bhardwaj",
    avatar: "/aman.jpg",
    greeting: "HEY, I'M AMAN BHARDWAJ",
    role: "Full Stack Developer",
    secondaryRole: "Computer Science Student & Creative Technologist",
    bio: "Building Digital Experiences Through Code & Creativity. Passionate about crafting high-performance web applications, scalable backends, and intelligent AI-powered solutions.",
    aboutStory: "I am a Computer Science undergraduate at Shivalik College of Engineering, Dehradun, with a strong focus on full-stack architecture, machine learning integration, and interactive user experiences. As the Treasurer of our ACM Student Chapter and an active hackathon competitor, I bridge the gap between creative design, disciplined engineering, and leadership.",
    location: "Dehradun, Uttarakhand, India",
    college: "Shivalik College of Engineering, Dehradun",
    status: "Available for Internships & High-Impact Projects",
    socials: {
      github: "https://github.com/amanbhardwaj-dev", // Editable placeholder
      linkedin: "https://linkedin.com/in/amanbhardwaj", // Editable placeholder
      instagram: "https://instagram.com/amanbhardwaj", // Editable placeholder
      email: "aman.bhardwaj.cse@gmail.com", // Editable placeholder
    },
    interests: [
      "Full Stack Development",
      "Artificial Intelligence & Machine Learning",
      "Problem Solving & DSA",
      "UI/UX & 3D Interactive Design",
      "Building Innovative Projects",
      "Cloud & Microservices"
    ],
    stats: [
      { label: "Hackathons", value: "8", suffix: "+" },
      { label: "Projects Built", value: "15", suffix: "+" },
      { label: "Code Commits", value: "1,200", suffix: "+" },
      { label: "Leadership Roles", value: "ACM", suffix: " Exec" },
    ]
  },

  education: {
    degree: "B.Tech in Computer Science & Engineering",
    field: "Computer Science & Engineering",
    institution: "Shivalik College of Engineering",
    location: "Dehradun, Uttarakhand",
    period: "2024 — 2028",
    expectedGraduation: "Expected Graduation: 2028",
    highlights: [
      "Treasurer at ACM Student Chapter, driving coding contests and national tech conferences.",
      "Active participant in collegiate hackathons, collegiate research seminars, and open-source sprints.",
      "Consistent academic performance with focus on algorithms, system architecture, and database theory."
    ],
    coursework: [
      "Data Structures & Algorithms",
      "Object Oriented Programming (OOP)",
      "Database Management Systems (DBMS)",
      "Operating Systems & Computer Networks",
      "Web Technologies & Frameworks",
      "AI & Machine Learning Foundations"
    ]
  },

  skills: [
    // Frontend
    {
      name: "React.js",
      category: "Frontend",
      proficiencyTag: "Core Specialist",
      icon: "Code2",
      description: "Component architecture, hooks, state management, Vite, and R3F 3D integration.",
      color: "#61DAFB"
    },
    {
      name: "JavaScript (ES6+)",
      category: "Frontend",
      proficiencyTag: "Advanced",
      icon: "Braces",
      description: "Modern asynchronous workflows, DOM mechanics, closures, and performance tuning.",
      color: "#F7DF1E"
    },
    {
      name: "Tailwind CSS",
      category: "Frontend",
      proficiencyTag: "Advanced",
      icon: "Palette",
      description: "Utility-first design systems, custom themes, responsive layouts, and glassmorphism.",
      color: "#38BDF8"
    },
    {
      name: "HTML5",
      category: "Frontend",
      proficiencyTag: "Core",
      icon: "FileCode",
      description: "Semantic web structure, SEO fundamentals, and accessibility standards.",
      color: "#E34F26"
    },
    {
      name: "CSS3",
      category: "Frontend",
      proficiencyTag: "Core",
      icon: "Layout",
      description: "Flexbox, Grid, keyframe animations, 3D transforms, and custom design tokens.",
      color: "#1572B6"
    },

    // Backend
    {
      name: "Node.js",
      category: "Backend",
      proficiencyTag: "Advanced",
      icon: "Server",
      description: "High-throughput asynchronous servers, middleware pipelines, and event-driven architecture.",
      color: "#339933"
    },
    {
      name: "Express.js",
      category: "Backend",
      proficiencyTag: "Advanced",
      icon: "Cpu",
      description: "RESTful API design, token authentication, error interception, and rate-limiting.",
      color: "#8B5CF6"
    },
    {
      name: "Python",
      category: "Backend",
      proficiencyTag: "Proficient",
      icon: "Terminal",
      description: "Scripting, machine learning pipelines, data manipulation, and automated testing.",
      color: "#3776AB"
    },
    {
      name: "REST APIs",
      category: "Backend",
      proficiencyTag: "Core",
      icon: "Network",
      description: "Architecting clean, versioned, documented, and secure endpoints with JWT/CORS.",
      color: "#00F0FF"
    },

    // Database
    {
      name: "MongoDB",
      category: "Database",
      proficiencyTag: "Advanced",
      icon: "Database",
      description: "NoSQL schema design, indexing, Mongoose models, aggregations, and Atlas deployments.",
      color: "#47A248"
    },
    {
      name: "Firebase",
      category: "Database",
      proficiencyTag: "Proficient",
      icon: "Flame",
      description: "Firestore, real-time database listeners, cloud storage, and Firebase Auth rules.",
      color: "#FFCA28"
    },

    // Tools
    {
      name: "Git",
      category: "Tools",
      proficiencyTag: "Core",
      icon: "GitBranch",
      description: "Version control, branching strategies, rebasing, and merge conflict resolution.",
      color: "#F05032"
    },
    {
      name: "GitHub",
      category: "Tools",
      proficiencyTag: "Advanced",
      icon: "Github",
      description: "Open-source collaboration, CI/CD Actions, issues management, and project tracking.",
      color: "#E6EDF3"
    },
    {
      name: "VS Code",
      category: "Tools",
      proficiencyTag: "Power User",
      icon: "Laptop",
      description: "Integrated development workflow, custom extensions, debugging, and terminal control.",
      color: "#007ACC"
    },
    {
      name: "Figma",
      category: "Tools",
      proficiencyTag: "Proficient",
      icon: "Figma",
      description: "UI/UX wireframing, high-fidelity interactive prototyping, and design system tokens.",
      color: "#F24E1E"
    }
  ],

  projects: [
    {
      id: "skillswap",
      title: "SkillSwap",
      tagline: "Peer-to-Peer Skill Exchange Platform",
      description: "A collaborative web ecosystem where learners and creators trade skills, schedule live mentorship sessions, and exchange knowledge through an intuitive decentralized matching algorithm.",
      longDescription: "SkillSwap empowers self-driven learners to exchange technical and creative talents without monetary friction. Features include real-time match recommendations, chat synchronization, verified reviews, and a responsive glassmorphic dashboard.",
      tags: ["React.js", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Socket.io"],
      category: "Full Stack Web",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
      githubUrl: "https://github.com/amanbhardwaj-dev/SkillSwap",
      liveUrl: "https://skillswap-demo.example.com",
      highlights: [
        "Dynamic peer-matching based on complementary skill tags and availability matrices.",
        "End-to-end user authentication with JWT, role-based permissions, and profile verification.",
        "Interactive session scheduler with automated calendar reminders and review scoring."
      ],
      metrics: [
        { label: "Target Users", value: "1,000+" },
        { label: "Exchange Categories", value: "25+" },
        { label: "Latency", value: "<120ms" }
      ]
    },
    {
      id: "ai-climate-digital-twin",
      title: "AI Climate Digital Twin",
      tagline: "AI-Powered Climate & Environmental Analysis Platform",
      description: "A digital twin simulation platform utilizing predictive machine learning models to analyze climate variables, simulate regional weather shifts, and forecast environmental risks.",
      longDescription: "Designed to provide researchers and urban planners with interactive climate projections. Integrates geospatial datasets, anomaly detection algorithms, and 3D data visualization for carbon trends and temperature surges.",
      tags: ["Python", "Machine Learning", "React", "Three.js", "FastAPI", "Tailwind CSS"],
      category: "AI & Data Science",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      githubUrl: "https://github.com/amanbhardwaj-dev/AI-Climate-Digital-Twin",
      liveUrl: "https://climate-twin.example.com",
      highlights: [
        "Time-series ML models forecasting temperature and precipitation anomalies.",
        "Interactive 3D globe visualization rendering heat maps and climate sensor feeds.",
        "Automated PDF executive report generation for sustainability policy benchmarking."
      ],
      metrics: [
        { label: "Forecast Accuracy", value: "92.4%" },
        { label: "Sensor Feeds", value: "50+ Nodes" },
        { label: "Update Rate", value: "Real-time" }
      ]
    },
    {
      id: "smart-construction-monitoring",
      title: "Smart Construction Monitoring",
      tagline: "Image-Based Construction Progress Monitoring System",
      description: "Computer vision platform that analyzes drone and on-site camera imagery to verify architectural progress, detect structural anomalies, and track construction phase milestones.",
      longDescription: "Automating construction QA/QC through visual AI. Compares daily site captures with 3D CAD blueprints, calculating percentage progress across structural beams, concrete pouring, and safety compliance checks.",
      tags: ["Python", "Computer Vision", "OpenCV", "React.js", "Flask", "Tailwind CSS"],
      category: "Computer Vision & IoT",
      image: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=1200&q=80",
      githubUrl: "https://github.com/amanbhardwaj-dev/Smart-Construction-Monitoring",
      liveUrl: "https://construction-ai.example.com",
      highlights: [
        "Automated semantic segmentation identifying concrete, scaffolding, and safety gear.",
        "Timeline comparison dashboard contrasting scheduled deadlines vs. actual site images.",
        "Instant alert notifications sent to site engineers whenever deviations exceed 5%."
      ],
      metrics: [
        { label: "Inspection Time Saved", value: "65%" },
        { label: "Detection Speed", value: "30 FPS" },
        { label: "Site Coverage", value: "100%" }
      ]
    },
    {
      id: "student-career-counselor",
      title: "Student Career Counselor",
      tagline: "Intelligent Student Guidance & Career Pathway Platform",
      description: "An AI-powered guidance platform that evaluates student aptitudes, interests, and academic credentials to formulate hyper-personalized career roadmaps and skill gap milestones.",
      longDescription: "Helps high school and collegiate students navigate emerging career landscapes. Evaluates strengths across 40+ industry domains, matches students with tailored online courses, and tracks actionable career readiness scores.",
      tags: ["React.js", "Node.js", "Express", "MongoDB", "AI Recommendation", "Tailwind CSS"],
      category: "EdTech & AI",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      githubUrl: "https://github.com/amanbhardwaj-dev/Student-Career-Counselor",
      liveUrl: "https://careercounselor.example.com",
      highlights: [
        "Multimodal questionnaire assessing cognitive problem-solving and industry inclinations.",
        "Interactive roadmap visualizer generating step-by-step quarterly skill goals.",
        "Curated resume tips, internship alerts, and targeted interview preparation repositories."
      ],
      metrics: [
        { label: "Career Pathways", value: "120+" },
        { label: "Student Satisfaction", value: "98%" },
        { label: "Roadmap Milestones", value: "500+" }
      ]
    }
  ],

  experience: [
    {
      id: "acm-treasurer",
      role: "Treasurer",
      organization: "ACM Student Chapter, Shivalik College of Engineering",
      location: "Dehradun, India",
      period: "2024 — Present",
      description: "Overseeing financial planning, sponsorship acquisition, resource allocation, and logistical execution for college-wide hackathons, guest lectures, and competitive programming contests.",
      achievements: [
        "Managed budget allocations for multiple flagship technical workshops and hackathons.",
        "Coordinated with student leads and faculty advisors to host 5+ coding bootcamps and competitions.",
        "Increased chapter membership and active event participation through transparent operations."
      ],
      badge: "Leadership & Governance",
      color: "#00F0FF"
    },
    {
      id: "hackathons-lead",
      role: "Hackathon Competitor & Project Lead",
      organization: "National & University Hackathons",
      location: "India",
      period: "2024 — Present",
      description: "Leading multidisciplinary teams in intense 24 to 48-hour sprint environments, transforming ambitious problem statements into functional, production-ready prototypes.",
      achievements: [
        "Secured 2nd Position in a high-stakes 48-Hour Hackathon building full-stack AI solutions.",
        "Placed in Top 6 at Quantum University Hackathon against 150+ regional collegiate teams.",
        "Directed full-stack architecture, rapid wireframing, API deployment, and live jury pitching."
      ],
      badge: "Competitive Innovation",
      color: "#A855F7"
    },
    {
      id: "web-dev-projects",
      role: "Full Stack & Software Developer",
      organization: "Independent & Academic Projects",
      location: "Dehradun, India",
      period: "2024 — Present",
      description: "Designing end-to-end web architectures, building reusable React components, creating scalable REST backends, and experimenting with Three.js 3D web graphics.",
      achievements: [
        "Architected four flagship projects spanning EdTech, climate tech, and computer vision.",
        "Maintained high code quality standards, modular component design, and zero-downtime hosting.",
        "Contributed to developer communities, sharing open-source utilities and mentorship."
      ],
      badge: "Software Engineering",
      color: "#38BDF8"
    }
  ],

  achievements: [
    {
      id: "second-pos-48h",
      title: "Second Position – 48-Hour Hackathon",
      event: "48-Hour National Innovation Hackathon",
      institution: "Inter-Collegiate Tech League",
      date: "2024 / 2025",
      description: "Engineered and pitched an innovative full-stack software prototype under strict 48-hour time constraints, recognized for exceptional UI/UX, robust backend architecture, and real-world viability.",
      rankBadge: "Runner Up (2nd Place)",
      type: "hackathon",
      icon: "Trophy"
    },
    {
      id: "top-6-quantum",
      title: "Top 6 Finalist – Quantum University Hackathon",
      event: "Quantum University National Hackathon",
      institution: "Quantum University",
      date: "2024 / 2025",
      description: "Ranked among the Top 6 teams out of 150+ competing teams across top engineering institutes. Commended by industry judges for scalable problem solving and polished execution.",
      rankBadge: "Top 6 Finalist",
      type: "hackathon",
      icon: "Award"
    },
    {
      id: "iit-roorkee-rsd",
      title: "Research Scholar Day 2025 Participant",
      event: "Research Scholar Day 2025",
      institution: "IIT Roorkee, Saharanpur Campus",
      date: "2025",
      description: "Selected to participate and showcase technical research perspectives and technological innovations at the prestigious IIT Roorkee Saharanpur Campus research exhibition.",
      rankBadge: "Research Delegate",
      type: "research",
      icon: "Sparkles"
    },
    {
      id: "acm-leadership",
      title: "ACM Executive Board Treasurer Appointment",
      event: "Executive Committee Induction",
      institution: "ACM Student Chapter, Shivalik",
      date: "2024 — 2025",
      description: "Appointed as Chapter Treasurer in recognition of operational dependability, financial stewardship, and active dedication to fostering student developer culture.",
      rankBadge: "Executive Council",
      type: "academic",
      icon: "Medal"
    }
  ]
};
