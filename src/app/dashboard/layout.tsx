"use client";

import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/ui/sidebar-modal";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.replace("/login");
    }
  }, [user, router]);

  if (user === null) {
    // Optionally show a loading spinner here
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar - always present on desktop, overlay on mobile */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden max-w-6xl mx-5 lg:mx-15 ">
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 lg:left-64 z-40">
            <DashboardHeader />
          </div>

          {/* Content */}
          <main
            className="flex-1 overflow-auto pb-20 pt-20 lg:pt-22"
            data-lenis-prevent
          >
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
