export enum ViewMode {
  Chat = 'CHAT',
  Imagine = 'IMAGINE',
  Dashboard = 'DASHBOARD'
}

export enum MessageRole {
  User = 'user',
  Model = 'model',
  System = 'system'
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  imageUrl?: string; // For user uploaded images or model generated images
  timestamp: number;
  isThinking?: boolean;
}

export interface UsageStat {
  name: string;
  tokens: number;
  requests: number;
}

export interface GenerationConfig {
  temperature: number;
  topK: number;
  topP: number;
}

// Recharts data types
export interface DailyUsageData {
  day: string;
  tokens: number;
  images: number;
}
