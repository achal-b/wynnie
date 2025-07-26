import { Card, CardContent } from "@/components/ui/card";
import { Truck } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { AnimatedCard } from "./shared";

interface DeliveryOptimizationData {
  type: "delivery";
  recommendedDelivery?: {
    estimatedTime: string;
  };
  optimalWarehouse?: {
    name: string;
  };
  totalDeliveryCost?: number;
  lastMileCoordination?: {
    trackingId: string;
  };
}

interface DeliveryOptimizationResultsProps {
  optimizationData: DeliveryOptimizationData;
}

export const DeliveryOptimizationResults = ({
  optimizationData,
}: DeliveryOptimizationResultsProps) => {
  return (
    <AnimatedCard
      showHeader
      title="Delivery Optimization Complete"
      icon={<Truck className="h-4 w-4 text-primary" />}
      gradient="primary"
    >
          <div className="bg-card p-3 rounded-lg border border-border space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-card-foreground">
                Estimated Delivery:
              </span>
              <span className="text-primary font-bold">
                {optimizationData.recommendedDelivery?.estimatedTime}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-card-foreground">
                Warehouse:
              </span>
              <span className="text-sm text-foreground/80">
                {optimizationData.optimalWarehouse?.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-card-foreground">
                Delivery Cost:
              </span>
              <span className="text-primary">
                {formatCurrency(optimizationData.totalDeliveryCost || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-card-foreground">
                Tracking ID:
              </span>
              <span className="font-mono text-xs text-foreground/80">
                {optimizationData.lastMileCoordination?.trackingId}
              </span>
            </div>
          </div>
        </AnimatedCard>
      );
    };
