"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { addDays, format, isSameDay } from "date-fns";
import { createBooking, loadSlots, type BookingResult } from "@/app/actions/book";
import { cn } from "@/lib/cn";

/** How far ahead the café takes bookings. */
const BOOKING_WINDOW_DAYS = 30;

/** The largest table seats six; anything above that is joined by hand. */
const PARTY_SIZES = [1, 2, 3, 4, 5, 6];

export function BookingForm() {
  const [partySize, setPartySize] = useState(2);
  const [date, setDate] = useState<Date>(() => new Date());
  const [time, setTime] = useState<string | null>(null);

  const [slots, setSlots] = useState<string[] | null>(null);
  const [loadingSlots, startLoadingSlots] = useTransition();
  const [submitting, startSubmitting] = useTransition();
  const [result, setResult] = useState<BookingResult | null>(null);

  const days = useMemo(
    () =>
      Array.from({ length: BOOKING_WINDOW_DAYS }, (_, i) =>
        addDays(new Date(), i),
      ),
    [],
  );

  const isoDate = format(date, "yyyy-MM-dd");

  // Land on a day the guest can actually book, but only once: after that the
  // empty state is the honest answer to a day they chose themselves.
  const autoAdvanced = useRef(false);

  // Re-ask the server whenever the date or the party changes — a table that
  // fits four may not exist at the same hour for six.
  useEffect(() => {
    setTime(null);
    setSlots(null);
    startLoadingSlots(async () => {
      const times = await loadSlots(isoDate, partySize);
      if (times.length === 0 && !autoAdvanced.current) {
        autoAdvanced.current = true;
        setDate((current) => addDays(current, 1));
        return;
      }
      setSlots(times);
    });
  }, [isoDate, partySize]);

  if (result?.ok) {
    return <Confirmation result={result} onReset={() => setResult(null)} />;
  }

  return (
    <form
      action={(formData) => {
        formData.set("date", isoDate);
        formData.set("partySize", String(partySize));
        if (time) formData.set("time", time);
        startSubmitting(async () => setResult(await createBooking(formData)));
      }}
      className="space-y-10"
    >
      <Field label="How many of you?" step="01">
        <div className="flex flex-wrap gap-2">
          {PARTY_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setPartySize(size)}
              aria-pressed={size === partySize}
              className={cn(
                "h-11 w-11 rounded-full border font-mono text-sm transition-colors duration-300",
                size === partySize
                  ? "border-ember-300 bg-ember-300 text-roast-950"
                  : "border-cream-100/15 text-cream-200 hover:border-cream-100/40",
              )}
            >
              {size}
            </button>
          ))}
        </div>
        <p className="mt-3 label-tech text-roast-400">
          Larger party? Call us and we will join tables.
        </p>
      </Field>

      <Field label="Which day?" step="02">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
          {days.map((day) => {
            const selected = isSameDay(day, date);
            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => setDate(day)}
                aria-pressed={selected}
                className={cn(
                  "flex h-20 w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-sm border transition-colors duration-300",
                  selected
                    ? "border-ember-300 bg-ember-300/10 text-cream-50"
                    : "border-cream-100/12 text-cream-300 hover:border-cream-100/35",
                )}
              >
                <span className="label-tech text-[0.625rem] opacity-70">
                  {format(day, "EEE")}
                </span>
                <span className="font-display text-2xl leading-none font-light">
                  {format(day, "d")}
                </span>
                <span className="label-tech text-[0.625rem] opacity-70">
                  {format(day, "MMM")}
                </span>
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="What time?" step="03">
        {loadingSlots || slots === null ? (
          <p className="label-tech text-roast-400">Checking the book…</p>
        ) : slots.length === 0 ? (
          <p className="text-sm text-cream-200/70">
            Nothing free for {partySize} on {format(date, "EEEE d MMMM")}. Try
            another day, or a smaller party.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {slots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                aria-pressed={slot === time}
                className={cn(
                  "rounded-full border px-4 py-2.5 font-mono text-sm transition-colors duration-300",
                  slot === time
                    ? "border-ember-300 bg-ember-300 text-roast-950"
                    : "border-cream-100/15 text-cream-200 hover:border-cream-100/40",
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        )}
      </Field>

      <AnimatePresence>
        {time && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <Field label="And who shall we expect?" step="04">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  name="guestName"
                  label="Name"
                  autoComplete="name"
                  error={result?.ok === false ? result.fields?.guestName : undefined}
                />
                <Input
                  name="guestPhone"
                  label="Phone"
                  type="tel"
                  autoComplete="tel"
                  error={result?.ok === false ? result.fields?.guestPhone : undefined}
                />
                <div className="sm:col-span-2">
                  <Input
                    name="guestEmail"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    error={result?.ok === false ? result.fields?.guestEmail : undefined}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    name="notes"
                    label="Anything we should know? (optional)"
                    required={false}
                  />
                </div>
              </div>
            </Field>
          </motion.div>
        )}
      </AnimatePresence>

      {result?.ok === false && (
        <p
          role="alert"
          className="rounded-sm border border-red-400/30 bg-red-400/8 px-4 py-3 text-sm text-red-200"
        >
          {result.error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-5 border-t border-cream-100/12 pt-8">
        <button
          type="submit"
          disabled={!time || submitting}
          className="group inline-flex items-center gap-3 rounded-full bg-cream-50 px-7 py-4 label-tech whitespace-nowrap text-roast-950 transition-colors duration-300 hover:bg-ember-300 disabled:cursor-not-allowed disabled:bg-roast-700 disabled:text-roast-400"
        >
          {submitting ? "Booking…" : "Confirm booking"}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
        {time && (
          <p className="label-tech text-roast-400">
            {partySize} · {format(date, "EEE d MMM")} · {time}
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  step,
  label,
  children,
}: {
  step: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    // Browsers give a fieldset min-width:min-content, which stops the day
    // strip inside it from ever shrinking to scroll.
    <fieldset className="min-w-0">
      <legend className="mb-5 flex items-baseline gap-3">
        <span className="label-tech text-ember-400">{step}</span>
        <span className="font-display text-xl font-light text-cream-50">
          {label}
        </span>
      </legend>
      {children}
    </fieldset>
  );
}

function Input({
  name,
  label,
  type = "text",
  required = true,
  autoComplete,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="label-tech text-roast-400">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className={cn(
          "mt-2 w-full rounded-sm border bg-roast-950/60 px-4 py-3 text-cream-50 outline-none transition-colors duration-300 placeholder:text-roast-500",
          error
            ? "border-red-400/60"
            : "border-cream-100/15 focus:border-ember-300",
        )}
      />
      {error && <span className="mt-1.5 block text-xs text-red-300">{error}</span>}
    </label>
  );
}

function Confirmation({
  result,
  onReset,
}: {
  result: Extract<BookingResult, { ok: true }>;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-sm border border-ember-300/30 bg-ember-300/5 p-8 md:p-10"
    >
      <p className="label-tech text-ember-300">Table booked</p>
      <p className="mt-6 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight font-light text-cream-50">
        See you on{" "}
        {format(new Date(`${result.date}T00:00:00`), "EEEE d MMMM")} at{" "}
        {result.time}.
      </p>
      <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4">
        <div>
          <dt className="label-tech text-roast-400">Reference</dt>
          <dd className="mt-2 font-mono text-2xl text-ember-300">
            {result.reference}
          </dd>
        </div>
        <div>
          <dt className="label-tech text-roast-400">To change or cancel</dt>
          <dd className="mt-2 text-sm text-cream-200/75">
            Quote that code when you call.
          </dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={onReset}
        className="mt-8 label-tech text-cream-300 underline-offset-8 transition-colors hover:text-cream-50 hover:underline"
      >
        Book another table
      </button>
    </motion.div>
  );
}
