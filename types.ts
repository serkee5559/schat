
export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  date: string;
}
