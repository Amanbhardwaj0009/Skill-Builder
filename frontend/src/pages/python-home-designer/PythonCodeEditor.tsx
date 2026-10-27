import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import {
  Play,
  RotateCcw,
  Terminal,
  Code2,
  FileCode,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface PythonCodeEditorProps {
  code: string;
  onChangeCode: (newCode: string) => void;
  onRunCode: () => void;
  onResetCode: () => void;
  isRunning: boolean;
  output: string[];
  errors: string[];
  warnings: string[];
  executionTimeMs?: number;
}

export const STARTER_TEMPLATES: Record<string, { label: string; code: string }> = {
  starter: {
    label: 'Mission 01 Starter (3 Rooms)',
    code: `# SkillQuest Python Home Designer
from skillquest_house import House

# 1. Initialize home boundaries (width=12m, depth=10m)
home = House(width=12, depth=10, floors=1)

# 2. Add individual rooms (name, x, z, width, depth)
home.add_room("living_room", x=0, z=0, width=6, depth=5)
home.add_room("kitchen", x=6, z=0, width=5, depth=5)
home.add_room("bedroom", x=0, z=5, width=5, depth=4.5)

# 3. Add doorways and windows
home.add_door("living_room", wall="south", width=1.0)
home.add_window("living_room", wall="south", width=1.5)
home.add_window("bedroom", wall="west", width=1.5)

# 4. Configure interior aesthetics
home.set_wall_color("living_room", "#E8DCC8")
home.set_floor_material("living_room", "oak")
home.set_floor_material("kitchen", "tile")
home.set_floor_material("bedroom", "carpet")

# 5. Place starter furniture
home.add_furniture("sofa", "living_room", x=2.5, z=2.5)
home.add_furniture("table", "living_room", x=2.5, z=1.2)
home.add_furniture("bed", "bedroom", x=2.2, z=2.0)
home.add_furniture("kitchen_counter", "kitchen", x=2.5, z=0.8)

print("Home layout generated successfully!")
`,
  },
  modern_loop: {
    label: 'Loop-Generated Floor Plan (4 Rooms)',
    code: `# Algorithmic Room Generation via Python Loops
from skillquest_house import House

home = House(width=14, depth=12)

# Define room specs: (name, x, z, width, depth, material)
room_specs = [
    ("grand_living", 0, 0, 7, 6, "oak"),
    ("gourmet_kitchen", 7, 0, 6, 6, "marble"),
    ("master_suite", 0, 6, 6, 5, "carpet"),
    ("study_lab", 7, 6, 6, 5, "concrete")
]

for name, rx, rz, rw, rd, mat in room_specs:
    home.add_room(name, x=rx, z=rz, width=rw, depth=rd)
    home.set_floor_material(name, mat)
    print(f"Constructed {name}: area = {rw * rd}m²")

home.add_door("grand_living", wall="south")
home.add_window("grand_living", wall="west")
home.add_window("master_suite", wall="south")
home.add_furniture("sofa", "grand_living", x=3.0, z=3.0)
`,
  },
};

export const PythonCodeEditor: React.FC<PythonCodeEditorProps> = ({
  code,
  onChangeCode,
  onRunCode,
  onResetCode,
  isRunning,
  output,
  errors,
  warnings,
  executionTimeMs,
}) => {
  const [consoleOpen, setConsoleOpen] = useState(true);

  return (
    <div className="flex flex-col h-[540px] md:h-[620px] w-full md:w-96 rounded-3xl border border-purple-500/25 bg-[#0C1222]/90 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Top Controls Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-800 p-3 bg-[#090D1A]">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Code2 className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold text-white">designer.py</span>
        </div>

        {/* Templates Selector */}
        <div className="flex items-center gap-1.5">
          <select
            onChange={(e) => {
              const tmpl = STARTER_TEMPLATES[e.target.value];
              if (tmpl) onChangeCode(tmpl.code);
            }}
            className="rounded-lg border border-gray-800 bg-[#121B2D] px-2 py-1 text-[10px] font-semibold text-gray-300 focus:outline-none"
          >
            {Object.entries(STARTER_TEMPLATES).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>

          <button
            onClick={onResetCode}
            className="rounded-lg border border-gray-800 bg-[#121B2D] p-1.5 text-gray-400 hover:text-white transition"
            title="Reset to Starter Code"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Monaco Code Editor */}
      <div className="flex-1 relative overflow-hidden">
        <Editor
          height="100%"
          language="python"
          theme="vs-dark"
          value={code}
          onChange={(val) => onChangeCode(val || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 12.5,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            padding: { top: 8, bottom: 8 },
          }}
        />
      </div>

      {/* Action Execution Button Bar */}
      <div className="border-t border-gray-800 p-2.5 bg-[#090D1A] flex items-center justify-between gap-2">
        <button
          onClick={onRunCode}
          disabled={isRunning}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition shadow-lg ${
            isRunning
              ? 'bg-purple-800 text-purple-300 cursor-wait'
              : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-glow-purple/30 hover:brightness-110 active:scale-[0.98]'
          }`}
        >
          <Play className={`h-4 w-4 ${isRunning ? 'animate-spin' : 'fill-white'}`} />
          <span>{isRunning ? 'Executing Python...' : 'Run Python Code'}</span>
        </button>

        <button
          onClick={() => setConsoleOpen(!consoleOpen)}
          className={`rounded-xl border p-2.5 text-xs font-bold transition flex items-center gap-1.5 ${
            errors.length > 0
              ? 'border-rose-500/50 bg-rose-500/10 text-rose-300'
              : 'border-gray-800 bg-[#121B2D] text-gray-400 hover:text-white'
          }`}
          title="Toggle Terminal Output"
        >
          <Terminal className="h-4 w-4" />
          {consoleOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
        </button>
      </div>

      {/* Terminal Output Console Drawer */}
      {consoleOpen && (
        <div className="h-32 border-t border-gray-800 bg-[#070A14] p-3 overflow-y-auto font-mono text-[11px] space-y-1.5 select-text">
          <div className="flex items-center justify-between text-[10px] text-gray-500 pb-1 border-b border-gray-900">
            <span>Terminal Output</span>
            {executionTimeMs !== undefined && (
              <span className="text-cyan-400 font-bold">{executionTimeMs}ms execution</span>
            )}
          </div>

          {errors.length === 0 && warnings.length === 0 && output.length === 0 && (
            <p className="text-gray-600 italic">Click 'Run Python Code' to compile and simulate.</p>
          )}

          {output.map((line, idx) => (
            <p key={idx} className="text-gray-300">
              <span className="text-purple-400">&gt;</span> {line}
            </p>
          ))}

          {warnings.map((warn, idx) => (
            <p key={idx} className="text-amber-400 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 shrink-0" />
              <span>Warning: {warn}</span>
            </p>
          ))}

          {errors.map((err, idx) => (
            <p key={idx} className="text-rose-400 flex items-center gap-1">
              <span className="font-bold">Error:</span> {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
