import { ReactNode } from "react";

interface ProgressBarProps {
  progress: number; // 0 to 1
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  label?: ReactNode;
  variant?: "default" | "warning" | "success" | "info";
  height?: "sm" | "md" | "lg";
}

const variantClasses = {
  default: "bg-orange-200 dark:bg-orange-800",
  warning: "bg-yellow-200 dark:bg-yellow-800",
  success: "bg-green-200 dark:bg-green-800",
  info: "bg-blue-200 dark:bg-blue-800",
};

const barVariantClasses = {
  default: "bg-orange-500",
  warning: "bg-yellow-500",
  success: "bg-green-500",
  info: "bg-blue-500",
};

const heightClasses = {
  sm: "h-1",
  md: "h-1.5",
  lg: "h-2",
};

export const ProgressBar = ({
  progress,
  className = "",
  barClassName = "",
  showLabel = false,
  label,
  variant = "default",
  height = "md",
}: ProgressBarProps) => {
  const clampedProgress = Math.max(0, Math.min(1, progress));

  return (
    <div className={className}>
      {showLabel && label && (
        <div className="flex items-center justify-between text-xs text-foreground/80 mb-2">
          <span>{label}</span>
          <span>{Math.round(clampedProgress * 100)}%</span>
        </div>
      )}
      <div
        className={`w-full ${variantClasses[variant]} rounded-full ${heightClasses[height]}`}
      >
        <div
          className={`${barVariantClasses[variant]} ${heightClasses[height]} rounded-full transition-all duration-1000 ${barClassName}`}
          style={{ width: `${clampedProgress * 100}%` }}
        />
      </div>
    </div>
  );
};
