/**
 * TypeScript Type Definitions
 * 
 * Centralized type definitions used throughout the application.
 */

/**
 * Server Action Response Type
 */
export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Server Action State Type for form handling
 */
export interface ActionState {
  success?: boolean;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * User Profile Types
 */
export interface UserProfile {
  userId: string;
  experienceLevel: 'beginner' | 'intermediate';
  investmentObjectives: string[];
  riskTolerance: 'low' | 'medium' | 'high';
  completedOnboarding: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Chat Message Types
 */
export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  metadata?: {
    videoRecommendations?: VideoResource[];
    disclaimerShown: boolean;
  };
}

export interface VideoResource {
  id: string;
  title: string;
  url: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate';
  topics: string[];
}

/**
 * Cryptocurrency Price Types
 */
export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  lastUpdated: Date;
}

export interface MarketData {
  prices: CryptoPrice[];
  lastSync: Date;
  isStale: boolean;
}

/**
 * Portfolio Types
 */
export interface BinanceCredentials {
  userId: string;
  apiKey: string; // encrypted
  apiSecret: string; // encrypted
  isActive: boolean;
  lastSync: Date;
}

export interface PortfolioAsset {
  userId: string;
  symbol: string;
  amount: number;
  currentPrice: number;
  currentValue: number;
  change24h: number;
  lastUpdated: Date;
}

export interface PortfolioSummary {
  totalValue: number;
  totalChange24h: number;
  totalChangePercent24h: number;
  assetCount: number;
  lastSync: Date;
}

/**
 * Crypto Alert Types
 */
export type AlertSide = "above" | "below";

export interface CryptoAlert {
  id: string;
  userId: string;
  symbol: string;
  pairSymbol: string;
  threshold: string;
  initialPrice: string;
  initialSide: AlertSide;
  triggered: boolean | null;
  triggeredAt: Date | null;
  triggeredPrice: string | null;
  acknowledged: boolean | null;
  acknowledgedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface BinanceSymbolInfo {
  symbol: string;
  baseAsset: string;
}

/**
 * API Error Types
 */
export interface APIError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
  requestId: string;
}