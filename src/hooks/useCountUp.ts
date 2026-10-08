import { useState, useEffect } from 'react';

/**
 * Custom hook to animate numbers counting up with cubic ease-out: 1 - (1 - t)^3
 * Duration defaults to 2200ms, starts after specified delay.
 */
export function useCountUp(end: number, delayMs = 0, durationMs = 2200): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let timeoutId: ReturnType<typeof setTimeout>;

    timeoutId = setTimeout(() => {
      let startTime: number | null = null;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        // Cubic ease-out: 1 - (1 - t)^3
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(ease * end);
        setCount(current);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        }
      };

      animationFrameId = requestAnimationFrame(step);
    }, delayMs);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [end, delayMs, durationMs]);

  return count;
}
