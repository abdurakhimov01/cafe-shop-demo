"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MaskText } from "@/components/ui/MaskText";
import { Reveal } from "@/components/ui/Reveal";
import { craft, img } from "@/lib/content";
import { cn } from "@/lib/cn";

/**
 * Source → Roast → Brew. On wide screens the photograph is pinned and swaps
 * as each step takes the middle of the viewport; on narrow ones each step
 * simply carries its own image.
 */
export function Craft() {
  const [active, setActive] = useState(0);
  const select = useCallback((index: number) => setActive(index), []);

  return (
    <section id="craft" className="relative bg-roast-900 py-28 grain md:py-40">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel>{craft.label}</SectionLabel>
            </Reveal>
            <h2 className="display-section mt-8 max-w-[14ch] text-[clamp(2.25rem,6.5vw,5rem)] text-cream-50">
              <MaskText lines={[craft.heading]} />
            </h2>
          </div>
          <Reveal delay={0.15}>
            <p className="label-tech text-roast-400">
              {String(active + 1).padStart(2, "0")} / {String(craft.steps.length).padStart(2, "0")}
            </p>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-12 md:gap-14">
          {/* Pinned photograph — wide screens only. */}
          <div className="hidden md:col-span-5 md:block">
            <div className="sticky top-[calc(var(--header-h)+3rem)] aspect-3/4 overflow-hidden rounded-sm bg-roast-850">
              {craft.steps.map((step, i) => (
                <motion.div
                  key={step.no}
                  aria-hidden={i !== active}
                  initial={false}
                  animate={{
                    opacity: i === active ? 1 : 0,
                    scale: i === active ? 1 : 1.06,
                  }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={img(step.image, 1200)}
                    alt={step.title}
                    fill
                    sizes="40vw"
                    className="object-cover"
                  />
                </motion.div>
              ))}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-roast-950/60 to-transparent"
              />
              <div className="absolute bottom-5 left-5 z-10">
                <motion.p
                  key={craft.steps[active].meta}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="label-tech rounded-full bg-roast-950/70 px-4 py-2 text-cream-200 backdrop-blur-sm"
                >
                  {craft.steps[active].meta}
                </motion.p>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            {craft.steps.map((step, i) => (
              <Step
                key={step.no}
                step={step}
                index={i}
                onEnter={select}
                isActive={i === active}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({
  step,
  index,
  onEnter,
  isActive,
}: {
  step: (typeof craft.steps)[number];
  index: number;
  onEnter: (index: number) => void;
  isActive: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // A band across the middle of the viewport decides which step is current.
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) onEnter(index);
  }, [inView, index, onEnter]);

  return (
    <div
      ref={ref}
      className={cn(
        "border-t border-cream-100/12 py-12 transition-opacity duration-700 md:py-20",
        index === 0 && "border-t-0 pt-0 md:pt-0",
        "md:opacity-40",
        isActive && "md:opacity-100",
      )}
    >
      <div className="flex items-baseline gap-5">
        <span className="label-tech text-ember-400">{step.no}</span>
        <h3 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-none font-light text-cream-50">
          {step.title}
        </h3>
      </div>

      <div className="relative mt-6 aspect-16/10 overflow-hidden rounded-sm md:hidden">
        <Image
          src={img(step.image, 900)}
          alt={step.title}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <p className="mt-6 max-w-[50ch] text-[1.0625rem] leading-[1.75] text-cream-200/70">
        {step.body}
      </p>
      <p className="mt-6 label-tech text-roast-400 md:hidden">{step.meta}</p>
    </div>
  );
}
