"use client";

import { useState, useEffect } from "react";

interface UseProductTimerProps {
  initialTime?: number;
  onTimerComplete?: () => void;
  autoStart?: boolean;
}

interface UseProductTimerReturn {
  timeLeft: number;
  timerActive: boolean;
  isPaused: boolean;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
}

export const useProductTimer = ({
  initialTime = 20,
  onTimerComplete,
  autoStart = false,
}: UseProductTimerProps = {}): UseProductTimerReturn => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [timerActive, setTimerActive] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);

  // Timer countdown effect
  useEffect(() => {
    if (timerActive && timeLeft > 0 && !isPaused) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      onTimerComplete?.();
    }
  }, [timerActive, timeLeft, isPaused, onTimerComplete]);

  const startTimer = () => {
    setTimeLeft(initialTime);
    setTimerActive(true);
    setIsPaused(false);
  };

  const stopTimer = () => {
    setTimerActive(false);
    setIsPaused(false);
  };

  const resetTimer = () => {
    setTimeLeft(initialTime);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  return {
    timeLeft,
    timerActive,
    isPaused,
    startTimer,
    stopTimer,
    resetTimer,
    pauseTimer,
    resumeTimer,
  };
};
