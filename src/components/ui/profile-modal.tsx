"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./dialog";
import {
  FiLogOut,
  FiMapPin,
  FiShoppingCart,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { Separator } from "./separator";
import Link from "next/link";

interface ProfileModalProps {
  name: string;
  email: string;
  avatarUrl: string | undefined;
  onSettings: () => void;
  onSignOut: () => void;
}

const menuItems = [
  {
    label: "Profile Settings",
    icon: <FiUser />,
    href: "/dashboard/settings/profile",
  },
  // {
  //   label: "Addresses",
  //   icon: <FiMapPin />,
  //   href: "/dashboard/settings/addresses",
  // },
  // {
  //   label: "Order History",
  //   icon: <FiShoppingCart />,
  //   href: "/dashboard/orders",
  // },
  {
    label: "Track Order",
    icon: <FiMapPin />,
    href: "/dashboard/track-order",
  },
];

export default function ProfileModal({
  name,
  email,
  avatarUrl,
  onSignOut,
}: ProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTriggerClick = () => setIsOpen((prev) => !prev);

  return (
    <div >
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <span className="cursor-pointer" onClick={handleTriggerClick}>
            <Avatar>
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-yellow-400">
                {name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </span>
        </DialogTrigger>
        <DialogContent className="absolute top-[8vh] right-[4.5%] p-0 w-64  text-foreground rounded-lg overflow-hidden">
          <DialogTitle className="sr-only">Profile Modal</DialogTitle>
          <div className="flex flex-col">
            {/* User Info */}
            <div className="flex items-center gap-3 px-3 py-2 border-primary/20 bg-gradient-to-r from-primary/10 to-primary/40">
              <Avatar className="h-10 w-10">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-yellow-600 text-xl">
                  {name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="">
                <div className="font-semibold  text-[15px] text-walmart-true-blue">
                  {name}
                </div>
                <div className="text-xs text-walmart-true-blue/50 font-light">
                  {email}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item) => (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center w-full px-4 py-2 hover:bg-primary/10 text-left gap-3 justify-start"
                >
                  <span className="h-3.5 w-3.5">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="px-2 pb-1">
              <Separator />
            </div>

            {/* Sign Out */}
            <button
              className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-[#27272a] gap-3 mb-2"
              onClick={onSignOut}
            >
              <span className="text-lg">
                <FiLogOut className="text-red-500 h-4 w-4" />
              </span>
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
