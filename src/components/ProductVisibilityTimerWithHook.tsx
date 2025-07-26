import { ProductVisibilityTimer } from "./ProductVisibilityTimer";
import { useProductTimer } from "@/hooks/use-product-timer";

interface ProductVisibilityTimerWithHookProps {
  onCancel: () => void;
  onProceed: () => void;
  onTimerComplete?: () => void;
  initialTime?: number;
  autoStart?: boolean;
  showPauseButton?: boolean;
  className?: string;
}

export const ProductVisibilityTimerWithHook = ({
  onCancel,
  onProceed,
  onTimerComplete,
  initialTime = 20,
  autoStart = false,
  showPauseButton = false,
  className = "",
}: ProductVisibilityTimerWithHookProps) => {
  const {
    timeLeft,
    timerActive,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    isPaused,
  } = useProductTimer({
    initialTime,
    onTimerComplete,
    autoStart,
  });

  const handleCancel = () => {
    stopTimer();
    onCancel();
  };

  const handleProceed = () => {
    stopTimer();
    onProceed();
  };

  return (
    <ProductVisibilityTimer
      timeLeft={timeLeft}
      timerActive={timerActive}
      onCancel={handleCancel}
      onProceed={handleProceed}
      totalTime={initialTime}
      className={className}
      showPauseButton={showPauseButton}
      onPause={pauseTimer}
      onResume={resumeTimer}
      isPaused={isPaused}
    />
  );
};
