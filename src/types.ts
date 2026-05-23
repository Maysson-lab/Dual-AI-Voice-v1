export type AIMode = "debate" | "podcast" | "philosophy" | "funny_clash" | "task_force";
export type Speaker = "AI1" | "AI2" | "USER";

export interface Message {
  id: string;
  speaker: Speaker;
  text: string;
  timestamp: number;
}

export interface ConversationState {
  isActive: boolean;
  topic: string;
  mode: AIMode;
  messages: Message[];
  currentSpeaker: Speaker;
  maxTurns: number;
}
