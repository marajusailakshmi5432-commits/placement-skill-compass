import { Building2, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { TRACK_LABELS, type Track } from "@/lib/skillpulse";

const OPTIONS: { id: Track; icon: typeof Building2 }[] = [
  { id: "service", icon: Building2 },
  { id: "product", icon: Rocket },
];

export function TrackToggle({ value, onChange }: { value: Track; onChange: (t: Track) => void }) {
  return (
    <div
      role="radiogroup"
      aria-label="Company track"
      className="relative inline-grid w-full grid-cols-2 rounded-xl bg-secondary p-1 sm:w-auto"
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-lg bg-card shadow-card transition-transform duration-300 ease-out",
          value === "product" && "translate-x-full",
        )}
      />
      {OPTIONS.map(({ id, icon: Icon }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={value === id}
          onClick={() => onChange(id)}
          className={cn(
            "relative z-10 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value === id ? "text-primary" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Icon className="h-4 w-4" />
          {TRACK_LABELS[id]}
        </button>
      ))}
    </div>
  );
}
