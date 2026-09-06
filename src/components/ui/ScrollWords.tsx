"use client";

import { Fragment, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * A block of text that lights up word by word as it crosses the viewport —
 * dim at first, full-contrast once read. Scroll position drives it directly,
 * so scrubbing backwards un-reads the sentence.
 */
export function ScrollWords({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.6"],
  });

  const words = text.split(" ");

  return (
    <p ref={ref} className={cn(className)}>
      {words.map((word, i) => (
        // Real spaces between the words keep the sentence selectable and
        // readable to a screen reader; only the opacity is per-word.
        <Fragment key={`${word}-${i}`}>
          <Word
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
          >
            {word}
          </Word>{" "}
        </Fragment>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}
    </motion.span>
  );
}
