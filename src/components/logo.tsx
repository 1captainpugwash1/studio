import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      <g>
        <path
          fill="hsl(var(--primary))"
          d="M40,55 L40,90 L20,95 L20,65 L40,55 Z"
        />
        <path
          fill="hsl(var(--primary))"
          d="M60,45 L60,90 L45,90 L45,55 L60,45 Z"
        />
        <path
          fill="hsl(var(--accent))"
          d="M58,47 L47,57 L47,88 L58,88 L58,47 Z"
        />
        <path
          fill="hsl(var(--accent))"
          d="M38,57 L22,67 L22,93 L38,88 L38,57 Z"
        />
        <path
          fill="hsl(var(--primary))"
          d="M80,95 L65,90 L65,20 L72,15 L80,25 L80,95 Z"
        />
        <path
          fill="hsl(var(--accent))"
          d="M78,93 L67,88 L67,23 L71,20 L78,28 L78,93 Z"
        />
        <path
          fill="hsl(var(--accent))"
          d="M40,35 L40,50 L20,60 L20,45 L40,35 Z"
        />
         <path
          fill="hsl(var(--primary))"
          d="M60,25 L60,40 L45,50 L45,35 L60,25 Z"
        />
         <path
          fill="hsl(var(--accent))"
          d="M58,28 L47,38 L47,48 L58,38 L58,28 Z"
        />
        <path
          fill="hsl(var(--primary))"
          d="M62,10 L62,18 L70,13 L70,8 L62,10 Z"
        />
      </g>
    </svg>
  );
}
