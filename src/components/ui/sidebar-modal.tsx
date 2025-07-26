"use client";

import { TbBrandWalmart } from "react-icons/tb";
import { useTheme } from "next-themes";
import {
  FiShoppingBag,
  FiMapPin,
  FiCreditCard,
  FiSettings,
  FiMoon,
  FiSun,
  FiX,
  FiMessageCircle,
  FiPackage,
} from "react-icons/fi";
import { useSidebar } from "@/contexts/SidebarContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { PWAInstallButton } from "@/components/PWAInstallButton";

const sidebarLinks = [
  { label: "Chat", icon: FiMessageCircle, path: "/dashboard" },
  { label: "Orders", icon: FiShoppingBag, path: "/dashboard/orders" },
  {
    label: "Addresses",
    icon: FiMapPin,
    path: "/dashboard/addresses",
  },
  {
    label: "Payment Methods",
    icon: FiCreditCard,
    path: "/dashboard/payment-methods",
  },
  { label: "Subscription", icon: FiPackage, path: "/dashboard/subscription" },
  { label: "Settings", icon: FiSettings, path: "/dashboard/settings" },
];

export default function Sidebar() {
  const { isOpen, closeSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const isMounted = useIsMounted();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleNavClick = () => {
    // Only close sidebar on mobile
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      closeSidebar();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/5 backdrop-blur-xs z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col px-4 py-4 z-50 border-r border-sidebar-border transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-walmart-true-blue p-2 rounded-lg">
              <TbBrandWalmart className="h-6 w-6 text-[#ffc220]" />
            </div>
            <div>
              <div className="font-bold text-xl uppercase text-walmart-true-blue">
                Wynnie
              </div>
              <div className="text-xs text-walmart-everyday-blue">
                By Wynnie
              </div>
            </div>
          </Link>
          {/* Close button only visible on mobile */}
          <button
            onClick={closeSidebar}
            className="p-2 rounded-lg hover:bg-sidebar-foreground/5 transition-colors lg:hidden text-sidebar-foreground"
            aria-label="Close sidebar"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav>
          <div className="text-xs text-foreground/80 mb-2 font-medium uppercase tracking-wide">
            Navigation
          </div>
          <ul className="space-y-1">
            {sidebarLinks.map((item) => {
              const isActive = isMounted && pathname === item.path;
              return (
                <li key={item.label}>
                  <Link
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                        : "hover:bg-sidebar-foreground/5 text-sidebar-foreground"
                    }`}
                    onClick={handleNavClick}
                  >
                    <item.icon className="h-4 w-4 text-walmart-true-blue" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Preferences */}
        <div className="mt-6">
          <div className="text-xs text-foreground/80 mb-2 font-medium uppercase tracking-wide">
            Preferences
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-foreground/5 transition-colors w-full text-sidebar-foreground"
          >
            {isMounted ? (
              theme === "light" ? (
                <FiMoon className="h-4 w-4" />
              ) : (
                <FiSun className="h-4 w-4" />
              )
            ) : (
              <FiMoon className="h-4 w-4" />
            )}
            <span className="text-sm">
              {isMounted
                ? theme === "light"
                  ? "Dark Mode"
                  : "Light Mode"
                : "Dark Mode"}
            </span>
          </button>
        </div>

        {/* PWA Install Button */}
        <div className="mt-auto pt-4 border-t border-sidebar-border">
          <PWAInstallButton variant="full" />
        </div>
      </aside>
    </>
  );
}
