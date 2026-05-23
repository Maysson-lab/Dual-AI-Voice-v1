import { Server, Socket } from "socket.io";
import { generateNextTurn } from "./geminiService";
import { Message, ConversationState } from "../types";

export function handleSocketConnection(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("Client connected:", socket.id);
    
    let conversationState: ConversationState = {
      isActive: false,
      topic: "",
      mode: "debate",
      messages: [],
      currentSpeaker: "AI1" // AI1 goes first
    };

    socket.on("start_conversation", async (data: { topic: string, mode: string }) => {
      console.log("Starting conversation on topic:", data.topic, data.mode);
      conversationState = {
        isActive: true,
        topic: data.topic,
        mode: data.mode as any,
        messages: [],
        currentSpeaker: "AI1"
      };
      
      socket.emit("conversation_started", { topic: data.topic, mode: data.mode });
      
      // Trigger first message
      await processNextTurn(socket, conversationState);
    });

    socket.on("stop_conversation", () => {
      conversationState.isActive = false;
      socket.emit("conversation_stopped");
    });
    
    socket.on("ready_for_next", async () => {
      if (conversationState.isActive) {
        await processNextTurn(socket, conversationState);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      conversationState.isActive = false;
    });
  });
}

async function processNextTurn(socket: Socket, state: ConversationState) {
  if (!state.isActive) return;
  
  socket.emit("speaker_typing", { speaker: state.currentSpeaker });
  
  try {
    const text = await generateNextTurn(state);
    
    const newMessage: Message = {
      id: Date.now().toString(),
      speaker: state.currentSpeaker,
      text: text,
      timestamp: Date.now()
    };
    
    state.messages.push(newMessage);
    
    // Switch speaker
    const previousSpeaker = state.currentSpeaker;
    state.currentSpeaker = state.currentSpeaker === "AI1" ? "AI2" : "AI1";
    
    socket.emit("new_message", newMessage);
    
  } catch (err: any) {
    console.error("Error generating turn:", err);
    socket.emit("error", { message: "Error generating response from Gemini API" });
    state.isActive = false;
  }
}
