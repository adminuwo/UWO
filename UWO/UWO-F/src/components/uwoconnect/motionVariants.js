// Framer Motion Reusable Animation Variants & Utilities for UWO Connect™
// Tuned to match the AI LEGAL™ premium motion standard: smooth, controlled, elegant easing [0.16, 1, 0.3, 1]

export const EASE_PREMIUM = [0.16, 1, 0.3, 1];

// Staggered Container for Sections & Grids (Gentle, deliberate pacing)
export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0.05) => ({
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// Clean Fade Up Reveal (Smooth & slower)
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.95,
      ease: EASE_PREMIUM,
    },
  },
};

// Subtle Fade In
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.9,
      ease: EASE_PREMIUM,
    },
  },
};

// Slide from Left
export const fadeLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.95,
      ease: EASE_PREMIUM,
    },
  },
};

// Slide from Right
export const fadeRight = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.95,
      ease: EASE_PREMIUM,
    },
  },
};

// Scale In (for mockups, screenshots, badges)
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.05,
      ease: EASE_PREMIUM,
    },
  },
};

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.85, ease: EASE_PREMIUM },
  },
};

// Card Hover & Tap Interactions
export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -5,
    scale: 1.01,
    transition: {
      duration: 0.35,
      ease: EASE_PREMIUM,
    },
  },
};

// Interactive Button Motion
export const btnMotion = {
  hover: {
    scale: 1.025,
    y: -1.5,
    transition: { duration: 0.28, ease: EASE_PREMIUM },
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: { duration: 0.15 },
  },
};

// Floating Idle Animations
export const floatMotion = {
  animate: {
    y: [-6, 6, -6],
    transition: {
      duration: 5.2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const floatMotionDelay = (delay = 0.5) => ({
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 5.6,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
});

// Check if user has requested reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

