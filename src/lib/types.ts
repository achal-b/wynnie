// Speech recognition types
declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechRecognition: new () => SpeechRecognition;
  }
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: (event: Event) => void;
  start: () => void;
}

export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

export interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// Chat and product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category?: string;
}

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  products?: Product[];
  flow2Results?: {
    products: any[];
    query: string;
    suggestions: string[];
    totalResults: number;
    searchTime: number;
    bestMatch?: any;
  };
  intent?: {
    type: string;
    entities: any;
    confidence: number;
  };
  // New fields for agent-based cart system
  cartData?: any;
  optimizationData?: any;
  isSystemMessage?: boolean;
}

export interface RecommendationPrompt {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  prompt: string;
}
