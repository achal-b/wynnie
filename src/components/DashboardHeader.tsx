"use client";

import { IoCartOutline, IoNotificationsOutline } from "react-icons/io5";
import ProfileModal from "@/components/ui/profile-modal";
import { useRouteTitle } from "@/lib/useRouteTitle";
import SidebarToggle from "@/components/ui/sidebar-toggle";
import { NotificationDropdown } from "./NotificationDropdown";
import { CartModal } from "./CartModal";

export default function DashboardHeader() {
  const title = useRouteTitle();
  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
      <div className="flex justify-between items-center py-2.5 max-w-6xl mx-2 lg:mx-15">
        <div className="flex items-center gap-1">
          <SidebarToggle />
          <h1 className="text-lg font-semibold capitalize line-clamp-1 text-walmart-true-blue">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          {/* <IoNotificationsOutline className="h-5 w-5" /> */}
          <NotificationDropdown />
          <CartModal />
          <ProfileModal
            name="Praveen Lodhi"
            email="praveenlodhi@gmail.com"
            avatarUrl="https://pbs.twimg.com/profile_images/1929077687391498243/iDx3yJFh_400x400.jpg"
            onSettings={() => {}}
            onSignOut={() => {}}
          />
        </div>
      </div>
    </header>
  );
}
