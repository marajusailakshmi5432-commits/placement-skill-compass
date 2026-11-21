import { BookOpen, Code, FolderCheck, MessagesSquare } from "lucide-react";
import type { StudyWeek } from "@/lib/skillpulse";

const ICONS = [BookOpen, Code, FolderCheck, MessagesSquare];
export function FourWeekRoadmap({ weeks, roleTitle }: { weeks: StudyWeek[]; roleTitle: string }) {
  return <section className="mt-8 border-t border-border pt-7" aria-label="Four-week roadmap">
    <h2 className="font-display text-xl font-semibold">4-Week Roadmap</h2>
    <p className="mt-1 text-sm text-muted-foreground">{roleTitle}</p>
    <ol className="mt-5 grid gap-4 md:grid-cols-2">
      {weeks.map((week, i) => {
        const Icon = ICONS[i] ?? BookOpen;
        return <li key={week.week} className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-primary"><Icon className="h-4 w-4" /><span className="text-xs font-semibold uppercase">Week {week.week}</span></div>
          <h3 className="mt-2 font-semibold">{week.title}</h3>
          <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-relaxed text-muted-foreground">
            {week.items.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </li>;
      })}
    </ol>
  </section>;
}