import { cn } from "@/lib/cn";

/** Mono index line that opens every section, with a rule running off it. */
export function SectionLabel({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-3 label-tech text-ember-400",
        className,
      )}
    >
      <span className="h-px w-8 shrink-0 bg-ember-400/50" />
      {children}
    </span>
  );
}
