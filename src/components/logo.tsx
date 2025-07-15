import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 81 83"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      <g>
        <path fill="hsl(var(--primary))" d="M36.1 27.2L36.1 83L10.7 83L0 83L21.4 65.1L21.4 46.1L36.1 27.2Z" />
        <path fill="hsl(var(--primary))" d="M60.4 20.3L60.4 83L80.1 83L60.4 65.9L60.4 20.3Z" />
        <path fill="hsl(var(--accent))" d="M38.5 24L38.5 61.9L24.1 65.1L24.1 48.4L38.5 24Z" />
        <path fill="hsl(var(--primary))" d="M41 0L41 83L58 83L58 24.9L41 0Z" />
        <path fill="hsl(var(--accent))" d="M43.4 29.5L43.4 61.9L55.6 61.9L55.6 34.1L43.4 29.5Z" />
      </g>
    </svg>
  );
}
