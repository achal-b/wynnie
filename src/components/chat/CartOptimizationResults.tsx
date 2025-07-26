import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingDown, Leaf } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { AnimatedCard } from "./shared";

interface CartOptimizationData {
  type: "cart";
  totalSavings: number;
  savingsPercentage: number;
  recommendedSubstitutions?: Array<{
    suggestedProduct: { name: string };
    reason: string;
    savings: number;
  }>;
  rollbackOpportunities?: Array<any>;
  sustainabilityScore: number;
}

interface CartOptimizationResultsProps {
  optimizationData: CartOptimizationData;
  onApplyOptimization?: () => void;
}

export const CartOptimizationResults = ({
  optimizationData,
  onApplyOptimization,
}: CartOptimizationResultsProps) => {
  return (
    <AnimatedCard
      showHeader
      title="Cart Optimization Results"
      icon={<TrendingDown className="h-4 w-4 text-primary" />}
      gradient="accent"
    >
      {optimizationData.totalSavings > 0 && (
        <div className="bg-card p-3 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold text-primary">
              Save {formatCurrency(optimizationData.totalSavings)}
            </span>
            <Badge className="bg-primary text-primary-foreground">
              {optimizationData.savingsPercentage.toFixed(1)}% OFF
            </Badge>
          </div>

          {optimizationData.recommendedSubstitutions
            ?.slice(0, 3)
            .map((sub, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center py-2 border-t border-border"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm text-card-foreground">
                    {sub.suggestedProduct.name}
                  </div>
                  <div className="text-xs text-foreground/80">{sub.reason}</div>
                </div>
                <div className="text-primary font-medium">
                  -{formatCurrency(sub.savings)}
                </div>
              </div>
            ))}

          {optimizationData.rollbackOpportunities &&
            optimizationData.rollbackOpportunities.length > 0 && (
              <div className="mt-2 text-xs text-destructive font-medium">
                🔥 {optimizationData.rollbackOpportunities.length} rollback
                deals available!
              </div>
            )}

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-foreground/80">
              <Leaf className="h-4 w-4 text-primary" />
              <span>
                Sustainability: {optimizationData.sustainabilityScore}%
              </span>
            </div>
            <Button size="sm" onClick={onApplyOptimization} className="text-xs">
              Apply All Savings
            </Button>
          </div>
        </div>
      )}
    </AnimatedCard>
  );
};
