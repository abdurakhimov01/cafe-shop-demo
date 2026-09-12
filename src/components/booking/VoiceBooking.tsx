"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { format } from "date-fns";
import { createBooking, loadSlots } from "@/app/actions/book";
import {
  matchTimeSlot,
  parsePartySize,
  parsePhoneDigits,
  parseSpokenDate,
  parseSpokenEmail,
  parseYesNo,
} from "@/lib/voiceParse";
import { cn } from "@/lib/cn";

/** Non-standard API — not in TS's DOM lib, so we type only what we call. */
interface SpeechRecognitionResultLike {
  0: { transcript: string };
  isFinal: boolean;
}
interface SpeechRecognitionEventLike extends Event {
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

type Stage =
  | "party"
  | "date"
  | "time"
  | "name"
  | "phone"
  | "email"
  | "review"
  | "submitting"
  | "done";

interface Fields {
  partySize: number | null;
  date: Date | null;
  time: string | null;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
}

interface Message {
  role: "agent" | "guest";
  text: string;
}

/** The largest table seats six — matches BookingForm's PARTY_SIZES. */
const MAX_PARTY_SIZE = 6;

const EMPTY_FIELDS: Fields = {
  partySize: null,
  date: null,
  time: null,
  guestName: "",
  guestPhone: "",
  guestEmail: "",
};

function clockLabel(clock: string) {
  const [h, m] = clock.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return format(d, "h:mm a");
}

function questionFor(stage: Stage, fields: Fields, slots: string[]): string {
  switch (stage) {
    case "party":
      return "Hi, this is the café's booking line. How many will be joining?";
    case "date":
      return "And what day would you like to come in — today, tomorrow, or a day of the week?";
    case "time": {
      const spoken = slots.slice(0, 6).map(clockLabel).join(", ");
      return slots.length > 0
        ? `For ${fields.partySize} on ${format(fields.date!, "EEEE d MMMM")}, I have ${spoken}. Which works?`
        : `Nothing free for ${fields.partySize} on ${format(fields.date!, "EEEE d MMMM")}. Try another day?`;
    }
    case "name":
      return "Great. Who should I put the table under?";
    case "phone":
      return "And a phone number, in case we need to reach you?";
    case "email":
      return "Last thing — your email, for the confirmation. You can say it or type it below.";
    case "review":
      return `Just to confirm: a table for ${fields.partySize} on ${format(fields.date!, "EEEE d MMMM")} at ${clockLabel(fields.time!)}, under ${fields.guestName}. Shall I book it?`;
    default:
      return "";
  }
}

/** Speech APIs only exist client-side, so the server always "sees" false. */
function subscribeNever() {
  return () => {};
}
function getSupportSnapshot() {
  return Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition) &&
    "speechSynthesis" in window;
}
function getServerSupportSnapshot() {
  return false;
}

