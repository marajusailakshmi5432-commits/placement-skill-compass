import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Activity, ClipboardCopy, Info, Printer, RotateCcw, Save, Sparkles, Target } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ReadinessGauge } from "@/components/skillpulse/ReadinessGauge";
import { RoleSelector } from "@/components/skillpulse/RoleSelector";
import { RoleSearch } from "@/components/skillpulse/RoleSearch";
import { TrackToggle } from "@/components/skillpulse/TrackToggle";
import { SkillChecklist } from "@/components/skillpulse/SkillChecklist";
import { ActionRoadmap } from "@/components/skillpulse/ActionRoadmap";
import { CustomRoleForm } from "@/components/skillpulse/CustomRoleForm";
import { FourWeekRoadmap } from "@/components/skillpulse/FourWeekRoadmap";
import { ResumeChecker } from "@/components/skillpulse/ResumeChecker";
import {
  CATEGORY_LABELS,
  CATEGORY_SHORT_LABELS,
  ROLES,
  STATUS_LABELS,
  TRACK_LABELS,
  TRACK_NOTES,
  TRACK_WEIGHTS,
  buildRoadmap,
  buildFourWeekPlan,
  buildSummary,
  categoriesIn,
  computeScore,
  getRole,
  getStatus,
  resolveRole,
  parseSavedRoles,
  type ActiveRole,
  type RoleRef,
  type Track,
} from "@/lib/skillpulse";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillPulse V3 — Placement Readiness & Resume Checker" },
      {
        name: "description",
        content:
          "Check placement readiness, save custom roles, follow a four-week study plan and compare resume skills with your target role.",
      },
      { property: "og:title", content: "SkillPulse V3 — Placement Readiness & Resume Checker" },
      {
        property: "og:description",
        content: "Find skill gaps, build custom roles and follow a four-week placement roadmap with SkillPulse.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STORAGE_KEY = "skillpulse:v1";
type CheckedMap = Record<string, string[]>;
const initialRole = getRole("software-developer");
const DEFAULT_ROLE: RoleRef = { id: initialRole.id, title: initialRole.title };

function Index() {
  const [roleRef, setRoleRef] = useState<RoleRef>(DEFAULT_ROLE);
  const [track, setTrack] = useState<Track>("service");
  const [checkedMap, setCheckedMap] = useState<CheckedMap>({});
  const [loaded, setLoaded] = useState(false);
  const [savedRoles, setSavedRoles] = useState<ActiveRole[]>([]);
  const [customTitle, setCustomTitle] = useState<string | null>(null);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (!saved || typeof saved !== "object") throw new Error("Invalid saved progress");
        setSavedRoles(parseSavedRoles(saved.savedRoles));
        if (saved.role && typeof saved.role.id === "string" && typeof saved.role.title === "string") {
          setRoleRef({ id: saved.role.id, title: saved.role.title });
        } else if (ROLES.some((r) => r.id === saved.roleId)) {
          setRoleRef({ id: saved.roleId, title: getRole(saved.roleId).title });
        }
        if (saved.track === "service" || saved.track === "product") setTrack(saved.track);
        if (saved.checkedMap && typeof saved.checkedMap === "object" && !Array.isArray(saved.checkedMap)) {
          setCheckedMap(Object.fromEntries(Object.entries(saved.checkedMap).filter((entry): entry is [string, string[]] => Array.isArray(entry[1]) && entry[1].every((id: unknown) => typeof id === "string"))));
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ role: roleRef, track, checkedMap, savedRoles }));
      setStorageError(false);
    } catch { setStorageError(true); }
  }, [loaded, roleRef, track, checkedMap, savedRoles]);

  const role = useMemo(() => resolveRole(roleRef, savedRoles), [roleRef, savedRoles]);
  const roleId = role.id;
  const cats = categoriesIn(role.skills);
  const checkedIds = checkedMap[roleId] ?? [];
  const checked = useMemo(() => new Set(checkedIds), [checkedIds]);
  const score = computeScore(role.skills, checkedIds, track);
  const status = getStatus(score);
  const roadmap = buildRoadmap(role.skills, checkedIds, track);
  const weeks = buildFourWeekPlan(role, track);

  const saveCustom = (newRole: ActiveRole) => {
    setSavedRoles((prev) => [...prev.filter((r) => r.id !== newRole.id), newRole]);
    setCheckedMap((prev) => ({ ...prev, [newRole.id]: [] }));
    setRoleRef({ id: newRole.id, title: newRole.title });
    setCustomTitle(null);
    toast.success("Custom role added");
  };

  const saveProgress = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ role: roleRef, track, checkedMap, savedRoles }));
      setStorageError(false);
      toast.success("Progress saved on this device");
    } catch {
      setStorageError(true);
      toast.error("Couldn't save on this device", { description: "Browser storage is unavailable. Copy or print your summary instead." });
    }
  };

  const toggle = (id: string) =>
    setCheckedMap((m) => {
      const cur = new Set(m[roleId] ?? []);
      if (cur.has(id)) cur.delete(id);
      else cur.add(id);
      return { ...m, [roleId]: [...cur] };
    });

  const reset = () => {
    setCheckedMap((m) => ({ ...m, [roleId]: [] }));
    toast("Checklist reset", { description: `${role.title} skills cleared.` });
  };

  const copy = async () => {
    const text = buildSummary(role, track, checkedIds);
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
          <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-hero-foreground/10 ring-1 ring-hero-foreground/20">
                <Activity className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-bold">SkillPulse</span>
              <span className="ml-1 text-xs text-hero-muted">Version 3</span>
            </div>
            <div className="mt-6 max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-hero-muted">
                Placement Readiness & Skill-Gap Analyzer
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
                SkillPulse — Placement Readiness
              </h1>
              <p className="mt-3 max-w-xl text-base text-hero-muted">
                Pick your target role, tick the skills you've got, and get a live readiness score with a
                four-week plan to close every gap.
              </p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
          {/* Controls */}
          <section className="border-b border-border pb-6">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  <Target className="h-4 w-4" /> Target Job Role
                </h2>
                <div className="mt-3">
                  <RoleSearch onSelect={setRoleRef} savedRoles={savedRoles} onAddCustom={setCustomTitle} />
                </div>
                {customTitle !== null && <CustomRoleForm key={customTitle} initialTitle={customTitle} onSave={saveCustom} onCancel={() => setCustomTitle(null)} />}
                {savedRoles.length > 0 && <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">Your saved roles</span>
                  {savedRoles.map((r) => <Button key={r.id} size="sm" variant={r.id === roleId ? "default" : "outline"} className="h-auto min-h-8 max-w-full whitespace-normal break-words text-left" onClick={() => setRoleRef({ id: r.id, title: r.title })}>{r.title}</Button>)}
                </div>}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Selected:</span>
                  <span className="inline-flex max-w-full items-center gap-1.5 break-words rounded-md bg-primary px-3 py-1 font-semibold text-primary-foreground">
                    {role.custom && <Sparkles className="h-3.5 w-3.5" />}
                    {role.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {role.custom ? role.group : role.group}
                  </span>
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick picks</p>
                <div className="mt-2">
                  <RoleSelector
                    value={roleId}
                    onChange={(id) => setRoleRef({ id, title: getRole(id).title })}
                  />
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
            <section className="order-2 py-3 lg:order-1 lg:col-span-8">
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
              <div className="rounded-lg border border-border bg-card p-5 lg:sticky lg:top-6">
                <div className="text-center">
                  <h2 className="font-display text-lg font-semibold text-foreground">Readiness Score</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {role.title} · {TRACK_LABELS[track]}
                  </p>
                </div>
                <div className="mt-6">
                  <ReadinessGauge score={score} status={status} />
                </div>
                <div className={`mt-6 grid gap-2 text-center ${cats.length === 4 ? "grid-cols-4" : "grid-cols-3"}`}>
                  {cats.map((cat) => {
                    const items = role.skills.filter((s) => s.category === cat);
                    const done = items.filter((s) => checked.has(s.id)).length;
                    return (
                      <div key={cat} className="rounded-lg bg-muted px-2 py-2.5">
                        <div className="font-display text-base font-bold tabular-nums text-foreground">
                          {done}/{items.length}
                        </div>
                        <div className="text-[11px] font-medium text-muted-foreground">
                          {CATEGORY_SHORT_LABELS[cat]}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 grid gap-2">
                  <div className="flex flex-wrap gap-2 [&>*]:flex-1">
                    <Button size="lg" onClick={copy} className="px-4">
                      <ClipboardCopy /> Copy Summary
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => window.print()} className="px-4" aria-label="Print readiness summary">
                      <Printer /> Print
                    </Button>
                  </div>
                  <Button variant="outline" onClick={saveProgress}><Save /> Save Progress</Button>
                  <Button variant="ghost" onClick={reset} disabled={checked.size === 0} className="text-muted-foreground">
                    <RotateCcw /> Reset Checklist
                  </Button>
                </div>
              </div>
            </aside>
          </div>

          {/* Roadmap */}
          <section className="mt-6 border-t border-border pt-7">
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

          <FourWeekRoadmap weeks={weeks} roleTitle={role.title} />
          <ResumeChecker skills={role.skills} roleTitle={role.title} />

          <footer className="mt-10 text-center text-xs text-muted-foreground">
            {storageError ? "Browser storage is unavailable. Copy or print your summary to keep it." : "SkillPulse V3 · Your roles and progress are saved on this device."}
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
        {cats.map((cat) => (
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
        <h2 className="mt-6 text-base font-semibold">4-Week Roadmap</h2>
        {weeks.map((week) => <div key={week.week} className="mt-3 text-sm"><h3 className="font-semibold">Week {week.week}: {week.title}</h3><ul className="list-disc pl-5">{week.items.map((item, i) => <li key={i}>{item}</li>)}</ul></div>)}
      </div>
    </div>
  );
}
