# Cafe Shop — demo

> **This is a demo.** "Cafe Shop" is not a real business. The name, address,
> phone number, opening hours, menu and prices are all invented, and the
> photographs are Unsplash stock. It exists to show how the site is built, and
> to be re-skinned for a real café later.

A scroll-driven landing page for a fictional speciality-coffee roastery and
café. Built as a portfolio piece: dark roast palette, a display serif set
large, and motion that is tied to scroll position rather than decorating it.

**Live:** _not deployed yet_

## What is in it

| Section   | What it does                                                                    |
| --------- | ------------------------------------------------------------------------------- |
| Hero      | Full-bleed photograph on parallax, headline uncovered line by line, ticker below |
| Story     | A statement that lights up word by word against scroll position                  |
| Craft     | Pinned photograph that swaps as each of the three steps takes the viewport       |
| Menu      | Tabbed sections with a spring-animated pill and per-row hover wash               |
| Spotlight | Oversized wordmark drifting behind the copy, image on counter-parallax           |
| Room      | Three image columns drifting at different speeds                                 |
| Visit     | Address, opening hours, booking call to action                                   |

Also: a two-part custom pointer, magnetic buttons, a full-screen mobile menu,
a generated Open Graph share card, and `robots.txt` / `sitemap.xml`. Every
animation is skipped when the visitor asks for reduced motion.

## Stack

- [Next.js 16](https://nextjs.org) — App Router, static export of a single route
- TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) — design tokens declared in `@theme`
- [Framer Motion](https://www.framer.com/motion/) — scroll-linked and view-triggered motion
- Type: Fraunces (display), Inter (body), JetBrains Mono (labels), self-hosted via `next/font`
- Photography: [Unsplash](https://unsplash.com)

## Running it

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

```bash
npm run build   # production build
npm run lint    # eslint
npx tsc --noEmit  # typecheck
```

## Changing the content

Every string and photograph the site renders lives in
[`src/lib/content.ts`](src/lib/content.ts) — the café's name, address, hours,
menu and prices, and the Unsplash ids for each image. Rewriting the site for a
different café, or translating it, means editing that one file.

Photographs are referenced by Unsplash id and delivered through `next/image`;
`img(id, width)` in the same file builds the URL so crop and quality stay
consistent.

## Layout

```
src/
├── app/            root layout, page, OG image, robots, sitemap
├── components/
│   ├── home/       one file per section
│   ├── site/       header, footer, cursor, marquee, logo
│   └── ui/         reusable motion primitives
└── lib/            content and the class-name helper
```

The `ui/` primitives are the reusable parts: `MaskText` (line-by-line reveal),
`ScrollWords` (word-by-word lighting), `Reveal` (fade and rise on entry),
`Magnetic` (pointer attraction), and `Counter` (count-up on view).
