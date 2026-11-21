import { useState } from "react";
import { ROLE_CATALOG } from "@/lib/role-catalog";
import { computeScore, resolveRole, type ActiveRole, type Track } from "@/lib/skillpulse";

export function CompareRoles({ role, savedRoles, checkedMap, track }: { role: ActiveRole; savedRoles: ActiveRole[]; checkedMap: Record<string, string[]>; track: Track }) {
  const [compareId, setCompareId] = useState("data-analyst");
  const options = [...ROLE_CATALOG, ...savedRoles].filter((r) => r.id !== role.id);
  const selected = options.find((r) => r.id === compareId) ?? options[0];
  if (!selected) return null;
  const other = resolveRole(selected, savedRoles);
  return <section className="mt-8 border-t border-border pt-7">
    <h2 className="font-display text-xl font-semibold">Compare Roles</h2>
    <label htmlFor="compare-role" className="mt-4 block text-sm font-medium">Compare with</label>
    <select id="compare-role" value={selected.id} onChange={(e) => setCompareId(e.target.value)} className="mt-2 h-11 w-full rounded-md border border-input bg-card px-3 text-sm sm:max-w-md">
      {options.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
    </select>
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      {[role, other].map((r) => {
        const checked = checkedMap[r.id] ?? [];
        return <div key={r.id} className="rounded-lg border border-border bg-card p-4">
          <h3 className="break-words font-semibold">{r.title}</h3>
          <p className="mt-2 text-2xl font-bold text-primary">{computeScore(r.skills, checked, track)}%</p>
          <p className="mt-1 text-sm text-muted-foreground">{r.skills.filter((s) => checked.includes(s.id)).length} / {r.skills.length} skills checked</p>
          <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-muted-foreground">{r.skills.filter((s) => !checked.includes(s.id)).slice(0, 3).map((s) => <li key={s.id}>{s.name}</li>)}</ul>
        </div>;
      })}
    </div>
  </section>;
}