import { useEffect, useState } from "react";

export default function useCounter(target, start = false, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime = null;
    let frameId = 0;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const nextCount = Math.floor(progress * target);
      setCount((prev) => (prev === nextCount ? prev : nextCount));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameId);
  }, [start, target, duration]);

  return count;
}
