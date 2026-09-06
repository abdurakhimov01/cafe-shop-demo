"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger position — each step adds 80 ms. */
  index?: number;
  delay?: number;
  /** Travel distance on entry, in px. */
  distance?: number;
}

/**
 * Fade-and-rise on first scroll into view. Plays once; respects
 * `prefers-reduced-motion` by rendering the resting state immediately.
 */
export function Reveal({
  children,
  className,
  index = 0,
  delay = 0,
  distance = 28,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{
        duration: 0.85,
        delay: delay + index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
