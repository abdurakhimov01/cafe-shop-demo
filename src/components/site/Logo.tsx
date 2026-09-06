import { cn } from "@/lib/cn";

/**
 * Wordmark: a filled bean-shaped mark with a roast crack down the middle,
 * followed by the name in the display serif.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-5 w-5 shrink-0 text-ember-300"
      >
        <ellipse
          cx="12"
          cy="12"
          rx="7.5"
          ry="10"
          transform="rotate(-38 12 12)"
          fill="currentColor"
        />
        <path
          d="M6.6 17.4c2.4-1.1 3.2-3.2 2.4-5.4-.8-2.2 0-4.3 2.4-5.4"
          fill="none"
          stroke="var(--color-roast-950)"
          strokeWidth="1.6"
          strokeLinecap="round"
          transform="rotate(-38 12 12)"
        />
      </svg>
      <span className="font-display text-[1.0625rem] leading-none font-normal tracking-[-0.01em]">
        Cafe Shop
      </span>
    </span>
  );
}
