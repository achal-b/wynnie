"use client";

import { useEffect } from "react";
import { useChatContext } from "@/contexts/ChatContext";
import { useCart } from "@/hooks/use-cart";
import { useEnhancedSpeechRecognition } from "@/hooks/use-enhanced-speech-recognition";
import { SpeechRecognitionError } from "@/components/SpeechRecognitionError";
import {
  VoiceListeningOverlay,
  ChatMessages,
  ChatInput,
} from "@/components/chat";

export default function DashboardPage() {
  const {
    messages,
    isLoading,
    messagesEndRef,
    sendMessage,
    addCartMessage,
    addOptimizationMessage,
  } = useChatContext();
  const { setChatMethods } = useCart();

  // Connect cart with chat methods for agent-based notifications (only once on mount)
  useEffect(() => {
    setChatMethods({ addCartMessage, addOptimizationMessage });
  }, []); // Empty dependency array - only run once on mount
  const {
    isListening,
    isRecording,
    recordingTime,
    startListening,
    stopListening,
    error,
    debugInfo,
    retryWithAssemblyAI,
  } = useEnhancedSpeechRecognition();

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(
        (transcript) => {
          console.log(
            "Transcript received (auto-translated to English for search):",
            transcript
          );
          sendMessage(transcript);
        },
        {
          mode: "assembly", // Assembly AI with auto-translation to English
          language: "unknown", // Auto-detect language, then translate to English
          maxRecordingTime: 30, // 30 seconds max
        }
      );
    }
  };

  return (
    <div className="font-light">
      {/* Debug info for development */}
      {/* {process.env.NODE_ENV === "development" && debugInfo && (
        // <div className="fixed top-16 left-4 bg-black/80 text-white text-xs p-2 rounded max-w-xs z-50">
        //   <strong>Debug:</strong> {debugInfo}
        // </div>
      )} */}

      {/* Error display with improved UX */}
      {error && (
        <SpeechRecognitionError
          error={error}
          debugInfo={debugInfo}
          onRetryWithAssemblyAI={() => retryWithAssemblyAI((transcript) => {
            console.log("Retry transcript received:", transcript);
            sendMessage(transcript);
          })}
        />
      )}

      <VoiceListeningOverlay
        isListening={isListening || isRecording}
        recordingTime={recordingTime}
        onStop={stopListening}
      />

      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
        onPromptClick={sendMessage}
      />

      <ChatInput
        onSendMessage={sendMessage}
        onVoiceInput={handleVoiceInput}
        isListening={isListening || isRecording}
        isLoading={isLoading}
      />
    </div>
  );
}
