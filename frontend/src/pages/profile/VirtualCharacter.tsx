import React, { useState } from 'react';
import { Sparkles, MessageSquare, ShieldCheck, Zap } from 'lucide-react';

interface VirtualCharacterProps {
  careerName: string;
  studentName?: string;
}

export const VirtualCharacter: React.FC<VirtualCharacterProps> = ({
  careerName = 'Manufacturing Engineer',
  studentName = 'Alex',
}) => {
  const [interactiveDialogue, setInteractiveDialogue] = useState<string | null>(null);
  const [talkCount, setTalkCount] = useState(0);

  const dialogueOptions: Record<string, string[]> = {
    'Manufacturing Engineer': [
      "All automated assembly cells are operating at peak 99.4% efficiency!",
      "I'm currently optimizing the conveyor cycle time and robotic arm calibration.",
      "Safety first! Protective helmet, hi-vis vest, and steel-toe boots locked in.",
      "Ready to deploy the new PLC logic update to the factory floor.",
    ],
    'Software Developer': [
      "Production build compiled with zero regressions! Ready for deployment.",
      "Refactoring algorithmic pipelines to reduce latency under 12ms.",
      "All automated test suites passing in the continuous integration runner.",
    ],
    'UI/UX Designer': [
      "Refining the design tokens and glassmorphic micro-interactions.",
      "User testing shows a 40% jump in mission completion velocity!",
    ],
    'Data Analyst': [
      "Query optimizations completed. Predictive maintenance models are converging.",
      "Telemetry telemetry indicates higher throughput across all manufacturing shifts.",
    ],
    'Cybersecurity Analyst': [
      "Zero-trust network protocols established. Industrial firewall fully fortified.",
      "No security anomalies detected on the operational technology network.",
    ],
  };

  const handleCharacterClick = () => {
    const list = dialogueOptions[careerName] || dialogueOptions['Manufacturing Engineer'];
    const nextIdx = (talkCount + 1) % list.length;
    setTalkCount(nextIdx);
    setInteractiveDialogue(list[nextIdx]);
    setTimeout(() => {
      setInteractiveDialogue(null);
    }, 4500);
  };

  return (
    <div className="relative flex flex-col items-center justify-end h-full z-10 pointer-events-auto">
      {/* Interactive Speech Bubble */}
      {interactiveDialogue && (
        <div className="absolute -top-12 z-20 max-w-xs animate-bounce rounded-2xl border border-cyan-400/50 bg-[#121B2D]/95 px-4 py-2.5 text-xs text-white shadow-glow-cyan backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-300 uppercase mb-0.5">
            <Sparkles className="h-3 w-3" /> {careerName} Field Log
          </div>
          <p className="leading-snug text-gray-200">{interactiveDialogue}</p>
          <div className="absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-r border-b border-cyan-400/50 bg-[#121B2D]" />
        </div>
      )}

      {/* Full-Body Vector Character Render */}
      <div
        onClick={handleCharacterClick}
        className="group relative cursor-pointer transition-transform duration-300 hover:scale-102 select-none"
        title="Click to interact with your Virtual Character"
      >
        <svg
          className="w-[280px] sm:w-[320px] md:w-[350px] lg:w-[390px] h-[480px] sm:h-[530px] md:h-[570px] lg:h-[610px] drop-shadow-2xl"
          viewBox="0 0 400 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Vest Yellow / Lime Gradient */}
            <linearGradient id="safetyYellow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>

            {/* Silver Reflective Tape */}
            <linearGradient id="reflectiveSilver" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>

            {/* Helmet Yellow */}
            <linearGradient id="helmetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="60%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#A16207" />
            </linearGradient>

            {/* Tactical Navy Clothes */}
            <linearGradient id="workShirt" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            {/* Work Trousers */}
            <linearGradient id="workPants" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>

            {/* Heavy Duty Boots */}
            <linearGradient id="bootGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#451A03" />
              <stop offset="50%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#1C1917" />
            </linearGradient>

            {/* Skin Tone Gradient */}
            <linearGradient id="skinTone" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0.9" />
            </linearGradient>

            {/* Ground Shadow Radial */}
            <radialGradient id="charShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. Realistic Floor Ground Shadow & Neon Ambient Pedestal */}
          <ellipse cx="200" cy="675" rx="140" ry="24" fill="url(#charShadow)" />
          <ellipse cx="200" cy="672" rx="90" ry="14" fill="#000000" fillOpacity="0.8" />

          {/* 2. Safety Work Boots (Left & Right) */}
          {/* Left Boot */}
          <g id="leftBoot">
            <path
              d="M142 580 L138 650 L120 660 L120 670 L174 670 L174 656 L164 580 Z"
              fill="url(#bootGrad)"
              stroke="#0F172A"
              strokeWidth="2"
            />
            {/* Steel Toe Cap & Rubber Sole Tread */}
            <rect x="118" y="662" width="58" height="8" rx="2" fill="#0F172A" />
            <path d="M120 655 Q135 645 150 655" stroke="#F59E0B" strokeWidth="2" fill="none" />
          </g>

          {/* Right Boot */}
          <g id="rightBoot">
            <path
              d="M236 580 L226 656 L226 670 L280 670 L280 660 L262 650 L258 580 Z"
              fill="url(#bootGrad)"
              stroke="#0F172A"
              strokeWidth="2"
            />
            {/* Steel Toe Cap & Rubber Sole Tread */}
            <rect x="224" y="662" width="58" height="8" rx="2" fill="#0F172A" />
            <path d="M250 655 Q265 645 280 655" stroke="#F59E0B" strokeWidth="2" fill="none" />
          </g>

          {/* 3. Utility Work Trousers (Legs) */}
          {/* Left Leg */}
          <path
            d="M152 350 L140 585 L168 585 L188 350 Z"
            fill="url(#workPants)"
            stroke="#0F172A"
            strokeWidth="2"
          />
          {/* Left Knee Reinforced Pad */}
          <rect x="138" y="440" width="30" height="42" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
          {/* Cargo Pocket */}
          <rect x="134" y="380" width="22" height="34" rx="4" fill="#1E293B" stroke="#475569" />

          {/* Right Leg */}
          <path
            d="M212 350 L232 585 L260 585 L248 350 Z"
            fill="url(#workPants)"
            stroke="#0F172A"
            strokeWidth="2"
          />
          {/* Right Knee Reinforced Pad */}
          <rect x="232" y="440" width="30" height="42" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
          {/* Cargo Pocket */}
          <rect x="244" y="380" width="22" height="34" rx="4" fill="#1E293B" stroke="#475569" />

          {/* Heavy Utility Belt & Tool Pouches */}
          <rect x="145" y="336" width="110" height="18" rx="3" fill="#0F172A" stroke="#334155" />
          <rect x="190" y="334" width="20" height="22" rx="3" fill="#D97706" stroke="#92400E" />

          {/* 4. Upper Body / Industrial Vest & Navy Shirt */}
          {/* Base Navy Tactical Work Shirt */}
          <path
            d="M130 190 L110 330 L290 330 L270 190 Z"
            fill="url(#workShirt)"
            stroke="#0F172A"
            strokeWidth="2"
          />

          {/* High-Visibility Industrial Safety Vest */}
          <path
            d="M135 185 L115 340 L285 340 L265 185 L225 185 L200 240 L175 185 Z"
            fill="url(#safetyYellow)"
            stroke="#A16207"
            strokeWidth="2"
          />

          {/* Reflective Silver Safety Bands (Horizontal & Vertical) */}
          {/* Horizontal Band Lower */}
          <rect x="120" y="300" width="160" height="16" fill="url(#reflectiveSilver)" opacity="0.95" />
          {/* Horizontal Band Upper */}
          <rect x="127" y="260" width="146" height="16" fill="url(#reflectiveSilver)" opacity="0.95" />
          {/* Vertical Chest Bands */}
          <path d="M155 185 L155 300 M245 185 L245 300" stroke="url(#reflectiveSilver)" strokeWidth="16" strokeLinecap="square" />

          {/* ID Badge / Credentials Lanyard on Chest */}
          <rect x="168" y="210" width="24" height="32" rx="3" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="1.5" />
          <rect x="171" y="214" width="18" height="6" fill="#8B5CF6" />
          <line x1="171" y1="225" x2="187" y2="225" stroke="#334155" strokeWidth="1.5" />
          <line x1="171" y1="230" x2="183" y2="230" stroke="#64748B" strokeWidth="1.5" />

          {/* 5. Arms & Hands with Protective Gloves */}
          {/* Left Arm & Tablet Holder */}
          <g id="leftArm">
            {/* Shoulder & Bicep */}
            <path d="M135 190 L95 280 L120 290 L150 205 Z" fill="url(#workShirt)" stroke="#0F172A" />
            {/* Forearm & Smart Industrial Tablet */}
            <path d="M95 280 L90 355 L115 355 L120 290 Z" fill="url(#skinTone)" />
            {/* Protective Work Glove */}
            <path d="M85 350 L75 390 L115 390 L110 350 Z" fill="#334155" stroke="#EAB308" strokeWidth="2" />
            {/* Tablet Device in Left Hand */}
            <rect x="55" y="350" width="48" height="70" rx="6" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
            <rect x="60" y="358" width="38" height="50" rx="3" fill="#1E293B" />
            <line x1="64" y1="368" x2="90" y2="368" stroke="#00F0FF" strokeWidth="2" />
            <line x1="64" y1="376" x2="84" y2="376" stroke="#8B5CF6" strokeWidth="2" />
            <circle cx="79" cy="396" r="6" fill="#10B981" />
          </g>

          {/* Right Arm in Confident Ready Stance */}
          <g id="rightArm">
            {/* Shoulder & Bicep */}
            <path d="M265 190 L305 280 L280 290 L250 205 Z" fill="url(#workShirt)" stroke="#0F172A" />
            {/* Forearm */}
            <path d="M305 280 L310 355 L285 355 L280 290 Z" fill="url(#skinTone)" />
            {/* Protective Glove */}
            <path d="M290 350 L285 390 L325 390 L315 350 Z" fill="#334155" stroke="#EAB308" strokeWidth="2" />
            {/* Tool Holster Clip (Flashlight or Laser Meter) */}
            <rect x="250" y="340" width="14" height="35" rx="3" fill="#F59E0B" stroke="#0F172A" />
          </g>

          {/* 6. Neck & Head */}
          <rect x="186" y="150" width="28" height="35" rx="4" fill="url(#skinTone)" stroke="#92400E" strokeWidth="0.5" />
          {/* Head & Facial Profile */}
          <ellipse cx="200" cy="140" rx="28" ry="34" fill="url(#skinTone)" />
          {/* Facial Features (Eyes, Eyebrows, Nose, Smile) */}
          <path d="M190 135 Q193 133 196 135" stroke="#451A03" strokeWidth="2" fill="none" />
          <path d="M204 135 Q207 133 210 135" stroke="#451A03" strokeWidth="2" fill="none" />
          <ellipse cx="193" cy="138" rx="2.5" ry="3.5" fill="#1C1917" />
          <ellipse cx="207" cy="138" rx="2.5" ry="3.5" fill="#1C1917" />
          <path d="M200 138 L199 146 L203 146" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M194 154 Q200 159 206 154" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Transparent Safety Visor / Glasses */}
          <rect x="182" y="130" width="36" height="16" rx="4" fill="#38BDF8" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="186" y1="134" x2="194" y2="134" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

          {/* 7. Protective Hard Hat / Industrial Safety Helmet */}
          <g id="safetyHelmet">
            {/* Main Dome */}
            <path
              d="M164 125 C164 78, 236 78, 236 125 C236 130, 164 130, 164 125 Z"
              fill="url(#helmetGrad)"
              stroke="#A16207"
              strokeWidth="2"
            />
            {/* Helmet Visor Brim */}
            <path
              d="M158 126 C158 122, 242 122, 242 126 L238 132 L162 132 Z"
              fill="#CA8A04"
              stroke="#713F12"
              strokeWidth="1.5"
            />
            {/* Front Headlamp / Sensor Unit */}
            <rect x="192" y="98" width="16" height="12" rx="3" fill="#1E293B" stroke="#475569" />
            <circle cx="200" cy="104" r="4" fill="#00F0FF" filter="drop-shadow(0 0 4px #00F0FF)" />
            {/* Side Ear Defenders Mounted to Helmet */}
            <ellipse cx="166" cy="132" rx="7" ry="11" fill="#1E293B" stroke="#CA8A04" />
            <ellipse cx="234" cy="132" rx="7" ry="11" fill="#1E293B" stroke="#CA8A04" />
          </g>

          {/* Subtle Cyber Rim Glow (Backlight Accent) */}
          <path
            d="M158 126 C158 75, 242 75, 242 126 L265 190 L305 280 L315 390 L260 585 L280 670"
            stroke="#8B5CF6"
            strokeWidth="3"
            opacity="0.3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Character Quick Info Pill Badge */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-purple-500/40 bg-[#101626]/90 px-3.5 py-1 text-xs font-bold text-white shadow-glow-purple backdrop-blur-md">
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
          <span>{careerName}</span>
          <span className="text-[10px] text-purple-300">• {studentName}</span>
        </div>
      </div>
    </div>
  );
};
