export const fadeIn = {
  from: { opacity: 0 },
  to: { opacity: 1 }
} as const;

export const fadeInUp = {
  from: { opacity: 0, transform: 'translateY(10px)' },
  to: { opacity: 1, transform: 'translateY(0)' }
} as const;

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;