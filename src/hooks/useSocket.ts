import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Message, AIMode, Speaker } from "../types";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] = useState<{id: string, text: string, speaker: Speaker} | null>(null);
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
      setStreamingMessage(null);
      setCurrentTopic(data.topic);
      setCurrentMode(data.mode);
      setTypingSpeaker(null);
      messageQueue.current = [];
      setCurrentSpokenMessage(null);
    });

    s.on("conversation_stopped", () => {
      setIsActive(false);
      setTypingSpeaker(null);
      setStreamingMessage(null);
    });

    s.on("message_chunk", (data) => {
      setStreamingMessage(data);
      setTypingSpeaker(null);
    });

    s.on("new_message", (msg: Message) => {
      setStreamingMessage(null);
      setMessages(p => [...p, msg]);
      setTypingSpeaker(null);
      
      if (msg.speaker !== "USER") {
        // Push to queue and trigger process
        messageQueue.current.push(msg);
        processQueue();
      }
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

  const startConversation = (topic: string, mode: AIMode, maxTurns: number) => {
    if (socket) {
      socket.emit("start_conversation", { topic, mode, maxTurns });
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
    setStreamingMessage(null);
    window.speechSynthesis.cancel();
  };

  const sendIntervention = (text: string) => {
    if (socket && isActive) {
      socket.emit("user_intervention", text);
    }
  };

  return {
    socket,
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
  };
}
