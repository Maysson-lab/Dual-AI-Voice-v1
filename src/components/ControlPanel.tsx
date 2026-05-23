import React, { useState } from "react";
import { Play, Square, Settings, Mic2, Sparkles, Brain, Radio, Zap } from "lucide-react";
import { AIMode } from "../types";

interface ControlPanelProps {
  isActive: boolean;
  onStart: (topic: string, mode: AIMode) => void;
  onStop: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export function ControlPanel({ isActive, onStart, onStop, speed, onSpeedChange }: ControlPanelProps) {
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState<AIMode>("debate");

  const handleStart = () => {
    if (topic.trim()) {
      onStart(topic.trim(), mode);
    }
  };

  const modeIcons = {
    debate: <Brain className="w-4 h-4" />,
    podcast: <Radio className="w-4 h-4" />,
    philosophy: <Sparkles className="w-4 h-4" />,
    funny_clash: <Zap className="w-4 h-4" />
  };

  const modeLabels = {
    debate: "Débat Logique",
    podcast: "Podcast Tech",
    philosophy: "Philosophie",
    funny_clash: "Clash Internet"
  };

  return (
    <div className="glass-panel p-6 flex flex-col gap-6 relative overflow-hidden bg-white/[0.02]">
      
      <div className="relative z-10">
        <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-3 block">
          Sujet de Simulation
        </label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={isActive}
          placeholder="ex. L'intelligence artificielle a-t-elle une âme ?"
          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-[14px] text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all resize-none h-24 disabled:opacity-50 shadow-inner"
        />
      </div>

      <div className="relative z-10">
        <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-3 block">
          Mode de Personnalité
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(modeLabels) as AIMode[]).map((m) => (
            <button
              key={m}
              disabled={isActive}
              onClick={() => setMode(m)}
              className={`flex items-center gap-2 p-3 rounded-xl border text-[11px] font-bold tracking-wide transition-all disabled:opacity-50 ${
                mode === m 
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-[0_0_15px_rgba(56,189,248,0.2)]' 
                  : 'bg-slate-900/40 border-slate-700/50 text-slate-400 hover:border-slate-500'
              }`}
            >
              {modeIcons[m]}
              <span className="truncate uppercase">{modeLabels[m]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 pt-4 border-t border-white/5">
        <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-4 flex justify-between">
          <span>Vitesse de Voix</span>
          <span className="text-sky-400 font-bold">VIT : {speed.toFixed(2)}x</span>
        </label>
        <input 
          type="range" 
          min="0.5" max="2" step="0.1" 
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="w-full cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none accent-sky-400"
        />
      </div>

      <div className="mt-2 relative z-10">
        {!isActive ? (
          <button
            onClick={handleStart}
            disabled={!topic.trim()}
            className="w-full bg-slate-100 text-slate-900 text-[12px] font-bold tracking-widest uppercase py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-white hover:scale-[1.02] shadow-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Play className="w-4 h-4 fill-current" />
            Lancer la Connexion
          </button>
        ) : (
          <button
            onClick={onStop}
            className="w-full bg-rose-500/10 border border-rose-500/50 text-rose-400 text-[12px] font-bold tracking-widest uppercase py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-rose-500/20 hover:scale-[1.02] shadow-lg"
          >
            <Square className="w-4 h-4 fill-current" />
            Arrêter la Connexion
          </button>
        )}
      </div>
    </div>
  );
}
