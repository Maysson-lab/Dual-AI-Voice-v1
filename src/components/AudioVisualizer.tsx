import React from "react";
import { motion } from "motion/react";
import { Speaker } from "../types";

export function AudioVisualizer({ isSpeaking, activeSpeaker }: { isSpeaking: boolean, activeSpeaker: Speaker | null }) {
  const bars = Array.from({ length: 5 });

  const getBarColor = () => {
    if (!isSpeaking) return "bg-white/10";
    return activeSpeaker === "AI1" ? "bg-[#00f2ff] shadow-[0_0_10px_rgba(0,242,255,0.8)]" : "bg-[#ff007f] shadow-[0_0_10px_rgba(255,0,127,0.8)]";
  };

  return (
    <div className="flex items-end justify-center gap-[3px] h-10 mt-2">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          initial={{ height: "20%" }}
          animate={{ 
            height: isSpeaking ? [`20%`, `${Math.random() * 60 + 40}%`, `${Math.random() * 40 + 20}%`, `20%`] : "20%"
          }}
          transition={{ 
            height: {
              repeat: isSpeaking ? Infinity : 0,
              duration: isSpeaking ? 0.4 + Math.random() * 0.4 : 0.4,
              ease: "easeInOut",
              delay: Math.random() * 0.2
            }
          }}
          className={`w-[4px] rounded-full ${getBarColor()} transition-colors duration-300`}
        />
      ))}
    </div>
  );
}
