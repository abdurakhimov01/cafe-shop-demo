"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Logo } from "./Logo";
import { Magnetic } from "@/components/ui/Magnetic";
import { nav, site } from "@/lib/content";
import { cn } from "@/lib/cn";

export function Header() {
  const { scrollY } = useScroll();
  const [settled, setSettled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => setSettled(value > 40));

  // The overlay menu owns the viewport while it is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          settled && !open
            ? "border-b border-cream-100/8 bg-roast-950/75 backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        <div className="container-page flex h-(--header-h) items-center justify-between">
          <a href="#top" className="relative z-10" aria-label={`${site.name} — home`}>
            <Logo />
          </a>

          <nav className="hidden items-center gap-9 md:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative label-tech text-cream-300 transition-colors hover:text-cream-50"
              >
                {item.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-ember-300 transition-transform duration-500 ease-(--ease-pour) group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Magnetic className="hidden sm:block">
              <a
                href="#visit"
                className="inline-flex items-center gap-2 rounded-full border border-ember-300/40 bg-ember-300/5 px-5 py-2.5 label-tech text-ember-200 transition-colors duration-300 hover:border-ember-300 hover:bg-ember-300 hover:text-roast-950"
              >
                Reserve
              </a>
            </Magnetic>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="relative z-10 flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
            >
              <span
                className={cn(
                  "block h-px w-5 bg-cream-100 transition-transform duration-300",
                  open && "translate-y-[3px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-px w-5 bg-cream-100 transition-transform duration-300",
                  open && "-translate-y-[3px] -rotate-45",
                )}
              />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-40 grain bg-roast-900 md:hidden"
          >
            <div className="container-page flex h-full flex-col justify-center gap-2 pb-20">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24 + i * 0.06, duration: 0.6 }}
                  className="display-section flex items-baseline gap-4 border-b border-cream-100/8 py-4 text-4xl text-cream-100"
                >
                  <span className="label-tech text-ember-400">
                    0{i + 1}
                  </span>
                  {item.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="mt-10 space-y-1 label-tech text-roast-400"
              >
                <p>{site.address}</p>
                <p className="text-ember-300">{site.phone}</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
