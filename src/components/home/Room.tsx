"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MaskText } from "@/components/ui/MaskText";
import { Reveal } from "@/components/ui/Reveal";
import { img, room } from "@/lib/content";

/**
 * Vertical travel per column, in percent of column height. The sign flips
 * across the section's scroll range, so a column starting low ends high.
 */
const DRIFT = [-18, 7, -11];

export function Room() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section id="room" className="relative bg-roast-950 py-28 md:py-40">
      <div className="container-page">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel>{room.label}</SectionLabel>
            </Reveal>
            <h2 className="display-section mt-8 max-w-[16ch] text-[clamp(2.25rem,6.5vw,5rem)] text-cream-50">
              <MaskText lines={[room.heading]} />
            </h2>
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-[36ch] text-[1.0625rem] leading-[1.7] text-cream-200/70">
              {room.body}
            </p>
          </Reveal>
        </div>
      </div>

      {/* Three columns drifting at different speeds — the middle one runs
          against the other two, which is what sells the depth. */}
      <div
        ref={ref}
        className="mt-20 grid grid-cols-2 gap-3 px-3 md:grid-cols-3 md:gap-5 md:px-5"
      >
        {room.columns.map((column, i) => (
          <Column
            key={i}
            images={column}
            progress={scrollYProgress}
            drift={DRIFT[i]}
            className={i === 2 ? "hidden md:grid" : ""}
          />
        ))}
      </div>
    </section>
  );
}

function Column({
  images,
  progress,
  drift,
  className,
}: {
  images: readonly string[];
  progress: MotionValue<number>;
  drift: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const y = useTransform(progress, [0, 1], [`${drift}%`, `${-drift}%`]);

  return (
    <motion.div
      style={reduce ? undefined : { y }}
      className={`grid gap-3 md:gap-5 ${className ?? ""}`}
    >
      {images.map((id) => (
        <figure
          key={id}
          className="group relative aspect-3/4 overflow-hidden rounded-sm bg-roast-850"
        >
          <Image
            src={img(id, 900)}
            alt=""
            fill
            sizes="(min-width: 768px) 32vw, 50vw"
            className="object-cover transition-transform duration-[1.2s] ease-(--ease-pour) group-hover:scale-105"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-roast-950/25 transition-opacity duration-700 group-hover:opacity-0"
          />
        </figure>
      ))}
    </motion.div>
  );
}
