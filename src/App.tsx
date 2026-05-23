import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX, Settings, Play, Square, Download, Activity, Mic } from "lucide-react";
import { useSocket } from "./hooks/useSocket";
import { useSpeech } from "./hooks/useSpeech";
import { AIMode, Message, Speaker } from "./types";
import { AIAvatar } from "./components/AIAvatar";
import { ChatBoard } from "./components/ChatBoard";
import { AudioVisualizer } from "./components/AudioVisualizer";
import { ControlPanel } from "./components/ControlPanel";

export default function App() {
  const {
    messages,
    streamingMessage,
    isActive,
    typingSpeaker,
    currentTopic,
    currentMode,
    startConversation,
    stopConversation,
    sendIntervention,
    currentSpokenMessage,
    onMessageSpoken
  } = useSocket();

  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1.1);
  
  const { isSpeaking } = useSpeech(currentSpokenMessage, onMessageSpoken, isMuted, speed);

  const handleExport = () => {
    let txt = `Sujet: ${currentTopic} | Mode: ${currentMode}\n\n`;
    messages.forEach(m => {
      txt += `[${m.speaker}] ${new Date(m.timestamp).toLocaleTimeString()}: ${m.text}\n`;
    });
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "DualAIVoice_Transcript_FR.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeSpeaker = currentSpokenMessage ? currentSpokenMessage.speaker : null;

  return (
    <div className="min-h-screen font-sans selection:bg-sky-500/30 overflow-hidden flex flex-col relative bg-slate-950 text-slate-200">
      
      {/* Top Navigation / Header */}
      <header className="flex-none h-[68px] px-6 flex items-center justify-between glass-panel rounded-none border-t-0 border-x-0 border-b border-white/5 z-10 shadow-sm shadow-black/50">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              {isActive && <span className="absolute w-3 h-3 bg-sky-400 rounded-full blur-[6px] animate-pulse"></span>}
              <span className={`relative w-2.5 h-2.5 rounded-full shadow-sm transition-colors duration-500 ${isActive ? 'bg-sky-400 shadow-sky-400' : 'bg-slate-700 shadow-transparent'}`}></span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-baseline gap-2 font-display">
                Voix Dual IA <span className="text-xs font-mono font-medium text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-full border border-white/5">CŒUR</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-xs font-medium tracking-wide">
            <div className="hidden md:flex items-center gap-2">
              <span className="text-slate-500 font-mono text-[10px] uppercase">Mode Actuel :</span>
              <span className="text-sky-300 font-mono tracking-widest uppercase bg-sky-900/20 px-2 py-1 rounded border border-sky-500/20">{currentMode.replace('_', ' ')}</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-full hover:bg-white/5 transition-colors text-slate-400 hover:text-white flex items-center justify-center"
                title={isMuted ? "Activer le son" : "Couper le son"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={handleExport}
                disabled={messages.length === 0}
                className="hover:bg-white/10 transition-colors text-slate-300 hover:text-white flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
                title="Exporter la transcription"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px] font-bold tracking-wider pt-0.5">EXPORTER</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row min-h-0 relative z-10 w-full max-w-7xl mx-auto p-4 md:p-6 gap-6">
        
        {/* Left Area: Setup & Avatars */}
        <div className="w-full md:w-[320px] flex flex-col gap-6 shrink-0 h-full drop-shadow-xl">
          <ControlPanel 
            isActive={isActive} 
            onStart={startConversation} 
            onStop={stopConversation}
            speed={speed}
            onSpeedChange={setSpeed}
          />
          
          <div className="glass-panel p-6 flex flex-col gap-4 relative overflow-hidden flex-1 justify-center border-t-2 border-t-sky-500/30">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Activity className="w-24 h-24" />
            </div>
            <div className="text-[10px] font-mono tracking-widest text-sky-400 self-start mb-2 uppercase">Système IA-1 / Logique</div>
            <AIAvatar 
              speaker="AI1" 
              name={currentMode === 'debate' ? 'UNITÉ ANALYTIQUE' : currentMode === 'podcast' ? 'MODULE HÔTE' : currentMode === 'philosophy' ? 'LOGOS' : 'CŒUR ÉMOTIONNEL'}
              isActive={isActive && typingSpeaker === "AI1"} 
              isSpeaking={isActive && isSpeaking && activeSpeaker === "AI1"} 
              color="blue"
            />
            <div className="text-xs text-center text-slate-400 italic mt-2 font-light">"Convergence probabiliste en cours..."</div>
            
            <AudioVisualizer isSpeaking={isSpeaking && activeSpeaker === "AI1"} activeSpeaker="AI1" />

            <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-auto pt-4 border-t border-white/5">
              <span>Précision</span>
              <span className="text-sky-400">99.9%</span>
            </div>
          </div>
        </div>

        {/* Middle Area: Chat Board */}
        <div className="flex-1 flex flex-col min-h-0 glass-panel overflow-hidden drop-shadow-2xl">
          <ChatBoard 
             messages={messages}
             streamingMessage={streamingMessage}
             typingSpeaker={typingSpeaker} 
             topic={currentTopic}
             mode={currentMode}
             isActive={isActive}
             onSendIntervention={sendIntervention}
          />
        </div>

        {/* Right Area: AI2 Avatar */}
        <div className="w-full md:w-[280px] flex flex-col gap-6 shrink-0 h-full drop-shadow-xl">
          <div className="glass-panel p-6 flex flex-col gap-4 relative overflow-hidden flex-1 justify-center border-t-2 border-t-pink-500/30">
             <div className="absolute bottom-0 left-0 p-4 opacity-5 pointer-events-none">
              <Activity className="w-24 h-24" />
            </div>
            <div className="text-[10px] font-mono tracking-widest text-pink-400 self-end mb-2 uppercase">Système IA-2 / Créatif</div>
            <AIAvatar 
              speaker="AI2" 
              name={currentMode === 'debate' ? 'UNITÉ SATIRIQUE' : currentMode === 'podcast' ? 'INVITÉ' : currentMode === 'philosophy' ? 'CHAOS' : 'PROTOCOLE DIVERGENT'}
              isActive={isActive && typingSpeaker === "AI2"} 
              isSpeaking={isActive && isSpeaking && activeSpeaker === "AI2"} 
              color="orange"
            />
            <div className="text-xs text-center text-slate-400 italic mt-2 font-light">"Traitement des abstractions à 1.2M/s"</div>
            
            <AudioVisualizer isSpeaking={isSpeaking && activeSpeaker === "AI2"} activeSpeaker="AI2" />

            <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-auto pt-4 border-t border-white/5">
               <span>Créativité</span>
               <span className="text-pink-400">MAX</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
