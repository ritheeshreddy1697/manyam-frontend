import { useEffect, useState } from "react";

export default function useParallax(
  speed = 0.5,
  { disabled = false, minWidth = 0 } = {}
) {
  const [offset, setOffset] = useState(0);
  const isDisabled =
    disabled || (typeof window !== "undefined" && window.innerWidth < minWidth);

  useEffect(() => {
    if (typeof window === "undefined" || isDisabled) {
      return;
    }

    let frameId = null;
    let latestScrollY = window.scrollY;

    const updateOffset = () => {
      frameId = null;
      const nextOffset = latestScrollY * speed;
      setOffset((prev) => (Math.abs(prev - nextOffset) < 0.5 ? prev : nextOffset));
    };

    const handleScroll = () => {
      latestScrollY = window.scrollY;
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updateOffset);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [isDisabled, speed]);

  return isDisabled ? 0 : offset;
}
