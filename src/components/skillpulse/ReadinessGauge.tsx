import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { STATUS_LABELS, type Status } from "@/lib/skillpulse";

const STATUS_STYLES: Record<Status, { stroke: string; badge: string; dot: string }> = {
  "needs-prep": {
    stroke: "stroke-status-prep",
    badge: "bg-status-prep/10 text-status-prep ring-status-prep/25",
    dot: "bg-status-prep",
  },
  "getting-close": {
    stroke: "stroke-status-close",
    badge: "bg-status-close/15 text-foreground ring-status-close/40",
    dot: "bg-status-close",
  },
  "placement-ready": {
    stroke: "stroke-status-ready",
    badge: "bg-status-ready/10 text-status-ready ring-status-ready/25",
    dot: "bg-status-ready",
  },
};

function useAnimatedNumber(value: number, duration = 500) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = Math.round(from + (value - from) * eased);
      setDisplay(v);
      fromRef.current = v;
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return display;
}

export function ReadinessGauge({ score, status }: { score: number; status: Status }) {
  const size = 220;
  const stroke = 16;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const shown = useAnimatedNumber(score);
  const styles = STATUS_STYLES[status];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          role="img"
          aria-label={`Readiness score ${score} percent`}
        >
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-secondary" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            className={cn(styles.stroke, "transition-[stroke-dashoffset,stroke] duration-500 ease-out")}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-6xl font-bold tabular-nums tracking-tight text-foreground">
            {shown}
            <span className="text-3xl text-muted-foreground">%</span>
          </span>
          <span className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Readiness
          </span>
        </div>
      </div>
      <span
        className={cn(
          "mt-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ring-1 transition-colors",
          styles.badge,
        )}
      >
        <span className={cn("h-2 w-2 rounded-full", styles.dot)} />
        {STATUS_LABELS[status]}
      </span>
    </div>
  );
}
