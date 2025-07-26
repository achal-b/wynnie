import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedCard, ProgressBar } from "./shared";

interface TimerCountdownProps {
  isVisible: boolean;
  initialTime?: number;
  onTimerComplete: () => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
  title?: string;
  subtitle?: string;
}

export const TimerCountdown = ({
  isVisible,
  initialTime = 20,
  onTimerComplete,
  onCancel,
  showCancelButton = true,
  title = "⏰ Limited Time Offer",
  subtitle = "Products will be hidden soon to make room for new deals",
}: TimerCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [timerActive, setTimerActive] = useState(false);

  // Start timer when component becomes visible
  useEffect(() => {
    if (isVisible && !timerActive) {
      setTimerActive(true);
      setTimeLeft(initialTime);
    }
  }, [isVisible, timerActive, initialTime]);

  // Timer countdown effect
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      onTimerComplete();
    }
  }, [timerActive, timeLeft, onTimerComplete]);

  if (!isVisible) return null;

  const progress = 1 - timeLeft / initialTime;

  return (
    <AnimatedCard gradient="warning" className="mt-3" cardClassName="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-200">
            {title}
          </h3>
          <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
            {subtitle}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {timeLeft}s
          </div>
          <div className="text-xs text-orange-600 dark:text-orange-400">
            remaining
          </div>
        </div>
      </div>

      <ProgressBar
        progress={progress}
        variant="warning"
        height="lg"
        className="mb-3"
      />

      <div className="flex gap-2">
        {showCancelButton && onCancel && (
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
            className="flex-1 bg-orange-50 dark:bg-orange-950/20 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-950/40"
          >
            Cancel
          </Button>
        )}
        <Button
          size="sm"
          onClick={onTimerComplete}
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
        >
          Continue Now
        </Button>
      </div>
    </AnimatedCard>
  );
};
