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
  
  let transcript = "";
  if (state.messages.length === 0) {
    transcript = "La conversation commence.";
  } else {
    state.messages.slice(-10).forEach(msg => {
      if (msg.speaker === "USER") transcript += `Utilisateur: ${msg.text}\n`;
      else transcript += `${msg.speaker}: ${msg.text}\n`;
    });
  }

  let prompt = `Voici la transcription de la conversation (Sujet: "${state.topic}") :\n\n${transcript}\n\nC'est à ton tour de parler. Réponds directement en tant que ${state.currentSpeaker}. Ne préfixe pas ta réponse avec ton nom. Garde ta réponse ultra concise (1 à 2 phrases maximum).`;
  if (state.messages.length === 0) {
      prompt = `Tu commences la conversation sur le sujet : "${state.topic}". Fais une entrée en matière ultra concise (1 à 2 phrases maximum) en tant que ${state.currentSpeaker}.`;
  }
  
  let contents: any[] = [{ role: 'user', parts: [{ text: prompt }] }];
  
  let tools: any[] | undefined = undefined;
  let toolConfig: any | undefined = undefined;

  // Always enable Google Search grounding
  const baseTools: any[] = [{ googleSearch: {} }];

  if (state.mode === 'task_force') {
    tools = [
        ...baseTools,
        {
            functionDeclarations: [
                {
                    name: "search_wikipedia",
                    description: "Rechercher des informations sur Wikipedia en français. Utile pour obtenir des faits précis.",
                    parameters: {
                        type: "OBJECT",
                        properties: {
                            query: { type: "STRING", description: "Le terme exact à rechercher" }
                        },
                        required: ["query"]
                    }
                },
                {
                    name: "get_current_time",
                    description: "Obtenir la date et l'heure courante du système.",
                    parameters: {
                        type: "OBJECT",
                        properties: {},
                    }
                }
            ]
        }
    ];
    toolConfig = { includeServerSideToolInvocations: true };
  } else {
    // For other modes, only allow Google Search tool. No server-side function calling needed, 
    // Gemini will resolve Google Search grounding implicitly.
    tools = baseTools;
  }

  let maxToolCalls = 3; 
  let isDone = false;
  let fullResponse = "";

  while (!isDone && maxToolCalls > 0) {
      maxToolCalls--;
      let hasFunctionCall = false;
      
      const requestParams: any = {
          model: 'gemini-3.5-flash',
          systemInstruction: persona,
          contents: contents
      };
      if (tools) {
          requestParams.tools = tools;
          if (toolConfig) {
              requestParams.toolConfig = toolConfig;
          }
      }

      const stream = await aiClient.models.generateContentStream(requestParams);

      let currentModelParts: any[] = [];
      let tempText = "";

      for await (const chunk of stream) {
          if (chunk.functionCalls && chunk.functionCalls.length > 0) {
              hasFunctionCall = true;
              for (const call of chunk.functionCalls) {
                  currentModelParts.push({ functionCall: call });
                  yield `\n[Appel de l'outil ${call.name} en cours...]\n`;
              }
          }
          if (chunk.text) {
              tempText += chunk.text;
              fullResponse += chunk.text;
              yield fullResponse;
          }
      }

      if (hasFunctionCall) {
          contents.push({ role: 'model', parts: currentModelParts });
          
          let functionResponses: any[] = [];
          for (const part of currentModelParts) {
              if (part.functionCall) {
                  const call = part.functionCall;
                  const args = call.args as any;
                  let result: any = {};
                  
                  if (call.name === "search_wikipedia") {
                      try {
                          const resp = await fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(args?.query || '')}`);
                          if (!resp.ok) result = { error: "Page non trouvée sur Wikipedia" };
                          else {
                              const data = await resp.json() as any;
                              result = { summary: data.extract || "Aucune information trouvée." };
                          }
                      } catch (e) {
                          result = { error: "Erreur réseau" };
                      }
                  } else if (call.name === "get_current_time") {
                      result = { time: new Date().toISOString() };
                  } else {
                      result = { error: "Outil inconnu" };
                  }
                  
                  functionResponses.push({
                      functionResponse: {
                          name: call.name,
                          response: result
                      }
                  });
              }
          }
          if (functionResponses.length > 0) {
              contents.push({ role: 'user', parts: functionResponses });
          }
      } else {
          isDone = true;
      }
  }

  return fullResponse || "Je n'ai pas les mots.";
}
