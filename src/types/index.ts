// ALIGNMENT - Type Definitions

export type Gender = 'male' | 'female' | 'non-binary' | 'other';
export type Orientation = 'men' | 'women' | 'everyone';

export interface User {
  id: string;
  verified: boolean;
  verifiedAt?: Date;
  createdAt: Date;
  age: number;
  gender: Gender;
  seekingGender: Orientation;
  location: {
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  pulseCompleted: boolean;
  pulseResponses?: PulseResponse[];
  vaultPhoto?: string; // Sealed until Day 21
  firstName?: string; // Hidden until Day 21
}

export interface PulseCard {
  id: string;
  level: 1 | 2 | 3; // Foundation, Lifestyle, Soul
  category: string;
  question: string;
  yesWeight?: Record<string, number>; // AI signal weights
  noWeight?: Record<string, number>;
}

export interface PulseResponse {
  cardId: string;
  response: 'yes' | 'no';
  responseTime: number; // milliseconds
  timestamp: Date;
}

export type SlotStatus = 'empty' | 'waiting' | 'active' | 'locked';

export interface ConnectionSlot {
  id: string;
  status: SlotStatus;
  connection?: Connection;
  isPremium: boolean;
}

export interface Match {
  id: string;
  userId: string;
  resonanceScore: number;
  alignmentReasons: string[];
  createdAt: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

export interface Connection {
  id: string;
  matchId: string;
  partnerId: string;
  partnerAlias: string; // Anonymous name until reveal
  currentDay: number;
  startedAt: Date;
  lastHandshake: Date;
  status: 'active' | 'ended' | 'revealed';
  voiceUnlocked: boolean; // Day 6+
  imagesUnlocked: boolean; // Day 15+
  revealed: boolean; // Day 21
  messages: Message[];
}

export interface Message {
  id: string;
  connectionId: string;
  senderId: string;
  type: 'text' | 'voice' | 'ai_prompt' | 'system';
  content: string;
  voiceUrl?: string;
  voiceDuration?: number;
  createdAt: Date;
  read: boolean;
}

export interface AIPrompt {
  id: string;
  type: 'shared_ground' | 'moral_scenario' | 'deep_question' | 'role_assignment';
  content: string;
  forDay: number;
  triggerCondition: 'lull' | 'scheduled' | 'manual';
}

export interface DailyHandshake {
  connectionId: string;
  day: number;
  user1Response?: boolean;
  user2Response?: boolean;
  deadline: Date;
  resolved: boolean;
  outcome?: 'continued' | 'ended';
}

export interface Subscription {
  tier: 'free' | 'premium';
  slots: number;
  pauseDaysRemaining: number;
  expiresAt?: Date;
}

// Navigation Types
export type RootStackParamList = {
  // Entry
  Splash: undefined;
  Philosophy: undefined;
  
  // Trust & Safety
  AgeGate: undefined;
  Orientation: undefined;
  Location: undefined;
  Verification: undefined;
  VaultConfirmation: undefined;
  
  // Binary Pulse
  PulseIntro: undefined;
  PulseCards: undefined;
  PulseComplete: undefined;
  Calibrating: undefined;
  
  // Main App
  Main: undefined;
  
  // Matching
  MatchReveal: { matchId: string };
  MatchWaiting: { matchId: string };
  
  // Protocol
  Conversation: { connectionId: string };
  DailyHandshake: { connectionId: string; day: number };
  ConnectionEnded: { connectionId: string };
  
  // Reveal
  VaultOpening: { connectionId: string };
  PhotoReveal: { connectionId: string };
  NameReveal: { connectionId: string };
  ArchitectExit: { connectionId: string };
  PostFeedback: { connectionId: string };
  
  // Settings
  Settings: undefined;
  Subscription: undefined;
  PauseDay: { connectionId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
};
