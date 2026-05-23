import React from "react";
import { motion } from "motion/react";
import { Cpu, Bot } from "lucide-react";
import { Speaker } from "../types";

interface AIAvatarProps {
  speaker: Speaker;
  name: string;
  isActive: boolean;
  isSpeaking: boolean;
  color: "blue" | "orange";
}

export function AIAvatar({ speaker, name, isActive, isSpeaking, color }: AIAvatarProps) {
  const isBlue = color === "blue";
  
  const ringClass = isBlue ? "avatar-ring-cyan" : "avatar-ring-pink";
  const glowTextClass = isBlue ? "text-sky-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]" : "text-pink-300 drop-shadow-[0_0_10px_rgba(244,114,182,0.5)]";
  
  const Icon = speaker === "AI1" ? Cpu : Bot;
  
  // Adjusted text and styles for improved aesthetic
  
  return (
    <div className="flex flex-col items-center justify-center relative w-full">
      <div className={`relative w-28 h-28 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ease-in-out ${isActive || isSpeaking ? 'avatar-ring ' + ringClass : 'opacity-40 blur-[1px]'}`}>
        <Icon className={`w-14 h-14 transition-all duration-300 ${isSpeaking ? 'scale-110' : ''} ${isBlue ? 'text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]' : 'text-pink-400 drop-shadow-[0_0_10px_rgba(244,114,182,0.8)]'}`} strokeWidth={1.5} />
      </div>

      <div className="flex flex-col items-center text-center">
        <h2 className={`text-sm font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${isActive || isSpeaking ? glowTextClass : 'text-slate-500'}`}>
          {name}
        </h2>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 mt-2 h-4">
          {isSpeaking ? (
            <span className={`font-bold animate-pulse ${isBlue ? 'text-sky-400' : 'text-pink-400'}`}>En diffusion</span>
          ) : isActive ? (
            <span className="text-slate-400">Analyse...</span>
          ) : (
            <span className="opacity-0">En attente</span>
          )}
        </span>
      </div>
    </div>
  );
}
