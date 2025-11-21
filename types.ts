export type AppState = 'landing' | 'processing' | 'wiki';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Entity {
  name: string;
  type: string; // e.g., "Technology", "Person", "Concept"
}

export interface WikiEntry {
  id: string;
  videoId: string;
  title: string;
  publishDate: string;
  summary: string;
  fullContent: string; // A longer generated "article" body
  entities: Entity[];
  category: string;
  sentimentScore: number; // 0 to 100
  views: number; // Simulated view count
}

export interface WikiData {
  channelName: string;
  channelDescription: string;
  totalVideos: number;
  subscribers: string;
  entries: WikiEntry[];
}

export interface ProcessingStep {
  id: number;
  label: string;
  details: string;
  status: 'pending' | 'active' | 'completed';
}
