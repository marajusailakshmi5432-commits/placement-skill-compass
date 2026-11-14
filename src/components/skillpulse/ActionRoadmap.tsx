import { PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, type Priority, type RoadmapItem } from "@/lib/skillpulse";

const PRIORITY_STYLES: Record<Priority, string> = {
  High: "bg-status-prep/10 text-status-prep",
  Medium: "bg-status-close/15 text-foreground",
  Low: "bg-secondary text-muted-foreground",
};

export function ActionRoadmap({ items }: { items: RoadmapItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-status-ready/40 bg-status-ready/5 px-6 py-12 text-center animate-rise">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-status-ready/15 text-status-ready">
          <PartyPopper className="h-6 w-6" />
        </span>
        <p className="mt-4 font-display text-lg font-semibold text-foreground">No gaps left — you're covered!</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Keep sharp with weekly mock interviews and timed practice rounds.
        </p>
      </div>
    );
  }
  return (
    <ol className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <li
          key={item.skill.id}
          className="flex gap-4 rounded-xl border border-border bg-card p-4 animate-rise"
        >
          <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-primary py-2 text-primary-foreground">
            <span className="text-[10px] font-semibold uppercase tracking-widest opacity-75">Week</span>
            <span className="font-display text-xl font-bold leading-none">{item.week}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-semibold text-foreground">{item.skill.name}</h4>
              <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", PRIORITY_STYLES[item.priority])}>
                {item.priority}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {CATEGORY_LABELS[item.skill.category]}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.skill.tip}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
