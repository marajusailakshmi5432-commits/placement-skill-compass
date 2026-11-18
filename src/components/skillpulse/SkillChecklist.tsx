import { BookOpen, Check, Cpu, MessageSquare, Wrench, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, CATEGORY_ORDER, type Category, type Skill } from "@/lib/skillpulse";

const CAT_ICONS: Record<Category, LucideIcon> = { technical: Cpu, fundamentals: BookOpen, tools: Wrench, soft: MessageSquare };

export function SkillChecklist({
  skills,
  checked,
  onToggle,
  weights,
}: {
  skills: Skill[];
  checked: Set<string>;
  onToggle: (id: string) => void;
  weights: Record<Category, number>;
}) {
  return (
    <div className="space-y-6">
      {CATEGORY_ORDER.map((cat) => {
        const items = skills.filter((s) => s.category === cat);
        const done = items.filter((s) => checked.has(s.id)).length;
        const Icon = CAT_ICONS[cat];
        return (
          <section key={cat}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="text-base font-semibold text-foreground">{CATEGORY_LABELS[cat]}</h3>
                <span className="hidden rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:inline">
                  ×{weights[cat]} weight
                </span>
              </div>
              <span className="text-sm font-semibold tabular-nums text-muted-foreground">
                {done}/{items.length}
              </span>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {items.map((s) => {
                const on = checked.has(s.id);
                return (
                  <li key={s.id}>
                    <label
                      className={cn(
                        "flex h-full cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-sm font-medium transition-all",
                        on
                          ? "border-primary/30 bg-accent text-accent-foreground"
                          : "border-border bg-card text-foreground hover:border-primary/30 hover:bg-muted",
                      )}
                    >
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={on}
                        onChange={() => onToggle(s.id)}
                      />
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
                          on ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card",
                        )}
                      >
                        <Check className={cn("h-3.5 w-3.5 transition-transform", on ? "scale-100" : "scale-0")} strokeWidth={3} />
                      </span>
                      <span className="leading-snug">{s.name}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
