/**
 * Every string and photograph the site renders lives here, so the copy can be
 * rewritten — or translated — without touching a component.
 *
 * Photographs are Unsplash originals referenced by id; `img()` builds the
 * delivery URL so crop and quality stay consistent everywhere.
 */

const UNSPLASH = "https://images.unsplash.com/";

export function img(id: string, width = 1600) {
  return `${UNSPLASH}${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export const site = {
  name: "Cafe Shop",
  tagline: "Speciality coffee, roasted in-house",
  address: "12 Amir Temur Avenue, Tashkent",
  phone: "+998 90 000 00 00",
  email: "hello@cafeshop.uz",
  instagram: "@cafeshop",
} as const;

export const nav = [
  { label: "Story", href: "#story" },
  { label: "Craft", href: "#craft" },
  { label: "Menu", href: "#menu" },
  { label: "Room", href: "#room" },
  { label: "Visit", href: "#visit" },
] as const;

export const hero = {
  eyebrow: "Est. 2019 — Tashkent",
  lines: ["Coffee worth", "slowing down for."],
  body:
    "We roast small batches every Tuesday, pull them for eleven days, and pour nothing we would not drink standing up at the bar ourselves.",
  image: "photo-1442512595331-e89e73853f31",
  ticker: [
    "Single origin",
    "Roasted Tuesdays",
    "Open 7:30 — 23:00",
    "Filter bar",
    "House pastry, baked daily",
    "Tashkent",
  ],
} as const;

export const story = {
  label: "01 — The idea",
  /** Rendered word by word; each word lights up as it crosses the viewport. */
  statement:
    "A café is not a room with coffee in it. It is the twenty minutes a person gives back to themselves — and everything we do here is built to be worth those twenty minutes.",
  paragraphs: [
    "We opened with one machine, four stools and a roaster small enough to carry. The room has grown; the standard has not moved.",
    "Every bean is bought from a farm we can name, roasted within sight of the counter, and served by someone who tasted that batch this morning.",
  ],
  stats: [
    { value: 6, suffix: "", label: "Origins on the bar" },
    { value: 11, suffix: " days", label: "Rest before we pour" },
    { value: 240, suffix: " kg", label: "Roasted each month" },
    { value: 2019, suffix: "", label: "Pulling shots since" },
  ],
  image: "photo-1524350876685-274059332603",
} as const;

export const craft = {
  label: "02 — The craft",
  heading: "Three rooms, one cup.",
  steps: [
    {
      no: "01",
      title: "Source",
      body:
        "Two buying trips a year. We pay above the fair-trade floor because the farms we want are worth keeping, and we print what we paid on the bag.",
      image: "photo-1447933601403-0c6688de566e",
      meta: "Yirgacheffe · Huila · Antigua",
    },
    {
      no: "02",
      title: "Roast",
      body:
        "A 5 kg drum behind the counter, run every Tuesday morning. Light enough to keep the fruit, long enough to lose the grass. Nothing leaves the room untasted.",
      image: "photo-1497935586351-b67a49e012bf",
      meta: "5 kg drum · Tuesdays · 11 min",
    },
    {
      no: "03",
      title: "Brew",
      body:
        "Espresso at 92°C, filter by hand at the bar. Two grinders, one for each, dialled in twice a day against the weather outside.",
      image: "photo-1513267048331-5611cad62e41",
      meta: "92°C · 1:2 in 28s",
    },
  ],
} as const;

export const menu = {
  label: "03 — The menu",
  heading: "Short list. Nothing on it by accident.",
  note: "Prices in thousand so'm. Oat, almond and lactose-free milk at no charge.",
  groups: [
    {
      id: "espresso",
      name: "Espresso bar",
      items: [
        { name: "Espresso", detail: "House blend, 1:2 in 28 seconds", price: "18" },
        { name: "Cortado", detail: "Double shot, cut with steamed milk", price: "24" },
        { name: "Flat white", detail: "Ristretto base, 160 ml", price: "28" },
        { name: "Cappuccino", detail: "Traditional, dusted or plain", price: "28" },
        { name: "Latte", detail: "240 ml, silk texture", price: "30" },
        { name: "Espresso tonic", detail: "Citrus, ice, long pour", price: "34" },
      ],
    },
    {
      id: "filter",
      name: "Filter bar",
      items: [
        { name: "V60", detail: "Single origin, brewed to order", price: "32" },
        { name: "Chemex", detail: "For two, served in the carafe", price: "56" },
        { name: "Cold brew", detail: "18-hour steep, on tap", price: "30" },
        { name: "Batch filter", detail: "Whatever we roasted Tuesday", price: "22" },
        { name: "Cupping flight", detail: "Three origins, side by side", price: "64" },
      ],
    },
    {
      id: "kitchen",
      name: "Kitchen",
      items: [
        { name: "Butter croissant", detail: "Laminated here, baked at six", price: "22" },
        { name: "Sourdough toast", detail: "Cultured butter, sea salt", price: "26" },
        { name: "Eggs on rye", detail: "Soft scramble, chives, house rye", price: "48" },
        { name: "Seasonal galette", detail: "Ask the counter", price: "34" },
        { name: "Basque cheesecake", detail: "Burnt top, single slice", price: "38" },
      ],
    },
  ],
} as const;

export const spotlight = {
  label: "04 — House signature",
  name: "The Tuesday",
  heading: "Whatever came off the drum that morning, poured black.",
  body:
    "It is not on the menu board because it changes every week. Ask for the Tuesday and you get the newest roast, brewed the way the roaster wanted it — no milk, no sugar, no negotiation.",
  meta: [
    { k: "Method", v: "Hand pour, V60" },
    { k: "Dose", v: "18 g / 300 ml" },
    { k: "Served", v: "Tuesdays, until it runs out" },
  ],
  image: "photo-1521302080334-4bebac2763a6",
} as const;

export const room = {
  label: "05 — The room",
  heading: "Forty seats, one long window, no rush.",
  body:
    "Power at every table, a shelf of books nobody checks, and music quiet enough to hold a conversation over.",
  /** Three columns that drift at different speeds as the section scrolls. */
  columns: [
    ["photo-1453614512568-c4024d13c247", "photo-1555507036-ab1f4038808a", "photo-1501339847302-ac426a4a7cbb"],
    ["photo-1541167760496-1628856ab772", "photo-1495474472287-4d71bcdd2085", "photo-1559496417-e7f25cb247f3"],
    ["photo-1498804103079-a6351b050096", "photo-1509440159596-0249088772ff", "photo-1442975631115-c4f7b05b8a2c"],
  ],
} as const;

export const booking = {
  label: "07 — Reserve",
  heading: "Book the table, not the whole evening.",
  body:
    "Ninety minutes a sitting, up to six at one table. We hold every booking for fifteen minutes past the hour — after that the table goes back on the floor.",
  fine: "No card, no deposit. Call us if your plans change and the table goes to someone else.",
} as const;

export const visit = {
  label: "06 — Visit",
  heading: "Come in. The first one is always the best one.",
  hours: [
    { days: "Monday — Thursday", time: "07:30 — 22:00" },
    { days: "Friday", time: "07:30 — 23:00" },
    { days: "Saturday", time: "09:00 — 23:00" },
    { days: "Sunday", time: "09:00 — 21:00" },
  ],
  image: "photo-1559925393-8be0ec4767c8",
} as const;
