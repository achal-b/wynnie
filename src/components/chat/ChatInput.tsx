import { FaCamera } from "react-icons/fa";
import { useState } from "react";
import { Mic, MessageSquare, Box, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import { FiShoppingBag } from "react-icons/fi";
import { useChatContext } from "@/contexts/ChatContext";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onVoiceInput: () => void;
  isListening: boolean;
  isLoading: boolean;
}

export const ChatInput = ({
  onSendMessage,
  onVoiceInput,
  isListening,
  isLoading,
}: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const { messages } = useChatContext();

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput("");
      setShowInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSend();
    }
  };

  return (
    <>
      {/* Desktop/Tablet Layout - Fixed Input Field (md and above) */}
      <div className="hidden md:block fixed bottom-6 left-1/2 -translate-x-1/2 z-10 max-w-2xl w-full px-4 pointer-events-auto mb-5">
        <div className="relative flex items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            placeholder="Ask me anything about products, shopping, or assistance..."
            className="pr-20 h-12 text-base rounded-full border-2 border-border bg-background/95 backdrop-blur-sm shadow-lg focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
          />
          <div className="absolute right-2 flex items-center gap-1">
            <Button
              size="icon"
              variant={isListening ? "default" : "ghost"}
              onClick={onVoiceInput}
              disabled={isLoading}
              className={`h-8 w-8 rounded-full transition-all duration-300 ${
                isListening
                  ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white scale-105 shadow-md"
                  : "hover:bg-muted"
              }`}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="h-8 w-8 rounded-full hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Layout - 3 Button Design (below md) */}
      <div className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center w-full pointer-events-none">
        {/* Input overlay */}
        <AnimatePresence>
          {showInput && (
            <motion.div
              className="mb-10 w-full max-w-xs mx-auto pointer-events-auto"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              <input
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                placeholder="Type your message..."
                className="font-light tracking-wide font-mono w-full px-4 py-2 rounded-full bg-background text-foreground shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all border border-border"
              />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Floating bar */}
        <div className="flex items-end backdrop-blur-xs bg-card/80 dark:bg-card/20 pointer-events-auto w-full px-3 py-2 gap-30 rounded-t-3xl justify-center border-t border-border">
          {/* Message button */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowInput((v) => !v)}
            className="rounded-full h-12 w-12 bg-background shadow-md hover:bg-muted"
          >
            <MessageSquare className="size-6" />
          </Button>
          {/* Mic button (center, larger) */}
          <Button
            size="icon"
            variant={isListening ? "default" : "secondary"}
            onClick={onVoiceInput}
            disabled={isLoading}
            className={`absolute m-3 rounded-full h-20 w-20 flex items-center justify-center shadow-lg border-5 border-background bg-primary text-primary-foreground transition-all duration-300 ${
              isListening
                ? "bg-gradient-to-r from-blue-200 to-blue-600 text-white scale-110"
                : "hover:bg-primary/90"
            }`}
          >
            <Mic className="size-8" />
          </Button>
          {/* Order buttons: camera or shopping bag, only one visible at a time */}
          {messages && messages.length > 0 ? (
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full h-12 w-12 bg-background shadow-md hover:bg-muted relative flex items-center justify-center overflow-hidden"
            >
              {/* Shimmer effect over the button */}
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                initial={{ backgroundPosition: "100% 0" }}
                animate={{ backgroundPosition: "0% 0" }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                style={{
                  background:
                    "linear-gradient(90deg, rgba(59,130,246,0) 0%, rgba(59,130,246,0.15) 50%, rgba(59,130,246,0) 100%)",
                  backgroundSize: "200% 100%",
                  zIndex: 10,
                }}
              />
              {/* Camera icon */}
              <FaCamera className="size-6 z-20 relative" />
            </Button>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full h-12 w-12 bg-background shadow-md hover:bg-muted flex items-center justify-center"
            >
              <FiShoppingBag className="size-6" />
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
