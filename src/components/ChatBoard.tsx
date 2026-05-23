import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Message, Speaker, AIMode } from "../types";
import { Network, Database, Send } from "lucide-react";

interface ChatBoardProps {
  messages: Message[];
  streamingMessage: { id: string; text: string; speaker: Speaker } | null;
  typingSpeaker: Speaker | null;
  topic: string;
  mode: AIMode;
  isActive: boolean;
  onSendIntervention: (text: string) => void;
}

export function ChatBoard({ messages, streamingMessage, typingSpeaker, topic, mode, isActive, onSendIntervention }: ChatBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [interventionText, setInterventionText] = useState("");

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, typingSpeaker, streamingMessage]);

  const handleSend = () => {
    if (interventionText.trim() && isActive) {
      onSendIntervention(interventionText.trim());
      setInterventionText("");
    }
  };

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

        {messages.length === 0 && isActive && !typingSpeaker && !streamingMessage && (
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
          
          {streamingMessage && (
            <MessageBubble key={streamingMessage.id} msg={{...streamingMessage, timestamp: Date.now()}} isStreaming />
          )}

          {typingSpeaker && !streamingMessage && (
            <TypingIndicator speaker={typingSpeaker} />
          )}
        </AnimatePresence>
      </div>

      {isActive && (
        <div className="p-4 border-t border-white/5 bg-slate-950/60 backdrop-blur-md flex gap-2">
          <input 
            type="text" 
            value={interventionText}
            onChange={(e) => setInterventionText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Intervenir dans la conversation..." 
            className="flex-1 bg-slate-800/80 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!interventionText.trim()}
            className="bg-sky-500/20 text-sky-400 px-4 rounded-xl border border-sky-500/30 hover:bg-sky-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function MessageBubble({ msg, isStreaming = false }: { msg: Message, key?: React.Key, isStreaming?: boolean }) {
  const isAI1 = msg.speaker === "AI1";
  const isUser = msg.speaker === "USER";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex flex-col max-w-[85%] ${
        isUser ? 'self-center items-center w-full my-4' : 
        isAI1 ? 'self-start items-start' : 'self-end items-end ml-auto'
      }`}
    >
      {!isUser && (
        <div className={`text-[10px] uppercase tracking-widest mb-1.5 px-2 font-mono flex items-center gap-2 ${isAI1 ? 'text-sky-400' : 'text-pink-400'}`}>
          <span className="font-bold">{msg.speaker} {isStreaming && <span className="animate-pulse opacity-70">...</span>}</span>
          <span className="text-slate-500 tracking-normal text-[9px]">{new Date(msg.timestamp).toLocaleTimeString([], { hour12: false })}</span>
        </div>
      )}
      
      <div 
        className={`p-5 text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap rounded-2xl border backdrop-blur-md shadow-lg ${
          isUser
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100 rounded-2xl max-w-lg text-center shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
            : isAI1 
              ? 'bg-sky-500/10 border-sky-500/20 rounded-tl-sm text-sky-50' 
              : 'bg-pink-500/10 border-pink-500/20 rounded-tr-sm text-pink-50'
        }`}
      >
        {isUser && <span className="block text-[10px] font-mono text-emerald-400/70 mb-2 uppercase tracking-widest">Intervention Utilisateur</span>}
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
