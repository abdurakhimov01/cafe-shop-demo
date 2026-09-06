"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MaskText } from "@/components/ui/MaskText";
import { Reveal } from "@/components/ui/Reveal";
import { img, spotlight } from "@/lib/content";

export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-14%", "14%"]);
  const nameX = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <section className="relative overflow-hidden bg-roast-850 py-28 grain md:py-40">
      {/* Oversized wordmark drifting behind the content. */}
      <motion.p
        aria-hidden
        style={{ x: nameX }}
        className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 font-display text-[26vw] leading-none font-light whitespace-nowrap text-cream-100/[0.035]"
      >
        {spotlight.name} {spotlight.name}
      </motion.p>

      <div className="container-page relative">
        <div className="grid items-center gap-14 md:grid-cols-12 md:gap-16">
          <div ref={ref} className="relative md:col-span-6">
            <div className="relative aspect-4/5 overflow-hidden rounded-sm">
              <motion.div style={{ y }} className="absolute inset-x-0 -inset-y-[14%]">
                <Image
                  src={img(spotlight.image, 1200)}
                  alt="A glass mug of black filter coffee casting a hard shadow"
                  fill
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
              <p className="absolute bottom-5 left-5 label-tech rounded-full bg-ember-300 px-4 py-2 text-roast-950">
                {spotlight.name}
              </p>
            </div>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <Reveal>
              <SectionLabel>{spotlight.label}</SectionLabel>
            </Reveal>

            <h2 className="display-section mt-8 text-[clamp(1.875rem,4.5vw,3.25rem)] text-cream-50">
              <MaskText lines={[spotlight.heading]} />
            </h2>

            <Reveal delay={0.1}>
              <p className="mt-8 max-w-[48ch] text-[1.0625rem] leading-[1.75] text-cream-200/70">
                {spotlight.body}
              </p>
            </Reveal>

            <dl className="mt-12 space-y-0">
              {spotlight.meta.map((row, i) => (
                <Reveal
                  key={row.k}
                  index={i}
                  className="flex items-baseline justify-between gap-6 border-t border-cream-100/12 py-4"
                >
                  <>
                    <dt className="label-tech text-roast-400">{row.k}</dt>
                    <dd className="text-right text-sm text-cream-100">{row.v}</dd>
                  </>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
