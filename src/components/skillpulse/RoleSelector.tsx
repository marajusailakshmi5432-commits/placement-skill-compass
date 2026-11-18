import { BarChart3, Briefcase, Bug, Code2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROLES, type RoleId } from "@/lib/skillpulse";

const ICONS: Record<RoleId, LucideIcon> = {
  "software-developer": Code2,
  "data-analyst": BarChart3,
  "business-analyst": Briefcase,
  "qa-automation": Bug,
};

export function RoleSelector({ value, onChange }: { value: string; onChange: (r: RoleId) => void }) {
  return (
    <div role="radiogroup" aria-label="Quick-pick job roles" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {ROLES.map((role) => {
        const Icon = ICONS[role.id];
        const active = role.id === value;
        return (
          <button
            key={role.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(role.id)}
            className={cn(
              "group flex items-center gap-3 rounded-xl border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-4",
              active
                ? "border-primary bg-primary text-primary-foreground shadow-elevated"
                : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent/50",
            )}
          >
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                active ? "bg-primary-foreground/15" : "bg-secondary text-primary",
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold leading-tight">{role.title}</span>
          </button>
        );
      })}
    </div>
  );
}
