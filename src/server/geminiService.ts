import { GoogleGenAI } from "@google/genai";
import { ConversationState } from "../types";
import { SYSTEM_PROMPTS } from "./systemPrompts";

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

export async function* generateNextTurn(state: ConversationState): AsyncGenerator<string, string, unknown> {
  const aiClient = getAI();
  
  const persona = SYSTEM_PROMPTS[state.mode][state.currentSpeaker];
  
  let promptText = `Nous avons une conversation simulée. Le sujet est : "${state.topic}".\n\n`;
  promptText += `Instructions Système pour toi :\n${persona}\n\n`;
  
  if (state.messages.length === 0) {
    promptText += "Tu commences la conversation. Donne une phrase d'ouverture percutante et intéressante ou pose une question sur le sujet abordé. Reste entre 2 et 4 phrases maximum.";
  } else {
    promptText += "Voici l'historique de la conversation jusqu'à présent :\n";
    state.messages.slice(-6).forEach(msg => { // sending last 6 messages to keep context window manageable
      promptText += `${msg.speaker}: ${msg.text}\n`;
    });
    promptText += "\nRéponds au dernier message de manière naturelle. NE PRÉFIXE PAS ta réponse avec ton nom. NE GÉNÈRE PAS la réponse de l'autre IA. Fournis uniquement ta réplique directe et parlée. Reste entre 2 et 4 phrases maximum.";
  }

  const stream = await aiClient.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents: promptText,
  });

  let fullResponse = "";
  for await (const chunk of stream) {
    if (chunk.text) {
      fullResponse += chunk.text;
      yield fullResponse;
    }
  }

  return fullResponse || "Je n'ai pas les mots.";
}
