"use client";

import { useState } from "react";
import { BookingForm } from "@/components/booking/BookingForm";
import { VoiceBooking } from "@/components/booking/VoiceBooking";
import { cn } from "@/lib/cn";

type Mode = "form" | "voice";

export function BookingPanel() {
  const [mode, setMode] = useState<Mode>("form");

  return (
    <div>
      <div className="mb-8 flex gap-2">
        <ModeButton active={mode === "form"} onClick={() => setMode("form")}>
          Fill in the form
        </ModeButton>
        <ModeButton active={mode === "voice"} onClick={() => setMode("voice")}>
          Talk to the host
        </ModeButton>
      </div>
      {mode === "form" ? <BookingForm /> : <VoiceBooking />}
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "label-tech rounded-full border px-4 py-2 transition-colors duration-300",
        active
          ? "border-ember-300 bg-ember-300/10 text-cream-50"
          : "border-cream-100/15 text-roast-400 hover:border-cream-100/40",
      )}
    >
      {children}
    </button>
  );
}
