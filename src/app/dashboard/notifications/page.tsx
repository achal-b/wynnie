"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, CreditCard, Truck, Gift, Bell } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

const allNotifications = [
  {
    id: "1",
    title: "Order Delivered",
    message:
      "Your order #ORD-001 has been delivered successfully. Thank you for shopping with us!",
    time: "2 minutes ago",
    icon: Package,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    unread: true,
  },
  {
    id: "2",
    title: "Payment Confirmed",
    message:
      "Payment of ₹1,899 has been processed successfully for order #ORD-001",
    time: "1 hour ago",
    icon: CreditCard,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    unread: true,
  },
  {
    id: "3",
    title: "Order Shipped",
    message:
      "Your order #ORD-002 is on the way and will be delivered by tomorrow evening",
    time: "3 hours ago",
    icon: Truck,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    unread: false,
  },
  {
    id: "4",
    title: "Special Offer",
    message:
      "Get 20% off on your next grocery order. Use code SAVE20. Valid till tomorrow!",
    time: "1 day ago",
    icon: Gift,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    unread: false,
  },
  {
    id: "5",
    title: "Order Confirmed",
    message:
      "Your order #ORD-003 has been confirmed and is being prepared for shipment",
    time: "2 days ago",
    icon: Package,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    unread: false,
  },
  {
    id: "6",
    title: "Welcome to AI Shopping",
    message:
      "Welcome to our AI-powered shopping platform! Start chatting with our AI assistant to discover amazing products.",
    time: "1 week ago",
    icon: Gift,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    unread: false,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(allNotifications);

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="bg-background min-h-screen font-light space-y-5">
      {/* Notifications Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 mt-3 md:mt-0">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-walmart-true-blue/10 dark:bg-walmart-true-blue/20">
              <Bell className="h-4 w-4 text-walmart-true-blue" />
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-medium text-sm text-foreground">
                  Notifications Center
                </h3>
                <div className="flex items-center gap-5">
                  {/* Notification Count */}
                  <p className="text-xs text-foreground/80 font-light">
                    {notifications.length} notification
                    {notifications.length !== 1 ? "s" : ""}
                    {unreadCount > 0 && ` • ${unreadCount} unread`}
                  </p>

                  {/* Clear All Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-red-500 hover:text-red-600 font-light text-xs"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              <p className="text-xs text-foreground/80 mt-1">
                Stay updated with your orders, offers, and account activities
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="space-y-10">

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`cursor-pointer hover:border-walmart-true-blue/30 transition-all duration-200 ${
                notification.unread
                  ? "bg-walmart-sky-blue/5 dark:bg-walmart-true-blue/10 border-walmart-sky-blue/20 dark:border-walmart-true-blue/30 shadow-sm"
                  : "hover:shadow-md hover:scale-[1.01]"
              }`}
            >
              <div className="flex gap-4">
                <div
                  className={`p-3 h-fit rounded-lg ${notification.bgColor} flex-shrink-0`}
                >
                  <notification.icon
                    className={`h-5 w-5 ${notification.color}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm text-foreground">
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-foreground/80 whitespace-nowrap font-light">
                        {notification.time}
                      </span>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-walmart-true-blue rounded-full flex-shrink-0" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-3 font-light">
                    {notification.message}
                  </p>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    {notification.unread && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs px-3 bg-walmart-sky-blue/10 text-walmart-true-blue hover:bg-walmart-sky-blue/20 cursor-pointer font-light"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                      >
                        Mark as Read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs px-3 text-red-500/80 border border-red-500/50 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 cursor-pointer font-light"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-walmart-sky-blue/10 dark:bg-walmart-true-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="h-10 w-10 text-walmart-true-blue" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-foreground">
              All caught up!
            </h3>
            <p className="text-foreground/80 font-light">
              No notifications to show right now
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
