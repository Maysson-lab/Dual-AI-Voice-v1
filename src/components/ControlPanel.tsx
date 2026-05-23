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
    debate: "Logic vs Chaos",
    podcast: "Tech Podcast",
    philosophy: "Deep Thoughts",
    funny_clash: "Internet Clash"
  };

  return (
    <div className="glass-panel p-5 flex flex-col gap-4 relative overflow-hidden">
      
      <div className="relative z-10">
        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 block">
          Simulation Topic
        </label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={isActive}
          placeholder="e.g. Is artificial intelligence conscious?"
          className="w-full bg-[rgba(255,255,255,0.02)] border border-white/10 rounded-lg p-3 text-[13px] text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#00f2ff]/50 transition-all resize-none h-20 disabled:opacity-50"
        />
      </div>

      <div className="relative z-10">
        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 block">
          Persona Mode
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(modeLabels) as AIMode[]).map((m) => (
            <button
              key={m}
              disabled={isActive}
              onClick={() => setMode(m)}
              className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] font-medium transition-all disabled:opacity-50 ${
                mode === m 
                  ? 'bg-white text-black border-white' 
                  : 'bg-[rgba(255,255,255,0.05)] border-white/10 text-neutral-300 hover:border-white/30'
              }`}
            >
              {modeIcons[m]}
              <span className="truncate uppercase tracking-wide">{modeLabels[m]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 pt-2 border-t border-white/10">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mb-2 flex justify-between">
          <span>Voice Speed</span>
          <span className="text-[#00f2ff]">VTS: {speed.toFixed(2)}x</span>
        </label>
        <input 
          type="range" 
          min="0.5" max="2" step="0.1" 
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          style={{ accentColor: '#00f2ff' }}
          className="w-full cursor-pointer h-1 bg-[rgba(255,255,255,0.1)] rounded-lg appearance-none"
        />
      </div>

      <div className="mt-2 relative z-10">
        {!isActive ? (
          <button
            onClick={handleStart}
            disabled={!topic.trim()}
            className="w-full bg-white text-black text-[12px] font-bold tracking-[1px] uppercase py-3 rounded-full flex items-center justify-center gap-2 transition-all hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4 fill-current" />
            Init Stream
          </button>
        ) : (
          <button
            onClick={onStop}
            className="w-full bg-transparent border border-[#ff007f] text-[#ff007f] text-[12px] font-bold tracking-[1px] uppercase py-3 rounded-full flex items-center justify-center gap-2 transition-all hover:bg-[#ff007f]/10"
          >
            <Square className="w-4 h-4 fill-current" />
            Halt Stream
          </button>
        )}
      </div>
    </div>
  );
}
