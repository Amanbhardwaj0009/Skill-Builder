import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { MISSIONS_DATA } from './missionsData';
import {
  Play,
  RotateCcw,
  Terminal,
  Code2,
  Sparkles,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileCode,
  Lightbulb,
  PlusCircle,
  HelpCircle,
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
  currentMissionId?: number;
}

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
  currentMissionId = 1,
}) => {
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [errorExplanation, setErrorExplanation] = useState<string | null>(null);

  const handleInsertSnippet = (snippet: string) => {
    onChangeCode(code + '\n' + snippet);
  };

  const handleExplainError = () => {
    if (errors.length === 0) return;
    const firstErr = errors[0];
    if (firstErr.includes('boundary') || firstErr.includes('extends beyond')) {
      setErrorExplanation(
        'Boundary Error: Your room coordinates (x, z) plus its width or depth exceed the lot dimensions (House width, depth). Either enlarge House(width, depth) or reduce room dimensions/positions.'
      );
    } else if (firstErr.includes('non-existent room')) {
      setErrorExplanation(
        'Invalid Room Reference: The door or window refers to a room name that has not been created with add_room() yet. Check spelling of room names.'
      );
    } else if (firstErr.includes('Syntax') || firstErr.includes('Exception')) {
      setErrorExplanation(
        'Python Syntax Error: Check for unclosed quotation marks, missing commas between arguments, or misspelled function names (e.g. add_room, add_door, add_window).'
      );
    } else {
      setErrorExplanation(
        `Design issue: ${firstErr}. Check the mission requirements and hint tabs on the right panel.`
      );
    }
  };

  return (
    <div className="flex flex-col h-[540px] md:h-[620px] w-full md:w-96 rounded-3xl border border-purple-500/25 bg-[#0C1222]/90 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Top Controls Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-800 p-2.5 bg-[#090D1A]">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Code2 className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold text-white">designer.py</span>
        </div>

        {/* Templates & Quick Actions */}
        <div className="flex items-center gap-1.5">
          <select
            onChange={(e) => {
              const missionId = Number(e.target.value);
              const targetMission = MISSIONS_DATA.find((m) => m.id === missionId);
              if (targetMission) onChangeCode(targetMission.starterCode);
            }}
            value={currentMissionId}
            className="rounded-lg border border-gray-800 bg-[#121B2D] px-2 py-1 text-[10px] font-semibold text-gray-300 focus:outline-none"
            title="Load starter code for mission"
          >
            {MISSIONS_DATA.map((m) => (
              <option key={m.id} value={m.id}>
                Mission {m.id} Template
              </option>
            ))}
          </select>

          {/* Quick Code Snippet Inserter */}
          <select
            onChange={(e) => {
              if (e.target.value) {
                handleInsertSnippet(e.target.value);
                e.target.value = '';
              }
            }}
            defaultValue=""
            className="rounded-lg border border-gray-800 bg-[#121B2D] px-2 py-1 text-[10px] font-semibold text-cyan-300 focus:outline-none"
            title="Quick insert Python snippet"
          >
            <option value="" disabled>
              + Snippet
            </option>
            <option value='home.add_door("living_room", wall="south", position=2.0, width=1.0)'>
              Door (+Door)
            </option>
            <option value='home.add_window("living_room", wall="north", position=1.5, width=1.5)'>
              Window (+Window)
            </option>
            <option value='home.add_furniture("sofa", "living_room", x=2.5, z=2.5)'>
              Furniture (+Sofa)
            </option>
            <option value='home.enable_solar_power(True)'>Eco (+Solar)</option>
            <option value='home.set_smart_lighting("living_room", True)'>IoT (+Smart Light)</option>
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
          onChange={(val) => {
            onChangeCode(val || '');
            if (errorExplanation) setErrorExplanation(null);
          }}
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

        {errors.length > 0 && (
          <button
            onClick={handleExplainError}
            className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-2.5 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition flex items-center gap-1"
            title="Explain Error"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Explain</span>
          </button>
        )}

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
        <div className="h-32 border-t border-gray-800 bg-[#070A14] p-3 overflow-y-auto font-mono text-[11px] space-y-1.5 select-text custom-scrollbar">
          <div className="flex items-center justify-between text-[10px] text-gray-500 pb-1 border-b border-gray-900">
            <span>Interactive Terminal</span>
            {executionTimeMs !== undefined && (
              <span className="text-cyan-400 font-bold">{executionTimeMs}ms execution</span>
            )}
          </div>

          {errorExplanation && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-[11px] text-amber-200 font-sans">
              <strong>Mentor Explanation:</strong> {errorExplanation}
            </div>
          )}

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
