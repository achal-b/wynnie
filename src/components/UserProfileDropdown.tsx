"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, User, Settings, MapPin } from "lucide-react";
import Link from "next/link";

export function UserProfileDropdown() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    // Here you would typically make an API call to update the user's notification preferences
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-yellow-500 text-black font-semibold">
              PL
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-0" align="end">
        {/* Profile Header */}
        <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-yellow-500 text-black font-semibold text-lg">
                PL
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Praveen Lodhi</p>
              <p className="text-sm text-foreground/80">praveen@example.com</p>
            </div>
          </div>
        </div>

        <div className="p-2">
          <DropdownMenuItem asChild>
            <Link
              href="/profile"
              className="flex items-center gap-3 p-3 cursor-pointer"
            >
              <User className="h-4 w-4" />
              <span>Profile Settings</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/track-order"
              className="flex items-center gap-3 p-3 cursor-pointer"
            >
              <MapPin className="h-4 w-4" />
              <span>Track Order</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={toggleNotifications}
            className="flex items-center gap-3 p-3 cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            <span>
              {notificationsEnabled ? "Disable" : "Enable"} Notifications
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/settings"
              className="flex items-center gap-3 p-3 cursor-pointer"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer text-red-600 focus:text-red-600">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
