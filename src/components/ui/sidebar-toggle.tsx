"use client";

import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { useSidebar } from "@/contexts/SidebarContext";

export default function SidebarToggle() {
  const { openSidebar } = useSidebar();

  return (
    <button
      onClick={openSidebar}
      className="p-2 rounded-lg hover:bg-muted transition-colors lg:hidden"
      aria-label="Open sidebar"
    >
      <HiOutlineMenuAlt1 className="h-5.5 w-5.5 text-foreground" />
    </button>
  );
}
