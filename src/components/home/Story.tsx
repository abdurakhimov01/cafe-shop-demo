"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ScrollWords } from "@/components/ui/ScrollWords";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { img, story } from "@/lib/content";

export function Story() {
  const mediaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: mediaRef,
    offset: ["start end", "end start"],
  });
  // Slow counter-drift inside a fixed frame reads as depth, not motion.
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section id="story" className="relative bg-roast-950 py-28 md:py-40">
      <div className="container-page">
        <Reveal>
          <SectionLabel>{story.label}</SectionLabel>
        </Reveal>

        <ScrollWords
          text={story.statement}
          className="display-section mt-10 max-w-[22ch] text-[clamp(1.75rem,5.2vw,3.75rem)] text-cream-50 md:max-w-[26ch]"
        />

        <div className="mt-20 grid gap-14 md:grid-cols-12 md:gap-12">
          <div
            ref={mediaRef}
            className="relative aspect-4/5 overflow-hidden rounded-sm md:col-span-5 md:aspect-3/4"
          >
            <motion.div style={{ y }} className="absolute inset-x-0 -inset-y-[12%]">
              <Image
                src={img(story.image, 1200)}
                alt="A hessian sack of green coffee open on the roastery floor"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </motion.div>
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-roast-950/70 to-transparent"
            />
          </div>

          <div className="flex flex-col justify-between gap-14 md:col-span-6 md:col-start-7">
            <div className="space-y-6">
              {story.paragraphs.map((paragraph, i) => (
                <Reveal key={paragraph} index={i}>
                  <p className="max-w-[52ch] text-[1.0625rem] leading-[1.75] text-cream-200/70">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            <dl className="grid grid-cols-2 gap-x-8 gap-y-10">
              {story.stats.map((stat, i) => (
                <Reveal key={stat.label} index={i} className="border-t border-cream-100/12 pt-5">
                  <dt className="font-display text-[clamp(2rem,4.5vw,3rem)] leading-none font-light text-ember-300">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </dt>
                  <dd className="mt-3 label-tech text-roast-400">{stat.label}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
