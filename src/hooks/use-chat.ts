"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Message } from "@/lib/types";
import { SAMPLE_PRODUCTS } from "@/lib/constants";
import { formatCurrency } from "@/lib/currency";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Add cart-related message function
  const addCartMessage = useCallback((content: string, data?: any) => {
    const cartMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: false,
      timestamp: new Date(),
      cartData: data,
      isSystemMessage: true
    };
    setMessages((prev) => [...prev, cartMessage]);
  }, []);

  // Add optimization results message
  const addOptimizationMessage = useCallback((optimizationType: 'cart' | 'delivery', data: any) => {
    const optimizationMessage: Message = {
      id: Date.now().toString(),
      content: optimizationType === 'cart' 
        ? `🛒 **Smart Cart Optimization Complete!**\n\nI found ${data.totalSavings ? `**${formatCurrency(data.totalSavings)} in savings**` : 'some great optimizations'} for you:` 
        : `🚛 **Delivery Optimization Complete!**\n\nOptimal delivery route planned with estimated delivery: **${data.recommendedDelivery?.estimatedTime || 'Tomorrow'}**`,
      isUser: false,
      timestamp: new Date(),
      optimizationData: { type: optimizationType, ...data },
      isSystemMessage: true
    };
    setMessages((prev) => [...prev, optimizationMessage]);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call the chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          context: messages.slice(-5).map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const result = await response.json();
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: result.data.message,
        isUser: false,
        timestamp: new Date(),
        intent: result.data.intent,
        flow2Results: result.data.flow2_results
      };
      setMessages((prev) => [...prev, aiResponse]);

      // Note: Flow 2 handles its own fallback products now, so we don't need to add SAMPLE_PRODUCTS here
      // The Flow 2 system will return products via flow2_results or use its own mock products when SerpAPI fails

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback to mock response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you want to ${content.toLowerCase()}. Let me help you with that! Here are some great products I found for you:`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);

      const productsMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "",
        isUser: false,
        timestamp: new Date(),
        products: SAMPLE_PRODUCTS,
      };
      setMessages((prev) => [...prev, productsMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return {
    messages,
    isLoading,
    messagesEndRef,
    sendMessage,
    addCartMessage,
    addOptimizationMessage,
  };
};
