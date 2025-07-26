"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function NotificationsPreferencesSettingsPage() {
  const [settings, setSettings] = useState({
    push: false,
    email: true,
    sms: true,
    recommendations: true,
    aiTips: false,
    promo: true,
    locationServices: true,
  });

  const handleChange = (key: keyof typeof settings) => (value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="font-light capitalize">
      <div className="space-y-5">
        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-walmart-true-blue/30 transition-all duration-200">
          <div>
            <p className="font-medium text-sm text-foreground">Language</p>
            <p className="text-xs text-foreground/80">English (US)</p>
          </div>
          <Button
            variant="outline"
            className="text-xs px-4 py-1 border-border text-foreground hover:bg-walmart-sky-blue/10 dark:hover:bg-walmart-true-blue/10 hover:text-walmart-true-blue hover:border-walmart-true-blue/30"
            onClick={() => alert("Change Language")}
          >
            🌐 Change
          </Button>
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-walmart-true-blue/30 transition-all duration-200">
          <div>
            <p className="font-medium text-sm text-foreground">Currency</p>
            <p className="text-xs text-foreground/80">Indian Rupee (₹)</p>
          </div>
          <Button
            variant="outline"
            className="text-xs px-4 py-1 border-border text-foreground hover:bg-walmart-sky-blue/10 dark:hover:bg-walmart-true-blue/10 hover:text-walmart-true-blue hover:border-walmart-true-blue/30"
            onClick={() => alert("Change Currency")}
          >
            <span className="flex items-center gap-2">
              <span className="text-xs">INR</span>
            </span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-walmart-true-blue/30 transition-all duration-200">
          <div>
            <p className="font-medium text-sm text-foreground">
              Location Services
            </p>
            <p className="text-xs text-foreground/80">
              For better delivery experience
            </p>
          </div>
          <Switch
            checked={settings.locationServices}
            onCheckedChange={handleChange("locationServices")}
          />
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-walmart-true-blue/30 transition-all duration-200">
          <div>
            <p className="font-medium text-sm text-foreground">
              Push Notifications
            </p>
            <p className="text-xs text-foreground/80">
              Order updates and delivery alerts
            </p>
          </div>
          <Switch
            checked={settings.push}
            onCheckedChange={handleChange("push")}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-walmart-true-blue/30 transition-all duration-200">
          <div>
            <p className="font-medium text-sm text-foreground">
              Email Notifications
            </p>
            <p className="text-xs text-foreground/80">
              Promotional offers and updates
            </p>
          </div>
          <Switch
            checked={settings.email}
            onCheckedChange={handleChange("email")}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-walmart-true-blue/30 transition-all duration-200">
          <div>
            <p className="font-medium text-sm text-foreground">SMS Alerts</p>
            <p className="text-xs text-foreground/80">
              Delivery and payment confirmations
            </p>
          </div>
          <Switch
            checked={settings.sms}
            onCheckedChange={handleChange("sms")}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-walmart-true-blue/30 transition-all duration-200">
          <div>
            <p className="font-medium text-sm text-foreground">
              Personalized Recommendations
            </p>
            <p className="text-xs text-foreground/80">
              Get product suggestions powered by AI
            </p>
          </div>
          <Switch
            checked={settings.recommendations}
            onCheckedChange={handleChange("recommendations")}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-walmart-true-blue/30 transition-all duration-200">
          <div>
            <p className="font-medium text-sm text-foreground">
              AI Assistant Tips
            </p>
            <p className="text-xs text-foreground/80">
              Receive helpful tips from your shopping assistant
            </p>
          </div>
          <Switch
            checked={settings.aiTips}
            onCheckedChange={handleChange("aiTips")}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-walmart-true-blue/30 transition-all duration-200">
          <div>
            <p className="font-medium text-sm text-foreground">
              Promotional Offers
            </p>
            <p className="text-xs text-foreground/80">
              Exclusive deals and discounts
            </p>
          </div>
          <Switch
            checked={settings.promo}
            onCheckedChange={handleChange("promo")}
          />
        </div>
      </div>
    </div>
  );
}
