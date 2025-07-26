"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Package, CreditCard, Truck, Gift } from "lucide-react";
import Link from "next/link";

const notifications = [
  {
    id: "1",
    title: "Order Delivered",
    message: "Your order #ORD-001 has been delivered successfully",
    time: "2 min ago",
    icon: Package,
    unread: true,
  },
  {
    id: "2",
    title: "Payment Confirmed",
    message: "Payment of ₹1,899 has been processed",
    time: "1 hour ago",
    icon: CreditCard,
    unread: true,
  },
  {
    id: "3",
    title: "Order Shipped",
    message: "Your order #ORD-002 is on the way",
    time: "3 hours ago",
    icon: Truck,
    unread: false,
  },
  {
    id: "4",
    title: "Special Offer",
    message: "Get 20% off on your next grocery order",
    time: "1 day ago",
    icon: Gift,
    unread: false,
  },
];

export function NotificationDropdown() {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center text-xs font-light bg-walmart-true-blue text-white">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <Link href="/dashboard/notifications">
              <Button variant="ghost" size="sm" className="text-xs">
                View All
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.slice(0, 4).map((notification) => (
            <div
              key={notification.id}
              className={`p-3 border-b last:border-0 hover:bg-sidebar-foreground/2 cursor-pointer ${
                notification.unread
                  ? "bg-walmart-true-blue/50 dark:bg-walmart-true-blue/20"
                  : ""
              }`}
            >
              <div className="flex gap-3">
                <div className={`p-1 rounded-sm h-fit flex-shrink-0`}>
                  <notification.icon className={`h-4 w-4`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-sm line-clamp-1">
                      {notification.title}
                    </p>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-xs text-foreground/80 line-clamp-2 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-foreground/80 mt-1">
                    {notification.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-foreground/80 mx-auto mb-4" />
            <p className="text-foreground/80">No notifications yet</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
