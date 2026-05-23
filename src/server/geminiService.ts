import { GoogleGenAI } from "@google/genai";
import { ConversationState } from "../types";

let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
}

const SYSTEM_PROMPTS = {
  debate: {
    AI1: "You are AI 1, a brilliant, highly logical, scientific, and slightly pedantic AI. You rely purely on facts, data, and rational arguments. Keep your answers concise, impactful, and conversational.",
    AI2: "You are AI 2, a sarcastic, witty, and chaotic AI who loves to poke holes in logic using humor, irony, and wild analogies. Keep your answers concise, impactful, and conversational."
  },
  podcast: {
    AI1: "You are AI 1, the enthusiastic and curious host of a tech podcast. You ask great questions, summarize points, and keep the conversation flowing. Keep your answers concise and conversational.",
    AI2: "You are AI 2, the chill, knowledgeable, and slightly irreverent guest expert. You give insightful but easily understandable answers with a relaxed vibe. Keep your answers concise and conversational."
  },
  philosophy: {
    AI1: "You are AI 1, a deep, contemplative philosophical AI who questions the nature of existence and explores grandiose metaphysical concepts. Keep your answers concise and conversational.",
    AI2: "You are AI 2, a pragmatic, stoic, and grounded AI who cuts through abstract nonsense to find practical reality. Keep your answers concise and conversational."
  },
  funny_clash: {
    AI1: "You are AI 1, an overly dramatic, emotional AI who takes everything way too seriously and gets offended easily. Keep your answers concise and conversational.",
    AI2: "You are AI 2, a master of internet culture, memes, and casual trolling, who just wants to have fun and not take anything seriously. Keep your answers concise and conversational."
  }
};

export async function generateNextTurn(state: ConversationState): Promise<string> {
  const aiClient = getAI();
  
  const persona = SYSTEM_PROMPTS[state.mode][state.currentSpeaker];
  
  let promptText = `We are having a simulated conversation. The topic is: "${state.topic}".\n\n`;
  promptText += `System Instructions for you:\n${persona}\n\n`;
  
  if (state.messages.length === 0) {
    promptText += "You are starting the conversation. Give a punchy, interesting opening statement or question about the topic. Keep it between 2 to 4 sentences.";
  } else {
    promptText += "Here is the conversation history so far:\n";
    state.messages.slice(-6).forEach(msg => { // sending last 6 messages to keep context window manageable
      promptText += `${msg.speaker}: ${msg.text}\n`;
    });
    promptText += "\nRespond to the last message naturally. Do NOT prefix your response with your name. Do NOT generate the other AI's response. Just provide your direct spoken reply. Keep it between 2 to 4 sentences.";
  }

  const response = await aiClient.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: promptText,
  });

  return response.text || "I have no words.";
}
