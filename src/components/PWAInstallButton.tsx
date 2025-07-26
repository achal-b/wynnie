"use client";

import { useState, useEffect } from "react";
import { FiDownload } from "react-icons/fi";
import { usePWA } from "@/hooks/use-pwa";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallButtonProps {
  variant?: "full" | "compact";
  className?: string;
}

export function PWAInstallButton({
  variant = "full",
  className = "",
}: PWAInstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { isInstalled, isStandalone } = usePWA();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      console.log(`PWA installation ${outcome}`);
    } catch (error) {
      console.warn("Installation failed:", error);
    }
  };

  // Don't show if already installed/standalone
  if (isInstalled || isStandalone) {
    return null;
  }

  // If no automatic install prompt is available but not installed, show manual install info
  const getManualInstallText = () => {
    if (!isMounted) return "Install App"; // Default text during SSR

    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("android") && userAgent.includes("chrome")) {
      return "Add to Home Screen";
    } else if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
      return "Add to Home Screen";
    }
    return "Install App";
  };

  const handleManualInstall = () => {
    if (!isMounted) return;

    const userAgent = navigator.userAgent.toLowerCase();
    let instructions = "";

    if (userAgent.includes("android") && userAgent.includes("chrome")) {
      instructions =
        'Tap the menu (⋮) in Chrome and select "Add to Home screen" or look for "Install app"';
    } else if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
      instructions =
        'Tap the Share button (□↗) and select "Add to Home Screen"';
    } else {
      instructions =
        "Look for the install button in your browser's address bar or menu";
    }

    alert(`To install Wynnie:\n\n${instructions}`);
  };

  if (variant === "compact") {
    return (
      <button
        onClick={deferredPrompt ? handleInstallClick : handleManualInstall}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition w-full text-sm ${className}`}
      >
        <FiDownload className="h-4 w-4" />
        <span>{deferredPrompt ? "Install App" : getManualInstallText()}</span>
      </button>
    );
  }

  return (
    <button
      onClick={deferredPrompt ? handleInstallClick : handleManualInstall}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg bg-[#13498D] hover:bg-[#0f3a6f] text-white transition w-full text-sm font-medium ${className}`}
    >
      <FiDownload className="h-4 w-4" />
      <span>{deferredPrompt ? "Install Wynnie" : getManualInstallText()}</span>
    </button>
  );
}
