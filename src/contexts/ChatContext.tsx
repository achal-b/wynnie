"use client";

import { createContext, useContext, ReactNode } from 'react';
import { useChat } from '@/hooks/use-chat';

interface ChatContextType {
  messages: any[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  sendMessage: (content: string) => void;
  addCartMessage: (content: string, data?: any) => void;
  addOptimizationMessage: (optimizationType: 'cart' | 'delivery', data: any) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const chatMethods = useChat();

  return (
    <ChatContext.Provider value={chatMethods}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
