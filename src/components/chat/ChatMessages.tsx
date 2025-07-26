import { AnimatePresence } from "motion/react";
import { Message } from "@/lib/types";
import { ChatMessage } from "./ChatMessage";
import { RecommendationPrompts } from "./RecommendationPrompts";
import { RECOMMENDATION_PROMPTS } from "@/lib/constants";
import Loader from "../ui/loader";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onPromptClick: (prompt: string) => void;
}

export const ChatMessages = ({
  messages,
  isLoading,
  messagesEndRef,
  onPromptClick,
}: ChatMessagesProps) => {
  return (
    <div
      className="flex-1 overflow-y-auto space-y-4 w-full bg-background"
      data-lenis-prevent
    >
      <AnimatePresence>
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            isLastMessage={index === messages.length - 1}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>{isLoading && <Loader />}</AnimatePresence>

      {messages.length === 0 && (
        <div className="flex flex-col h-full">
          <RecommendationPrompts
            prompts={RECOMMENDATION_PROMPTS}
            onPromptClick={onPromptClick}
          />
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
