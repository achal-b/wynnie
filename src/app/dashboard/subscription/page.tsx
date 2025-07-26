"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { CartModal } from "@/components/CartModal";
import {
  Crown,
  Check,
  Star,
  Calendar,
  Package,
  CreditCard,
} from "lucide-react";

const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic",
    price: 199,
    period: "month",
    description: "Perfect for occasional shoppers",
    features: [
      "Free delivery on orders above ₹500",
      "Basic AI recommendations",
      "Email support",
      "Order tracking",
    ],
    popular: false,
    current: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: 499,
    period: "month",
    description: "Best for regular shoppers",
    features: [
      "Free delivery on all orders",
      "Advanced AI recommendations",
      "Priority customer support",
      "Early access to deals",
      "Monthly grocery credits ₹100",
      "Express delivery options",
    ],
    popular: true,
    current: true,
  },
];

const currentSubscription = {
  plan: "Premium",
  status: "Active",
  nextBilling: "Feb 15, 2024",
  amount: "₹199",
};

const orderHistory = [
  {
    id: "SUB-001",
    date: "Jan 15, 2024",
    amount: "₹199",
    status: "Paid",
    plan: "Premium",
  },
  {
    id: "SUB-002",
    date: "Dec 15, 2023",
    amount: "₹199",
    status: "Paid",
    plan: "Premium",
  },
  {
    id: "SUB-003",
    date: "Nov 15, 2023",
    amount: "₹99",
    status: "Paid",
    plan: "Basic",
  },
];

export default function SubscriptionsPage() {
  return (
    <div className=" bg-background space-y-10 font-light">
      <div className="space-y-6">
        {/* Current Subscription */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Crown className="h-5 w-5 text-walmart-true-blue" />
              Current Subscription
            </CardTitle>
          </CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg text-foreground">
                {currentSubscription.plan} Plan
              </h3>
              <p className="text-sm text-foreground/80">
                Status:{" "}
                <span className="text-green-600 font-medium">
                  {currentSubscription.status}
                </span>
              </p>
            </div>
            <Badge className="bg-walmart-true-blue text-white dark:bg-walmart-true-blue dark:text-white">
              {currentSubscription.amount}/month
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-foreground/80" />
              <span className="text-foreground/80">
                Next billing: {currentSubscription.nextBilling}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-foreground/80" />
              <span className="text-foreground/80">Auto-renewal enabled</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-border hover:border-walmart-true-blue hover:bg-walmart-sky-blue/10 text-foreground hover:text-walmart-true-blue"
            >
              Manage Subscription
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-border hover:border-walmart-true-blue hover:bg-walmart-sky-blue/10 text-foreground hover:text-walmart-true-blue"
            >
              Cancel Subscription
            </Button>
          </div>
        </Card>

        {/* Subscription Plans */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">
            Subscription Plans
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {subscriptionPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative border-border ${
                  plan.popular ? "border-walmart-true-blue shadow-lg" : ""
                } ${
                  plan.current
                    ? "bg-walmart-sky-blue/5 dark:bg-walmart-true-blue/5"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-walmart-true-blue text-white dark:bg-walmart-true-blue dark:text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-lg text-foreground">
                    {plan.name}
                  </CardTitle>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-foreground">
                      ₹{plan.price}
                      <span className="text-sm font-normal text-foreground/80">
                        /{plan.period}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/80">
                      {plan.description}
                    </p>
                  </div>
                </CardHeader>

                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-walmart-true-blue dark:text-walmart-sky-blue mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={
                    plan.current
                      ? "outline"
                      : plan.popular
                      ? "default"
                      : "outline"
                  }
                  disabled={plan.current}
                  style={{
                    backgroundColor: plan.popular ? "#0071ce" : undefined,
                    color: plan.popular ? "white" : undefined,
                    borderColor: plan.current ? "#0071ce" : undefined,
                  }}
                  className={`w-full ${
                    plan.popular
                      ? "bg-walmart-true-blue hover:bg-walmart-bentonville-blue text-white"
                      : plan.current
                      ? "border-walmart-true-blue text-walmart-true-blue hover:bg-walmart-sky-blue/10"
                      : "border-border text-foreground hover:border-walmart-true-blue hover:bg-walmart-sky-blue/10"
                  }`}
                >
                  {plan.current ? "Current Plan" : `Upgrade to ${plan.name}`}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Package className="h-5 w-5 text-walmart-true-blue" />
              Billing History
            </CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {orderHistory.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-walmart-true-blue/30 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm text-foreground">
                    {order.plan} Plan
                  </p>
                  <p className="text-xs text-foreground/80">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm text-foreground">
                    {order.amount}
                  </p>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400"
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
