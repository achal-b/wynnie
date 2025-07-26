import { OfflineStorageManager } from "./offline-storage";

export class PWAUtils {
  static async handleOfflineForm(
    formData: FormData,
    endpoint: string
  ): Promise<boolean> {
    if (!navigator.onLine) {
      // Store form data for later sync
      const pendingRequests =
        (await OfflineStorageManager.getItem<any[]>("pending_requests")) || [];
      pendingRequests.push({
        id: Date.now().toString(),
        endpoint,
        data: Object.fromEntries(formData.entries()),
        timestamp: Date.now(),
        method: "POST",
      });

      await OfflineStorageManager.setItem("pending_requests", pendingRequests);
      return true;
    }
    return false;
  }

  static async syncPendingRequests(): Promise<void> {
    if (!navigator.onLine) return;

    const pendingRequests =
      (await OfflineStorageManager.getItem<any[]>("pending_requests")) || [];

    for (const request of pendingRequests) {
      try {
        const response = await fetch(request.endpoint, {
          method: request.method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request.data),
        });

        if (response.ok) {
          // Remove successfully synced request
          const updatedRequests = pendingRequests.filter(
            (r) => r.id !== request.id
          );
          await OfflineStorageManager.setItem(
            "pending_requests",
            updatedRequests
          );
        }
      } catch (error) {
        console.warn("Failed to sync request:", error);
      }
    }
  }

  static async preloadCriticalResources(): Promise<void> {
    if ("caches" in window) {
      try {
        const cache = await caches.open("wynnie-critical-v1");

        const criticalUrls = [
          "/",
          "/offline",
          "/dashboard",
          "/api/products",
          "/manifest.json",
        ];

        await cache.addAll(criticalUrls);
      } catch (error) {
        console.warn("Failed to preload critical resources:", error);
      }
    }
  }

  static async checkForUpdates(): Promise<boolean> {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.update();
        return true;
      } catch (error) {
        console.warn("Failed to check for updates:", error);
        return false;
      }
    }
    return false;
  }

  static async getNetworkStatus(): Promise<{
    online: boolean;
    connectionType: string;
    effectiveType: string;
  }> {
    const navigator_connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    return {
      online: navigator.onLine,
      connectionType: navigator_connection?.type || "unknown",
      effectiveType: navigator_connection?.effectiveType || "unknown",
    };
  }

  static async estimateDataUsage(): Promise<{
    estimated: number;
    unit: string;
  }> {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;

      if (usage > 1024 * 1024) {
        return {
          estimated: Math.round((usage / (1024 * 1024)) * 100) / 100,
          unit: "MB",
        };
      } else if (usage > 1024) {
        return {
          estimated: Math.round((usage / 1024) * 100) / 100,
          unit: "KB",
        };
      } else {
        return {
          estimated: usage,
          unit: "bytes",
        };
      }
    }

    return {
      estimated: 0,
      unit: "unknown",
    };
  }

  static async clearAppData(): Promise<void> {
    try {
      // Clear all caches
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }

      // Clear localStorage
      Object.keys(localStorage)
        .filter((key) => key.startsWith("wynnie_"))
        .forEach((key) => localStorage.removeItem(key));

      // Clear IndexedDB if used
      if ("indexedDB" in window) {
        // Implementation would depend on your IndexedDB usage
      }

      console.log("App data cleared successfully");
    } catch (error) {
      console.error("Failed to clear app data:", error);
    }
  }

  static async shareContent(data: {
    title?: string;
    text?: string;
    url?: string;
  }): Promise<boolean> {
    if ("share" in navigator) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.warn("Web Share failed:", error);
        }
        return false;
      }
    }

    // Fallback to clipboard
    if (
      data.url &&
      "clipboard" in navigator &&
      "writeText" in (navigator as any).clipboard
    ) {
      try {
        await (navigator as any).clipboard.writeText(data.url);
        return true;
      } catch (error) {
        console.warn("Clipboard write failed:", error);
      }
    }

    return false;
  }

  static isInstalled(): boolean {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes("android-app://")
    );
  }

  static getInstallPrompt(): string {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
      return 'Tap the Share button and then "Add to Home Screen"';
    } else if (userAgent.includes("android")) {
      return 'Tap the menu button and then "Add to Home Screen" or "Install App"';
    } else {
      return "Look for the install button in your browser's address bar";
    }
  }
}
