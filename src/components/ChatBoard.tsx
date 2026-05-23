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
    <div className="flex-1 flex flex-col h-full bg-slate-900/40 relative">

      {/* Header Topic */}
      <div className="p-4 border-b border-white/5 bg-slate-950/40 flex items-center justify-between shrink-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Database className="w-4 h-4 text-slate-500" />
          <span className="text-[11px] uppercase tracking-widest text-sky-400 font-bold ml-1">
            {topic ? `Sujet : ${topic}` : 'Sélectionnez un sujet pour commencer'}
          </span>
        </div>
        <span className="text-[10px] bg-white/5 text-slate-400 px-2 py-1 rounded border border-white/10 uppercase font-mono tracking-wider">
          MESSAGES : {messages.length}
        </span>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 z-10 scroll-smooth">
        {messages.length === 0 && !isActive && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
            <Network className="w-12 h-12 mb-4 opacity-50 drop-shadow-lg" />
            <p className="text-[11px] font-mono uppercase tracking-widest">En attente d'Initialisation</p>
          </div>
        )}

        {messages.length === 0 && isActive && !typingSpeaker && (
          <div className="flex justify-center my-8">
            <div className="text-[11px] font-mono uppercase tracking-widest text-sky-400 animate-pulse">
              [ Établissement de la Connexion Neuronale... ]
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

function MessageBubble({ msg }: { msg: Message, key?: React.Key }) {
  const isAI1 = msg.speaker === "AI1";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex flex-col max-w-[85%] ${isAI1 ? 'self-start items-start' : 'self-end items-end ml-auto'}`}
    >
      <div className={`text-[10px] uppercase tracking-widest mb-1.5 px-2 font-mono flex items-center gap-2 ${isAI1 ? 'text-sky-400' : 'text-pink-400'}`}>
        <span className="font-bold">{msg.speaker}</span>
        <span className="text-slate-500 tracking-normal text-[9px]">{new Date(msg.timestamp).toLocaleTimeString([], { hour12: false })}</span>
      </div>
      
      <div 
        className={`p-5 text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap rounded-2xl border backdrop-blur-md shadow-lg ${
          isAI1 
            ? 'bg-sky-500/10 border-sky-500/20 rounded-tl-sm text-sky-50' 
            : 'bg-pink-500/10 border-pink-500/20 rounded-tr-sm text-pink-50'
        }`}
      >
        <span>{msg.text}</span>
      </div>
    </motion.div>
  );
}

function TypingIndicator({ speaker }: { speaker: Speaker, key?: React.Key }) {
  const isAI1 = speaker === "AI1";
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`flex flex-col mt-4 max-w-[85%] ${isAI1 ? 'self-start items-start' : 'self-end items-end ml-auto'}`}
    >
      <div className={`p-5 rounded-2xl border backdrop-blur-md shadow-lg flex items-center gap-3 h-[58px] ${
        isAI1 ? 'bg-sky-500/10 border-sky-500/20 rounded-tl-sm' : 'bg-pink-500/10 border-pink-500/20 rounded-tr-sm'
      }`}>
        <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2">
           <span className="hidden sm:inline">Génération</span>
           <div className="flex gap-1 ml-1">
             <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className={`w-1.5 h-1.5 rounded-full ${isAI1 ? 'bg-sky-400' : 'bg-pink-400'}`} />
             <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className={`w-1.5 h-1.5 rounded-full ${isAI1 ? 'bg-sky-400' : 'bg-pink-400'}`} />
             <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className={`w-1.5 h-1.5 rounded-full ${isAI1 ? 'bg-sky-400' : 'bg-pink-400'}`} />
           </div>
        </span>
      </div>
    </motion.div>
  );
}
