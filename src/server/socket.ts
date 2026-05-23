import { Server, Socket } from "socket.io";
import { generateNextTurn } from "./geminiService";
import { Message, ConversationState } from "../types";

export function handleSocketConnection(io: Server) {
  let globalConversationState: ConversationState = {
    isActive: false,
    topic: "",
    mode: "debate",
    messages: [],
    currentSpeaker: "AI1",
    maxTurns: 10
  };

  io.on("connection", (socket: Socket) => {
    console.log("Client connected:", socket.id);
    
    socket.on("start_conversation", async (data: { topic: string, mode: string, maxTurns: number }) => {
      console.log("Starting conversation on topic:", data.topic, data.mode);
      globalConversationState = {
        isActive: true,
        topic: data.topic,
        mode: data.mode as any,
        messages: [],
        currentSpeaker: "AI1",
        maxTurns: data.maxTurns || 10
      };
      
      socket.emit("conversation_started", { topic: data.topic, mode: data.mode });
      
      // Trigger first message
      await processNextTurn(socket, globalConversationState);
    });

    socket.on("stop_conversation", () => {
      globalConversationState.isActive = false;
      socket.emit("conversation_stopped");
    });
    
    socket.on("user_intervention", async (text: string) => {
      if (globalConversationState.isActive) {
        const userMsg: Message = {
          id: Date.now().toString(),
          speaker: "USER",
          text: text,
          timestamp: Date.now()
        };
        globalConversationState.messages.push(userMsg);
        socket.emit("new_message", userMsg);
        
        // Wait, the client is probably "ready_for_next" already or will be.
        // Actually, if we just push it, the next generated turn will see it.
        // But if we want to interrupt and generate right now:
        // We could cancel current stream by setting a flag or just let it queue.
        // Simplest is just pushing it to messages so the next turn sees it.
      }
    });

    socket.on("ready_for_next", async () => {
      if (globalConversationState.isActive) {
        await processNextTurn(socket, globalConversationState);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      globalConversationState.isActive = false;
    });
  });
}

async function processNextTurn(socket: Socket, state: ConversationState) {
  if (!state.isActive) return;
  
  const aiMessagesCount = state.messages.filter(m => m.speaker !== "USER").length;
  if (state.maxTurns > 0 && aiMessagesCount >= state.maxTurns) {
    state.isActive = false;
    socket.emit("conversation_stopped");
    return;
  }
  
  socket.emit("speaker_typing", { speaker: state.currentSpeaker });
  
  try {
    const generator = generateNextTurn(state);
    const newMessageId = Date.now().toString();
    
    let text = "";
    for await (const value of generator) {
      if (!state.isActive) break;
      text = value;
      socket.emit("message_chunk", {
        id: newMessageId,
        speaker: state.currentSpeaker,
        text: text
      });
    }
    
    if (!state.isActive && !text) return; // if stopped before text
    
    const newMessage: Message = {
      id: newMessageId,
      speaker: state.currentSpeaker,
      text: text,
      timestamp: Date.now()
    };
    
    state.messages.push(newMessage);
    
    // Switch speaker
    state.currentSpeaker = state.currentSpeaker === "AI1" ? "AI2" : "AI1";
    
    socket.emit("new_message", newMessage);
    
  } catch (err: any) {
    console.error("Error generating turn:", err);
    socket.emit("error", { message: "Error generating response from Gemini API" });
    state.isActive = false;
  }
}
