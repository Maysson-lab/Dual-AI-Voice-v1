import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Message, AIMode, Speaker } from "../types";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [typingSpeaker, setTypingSpeaker] = useState<Speaker | null>(null);
  const [currentTopic, setCurrentTopic] = useState("");
  const [currentMode, setCurrentMode] = useState<AIMode>("debate");
  
  // A queue for incoming messages that need to be spoken
  const messageQueue = useRef<Message[]>([]);
  const [currentSpokenMessage, setCurrentSpokenMessage] = useState<Message | null>(null);

  useEffect(() => {
    const s = io();
    setSocket(s);

    s.on("conversation_started", (data) => {
      setIsActive(true);
      setMessages([]);
      setCurrentTopic(data.topic);
      setCurrentMode(data.mode);
      setTypingSpeaker(null);
      messageQueue.current = [];
      setCurrentSpokenMessage(null);
    });

    s.on("conversation_stopped", () => {
      setIsActive(false);
      setTypingSpeaker(null);
    });

    s.on("new_message", (msg: Message) => {
      setMessages(p => [...p, msg]);
      setTypingSpeaker(null);
      
      // Push to queue and trigger process
      messageQueue.current.push(msg);
      processQueue();
    });

    s.on("speaker_typing", (data: { speaker: Speaker }) => {
      setTypingSpeaker(data.speaker);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  const processQueue = useCallback(() => {
    if (messageQueue.current.length > 0 && !currentSpokenMessage) {
      const nextMsg = messageQueue.current.shift()!;
      setCurrentSpokenMessage(nextMsg);
    }
  }, [currentSpokenMessage]);

  const onMessageSpoken = useCallback(() => {
    setCurrentSpokenMessage(null);
    if (socket && isActive) {
      // Tell backend to generate next
      socket.emit("ready_for_next");
    }
    // Check if more in queue (rare unless paused)
    processQueue();
  }, [socket, isActive, processQueue]);

  const startConversation = (topic: string, mode: AIMode) => {
    if (socket) {
      socket.emit("start_conversation", { topic, mode });
    }
  };

  const stopConversation = () => {
    if (socket) {
      socket.emit("stop_conversation");
    }
    setIsActive(false);
    messageQueue.current = [];
    setCurrentSpokenMessage(null);
    setTypingSpeaker(null);
    window.speechSynthesis.cancel();
  };

  return {
    socket,
    messages,
    isActive,
    typingSpeaker,
    currentTopic,
    currentMode,
    startConversation,
    stopConversation,
    currentSpokenMessage,
    onMessageSpoken
  };
}
