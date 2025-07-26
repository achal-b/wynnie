"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ServiceWorkerHandler() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null
  );

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New service worker is available
                setWaitingWorker(newWorker);
                setShowUpdatePrompt(true);
              }
            });
          }
        });
      });

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        // Service worker has been updated and is now controlling the page
        window.location.reload();
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
      setShowUpdatePrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
  };

  if (!showUpdatePrompt) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 bg-background border border-border p-4 rounded-lg shadow-lg flex items-center justify-between z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="flex-1 mr-3">
        <p className="text-sm font-medium">Update Available</p>
        <p className="text-xs text-foreground/80">
          A new version of Wynnie is ready
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleDismiss}>
          Later
        </Button>
        <Button variant="default" size="sm" onClick={handleUpdate}>
          Update
        </Button>
      </div>
    </div>
  );
}
