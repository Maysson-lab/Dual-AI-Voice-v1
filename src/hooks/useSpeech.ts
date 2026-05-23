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

    // Actual speech
    const utterance = new SpeechSynthesisUtterance(currentMessage.text);
    
    // Pick voices based on speaker
    const englishVoices = voicesRef.current.filter(v => v.lang.startsWith('en') || v.lang.startsWith('fr'));
    
    if (englishVoices.length > 0) {
      // Try to find distinct voices
      const ai1Voice = englishVoices.find(v => v.name.includes('Google') && v.name.includes('Female')) || englishVoices[0];
      const ai2Voice = englishVoices.find(v => v.name.includes('Google') && v.name.includes('Male')) || englishVoices[englishVoices.length - 1] || englishVoices[0];
      
      utterance.voice = currentMessage.speaker === "AI1" ? ai1Voice : ai2Voice;
    }
    
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
