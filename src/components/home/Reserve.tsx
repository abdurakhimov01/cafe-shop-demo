import { SectionLabel } from "@/components/ui/SectionLabel";
import { MaskText } from "@/components/ui/MaskText";
import { Reveal } from "@/components/ui/Reveal";
import { BookingForm } from "@/components/booking/BookingForm";
import { booking } from "@/lib/content";

export function Reserve() {
  return (
    <section id="book" className="relative bg-roast-950 py-28 md:py-40">
      <div className="container-page grid gap-14 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <Reveal>
            <SectionLabel>{booking.label}</SectionLabel>
          </Reveal>

          <h2 className="display-section mt-8 max-w-[16ch] text-[clamp(2rem,5vw,3.5rem)] text-cream-50">
            <MaskText lines={[booking.heading]} />
          </h2>

          <Reveal delay={0.1}>
            <p className="mt-8 max-w-[42ch] text-[1.0625rem] leading-[1.75] text-cream-200/70">
              {booking.body}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-8 max-w-[42ch] label-tech leading-relaxed text-roast-400">
              {booking.fine}
            </p>
          </Reveal>
        </div>

        {/* min-w-0: a grid item defaults to min-width:auto, which lets the
            day strip widen the column instead of scrolling inside it. */}
        <Reveal delay={0.1} className="min-w-0 md:col-span-6 md:col-start-7">
          <div className="rounded-sm border border-cream-100/10 bg-roast-900/60 p-6 grain md:p-10">
            <BookingForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
