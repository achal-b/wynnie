"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import { ORDERS } from "@/lib/constants";
import { sortOrdersByDateDesc } from "@/lib/utils";
import { motion } from "motion/react";
import { FiShield } from "react-icons/fi";

const getStatusConfig = (status: string) => {
  switch (status) {
    case "delivered":
      return {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950/20",
        textColor: "text-green-700 dark:text-green-400",
        borderColor: "border-green-200 dark:border-green-800",
      };
    case "in-transit":
      return {
        icon: Truck,
        color: "text-walmart-true-blue",
        bgColor: "bg-walmart-sky-blue/20 dark:bg-walmart-true-blue/10",
        textColor: "text-walmart-true-blue dark:text-walmart-sky-blue",
        borderColor:
          "border-walmart-sky-blue/30 dark:border-walmart-true-blue/30",
      };
    case "processing":
      return {
        icon: Clock,
        color: "text-walmart-everyday-blue",
        bgColor: "bg-walmart-spark-yellow/20 dark:bg-walmart-everyday-blue/10",
        textColor: "text-walmart-everyday-blue dark:text-walmart-spark-yellow",
        borderColor:
          "border-walmart-spark-yellow/30 dark:border-walmart-everyday-blue/30",
      };
    default:
      return {
        icon: Package,
        color: "text-foreground/80",
        bgColor: "bg-muted/50",
        textColor: "text-foreground/80",
        borderColor: "border-border",
      };
  }
};

export default function OrdersPage() {
  const sortedOrders = sortOrdersByDateDesc(ORDERS);

  return (
    <div className="bg-background  font-light space-y-10 min-h-screen">
      {/* Orders Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 mt-3 md:mt-0">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-walmart-true-blue/10 dark:bg-walmart-true-blue/20">
              <Package className="h-4 w-4 text-walmart-true-blue" />
            </div>
            <div>
              <h3 className="font-medium text-sm text-foreground">
                Order History
              </h3>
              <p className="text-xs text-foreground/80 mt-1">
                Track your recent orders and manage deliveries
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {sortedOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Card
                key={order.id}
                className="overflow-hidden border-border hover:border-walmart-true-blue/30 duration-150 hover:shadow-md transition-all  hover:scale-[1.01]"
              >
                <div className="space-y-4">
                  {/* Order Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {order.id}
                      </p>
                      <p className="text-xs text-foreground/80">{order.date}</p>
                    </div>
                    <Badge
                      className={`${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} border px-3 py-1 text-xs font-medium`}
                    >
                      <StatusIcon className="h-3 w-3 mr-1.5" />
                      {order.status.replace("-", " ")}
                    </Badge>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    <p className="text-sm text-foreground/80 font-medium">
                      {order.itemCount} items
                    </p>
                    <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
                      {order.items.join(", ")}
                    </p>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-foreground/80">Total:</span>
                      <span className="font-semibold text-foreground">
                        {order.total}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-foreground/80">Delivery:</span>
                      <span className="text-foreground">
                        {order.estimatedDelivery}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent border-border hover:border-walmart-true-blue hover:bg-walmart-sky-blue/10 text-foreground hover:text-walmart-true-blue transition-colors"
                    >
                      Track Order
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent border-border hover:border-walmart-true-blue hover:bg-walmart-sky-blue/10 text-foreground hover:text-walmart-true-blue transition-colors"
                    >
                      Reorder
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-foreground/80 hover:text-foreground hover:bg-muted/50"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
