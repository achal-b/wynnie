"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Smartphone,
  CreditCard,
  Building2,
  Wallet,
  Check,
  Plus,
  ChevronRight,
} from "lucide-react";
import { CartModal } from "@/components/CartModal";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";

const paymentMethods = [
  {
    id: "upi",
    title: "UPI Payment",
    subtitle: "PhonePe, Google Pay, BHIM",
    icon: Smartphone,
    color: "text-walmart-true-blue",
    bgColor: "bg-walmart-sky-blue/20 dark:bg-walmart-true-blue/10",
    recommended: true,
  },
  {
    id: "card",
    title: "Credit/Debit Card",
    subtitle: "Visa, Mastercard, RuPay",
    icon: CreditCard,
    color: "text-walmart-true-blue",
    bgColor: "bg-walmart-sky-blue/20 dark:bg-walmart-true-blue/10",
    recommended: false,
  },
  {
    id: "netbanking",
    title: "Net Banking",
    subtitle: "All major banks supported",
    icon: Building2,
    color: "text-walmart-true-blue",
    bgColor: "bg-walmart-sky-blue/20 dark:bg-walmart-true-blue/10",
    recommended: false,
  },
  {
    id: "wallet",
    title: "Digital Wallets",
    subtitle: "PayPal, Amazon Pay, etc.",
    icon: Wallet,
    color: "text-walmart-true-blue",
    bgColor: "bg-walmart-sky-blue/20 dark:bg-walmart-true-blue/10",
    recommended: false,
  },
];

const paymentFeatures = [
  "Instant payment confirmation",
  "Auto-deduction for future orders",
  "Secure transaction history",
  "Multiple payment backup options",
];

export default function PaymentsPage() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  return (
    <div className="bg-background font-light space-y-10">
      <div className="space-y-10">
        {/* Security Banner */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10        mt-3 md:mt-0">
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

        {/* Payment Methods */}
        <div className="space-y-3">
          <h2 className="text-base font-medium text-foreground">
            Choose Payment Method
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <Card
                key={method.id}
                className={`cursor-pointer transition-all duration-200 border-border ${
                  selectedMethod === method.id
                    ? "ring-2 ring-walmart-true-blue border-walmart-true-blue/50"
                    : "hover:border-walmart-true-blue/30 hover:shadow-sm"
                }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${method.bgColor}`}>
                    <method.icon className={`h-4 w-4 ${method.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm text-foreground">
                        {method.title}
                      </h3>
                      {method.recommended && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-2 py-0.5 bg-walmart-true-blue/10 text-walmart-true-blue border-walmart-true-blue/20 dark:bg-walmart-sky-blue/20 dark:text-walmart-sky-blue dark:border-walmart-sky-blue/30"
                        >
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-foreground/80 mt-0.5">
                      {method.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={`h-4 w-4 rounded-full flex items-center justify-center ${
                        selectedMethod === method.id
                          ? "border-walmart-true-blue bg-walmart-true-blue"
                          : "border-muted-foreground/30 border-2"
                      }`}
                    >
                      {selectedMethod === method.id && (
                        <div className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {/* Add New Payment Method */}
          <Card className="border-dashed border-muted-foreground/20 bg-transparent w-full hover:border-walmart-true-blue/30 transition-colors">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-auto text-foreground hover:text-walmart-true-blue hover:bg-walmart-sky-blue/10"
            >
              <div className="p-2 rounded-lg bg-muted/50">
                <Plus className="h-4 w-4 text-foreground/80" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm text-foreground">
                  Add New Payment Method
                </p>
                <p className="text-xs text-foreground/80 font-light">
                  Save cards, UPI IDs, or bank accounts
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-foreground/80 ml-auto" />
            </Button>
          </Card>
        </div>

        {/* Payment Features */}
        <div className="space-y-3">
          <h3 className="text-base font-medium text-foreground">
            Payment Features
          </h3>

          <div className="space-y-3 grid grid-cols-1 md:grid-cols-2">
            {paymentFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-walmart-true-blue/10 dark:bg-walmart-sky-blue/20">
                  <Check className="h-3 w-3 text-walmart-true-blue dark:text-walmart-sky-blue" />
                </div>
                <p className="text-sm text-foreground/80">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        {selectedMethod && (
          <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-border">
            <Button
              className="w-full bg-walmart-true-blue hover:bg-walmart-bentonville-blue text-white"
              size="lg"
            >
              Continue with{" "}
              {paymentMethods.find((m) => m.id === selectedMethod)?.title}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
