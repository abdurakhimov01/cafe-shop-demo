"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";

interface MaskTextProps {
  /** Each string becomes one clipped line that slides up from below. */
  lines: readonly string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** Play on mount rather than waiting for the line to scroll into view. */
  immediate?: boolean;
}

const line: Variants = {
  hidden: { y: "115%" },
  visible: { y: "0%" },
};

/**
 * Display-type entrance: every line sits inside its own overflow-hidden box
 * and rises out of it, so the text appears to be uncovered rather than faded.
 *
 * The viewport trigger has to live on the outer wrapper, not on the moving
 * line — while a line is parked below its clip box it has no visible area at
 * all, so an observer watching it would never report it as on screen.
 */
export function MaskText({
  lines,
  className,
  lineClassName,
  delay = 0,
  immediate = false,
}: MaskTextProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <span className={cn("block", className)}>
        {lines.map((text) => (
          <span key={text} className={cn("block", lineClassName)}>
            {text}
          </span>
        ))}
      </span>
    );
  }

  return (
    <motion.span
      className={cn("block", className)}
      initial="hidden"
      {...(immediate
        ? { animate: "visible" }
        : {
            whileInView: "visible",
            viewport: { once: true, margin: "0px 0px -10% 0px" },
          })}
    >
      {lines.map((text, i) => (
        <span key={text} className="block overflow-hidden pb-[0.12em]">
          <motion.span
            className={cn("block", lineClassName)}
            variants={line}
            transition={{
              duration: 1,
              delay: delay + i * 0.09,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {text}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
