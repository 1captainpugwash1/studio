import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <g>
        <path
          d="M20,0 h60 a20,20 0 0 1 20,20 v60 a20,20 0 0 1 -20,20 h-60 a20,20 0 0 1 -20,-20 v-60 a20,20 0 0 1 20,-20 z"
          fill="url(#logoGradient)"
        />
        <path
          fill="hsl(var(--primary-foreground))"
          d="M32.5,25 h20 a12.5,12.5 0 0 1 0,25 h-20 a12.5,12.5 0 0 1 0,-25 z
             M32.5,50 h25 a12.5,12.5 0 0 1 0,25 h-25 a12.5,12.5 0 0 1 0,-25 z"
        />
        <path
          fill="hsl(var(--primary-foreground))"
          opacity="0.7"
          d="M32.5,25 a12.5,12.5 0 0 1 12.5,-12.5 v50 a12.5,12.5 0 0 1 -12.5,-12.5 v-25 z"
        />
      </g>
    </svg>
  );
}
