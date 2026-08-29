/**
 * Motion constants — Emil Kowalski taste applied to FactorCore
 * Durations ≤ 300ms. Spring physics. No artificial delays.
 */

// ─── Spring presets ──────────────────────────────────────────────────────────
export const spring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

export const springMedium = {
  type: "spring" as const,
  stiffness: 280,
  damping: 24,
};

export const springSlow = {
  type: "spring" as const,
  stiffness: 180,
  damping: 20,
};

// ─── Easing ──────────────────────────────────────────────────────────────────
// Emil Kowalski's signature ease: fast out, slow deceleration
export const ease = [0.16, 1, 0.3, 1] as const;
export const easeOut = [0, 0, 0.2, 1] as const;

// ─── Variant presets ─────────────────────────────────────────────────────────
export const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
};

// ─── Stagger helpers ─────────────────────────────────────────────────────────
export const stagger = (i: number, base = 0.06) => ({
  ...fadeUp,
  transition: {
    delay: i * base,
    ...spring,
  },
});

// ─── Page transition ─────────────────────────────────────────────────────────
export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { ...springMedium },
};
