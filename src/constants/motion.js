export const motion = {
  fast: 0.18,
  medium: 0.32,
  slow: 0.55,
  ease: [0.22, 1, 0.36, 1],
};

export const motionEase = `cubic-bezier(${motion.ease.join(', ')})`;
