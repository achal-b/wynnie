import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useEffect } from "react";

interface VoiceListeningOverlayProps {
  isListening: boolean;
  recordingTime?: number;
  onStop?: () => void; // Add onStop callback
}

export const VoiceListeningOverlay = ({
  isListening,
  recordingTime = 0,
  onStop,
}: VoiceListeningOverlayProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isListening && onStop && (e.key === "Escape" || e.key === " ")) {
        e.preventDefault();
        onStop();
      }
    };

    if (isListening) {
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
    }
  }, [isListening, onStop]);

  return (
    <AnimatePresence>
      {isListening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-xs z-50 flex items-center justify-center"
        >
          <div className="relative">
            {/* Outer rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="w-24 h-24 sm:w-32 sm:h-32  rounded-full "
            />

            {/* Inner pulsing circle */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute inset-3 sm:inset-4 rounded-full flex items-center justify-center overflow-hidden"
            >
              <motion.div
                animate={{ y: [-2, 2, -2] }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src="/preloader/video-3.gif"
                  alt="Voice listening animation"
                  width={100}
                  height={100}
                  className="h-full w-full scale-110 rounded-full opacity-80 saturate-150"
                />
              </motion.div>
            </motion.div>

            {/* Ripple effects */}
            <motion.div
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeOut",
              }}
              className="absolute inset-0 border-2 border-muted/20 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeOut",
                delay: 0.3,
              }}
              className="absolute -inset-2 border-2 border-muted/20 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 2.2], opacity: [0.2, 0] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeOut",
                delay: 0.6,
              }}
              className="absolute -inset-4 border-2 border-muted/20 rounded-full"
            />
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-1/4 sm:bottom-1/3 text-center px-4"
          >
            <motion.p
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="text-card-foreground text-lg sm:text-xl font-semibold mb-2"
            >
              Listening...
            </motion.p>
            {recordingTime > 0 && (
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-card-foreground text-sm mb-2 font-mono"
              >
                {formatTime(recordingTime)}
              </motion.p>
            )}
            <p className="text-foreground/80 text-sm">
              Speak now, I&apos;m all ears!
            </p>
            <p className="text-foreground/60 text-xs mt-1">
              Press Esc or Space to stop recording
            </p>
            {recordingTime > 25 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-accent-foreground text-xs mt-2"
              >
                Recording will stop automatically in {30 - recordingTime}s
              </motion.p>
            )}
            
            {/* Stop button */}
            {onStop && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={onStop}
                className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Stop Recording
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
