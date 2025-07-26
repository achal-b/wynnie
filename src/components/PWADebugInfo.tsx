"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DebugInfo {
  userAgent: string;
  platform: string;
  online: boolean;
  isHttps: boolean;
  hasServiceWorker: boolean;
  hasManifest: boolean;
  isStandalone: boolean;
  hasBeforeInstallPrompt: boolean;
  isChrome: boolean;
  chromeVersion: string;
  manifestExists: boolean;
  serviceWorkerRegistered: boolean;
  iconStatus: string;
  currentUrl: string;
  currentOrigin: string;
  manifestContent?: any;
  serviceWorkerCount?: number;
  installPromptTriggered?: string;
}

export function PWADebugInfo() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({} as DebugInfo);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const checkPWAStatus = () => {
      // Ensure we're in the browser
      if (typeof window === "undefined" || typeof navigator === "undefined") {
        return;
      }

      const info: DebugInfo = {
        // Basic browser info
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        online: navigator.onLine,

        // PWA specific checks
        isHttps: location.protocol === "https:",
        hasServiceWorker: "serviceWorker" in navigator,
        hasManifest: document.querySelector('link[rel="manifest"]') !== null,
        isStandalone: window.matchMedia("(display-mode: standalone)").matches,

        // Install prompt availability
        hasBeforeInstallPrompt: false, // Will be updated by event listener

        // Chrome specific
        isChrome:
          /Chrome/.test(navigator.userAgent) &&
          /Google Inc/.test(navigator.vendor),
        chromeVersion:
          navigator.userAgent.match(/Chrome\/(\d+)/)?.[1] || "Unknown",

        // Additional checks
        manifestExists: false,
        serviceWorkerRegistered: false,
        iconStatus: "Unknown",

        // Current URL
        currentUrl: window.location.href,
        currentOrigin: window.location.origin,
      };

      // Check manifest
      fetch("/manifest.json")
        .then((response) => {
          info.manifestExists = response.ok;
          return response.json();
        })
        .then((manifest) => {
          info.manifestContent = manifest;
        })
        .catch(() => {
          info.manifestExists = false;
        });

      // Check service worker
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          info.serviceWorkerRegistered = registrations.length > 0;
          info.serviceWorkerCount = registrations.length;
          setDebugInfo({ ...info });
        });
      }

      setDebugInfo(info);
    };

    checkPWAStatus();

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      setDebugInfo((prev: DebugInfo) => ({
        ...prev,
        hasBeforeInstallPrompt: true,
        installPromptTriggered: new Date().toISOString(),
      }));
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const checkPWACriteria = () => {
    const criteria = {
      https: debugInfo.isHttps,
      manifest: debugInfo.manifestExists,
      serviceWorker: debugInfo.serviceWorkerRegistered,
      chrome: debugInfo.isChrome,
      notStandalone: !debugInfo.isStandalone,
      beforeInstallPrompt: debugInfo.hasBeforeInstallPrompt,
    };

    return criteria;
  };

  const copyDebugInfo = () => {
    if (typeof navigator !== "undefined" && "clipboard" in navigator) {
      navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = JSON.stringify(debugInfo, null, 2);
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  if (!showDebug) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 z-50 bg-transparent border-0"
      >
        {/* PWA Debug */}
      </Button>
    );
  }

  const criteria = checkPWACriteria();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 p-4 overflow-auto">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            PWA Installation Debug Info
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDebug(false)}
            >
              Close
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">PWA Installation Criteria:</h3>
            <div className="space-y-1 text-sm">
              <div
                className={`flex items-center gap-2 ${
                  criteria.https ? "text-green-600" : "text-red-600"
                }`}
              >
                <span>{criteria.https ? "✅" : "❌"}</span>
                HTTPS: {debugInfo.isHttps ? "Yes" : "No"}
              </div>
              <div
                className={`flex items-center gap-2 ${
                  criteria.manifest ? "text-green-600" : "text-red-600"
                }`}
              >
                <span>{criteria.manifest ? "✅" : "❌"}</span>
                Manifest: {debugInfo.manifestExists ? "Yes" : "No"}
              </div>
              <div
                className={`flex items-center gap-2 ${
                  criteria.serviceWorker ? "text-green-600" : "text-red-600"
                }`}
              >
                <span>{criteria.serviceWorker ? "✅" : "❌"}</span>
                Service Worker:{" "}
                {debugInfo.serviceWorkerRegistered ? "Yes" : "No"}
              </div>
              <div
                className={`flex items-center gap-2 ${
                  criteria.chrome ? "text-green-600" : "text-yellow-600"
                }`}
              >
                <span>{criteria.chrome ? "✅" : "⚠️"}</span>
                Chrome Browser:{" "}
                {debugInfo.isChrome
                  ? `Yes (v${debugInfo.chromeVersion})`
                  : "No"}
              </div>
              <div
                className={`flex items-center gap-2 ${
                  criteria.notStandalone ? "text-green-600" : "text-yellow-600"
                }`}
              >
                <span>{criteria.notStandalone ? "✅" : "⚠️"}</span>
                Not in Standalone Mode:{" "}
                {debugInfo.isStandalone ? "Already installed" : "Yes"}
              </div>
              <div
                className={`flex items-center gap-2 ${
                  criteria.beforeInstallPrompt
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <span>{criteria.beforeInstallPrompt ? "✅" : "❌"}</span>
                Install Prompt Available:{" "}
                {debugInfo.hasBeforeInstallPrompt ? "Yes" : "No"}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Troubleshooting Tips:</h3>
            <div className="space-y-2 text-sm">
              {!criteria.https && (
                <div className="p-2 bg-red-50 border border-red-200 rounded">
                  ❌ Your site must be served over HTTPS for PWA installation
                </div>
              )}
              {!criteria.manifest && (
                <div className="p-2 bg-red-50 border border-red-200 rounded">
                  ❌ Web app manifest is missing or invalid
                </div>
              )}
              {!criteria.serviceWorker && (
                <div className="p-2 bg-red-50 border border-red-200 rounded">
                  ❌ Service worker is not registered
                </div>
              )}
              {!criteria.chrome && (
                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                  ⚠️ PWA install prompts work best in Chrome/Edge browsers
                </div>
              )}
              {criteria.https &&
                criteria.manifest &&
                criteria.serviceWorker &&
                !criteria.beforeInstallPrompt && (
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                    💡 All criteria met but no install prompt. Try:
                    <ul className="list-disc ml-4 mt-1">
                      <li>Spend more time on the site (user engagement)</li>
                      <li>Check Chrome://flags for PWA settings</li>
                      <li>Clear Chrome cache and reload</li>
                      <li>
                        Use Chrome menu {" > "} &quot;Add to Home screen&quot;
                      </li>
                    </ul>
                  </div>
                )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Manual Installation:</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                <strong>Chrome Android:</strong> Menu (⋮) → &quot;Add to Home
                screen&quot; or &quot;Install app&quot;
              </div>
              <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                <strong>Chrome Desktop:</strong> Address bar install icon or
                Menu → &quot;Install Wynnie&quot;
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button onClick={copyDebugInfo} variant="outline" size="sm">
              Copy Debug Info
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
