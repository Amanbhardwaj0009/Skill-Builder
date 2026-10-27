# SkillQuest AI

> **Tagline:** Learn by Playing. Build by Doing.

**SkillQuest AI** is a production-grade, full-stack AI-powered gamified learning platform that transforms computer science education into an immersive RPG quest experience. Learners complete structured missions, solve coding challenges in a sandboxed Monaco Arena, interact with an AI Mentor in Hindi and English, earn XP, climb global leaderboards, assemble collaborative squads, and ship real-world portfolio projects.

---

## 🎮 Key Features

1. **Futuristic RPG Aesthetic:** Cyberpunk dark-mode interface (`#080B14`, `#101626`, `#121B2D`) with electric purple and neon cyan glowing accents, glassmorphic panels, and animated feedback.
2. **Quest Explorer & Modular Learning System:**
   - 6 foundational tracks: HTML Explorer, CSS Architect, JavaScript Adventurer, Python Problem Solver, DSA Dungeon, and AI Explorer.
   - Stage-by-stage progression: Concepts ➔ Code specimens ➔ Knowledge check quizzes ➔ Interactive coding challenges ➔ Completion victory.
3. **Conversational AI Learning Mentor (`/mentor`):**
   - Natural language guidance with bilingual support: **English**, **Hindi (हिंदी)**, and Hinglish.
   - Graduated step-by-step hints without revealing answers upfront.
   - Intelligent offline fallback rule engine when external API keys are omitted.
4. **Interactive Coding Arena (`/coding-arena`):**
   - Monaco Editor with syntax highlighting.
   - Real-time test-bench evaluation for JavaScript and Python.
   - Live interactive DOM preview for HTML and CSS.
   - Anti-cheat design: private hidden test cases evaluated exclusively on the server.
5. **Gamification & Anti-Abuse Engine:**
   - Idempotent XP transactions prevent reward exploitation.
   - Automated RPG leveling formula: $\text{Level} = \lfloor\sqrt{\text{XP} / 100}\rfloor + 1$.
   - Daily streak tracking with timezone-safe calculations.
   - Dynamic achievements engine awarding unlockable badges and bounty XP.
6. **Collaborative Learning Squads (`/team-challenges`):**
   - Squad creation with unique shareable invitation codes (e.g., `SQUAD-7788`).
   - Shared challenge objectives checklist and squad score leaderboard.
7. **Interactive RPG Skill Tree (`/skill-tree`):**
   - Game-style node map with prerequisite locking and direct quest unlocking.
8. **Project Builder & Student Portfolio (`/projects`, `/portfolio`):**
   - Capstone project checklists, GitHub repository linking, and verified skill badges backed by completed quests.
9. **Global Leaderboard (`/leaderboard`):**
   - Weekly velocity, monthly trial, and all-time rankings highlighting the authenticated student's rank.
10. **Administrative Command Center (`/admin`):**
    - Platform analytics, telemetry, user governance, and role promotion.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Monaco Editor (`@monaco-editor/react`), Lucide React, Recharts, Framer Motion, Canvas Confetti |
| **Backend** | Node.js, Express.js, TypeScript, REST API, Zod, JWT (`jsonwebtoken`), Bcrypt.js, Helmet, Morgan, Express Rate Limit |
| **Database** | MongoDB, Mongoose ODM (supports both local/remote MongoDB Atlas and automatic zero-config fallback) |
| **Code Runner** | Sandboxed execution engine with strict timeout (2.5s) and memory constraints |
| **AI Integration** | Configurable LLM API (Google Gemini / OpenAI compatible) with local contextual AI mentor fallback |

---

## 🚀 Quickstart & Installation

### Prerequisites
- Node.js (v18+ or v20+)
- npm or pnpm

### 1. Repository Setup & Dependencies

```powershell
# Clone the repository and navigate into it
cd SkillQuest-AI

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

Create `.env` in both `backend` and `frontend`:

#### `backend/.env`
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=
JWT_SECRET=super_secret_skillquest_jwt_key_2026_dev_mode
FRONTEND_ORIGIN=http://localhost:5173
LLM_PROVIDER=gemini
LLM_API_KEY=
LLM_MODEL=gemini-1.5-flash
CODE_EXEC_TIMEOUT_MS=3000
```
> *Note: If `MONGODB_URI` is left blank, the backend automatically uses the embedded MongoDB server, requiring zero external database configuration.*

#### `frontend/.env`
```env
VITE_API_BASE_URL=/api
```

### 3. Seed Database
The backend seeds initial quests, challenges, achievements, and demo accounts upon first start, or manually via:
```powershell
cd backend
npm run seed
```

**Default Demo Credentials:**
- **Student Account:** `student@skillquest.ai` / `StudentPass123!`
- **Admin Account:** `admin@skillquest.ai` / `AdminPass123!`
*(Quick 1-click login buttons are also provided on the sign-in screen)*

### 4. Running the Application

In terminal 1 (Backend):
```powershell
cd backend
npm run dev
```

In terminal 2 (Frontend):
```powershell
cd frontend
npm run dev
```

Open your browser to: **`http://localhost:5173`**

---

## 🧪 Testing

Execute automated integration tests verifying authentication, quest progression, sandboxed code execution, AI endpoints, and security authorization:

```powershell
cd backend
npm test
```

Build production bundles:
```powershell
cd frontend
npm run build
```

---

## 🛡️ Security & Anti-Abuse
- **Idempotency Keys:** Every XP grant writes to an `XPTransaction` collection with a unique key preventing double-awarding.
- **Hidden Test Cases:** Private test inputs and expected values are never exposed to the client until validated on the server.
- **Isolated VM:** User-submitted code executes in an isolated environment without access to the host's filesystem, network, or server process.
- **Admin Authorization:** All administrative endpoints are guarded by strict JWT and role-verification middleware.
