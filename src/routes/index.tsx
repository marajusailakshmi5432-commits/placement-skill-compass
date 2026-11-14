import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Activity, ClipboardCopy, Info, Printer, RotateCcw, Target } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ReadinessGauge } from "@/components/skillpulse/ReadinessGauge";
import { RoleSelector } from "@/components/skillpulse/RoleSelector";
import { TrackToggle } from "@/components/skillpulse/TrackToggle";
import { SkillChecklist } from "@/components/skillpulse/SkillChecklist";
import { ActionRoadmap } from "@/components/skillpulse/ActionRoadmap";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  ROLES,
  STATUS_LABELS,
  TRACK_LABELS,
  TRACK_NOTES,
  TRACK_WEIGHTS,
  buildRoadmap,
  buildSummary,
  computeScore,
  getRole,
  getStatus,
  type RoleId,
  type Track,
} from "@/lib/skillpulse";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillPulse — Placement Readiness & Skill-Gap Analyzer" },
      {
        name: "description",
        content:
          "Check your campus placement readiness by role and company track, see your skill gaps and get a week-by-week action roadmap.",
      },
      { property: "og:title", content: "SkillPulse — Placement Readiness & Skill-Gap Analyzer" },
      {
        property: "og:description",
        content: "Score your placement readiness and get a 1-week action plan for every missing skill.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STORAGE_KEY = "skillpulse:v1";
type CheckedMap = Record<RoleId, string[]>;
const emptyChecked = (): CheckedMap =>
  Object.fromEntries(ROLES.map((r) => [r.id, []])) as unknown as CheckedMap;

function Index() {
  const [roleId, setRoleId] = useState<RoleId>("software-developer");
  const [track, setTrack] = useState<Track>("service");
  const [checkedMap, setCheckedMap] = useState<CheckedMap>(emptyChecked);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (ROLES.some((r) => r.id === saved.roleId)) setRoleId(saved.roleId);
        if (saved.track === "service" || saved.track === "product") setTrack(saved.track);
        if (saved.checkedMap) setCheckedMap({ ...emptyChecked(), ...saved.checkedMap });
      }
    } catch {
      /* ignore corrupt storage */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify({ roleId, track, checkedMap }));
  }, [loaded, roleId, track, checkedMap]);

  const role = getRole(roleId);
  const checkedIds = checkedMap[roleId] ?? [];
  const checked = useMemo(() => new Set(checkedIds), [checkedIds]);
  const score = computeScore(role.skills, checkedIds, track);
  const status = getStatus(score);
  const roadmap = buildRoadmap(role.skills, checkedIds, track);

  const toggle = (id: string) =>
    setCheckedMap((m) => {
      const cur = new Set(m[roleId]);
      if (cur.has(id)) cur.delete(id);
      else cur.add(id);
      return { ...m, [roleId]: [...cur] };
    });

  const reset = () => {
    setCheckedMap((m) => ({ ...m, [roleId]: [] }));
    toast("Checklist reset", { description: `${role.title} skills cleared.` });
  };

  const copy = async () => {
    const text = buildSummary(roleId, track, checkedIds);
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Summary copied", { description: "Paste it into notes, email or chat." });
    } catch {
      toast.error("Couldn't copy", { description: "Try the Print option instead." });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="print:hidden">
        {/* Header */}
        <header className="relative overflow-hidden bg-hero text-hero-foreground">
          <div className="hero-grid pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pt-10 lg:pb-28">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-hero-foreground/10 ring-1 ring-hero-foreground/20">
                <Activity className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">SkillPulse</span>
            </div>
            <div className="mt-12 max-w-3xl sm:mt-16">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-hero-muted">
                Placement Readiness & Skill-Gap Analyzer
              </p>
              <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
                Know exactly how ready you are for campus placements.
              </h1>
              <p className="mt-5 max-w-xl text-base text-hero-muted sm:text-lg">
                Pick your target role, tick the skills you've got, and get a live readiness score with a
                week-by-week plan to close every gap.
              </p>
            </div>
          </div>
        </header>

        <main className="relative mx-auto -mt-16 max-w-6xl px-4 pb-16 sm:px-6 lg:-mt-20">
          {/* Controls */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-elevated sm:p-6">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  <Target className="h-4 w-4" /> Target Job Role
                </h2>
                <div className="mt-3">
                  <RoleSelector value={roleId} onChange={setRoleId} />
                </div>
              </div>
              <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Company Track
                  </h2>
                  <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span className="max-w-lg">{TRACK_NOTES[track]}</span>
                  </p>
                </div>
                <TrackToggle value={track} onChange={setTrack} />
              </div>
            </div>
          </section>

          {/* Checklist + Gauge */}
          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            <section className="order-2 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6 lg:order-1 lg:col-span-8">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-semibold text-foreground">Skill Checklist</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tick what you can confidently demonstrate in an interview.
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-sm font-semibold tabular-nums text-primary">
                  {checked.size}/{role.skills.length}
                </span>
              </div>
              <SkillChecklist skills={role.skills} checked={checked} onToggle={toggle} weights={TRACK_WEIGHTS[track]} />
            </section>

            <aside className="order-1 lg:order-2 lg:col-span-4">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-6">
                <div className="text-center">
                  <h2 className="font-display text-lg font-semibold text-foreground">Readiness Score</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {role.title} · {TRACK_LABELS[track]}
                  </p>
                </div>
                <div className="mt-6">
                  <ReadinessGauge score={score} status={status} />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                  {CATEGORY_ORDER.map((cat) => {
                    const items = role.skills.filter((s) => s.category === cat);
                    const done = items.filter((s) => checked.has(s.id)).length;
                    return (
                      <div key={cat} className="rounded-lg bg-muted px-2 py-2.5">
                        <div className="font-display text-base font-bold tabular-nums text-foreground">
                          {done}/{items.length}
                        </div>
                        <div className="text-[11px] font-medium text-muted-foreground">
                          {CATEGORY_LABELS[cat].replace(" Skills", "")}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 grid gap-2">
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <Button size="lg" onClick={copy} className="px-4">
                      <ClipboardCopy /> Copy Summary
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => window.print()} className="px-4" aria-label="Print readiness summary">
                      <Printer /> Print
                    </Button>
                  </div>
                  <Button variant="ghost" onClick={reset} disabled={checked.size === 0} className="text-muted-foreground">
                    <RotateCcw /> Reset Checklist
                  </Button>
                </div>
              </div>
            </aside>
          </div>

          {/* Roadmap */}
          <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">Missing Skills & Action Roadmap</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Highest-impact gaps first — one focused week per skill.
                </p>
              </div>
              {roadmap.length > 0 && (
                <span className="rounded-full bg-status-prep/10 px-3 py-1 text-sm font-semibold text-status-prep">
                  {roadmap.length} gap{roadmap.length === 1 ? "" : "s"}
                </span>
              )}
            </div>
            <ActionRoadmap items={roadmap} />
          </section>

          <footer className="mt-10 text-center text-xs text-muted-foreground">
            SkillPulse · Your progress is saved on this device.
          </footer>
        </main>
      </div>

      {/* Print-only summary */}
      <div className="hidden text-foreground print:block">
        <h1 className="font-display text-2xl font-bold">SkillPulse — Placement Readiness Summary</h1>
        <p className="mt-2 text-sm">
          <strong>Role:</strong> {role.title} &nbsp;·&nbsp; <strong>Track:</strong> {TRACK_LABELS[track]} &nbsp;·&nbsp;{" "}
          <strong>Score:</strong> {score}% ({STATUS_LABELS[status]})
        </p>
        {CATEGORY_ORDER.map((cat) => (
          <div key={cat} className="mt-4">
            <h2 className="text-base font-semibold">{CATEGORY_LABELS[cat]}</h2>
            <ul className="mt-1 text-sm">
              {role.skills
                .filter((s) => s.category === cat)
                .map((s) => (
                  <li key={s.id}>
                    {checked.has(s.id) ? "☑" : "☐"} {s.name}
                  </li>
                ))}
            </ul>
          </div>
        ))}
        <h2 className="mt-6 text-base font-semibold">Action Roadmap</h2>
        {roadmap.length === 0 ? (
          <p className="text-sm">All skills covered — keep practising mock interviews!</p>
        ) : (
          <ol className="mt-1 space-y-1.5 text-sm">
            {roadmap.map((r) => (
              <li key={r.skill.id}>
                <strong>
                  Week {r.week}: {r.skill.name}
                </strong>{" "}
                ({r.priority}) — {r.skill.tip}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
