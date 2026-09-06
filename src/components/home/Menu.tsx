"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MaskText } from "@/components/ui/MaskText";
import { Reveal } from "@/components/ui/Reveal";
import { menu } from "@/lib/content";
import { cn } from "@/lib/cn";

type GroupId = (typeof menu.groups)[number]["id"];

export function Menu() {
  const [activeId, setActiveId] = useState<GroupId>(menu.groups[0].id);
  const group = menu.groups.find((g) => g.id === activeId) ?? menu.groups[0];

  return (
    <section id="menu" className="relative bg-roast-950 py-28 md:py-40">
      <div className="container-page">
        <Reveal>
          <SectionLabel>{menu.label}</SectionLabel>
        </Reveal>

        <h2 className="display-section mt-8 max-w-[18ch] text-[clamp(2.25rem,6.5vw,5rem)] text-cream-50">
          <MaskText lines={[menu.heading]} />
        </h2>

        <Reveal delay={0.1}>
          <div
            role="tablist"
            aria-label="Menu sections"
            className="mt-14 flex flex-wrap gap-2 border-b border-cream-100/12 pb-5"
          >
            {menu.groups.map((g) => {
              const selected = g.id === activeId;
              return (
                <button
                  key={g.id}
                  role="tab"
                  type="button"
                  id={`tab-${g.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${g.id}`}
                  onClick={() => setActiveId(g.id)}
                  className={cn(
                    "relative rounded-full px-5 py-2.5 label-tech transition-colors duration-300",
                    selected ? "text-roast-950" : "text-cream-300 hover:text-cream-50",
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="menu-pill"
                      className="absolute inset-0 rounded-full bg-ember-300"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{g.name}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.ul
            key={group.id}
            id={`panel-${group.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${group.id}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4"
          >
            {group.items.map((item, i) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative border-b border-cream-100/8"
              >
                {/* Ember wash that fills the row from the left on hover. */}
                <span
                  aria-hidden
                  className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-ember-300/8 to-transparent transition-transform duration-500 ease-(--ease-pour) group-hover:scale-x-100"
                />
                <div className="relative flex items-baseline gap-6 py-6 md:gap-10">
                  <h3 className="font-display text-xl font-light text-cream-50 transition-transform duration-500 ease-(--ease-pour) group-hover:translate-x-2 md:text-2xl">
                    {item.name}
                  </h3>
                  <span
                    aria-hidden
                    className="mb-1.5 hidden h-px flex-1 bg-cream-100/12 sm:block"
                  />
                  <p className="ml-auto hidden max-w-[34ch] text-right text-sm leading-relaxed text-cream-200/55 sm:block">
                    {item.detail}
                  </p>
                  <span className="ml-auto shrink-0 font-mono text-sm text-ember-300 sm:ml-8">
                    {item.price}
                  </span>
                </div>
                <p className="relative -mt-2 pb-6 text-sm leading-relaxed text-cream-200/55 sm:hidden">
                  {item.detail}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>

        <Reveal delay={0.1}>
          <p className="mt-10 label-tech text-roast-400">{menu.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
