export const motion = {
  fast: 0.18,
  medium: 0.26,
  slow: 0.4,
  ease: [0.22, 1, 0.36, 1],
};

export const motionCssVars = {
  '--motion-fast': `${motion.fast}s`,
  '--motion-medium': `${motion.medium}s`,
  '--motion-slow': `${motion.slow}s`,
  '--motion-ease': `cubic-bezier(${motion.ease.join(',')})`,
};
