"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function Transition({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show transition for 3 seconds, then fade out
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
          <div className="rounded-full flex flex-col items-center justify-center gap-4">
            <Image
              src="/preloader/video-3.gif"
              alt="preloader"
              width={1000}
              height={1000}
              priority
              unoptimized
              className="w-25 h-25 object-cover rounded-full animate-spin"
            />
            <span className="text-primary text-4xl tracking-wide font-black uppercase">
              Wynnie
            </span>
            <span className="text-muted-foreground text-lg font-medium text-center max-w-xs">
              Your AI Shopping Assistant
            </span>
          </div>
        </div>
      )}
      <div
        className={
          isLoading
            ? "opacity-0"
            : "opacity-100 transition-opacity duration-1000"
        }
      >
        {children}
      </div>
    </>
  );
}