export function VoiceBooking() {
  const supported = useSyncExternalStore(
    subscribeNever,
    getSupportSnapshot,
    getServerSupportSnapshot,
  );
  const [stage, setStage] = useState<Stage>("party");
  const [fields, setFields] = useState<Fields>(EMPTY_FIELDS);
  const [slots, setSlots] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [listening, setListening] = useState(false);
  const [typed, setTyped] = useState("");
  const [reference, setReference] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const transcriptEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const say = useCallback((text: string, andListen: boolean) => {
    setMessages((m) => [...m, { role: "agent", text }]);
    const synth = window.speechSynthesis;
    if (!synth) {
      if (andListen) startListening();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    if (andListen) utterance.onend = () => startListening();
    synth.cancel();
    synth.speak(utterance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startListening() {
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) return;
    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const said = event.results[event.results.length - 1][0].transcript;
      setListening(false);
      handleUtterance(said);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  async function goToTimeStage(nextFields: Fields) {
    const isoDate = format(nextFields.date!, "yyyy-MM-dd");
    const available = await loadSlots(isoDate, nextFields.partySize!);
    setSlots(available);
    setStage("time");
    say(questionFor("time", nextFields, available), available.length > 0);
    if (available.length === 0) {
      // Stay in the date stage in spirit — the next reply is another date.
      setStage("date");
    }
  }

  async function submitBooking(current: Fields) {
    setStage("submitting");
    const fd = new FormData();
    fd.set("date", format(current.date!, "yyyy-MM-dd"));
    fd.set("time", current.time!);
    fd.set("partySize", String(current.partySize));
    fd.set("guestName", current.guestName);
    fd.set("guestEmail", current.guestEmail);
    fd.set("guestPhone", current.guestPhone);

    const result = await createBooking(fd);

    if (result.ok) {
      setReference(result.reference);
      setStage("done");
      say(
        `Booked — table for ${current.partySize} on ${format(new Date(`${result.date}T00:00:00`), "EEEE d MMMM")} at ${clockLabel(result.time)}. Your reference is ${result.reference.split("").join(" ")}.`,
        false,
      );
      return;
    }

    if (result.fields?.guestEmail) {
      setStage("email");
      say(`${result.error} What's a good email?`, true);
    } else if (result.fields?.guestPhone) {
      setStage("phone");
      say(`${result.error} What's a good number?`, true);
    } else if (result.fields?.guestName) {
      setStage("name");
      say(`${result.error} Who should I put the table under?`, true);
    } else {
      const isoDate = format(current.date!, "yyyy-MM-dd");
      const available = await loadSlots(isoDate, current.partySize!);
      setSlots(available);
      setStage("time");
      say(`${result.error} ${questionFor("time", current, available)}`, available.length > 0);
    }
  }

  function handleUtterance(raw: string) {
    const text = raw.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "guest", text }]);

    if (stage === "party") {
      const n = parsePartySize(text);
      if (n === null) {
        say("Sorry, how many people — just a number is fine.", true);
        return;
      }
      if (n > MAX_PARTY_SIZE) {
        say(
          `Our biggest table seats ${MAX_PARTY_SIZE} — for a bigger group, please call us and we'll join tables. How many for this booking?`,
          true,
        );
        return;
      }
      const next = { ...fields, partySize: n };
      setFields(next);
      setStage("date");
      say(questionFor("date", next, slots), true);
      return;
    }

    if (stage === "date") {
      const d = parseSpokenDate(text, new Date());
      if (!d) {
        say("I didn't catch a day — try today, tomorrow, or a weekday name.", true);
        return;
      }
      const next = { ...fields, date: d };
      setFields(next);
      void goToTimeStage(next);
      return;
    }

    if (stage === "time") {
      const t = matchTimeSlot(text, slots);
      if (!t) {
        say(`I don't have that one — ${questionFor("time", fields, slots)}`, true);
        return;
      }
      const next = { ...fields, time: t };
      setFields(next);
      setStage("name");
      say(questionFor("name", next, slots), true);
      return;
    }

    if (stage === "name") {
      const next = { ...fields, guestName: text.replace(/^my name is\s+/i, "").trim() };
      setFields(next);
      setStage("phone");
      say(questionFor("phone", next, slots), true);
      return;
    }

    if (stage === "phone") {
      const digits = parsePhoneDigits(text);
      if (digits.length < 6) {
        say("That number seems short — could you say it again?", true);
        return;
      }
      const next = { ...fields, guestPhone: digits };
      setFields(next);
      setStage("email");
      say(questionFor("email", next, slots), true);
      return;
    }

    if (stage === "email") {
      const email = parseSpokenEmail(text);
      const next = { ...fields, guestEmail: email };
      setFields(next);
      setStage("review");
      say(questionFor("review", next, slots), true);
      return;
    }

    if (stage === "review") {
      const yes = parseYesNo(text);
      if (yes === true) {
        void submitBooking(fields);
        return;
      }
      if (yes === false) {
        restart();
        return;
      }
      say("Sorry — shall I book it? Yes or no.", true);
    }
  }

  function restart() {
    setFields(EMPTY_FIELDS);
    setSlots([]);
    setStage("party");
    setReference(null);
    setMessages([]);
    say(questionFor("party", EMPTY_FIELDS, []), true);
  }

  function begin() {
    setStarted(true);
    say(questionFor("party", fields, slots), true);
  }

  function submitTyped(e: React.FormEvent) {
    e.preventDefault();
    if (!typed.trim()) return;
    const text = typed;
    setTyped("");
    handleUtterance(text);
  }

  if (!supported) {
    return (
      <div className="flex min-h-[20rem] flex-col items-center justify-center gap-3 text-center">
        <p className="label-tech text-roast-400">Voice booking</p>
        <p className="max-w-[36ch] text-sm text-cream-200/70">
          Your browser can&apos;t do speech recognition — this demo needs
          Chrome or Edge. Use the form instead.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[24rem] flex-col">
      <div className="mb-5 flex items-center justify-between">
        <p className="label-tech text-roast-400">AI voice agent — demo</p>
        {started && stage !== "submitting" && (
          <button
            type="button"
            onClick={restart}
            className="label-tech text-cream-300 underline-offset-4 hover:text-cream-50 hover:underline"
          >
            Start over
          </button>
        )}
      </div>

      {!started ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
          <p className="max-w-[34ch] text-sm text-cream-200/70">
            A live phone-call agent would answer this way — this one talks
            through your speakers and books the same table.
          </p>
          <button
            type="button"
            onClick={begin}
            className="group inline-flex items-center gap-3 rounded-full bg-cream-50 px-7 py-4 label-tech whitespace-nowrap text-roast-950 transition-colors duration-300 hover:bg-ember-300"
          >
            Call the host
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 space-y-3 overflow-y-auto pr-1" style={{ maxHeight: "16rem" }}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-sm px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "agent"
                    ? "bg-roast-900/70 text-cream-200/85"
                    : "ml-auto bg-ember-300/10 text-cream-50",
                )}
              >
                {m.text}
              </div>
            ))}
            <div ref={transcriptEnd} />
          </div>

          {stage === "done" && reference ? (
            <div className="mt-6 rounded-sm border border-ember-300/30 bg-ember-300/5 p-6">
              <p className="label-tech text-ember-300">Table booked</p>
              <p className="mt-3 font-mono text-2xl text-ember-300">{reference}</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4 border-t border-cream-100/12 pt-6">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  disabled={stage === "submitting"}
                  onClick={() => (listening ? stopListening() : startListening())}
                  aria-pressed={listening}
                  className={cn(
                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 disabled:opacity-40",
                    listening
                      ? "animate-pulse border-ember-300 bg-ember-300 text-roast-950"
                      : "border-cream-100/25 text-cream-200 hover:border-ember-300",
                  )}
                >
                  <span className="h-3 w-3 rounded-full bg-current" />
                </button>
                <p className="label-tech text-roast-400">
                  {stage === "submitting"
                    ? "Booking…"
                    : listening
                      ? "Listening…"
                      : "Tap to talk"}
                </p>
              </div>

              <form onSubmit={submitTyped} className="flex gap-2">
                <input
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  placeholder="Or type your reply"
                  disabled={stage === "submitting"}
                  className="w-full rounded-sm border border-cream-100/15 bg-roast-950/60 px-4 py-2.5 text-sm text-cream-50 outline-none transition-colors duration-300 placeholder:text-roast-500 focus:border-ember-300"
                />
                <button
                  type="submit"
                  disabled={stage === "submitting"}
                  className="label-tech shrink-0 rounded-sm border border-cream-100/15 px-4 text-cream-200 transition-colors hover:border-ember-300 hover:text-cream-50"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}
