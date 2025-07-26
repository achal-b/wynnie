"use client";

import { useState, useEffect } from "react";

export function usePWA() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is running in standalone mode
    const checkStandalone = () => {
      return (
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes("android-app://")
      );
    };

    setIsStandalone(checkStandalone());

    // Check if app is installed
    if ("getInstalledRelatedApps" in navigator) {
      (navigator as any).getInstalledRelatedApps().then((apps: any[]) => {
        setIsInstalled(apps.length > 0);
      });
    }

    // Listen for beforeinstallprompt to know if app is installable
    const handleBeforeInstallPrompt = () => {
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
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

  return {
    isInstalled,
    isInstallable,
    isStandalone,
  };
}
