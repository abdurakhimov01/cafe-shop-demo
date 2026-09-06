"use client";

import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MaskText } from "@/components/ui/MaskText";
import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { img, site, visit } from "@/lib/content";

export function Visit() {
  return (
    <section id="visit" className="relative overflow-hidden bg-roast-900 grain">
      <div className="container-page grid gap-16 py-28 md:grid-cols-12 md:gap-14 md:py-40">
        <div className="md:col-span-6">
          <Reveal>
            <SectionLabel>{visit.label}</SectionLabel>
          </Reveal>

          <h2 className="display-section mt-8 max-w-[15ch] text-[clamp(2.25rem,6vw,4.5rem)] text-cream-50">
            <MaskText lines={[visit.heading]} />
          </h2>

          <div className="mt-14 space-y-10">
            <Reveal>
              <div>
                <p className="label-tech text-roast-400">Where</p>
                <p className="mt-3 max-w-[24ch] font-display text-2xl leading-tight font-light text-cream-50">
                  {site.address}
                </p>
              </div>
            </Reveal>

            <Reveal index={1}>
              <div>
                <p className="label-tech text-roast-400">Hours</p>
                <dl className="mt-4">
                  {visit.hours.map((row) => (
                    <div
                      key={row.days}
                      className="flex items-baseline justify-between gap-6 border-b border-cream-100/8 py-3"
                    >
                      <dt className="text-sm text-cream-200/75">{row.days}</dt>
                      <dd className="font-mono text-sm text-ember-300">{row.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            <Reveal index={2}>
              <div className="flex flex-wrap items-center gap-4">
                <Magnetic>
                  <a
                    href={`tel:${site.phone.replace(/\s/g, "")}`}
                    className="group inline-flex items-center gap-3 rounded-full bg-cream-50 px-6 py-3.5 label-tech whitespace-nowrap text-roast-950 transition-colors duration-300 hover:bg-ember-300 sm:px-7 sm:py-4"
                  >
                    Book a table
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                </Magnetic>
                <a
                  href={`mailto:${site.email}`}
                  className="label-tech text-cream-300 underline-offset-8 transition-colors hover:text-cream-50 hover:underline"
                >
                  {site.email}
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.15} className="md:col-span-5 md:col-start-8">
          <div className="relative aspect-4/5 overflow-hidden rounded-sm">
            <Image
              src={img(visit.image, 1200)}
              alt="The café terrace on the avenue, awnings out and tables set"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-roast-950/65 via-transparent to-transparent"
            />
            <p className="absolute bottom-5 left-5 label-tech rounded-full bg-roast-950/70 px-4 py-2 text-cream-200 backdrop-blur-sm">
              {site.instagram}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
