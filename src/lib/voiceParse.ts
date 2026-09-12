/** Small heuristics for turning free speech into booking fields — no LLM, no API cost. */

const NUMBER_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
};

const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function parsePartySize(text: string): number | null {
  const t = text.toLowerCase();
  const digits = t.match(/\b(\d{1,2})\b/);
  if (digits) {
    const n = Number(digits[1]);
    if (n >= 1 && n <= 12) return n;
  }
  for (const [word, n] of Object.entries(NUMBER_WORDS)) {
    if (new RegExp(`\\b${word}\\b`).test(t)) return n;
  }
  return null;
}

/** "today" / "tomorrow" / a weekday name, resolved against a reference date. */
export function parseSpokenDate(text: string, today: Date): Date | null {
  const t = text.toLowerCase();
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);

  if (/\bday after tomorrow\b/.test(t)) {
    const d = new Date(start);
    d.setDate(d.getDate() + 2);
    return d;
  }
  if (/\btomorrow\b/.test(t)) {
    const d = new Date(start);
    d.setDate(d.getDate() + 1);
    return d;
  }
  if (/\btoday\b|\btonight\b/.test(t)) return start;

  for (let i = 0; i < WEEKDAYS.length; i++) {
    if (!new RegExp(`\\b${WEEKDAYS[i]}\\b`).test(t)) continue;
    const d = new Date(start);
    let diff = i - start.getDay();
    // A bare weekday name always means the next one ahead — "today" is its
    // own word above, so this branch never needs to resolve to day zero.
    if (diff <= 0) diff += 7;
    d.setDate(d.getDate() + diff);
    return d;
  }

  return null;
}

export function parsePhoneDigits(text: string): string {
  return text.replace(/\D/g, "");
}

/** "sam at gmail dot com" → "sam@gmail.com". Falls back to the raw text. */
export function parseSpokenEmail(text: string): string {
  const cleaned = text
    .toLowerCase()
    .replace(/\s+at\s+/g, "@")
    .replace(/\s+dot\s+/g, ".")
    .replace(/\s+/g, "");
  return cleaned || text.trim();
}

interface TimeMention {
  hour: number;
  minute: number;
  ampm: "am" | "pm" | null;
}

function extractTimeMentions(text: string): TimeMention[] {
  const t = text.toLowerCase();
  const mentions: TimeMention[] = [];

  const numeric = /\b(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)?/g;
  let m: RegExpExecArray | null;
  while ((m = numeric.exec(t))) {
    const hour = Number(m[1]);
    if (hour < 1 || hour > 23) continue;
    mentions.push({
      hour,
      minute: m[2] ? Number(m[2]) : 0,
      ampm: m[3] ? (m[3][0] === "a" ? "am" : "pm") : null,
    });
  }

  for (const [word, hour] of Object.entries(NUMBER_WORDS)) {
    const match = t.match(new RegExp(`\\b${word}\\b\\s*(a\\.?m\\.?|p\\.?m\\.?)?`));
    if (match) {
      mentions.push({
        hour,
        minute: 0,
        ampm: match[1] ? (match[1][0] === "a" ? "am" : "pm") : null,
      });
    }
  }

  return mentions;
}

/** Match spoken time against the "HH:MM" slots actually on offer. */
export function matchTimeSlot(text: string, slots: string[]): string | null {
  for (const { hour, minute, ampm } of extractTimeMentions(text)) {
    const readings: number[] =
      ampm === "am"
        ? [hour === 12 ? 0 : hour]
        : ampm === "pm"
          ? [hour === 12 ? 12 : hour + 12]
          : hour >= 13
            ? [hour]
            : // No am/pm given — a dinner booking is more likely the evening
              // hour, so try that first and fall back to the literal one.
              [hour === 12 ? 12 : hour + 12, hour];

    for (const h of readings) {
      const clock = `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      if (slots.includes(clock)) return clock;
    }
  }
  return null;
}

export function parseYesNo(text: string): boolean | null {
  const t = text.toLowerCase();
  if (/\b(yes|yeah|yep|yup|correct|sure|book it|sounds good|confirm|please)\b/.test(t))
    return true;
  if (/\b(no|nope|not right|wrong|cancel|start over|redo)\b/.test(t)) return false;
  return null;
}
