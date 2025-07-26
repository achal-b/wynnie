import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  cardClassName?: string;
  showHeader?: boolean;
  title?: string;
  icon?: ReactNode;
  gradient?: "primary" | "accent" | "success" | "warning" | "info";
  variant?: "default" | "outlined" | "filled";
}

const gradientClasses = {
  primary: "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30",
  accent: "bg-gradient-to-br from-accent/10 to-primary/10 border-accent/30",
  success:
    "bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30 border-green-300 dark:border-green-700",
  warning:
    "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800",
  info: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800",
};

const variantClasses = {
  default: "",
  outlined: "bg-card border border-border",
  filled: "bg-card/50",
};

export const AnimatedCard = ({
  children,
  delay = 0.2,
  className = "mt-3",
  cardClassName = "",
  showHeader = false,
  title,
  icon,
  gradient = "primary",
  variant = "default",
}: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={className}
    >
      <Card
        className={`${gradientClasses[gradient]} ${variantClasses[variant]} ${cardClassName}`}
      >
        {showHeader && title && (
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-card-foreground">
              {icon}
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className={showHeader ? "space-y-3" : ""}>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};
