# Aman Bhardwaj – Premium 3D Interactive Developer Portfolio

An award-winning Awwwards-caliber 3D interactive developer portfolio designed and engineered for **Aman Bhardwaj**.

Built with **Three.js**, **React Three Fiber (R3F)**, **@react-three/drei**, **Tailwind CSS**, and **Framer Motion**.

---

## 🚀 Quick Start

### 1. Run Local Development Server
```bash
npm run dev
# or
npm run dev:portfolio
```
Then open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Build for Production
```bash
npm run build
# or
npm run build:portfolio
```
Production assets will be output to `frontend/dist/`.

---

## 🎨 Architecture & File Structure

```
frontend/src/portfolio/
├── AmanPortfolio.tsx               # Master Portfolio Layout & Scroll Spy
├── data/
│   └── portfolioData.ts           # Centralized data: all text, projects, skills & links
├── utils/
│   └── soundEffects.ts            # Futuristic Web Audio API synthesizer
├── components/
│   ├── 3d/
│   │   ├── HeroCanvas3D.tsx       # 3D Floating Laptop with live Matrix screen & shapes
│   │   └── FloatingContactCanvas3D.tsx # 3D Hologram Transmission Beacon
│   ├── layout/
│   │   ├── Navbar.tsx             # Floating glass dock with audio toggle & mobile drawer
│   │   └── Footer.tsx             # Cyber footer with back-to-top & sitemap
│   ├── sections/
│   │   ├── HeroSection.tsx        # Immersive hero with 3D canvas, CTAs & social links
│   │   ├── AboutSection.tsx       # 3D Tilt profile card, config terminal & stats
│   │   ├── SkillsSection.tsx      # Category-filtered 3D skill cards with editable badges
│   │   ├── ProjectsSection.tsx    # 2x2 Flagship project showcase with 3D tilt
│   │   ├── ExperienceSection.tsx  # Glowing timeline (ACM Treasurer, Hackathons)
│   │   ├── AchievementsSection.tsx# Trophy gallery with Certificate modal & confetti
│   │   ├── EducationSection.tsx   # B.Tech CSE at Shivalik College of Engineering
│   │   └── ContactSection.tsx     # Working contact form & 1-click email copy
│   └── ui/
│       ├── CustomCursor.tsx       # Sleek magnetic laser cursor (desktop)
│       ├── LoadingScreen.tsx      # Futuristic boot sequence loader
│       ├── TiltCard3D.tsx         # 3D mouse parallax tilt wrapper with glare
│       ├── ProjectModal.tsx       # Deep-dive project modal with architecture details
│       └── ResumeModal.tsx        # Formatted interactive resume viewer & printable view
```

---

## ✏️ How to Customize Personal Details

All information, social links, resume URL, projects, and skills are organized in a single file:
👉 `frontend/src/portfolio/data/portfolioData.ts`

- **Update Social Links & Email:** Modify `portfolioData.personal.socials`
- **Update Skills or Proficiency:** Modify `portfolioData.skills`
- **Update Projects & Links:** Modify `portfolioData.projects`
- **Update Hackathons & Honors:** Modify `portfolioData.achievements`
- **Update Leadership & Experience:** Modify `portfolioData.experience`

---

## 🌟 Key Features

1. **Interactive 3D Floating Laptop (Hero):**
   - Procedurally generated animated canvas screen displaying dynamic terminal code.
   - Orbiting cyber rings, floating dodecahedron, wireframe gems, and twinkling particle dust.
   - Responds smoothly to cursor parallax movement.

2. **3D Hologram Beacon (Contact):**
   - Gyroscopic energy rings and orbiting data nodes in Three.js.

3. **3D Tilt Micro-Interactions:**
   - Every card tilts dynamically based on mouse position with light glare reflection.

4. **Futuristic Audio Experience:**
   - Subtle Web Audio API sound effects on hover, click, and success actions (with navbar mute toggle).

5. **Confetti Celebrations:**
   - Confetti bursts when launching project demos or opening achievement certificates.

6. **Fully Responsive:**
   - Tested across mobile, tablet, laptop, and ultra-wide displays.
