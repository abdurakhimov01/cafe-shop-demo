import { cn } from "@/lib/cn";

/**
 * Seamless ticker. The item list is rendered as two identical groups inside
 * one track; translating the track by exactly -50% swaps the first group for
 * the second, so the loop point is invisible. `duration` is in seconds.
 */
export function Marquee({
  items,
  duration = 40,
  className,
  separator = "✦",
}: {
  items: readonly string[];
  duration?: number;
  className?: string;
  separator?: string;
}) {
  const group = (key: string) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key === "b"}>
      {items.map((item) => (
        <span
          key={item}
          className="flex shrink-0 items-center label-tech whitespace-nowrap"
        >
          {item}
          <span className="px-6 text-ember-400/70">{separator}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]",
        className,
      )}
    >
      <div
        className="flex w-max will-change-transform"
        style={{ animation: `marquee-x ${duration}s linear infinite` }}
      >
        {group("a")}
        {group("b")}
      </div>
    </div>
  );
}
