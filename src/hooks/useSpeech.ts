import { useEffect, useRef, useState } from "react";
import { Message } from "../types";

export function useSpeech(
  currentMessage: Message | null, 
  onFinished: () => void,
  isMuted: boolean,
  speed: number
) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = window.speechSynthesis;
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const populateVoices = () => {
      voicesRef.current = synth.getVoices();
    };
    
    populateVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = populateVoices;
    }
  }, [synth]);

  useEffect(() => {
    if (!currentMessage) {
      setIsSpeaking(false);
      return;
    }

    if (isMuted) {
      // If muted, just simulate the time it takes to read
      setIsSpeaking(true);
      const timeMs = Math.max(1000, (currentMessage.text.length / 15) * 1000 * (1 / speed));
      const t = setTimeout(() => {
        setIsSpeaking(false);
        onFinished();
      }, timeMs);
      return () => clearTimeout(t);
    }

    const cleanText = currentMessage.text.replace(/\[.*?\]/g, '').replace(/\*/g, '').trim();
    if (!cleanText) {
      setIsSpeaking(false);
      onFinished();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Pick voices based on speaker
    const frenchVoices = voicesRef.current.filter(v => v.lang.startsWith('fr'));
    
    if (frenchVoices.length > 0) {
      // Try to find distinct voices
      const ai1Voice = frenchVoices.find(v => (v.name.includes('Google') && v.name.includes('Female')) || v.name.includes('Thomas') || v.name.includes('Marie')) || frenchVoices[0];
      const ai2Voice = frenchVoices.find(v => (v.name.includes('Google') && v.name.includes('Male')) || v.name.includes('Audrey') || v.name.includes('Thomas')) || frenchVoices[frenchVoices.length - 1] || frenchVoices[0];
      
      utterance.voice = currentMessage.speaker === "AI1" ? ai1Voice : ai2Voice;
    }
    
    utterance.lang = 'fr-FR';
    
    utterance.rate = speed;
    
    // Pitch differences
    utterance.pitch = currentMessage.speaker === "AI1" ? 1.2 : 0.8;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onFinished();
    };
    utterance.onerror = (e) => {
      console.warn("Speech synthesis error", e);
      setIsSpeaking(false);
      onFinished();
    };

    synth.cancel(); // cancel any ongoing
    synth.speak(utterance);

    return () => {
      synth.cancel();
    };
  }, [currentMessage, isMuted, speed, onFinished, synth]);

  return { isSpeaking };
}
