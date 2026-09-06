"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * A two-part pointer: a small ember dot that tracks exactly, and a ring that
 * trails on a spring and swells over anything clickable.
 *
 * Only mounts on devices with a real hovering pointer — touch screens keep
 * the native behaviour, and the `data-cursor` flag on <body> is what tells
 * the stylesheet it is safe to hide the system cursor.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hot, setHot] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    setEnabled(true);
    document.body.dataset.cursor = "on";

    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target as Element | null;
      setHot(Boolean(target?.closest("a, button, [data-cursor-hot]")));
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      delete document.body.dataset.cursor;
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-300 mix-blend-difference"
        style={{ x, y }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cream-300/60"
        style={{ x: ringX, y: ringY }}
        animate={{
          width: hot ? 52 : 30,
          height: hot ? 52 : 30,
          opacity: hot ? 0.9 : 0.45,
        }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
}
