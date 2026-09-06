"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MaskText } from "@/components/ui/MaskText";
import { Magnetic } from "@/components/ui/Magnetic";
import { Marquee } from "@/components/site/Marquee";
import { hero, img } from "@/lib/content";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The photograph drifts slower than the page and darkens on the way out,
  // so the copy below arrives against an already-settled surface.
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const veil = useTransform(scrollYProgress, [0, 1], [0.55, 0.92]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);
  const copyFade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex h-[100svh] min-h-[38rem] flex-col justify-end overflow-hidden grain"
    >
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 -z-10"
      >
        <Image
          src={img(hero.image, 2000)}
          alt="A hand pouring water over a paper filter behind the bar"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <motion.div
        aria-hidden
        style={{ opacity: veil }}
        className="absolute inset-0 -z-10 bg-roast-950"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-roast-950 via-roast-950/35 to-roast-950/70"
      />

      <motion.div
        style={{ y: copyY, opacity: copyFade }}
        className="container-page pb-14 md:pb-20"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="label-tech mb-7 flex items-center gap-3 text-ember-300"
        >
          <span className="h-px w-8 bg-ember-300/60" />
          {hero.eyebrow}
        </motion.p>

        <h1 className="display-hero max-w-[16ch] text-[clamp(2.75rem,10.5vw,9.5rem)] text-cream-50">
          <MaskText lines={hero.lines} immediate delay={0.15} />
        </h1>

        <div className="mt-10 flex flex-col gap-8 border-t border-cream-100/12 pt-8 md:flex-row md:items-end md:justify-between md:gap-16">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75 }}
            className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-cream-200/75 md:text-base"
          >
            {hero.body}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85 }}
            className="flex shrink-0 flex-wrap items-center gap-3 sm:gap-4"
          >
            <Magnetic>
              <a
                href="#menu"
                className="group inline-flex items-center gap-3 rounded-full bg-cream-50 px-6 py-3.5 label-tech whitespace-nowrap text-roast-950 transition-colors duration-300 hover:bg-ember-300 sm:px-7 sm:py-4"
              >
                See the menu
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#story"
                className="inline-flex items-center rounded-full border border-cream-100/25 px-6 py-3.5 label-tech whitespace-nowrap text-cream-200 transition-colors duration-300 hover:border-cream-100/60 hover:text-cream-50 sm:px-7 sm:py-4"
              >
                Our story
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="relative z-10 border-t border-cream-100/10 py-4 text-cream-300/60"
      >
        <Marquee items={hero.ticker} duration={45} />
      </motion.div>
    </section>
  );
}
