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
  const ringClass = color === "blue" ? "avatar-ring-cyan" : "avatar-ring-pink";
  const glowTextClass = color === "blue" ? "glow-cyan" : "glow-pink";
  const strokeColor = color === "blue" ? "#00f2ff" : "#ff007f";
  
  const Icon = speaker === "AI1" ? Cpu : Bot;

  return (
    <div className="flex flex-col items-center justify-center relative w-full">
      <div className={`relative w-[100px] h-[100px] rounded-full flex items-center justify-center mb-3 transition-opacity duration-300 ${isActive || isSpeaking ? 'avatar-ring ' + ringClass : 'opacity-50 blur-[0.5px]'}`}>
        <Icon className={`w-12 h-12 transition-all duration-300 ${isSpeaking ? 'scale-110 drop-shadow-[0_0_8px_currentColor]' : ''}`} color={strokeColor} strokeWidth={1.5} />
      </div>

      <div className="flex flex-col items-center text-center">
        <h2 className={`text-base font-bold uppercase tracking-wider text-white ${isActive || isSpeaking ? glowTextClass : ''}`}>
          {name}
        </h2>
        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mt-1 h-3">
          {isSpeaking ? (
            <span style={{ color: strokeColor }} className="font-bold animate-pulse">Broadcasting</span>
          ) : isActive ? (
            <span className="text-neutral-400">Processing...</span>
          ) : (
            <span className="opacity-0">Standby</span>
          )}
        </span>
      </div>
    </div>
  );
}
