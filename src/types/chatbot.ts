import { LeadSubmission } from "@/lib/validations/chatbotSchema";
import { CHAT_STEPS } from "@/lib/constants/chatbot";

export type ChatStep = typeof CHAT_STEPS[keyof typeof CHAT_STEPS];

export interface ChatMessage {
  id: string;
  type: "bot" | "user";
  text: string;
  isOptions?: boolean; // True if the message should render clickable options (services)
  options?: string[]; // Array of strings if isOptions is true
  timestamp: number;
}

export interface ChatbotState {
  isOpen: boolean;
  step: ChatStep;
  messages: ChatMessage[];
  isTyping: boolean;
  error: string | null;
  
  // Accumulated Lead Data
  leadData: Partial<LeadSubmission>;
}

export type ChatbotAction = 
  | { type: "TOGGLE_OPEN" }
  | { type: "SET_STEP"; payload: ChatStep }
  | { type: "ADD_MESSAGE"; payload: Omit<ChatMessage, "id" | "timestamp"> }
  | { type: "SET_TYPING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "UPDATE_LEAD_DATA"; payload: Partial<LeadSubmission> }
  | { type: "RESTORE_STATE"; payload: ChatbotState }
  | { type: "CLEAR_SESSION" };
