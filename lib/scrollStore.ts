/**
 * A tiny mutable bridge between GSAP's ScrollTrigger and the R3F canvas.
 * Mutating a module object avoids React re-renders at 60fps while scrolling.
 */
export const storyScroll = {
  /** 0 → 1 across the pinned story */
  progress: 0,
  /** Raw scroll position used for subtle secondary motion */
  scrollY: 0,
  /** True while the story viewport is on screen */
  active: false,
};

export const pointerState = {
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0,
};
