import type { Transition, Variants } from "motion/react";

/** Shared timing so every animation in the app feels like one system. */
export const DURATION = {
  fast: 0.15,
  base: 0.2,
  slow: 0.25,
} as const;

export const EASE = [0.4, 0, 0.2, 1] as const;

export const transition: Transition = {
  duration: DURATION.base,
  ease: EASE,
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: DURATION.base, ease: EASE } },
  exit: { opacity: 0, transition: { duration: DURATION.fast, ease: EASE } },
};

export const fadeSlideUp: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
  exit: { opacity: 0, y: 8, transition: { duration: DURATION.fast, ease: EASE } },
};

export const fadeSlideDown: Variants = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: DURATION.fast, ease: EASE } },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: { duration: DURATION.base, ease: EASE } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: DURATION.fast, ease: EASE } },
};

/** Floating panels — dropdowns, tooltips: fade + slight scale + 4px slide. */
export const dropdownPanel: Variants = {
  initial: { opacity: 0, scale: 0.97, y: -4 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: DURATION.fast, ease: EASE } },
  exit: { opacity: 0, scale: 0.97, y: -4, transition: { duration: DURATION.fast, ease: EASE } },
};

/** Modal / dialog panels: fade + scale + slight rise. */
export const modalPanel: Variants = {
  initial: { opacity: 0, scale: 0.96, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
  exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: DURATION.fast, ease: EASE } },
};

/** Scroll-reveal grids: parent orchestrates a short stagger across children. */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.05, delayChildren: 0.03 },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
};

/** Once-only scroll-triggered reveal viewport settings. */
export const viewportOnce = { once: true, margin: "-80px" } as const;

/** Toast stack: rise + slight scale in, slide out to the side on dismiss. */
export const toastSlide: Variants = {
  initial: { opacity: 0, y: 16, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: DURATION.base, ease: EASE } },
  exit: { opacity: 0, x: 24, transition: { duration: DURATION.fast, ease: EASE } },
};
