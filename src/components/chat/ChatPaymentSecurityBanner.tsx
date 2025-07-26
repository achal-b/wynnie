import { Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ChatPaymentSecurityBanner() {
  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-walmart-true-blue/10 dark:bg-walmart-true-blue/20">
          <Shield className="h-4 w-4 text-walmart-true-blue" />
        </div>
        <div>
          <h3 className="font-medium text-sm text-foreground">
            Secure Payments
          </h3>
          <p className="text-xs text-foreground/80 mt-1">
            Bank-grade security with Juspay integration
          </p>
        </div>
      </div>
    </Card>
  );
}
