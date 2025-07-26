"use client";

import Lenis from "@studio-freight/lenis";
import { useEffect } from "react";

const LenisScroll = () => {
  useEffect(() => {
    // Initialize Lenis with smoother configuration
    const lenis = new Lenis({
      duration: 1.8, // Longer duration for smoother feel
      easing: (t) => {
        // Custom easing function for ultra-smooth scrolling
        return 1 - Math.pow(1 - t, 3);
      },
      smooth: true,
      lerp: 0.08, // Lower lerp value for smoother interpolation
    });

    // Handle scroll events
    lenis.on("scroll", (e: any) => {
      // You can add custom scroll handling here if needed
      // console.log('Scrolling:', e.scroll);
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Handle specific scrollable containers that should not be affected by Lenis
    const handleScrollableContainers = () => {
      const scrollableContainers = document.querySelectorAll(
        "[data-lenis-prevent]"
      );
      scrollableContainers.forEach((container) => {
        // Prevent Lenis from interfering with these containers
        container.addEventListener(
          "wheel",
          (e) => {
            e.stopPropagation();
          },
          { passive: true }
        );

        // Also prevent touch events on mobile
        container.addEventListener(
          "touchstart",
          (e) => {
            e.stopPropagation();
          },
          { passive: true }
        );
        
        container.addEventListener(
          "touchend",
          (e) => {
            e.stopPropagation();
          },
          { passive: true }
        );
        
        container.addEventListener(
          "touchmove",
          (e) => {
            e.stopPropagation();
          },
          { passive: true }
        );
      });
    };

    // Initial setup
    handleScrollableContainers();

    // Set up a mutation observer to handle dynamically added elements
    const observer = new MutationObserver(() => {
      handleScrollableContainers();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup
    return () => {
      lenis.destroy();
      observer.disconnect();
    };
  }, []);

  return null;
};

export default LenisScroll;
