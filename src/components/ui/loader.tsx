"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Brain,
  Globe,
  FileText,
  Database,
  Play,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { LOADING_STEPS } from "@/lib/constants";
import { TextShimmer } from "@/components/ui/text-shimmer";

// New Step type for dynamic steps
interface LoaderStep {
  id: string;
  title: string;
  description: string;
  status: "hidden" | "searching" | "completed" | "revealed";
  icon: React.ElementType;
}

function getRandomText(texts: Array<{ text: string; description: string }>): {
  text: string;
  description: string;
} {
  return texts[Math.floor(Math.random() * texts.length)];
}

function generateLoaderSteps(): LoaderStep[] {
  return LOADING_STEPS.map((step, idx) => {
    const selectedText = getRandomText(step.texts);
    return {
      id: (idx + 1).toString(),
      title: selectedText.text,
      description: selectedText.description,
      status: "hidden" as const,
      icon: step.icon,
    };
  });
}

export default function Component() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  // Use dynamic steps
  const [steps, setSteps] = useState<LoaderStep[]>(() => generateLoaderSteps());

  const startAnimation = () => {
    setIsAnimating(true);
    setProgress(0);
    setCurrentStepIndex(0);
    setSteps(generateLoaderSteps());
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setProgress(0);
    setCurrentStepIndex(-1);
    setSteps(generateLoaderSteps());
  };

  // Auto-start animation when component mounts
  useEffect(() => {
    startAnimation();
  }, []);

  useEffect(() => {
    if (!isAnimating || currentStepIndex === -1) return;

    const totalSteps = steps.length;
    const stepProgress = (currentStepIndex + 1) * (100 / totalSteps);

    const animateStep = async () => {
      // Step 1: Show searching state
      setSteps((prevSteps) =>
        prevSteps.map((step, index) => {
          if (index === currentStepIndex) {
            return { ...step, status: "searching" as const };
          }
          return step;
        })
      );

      // Step 2: Wait for searching duration
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Step 3: Complete searching
      setSteps((prevSteps) =>
        prevSteps.map((step, index) => {
          if (index === currentStepIndex) {
            return { ...step, status: "completed" as const };
          }
          return step;
        })
      );

      // Step 4: Simultaneously reveal step and animate progress bar
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Reveal step and animate progress bar at the same time
      setSteps((prevSteps) =>
        prevSteps.map((step, index) => {
          if (index === currentStepIndex) {
            return { ...step, status: "revealed" as const };
          }
          return step;
        })
      );

      setProgress(stepProgress);

      // Step 5: Move to next step or finish
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (currentStepIndex < totalSteps - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setIsAnimating(false);
      }
    };

    animateStep();
  }, [currentStepIndex, isAnimating, steps.length]);

  const getIcon = (IconComponent: React.ElementType, status: string) => {
    if (status === "searching") {
      return (
        <Loader2 className="w-4 h-4 text-primary-foreground animate-spin flex items-center justify-center" />
      );
    }
    const iconClass =
      status === "revealed"
        ? "text-primary-foreground p-0.5"
        : "text-foreground/80 p-0.5";
    return <IconComponent className={`w-4 h-4 ${iconClass}`} />;
  };

  const getProgressBarHeight = () => {
    const revealedSteps = steps.filter(
      (step) => step.status === "revealed"
    ).length;
    if (revealedSteps === 0) return "0%";

    // Calculate height to reach the last revealed step
    const stepHeight = 100 / steps.length;
    const targetHeight = revealedSteps * stepHeight;
    return `${Math.min(targetHeight, 100)}%`;
  };

  return (
    <div className="max-w-[80%] border border-border bg-card h-fit rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-card-foreground font-medium">Research</span>
        </div>
        {/* <div className="flex items-center gap-2 text-sm hidden">
          <Button
            onClick={startAnimation}
            disabled={isAnimating}
            size="sm"
            className="bg-muted hover:bg-muted/80 text-card-foreground"
          >
            <Play className="w-4 h-4 mr-1" />
            Start
          </Button>
          <Button
            onClick={resetAnimation}
            size="sm"
            variant="outline"
            className="border-border text-card-foreground hover:bg-muted bg-transparent"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div> */}
      </div>

      {/* Research Steps */}
      <div className="p-4">
        <div className="relative" style={{ minHeight: "400px" }}>
          {/* Progress Bar Background - only show if there are revealed steps */}
          <AnimatePresence>
            {steps.some((step) => step.status === "revealed") && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute left-2 top-6 w-px bg-muted"
                style={{
                  height: `${
                    (steps.filter((step) => step.status === "revealed").length /
                      steps.length) *
                    100
                  }%`,
                  maxHeight: "calc(100% - 48px)",
                }}
              />
            )}
          </AnimatePresence>

          {/* Progress Bar Fill */}
          <motion.div
            className="absolute left-2 top-6 w-px bg-primary"
            initial={{ height: "0%" }}
            animate={{
              height: getProgressBarHeight(),
            }}
            transition={{
              duration: 0.45,
              ease: "easeInOut",
            }}
            style={{
              maxHeight: "calc(100% - 48px)",
            }}
          />

          <div className="space-y-6">
            {steps.map((step, index) => {
              const shouldShow = step.status !== "hidden";

              return (
                <AnimatePresence key={step.id}>
                  {shouldShow && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut",
                        delay: step.status === "revealed" ? 0.12 : 0,
                      }}
                      className="flex items-start gap-3 relative"
                    >
                      {/* Icon with background */}
                      <div className="relative z-10 flex-shrink-0 mt-1">
                        <motion.div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                            step.status === "revealed"
                              ? "bg-primary border-primary"
                              : step.status === "searching" ||
                                step.status === "completed"
                              ? "bg-muted border-muted"
                              : "bg-muted/50 border-muted/50"
                          }`}
                          animate={{
                            scale: step.status === "revealed" ? [1, 1.1, 1] : 1,
                            boxShadow:
                              step.status === "revealed"
                                ? "0 0 0 2px rgba(var(--primary), 0.3)"
                                : "none",
                          }}
                          transition={{ duration: 0.18 }}
                        >
                          <motion.div
                            key={`${step.id}-${step.status}`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.12 }}
                          >
                            {getIcon(step.icon, step.status)}
                          </motion.div>
                        </motion.div>
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0 pb-2">
                        <div className="flex items-center gap-2">
                          {/* Step Title with shimmer if searching/completed */}
                          {step.status === "searching" ||
                          step.status === "completed" ? (
                            <TextShimmer
                              className="font-mono text-primary/20 text-sm"
                              duration={1}
                            >
                              {step.status === "searching"
                                ? "Searching..."
                                : step.title}
                            </TextShimmer>
                          ) : (
                            <motion.h3
                              className="font-medium text-sm text-card-foreground"
                              animate={{ color: "hsl(var(--card-foreground))" }}
                              transition={{ duration: 0.18 }}
                            >
                              {step.title}
                            </motion.h3>
                          )}

                          {(step.status === "searching" ||
                            step.status === "completed") && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex items-center"
                            >
                              <motion.div
                                className="w-0.5 h-4 bg-muted-foreground"
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{
                                  duration: 0.6,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "easeInOut",
                                }}
                              />
                            </motion.div>
                          )}
                        </div>

                        <AnimatePresence>
                          {step.description && step.status === "revealed" && (
                            <motion.p
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.22, delay: 0.12 }}
                              className="text-xs mt-1 leading-relaxed text-foreground/80"
                            >
                              {step.description}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
