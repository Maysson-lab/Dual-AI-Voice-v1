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
    isActive,
    typingSpeaker,
    currentTopic,
    currentMode,
    startConversation,
    stopConversation,
    currentSpokenMessage,
    onMessageSpoken
  } = useSocket();

  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1.1);
  
  const { isSpeaking } = useSpeech(currentSpokenMessage, onMessageSpoken, isMuted, speed);

  const handleExport = () => {
    let txt = `Topic: ${currentTopic} | Mode: ${currentMode}\n\n`;
    messages.forEach(m => {
      txt += `[${m.speaker}] ${new Date(m.timestamp).toLocaleTimeString()}: ${m.text}\n`;
    });
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "DualAIVoice_Transcript.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeSpeaker = currentSpokenMessage ? currentSpokenMessage.speaker : null;

  return (
    <div className="min-h-screen font-sans selection:bg-[#00f2ff]/30 overflow-hidden flex flex-col relative bg-transparent text-[#e2e2e2]">
      
      {/* Top Navigation / Header */}
      <header className="flex-none h-[60px] px-6 flex items-center justify-between glass-panel rounded-none border-t-0 border-x-0 border-b z-10">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              {isActive && <span className="absolute w-3 h-3 bg-[#00f2ff] rounded-full blur-[4px] animate-pulse"></span>}
              <span className={`relative w-2 h-2 rounded-full shadow-[0_0_10px] ${isActive ? 'bg-[#00f2ff] shadow-[#00f2ff]' : 'bg-neutral-600 shadow-transparent'}`}></span>
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-[2px] glow-cyan text-white uppercase">
                Dual AI Voice <span className="font-light opacity-50 text-sm">CORE</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-[12px] font-medium tracking-wide">
            <div className="hidden md:flex items-center gap-2">
              <span className="opacity-70">MODE:</span>
              <span className="glow-cyan text-[#00f2ff] uppercase">{currentMode.replace('_', ' ')}</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="hover:text-white transition-colors opacity-70 hover:opacity-100 flex items-center gap-2"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={handleExport}
                disabled={messages.length === 0}
                className="hover:text-white transition-colors opacity-70 hover:opacity-100 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Export Transcript"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">EXPORT</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row min-h-0 relative z-10 w-full max-w-7xl mx-auto p-4 gap-4">
        
        {/* Left Area: Setup & Avatars */}
        <div className="w-full md:w-[280px] flex flex-col gap-4 shrink-0 h-full">
          <ControlPanel 
            isActive={isActive} 
            onStart={startConversation} 
            onStop={stopConversation}
            speed={speed}
            onSpeedChange={setSpeed}
          />
          
          <div className="glass-panel p-5 flex flex-col gap-4 relative overflow-hidden flex-1 justify-center">
            <div className="text-[10px] uppercase px-2 py-0.5 rounded bg-white/10 self-start mb-2 tracking-wider">IA-1 / LOGIC</div>
            <AIAvatar 
              speaker="AI1" 
              name={currentMode === 'debate' ? 'UNITÉ ANALYTIQUE' : currentMode === 'podcast' ? 'HOST MODULE' : currentMode === 'philosophy' ? 'LOGOS' : 'EMOTION CORE'}
              isActive={isActive && typingSpeaker === "AI1"} 
              isSpeaking={isActive && isSpeaking && activeSpeaker === "AI1"} 
              color="blue"
            />
            <div className="text-xs text-center opacity-70 italic mt-2">"Convergence probabilistique..."</div>
            
            <AudioVisualizer isSpeaking={isSpeaking && activeSpeaker === "AI1"} activeSpeaker="AI1" />

            <div className="flex justify-between text-[11px] opacity-60 uppercase tracking-[0.5px] mt-auto pt-3 border-t border-white/10">
              <span>Précision</span>
              <span>99.9%</span>
            </div>
          </div>
        </div>

        {/* Middle Area: Chat Board */}
        <div className="flex-1 flex flex-col min-h-0 glass-panel overflow-hidden">
          <ChatBoard 
             messages={messages} 
             typingSpeaker={typingSpeaker} 
             topic={currentTopic}
             mode={currentMode}
             isActive={isActive}
          />
        </div>

        {/* Right Area: AI2 Avatar */}
        <div className="w-full md:w-[280px] flex flex-col gap-4 shrink-0 h-full">
          <div className="glass-panel p-5 flex flex-col gap-4 relative overflow-hidden flex-1 justify-center">
            <div className="text-[10px] uppercase px-2 py-0.5 rounded bg-white/10 self-end mb-2 tracking-wider text-[#ff007f]">IA-2 / SARCASM</div>
            <AIAvatar 
              speaker="AI2" 
              name={currentMode === 'debate' ? 'UNITÉ SATIRIQUE' : currentMode === 'podcast' ? 'GUEST NODE' : currentMode === 'philosophy' ? 'CHAOS' : 'TROLL PROTOCOL'}
              isActive={isActive && typingSpeaker === "AI2"} 
              isSpeaking={isActive && isSpeaking && activeSpeaker === "AI2"} 
              color="orange"
            />
            <div className="text-xs text-center opacity-70 italic mt-2">"Traitement de 1.2M blagues/ms."</div>
            
            <AudioVisualizer isSpeaking={isSpeaking && activeSpeaker === "AI2"} activeSpeaker="AI2" />

            <div className="flex justify-between text-[11px] opacity-60 uppercase tracking-[0.5px] mt-auto pt-3 border-t border-white/10">
               <span>Niveau Sarcasme</span>
               <span>MAX</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
