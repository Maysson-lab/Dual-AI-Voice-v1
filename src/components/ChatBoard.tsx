import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Message, Speaker, AIMode } from "../types";
import { Network, Database } from "lucide-react";

interface ChatBoardProps {
  messages: Message[];
  typingSpeaker: Speaker | null;
  topic: string;
  mode: AIMode;
  isActive: boolean;
}

export function ChatBoard({ messages, typingSpeaker, topic, mode, isActive }: ChatBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, typingSpeaker]);

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent relative">

      {/* Header Topic */}
      <div className="p-3 border-b border-white/5 bg-transparent flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-neutral-500" />
          <span className="text-[11px] uppercase tracking-widest text-[#00f2ff] font-medium text-center">
            {topic ? `Topic: ${topic}` : 'Select a topic to begin'}
          </span>
        </div>
        <span className="text-[10px] bg-white/5 text-neutral-400 px-2 py-0.5 rounded border border-white/10 uppercase font-mono">
          T:{messages.length}
        </span>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 z-10 scroll-smooth">
        {messages.length === 0 && !isActive && (
          <div className="h-full flex flex-col items-center justify-center text-neutral-500 opacity-50">
            <Network className="w-10 h-10 mb-4 opacity-50" />
            <p className="text-[11px] uppercase tracking-widest">Systems Ready for Input</p>
          </div>
        )}

        {messages.length === 0 && isActive && !typingSpeaker && (
          <div className="flex justify-center my-8">
            <div className="text-[11px] uppercase tracking-widest text-[#00f2ff] animate-pulse">
              [ Establishing Connection... ]
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          {typingSpeaker && (
            <TypingIndicator speaker={typingSpeaker} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isAI1 = msg.speaker === "AI1";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex flex-col max-w-[85%] ${isAI1 ? 'self-start items-start' : 'self-end items-end ml-auto'}`}
    >
      <div className={`text-[10px] uppercase tracking-widest mb-1.5 px-1 font-mono flex items-center gap-2 ${isAI1 ? 'text-[#00f2ff]' : 'text-[#ff007f]'}`}>
        <span className="font-bold">{msg.speaker}</span>
        <span className="text-neutral-500 tracking-normal text-[9px]">{new Date(msg.timestamp).toLocaleTimeString([], { hour12: false })}</span>
      </div>
      
      <div 
        className={`p-4 text-sm leading-relaxed whitespace-pre-wrap rounded-2xl border ${
          isAI1 
            ? 'bg-[#00f2ff]/5 border-[#00f2ff]/20 border-l-[4px] border-l-[#00f2ff] rounded-tl-sm' 
            : 'bg-[#ff007f]/5 border-[#ff007f]/20 border-r-[4px] border-r-[#ff007f] rounded-tr-sm'
        }`}
      >
        <span className="text-neutral-200">{msg.text}</span>
      </div>
    </motion.div>
  );
}

function TypingIndicator({ speaker }: { speaker: Speaker }) {
  const isAI1 = speaker === "AI1";
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`flex flex-col mt-4 max-w-[85%] ${isAI1 ? 'self-start items-start' : 'self-end items-end ml-auto'}`}
    >
      <div className={`p-4 rounded-2xl border flex items-center gap-2 h-[52px] ${
        isAI1 ? 'bg-[#00f2ff]/5 border-[#00f2ff]/20 border-l-[4px] border-l-[#00f2ff] rounded-tl-sm' : 'bg-[#ff007f]/5 border-[#ff007f]/20 border-r-[4px] border-r-[#ff007f] rounded-tr-sm'
      }`}>
        <span className="text-xs uppercase tracking-widest text-neutral-400 mr-2 flex items-center gap-2">
           <span className="hidden sm:inline">Generating</span>
           <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className={`w-[4px] h-[4px] rounded-full ${isAI1 ? 'bg-[#00f2ff]' : 'bg-[#ff007f]'}`} />
           <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className={`w-[4px] h-[4px] rounded-full ${isAI1 ? 'bg-[#00f2ff]' : 'bg-[#ff007f]'}`} />
           <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className={`w-[4px] h-[4px] rounded-full ${isAI1 ? 'bg-[#00f2ff]' : 'bg-[#ff007f]'}`} />
        </span>
      </div>
    </motion.div>
  );
}
