declare module "@studio-freight/lenis" {
  export default class Lenis {
    constructor(options?: {
      duration?: number;
      easing?: (t: number) => number;
      smooth?: boolean;
      smoothTouch?: boolean;
      touchMultiplier?: number;
      infinite?: boolean;
      wheelMultiplier?: number;
      lerp?: number;
      syncTouch?: boolean;
      syncTouchLerp?: number;
      touchInertiaMultiplier?: number;
      orientation?: "vertical" | "horizontal";
      gestureOrientation?: "vertical" | "horizontal";
      touchAxis?: "x" | "y";
      infinite?: boolean;
      wheelMultiplier?: number;
      normalizeWheel?: boolean;
    });
    raf(time: number): void;
    destroy(): void;
    scrollTo(
      target: number | string | HTMLElement,
      options?: {
        offset?: number;
        duration?: number;
        easing?: (t: number) => number;
        immediate?: boolean;
      }
    ): void;
    stop(): void;
    start(): void;
    on(event: string, callback: Function): void;
    off(event: string, callback: Function): void;
  }
}
