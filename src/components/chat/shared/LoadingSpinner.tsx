import { motion } from "motion/react";
import { ReactNode } from "react";

interface LoadingSpinnerProps {
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "search" | "processing";
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
};

const variantClasses = {
  default: "text-primary",
  search: "text-yellow-600",
  processing: "text-blue-600",
};

export const LoadingSpinner = ({
  icon = "⏳",
  title = "Loading...",
  subtitle = "Please wait while we process your request",
  className = "",
  size = "md",
  variant = "default",
}: LoadingSpinnerProps) => {
  return (
    <div className={`text-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className={`${sizeClasses[size]} mx-auto mb-4 text-2xl`}
      >
        {icon}
      </motion.div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-foreground/70">{subtitle}</p>
    </div>
  );
};
