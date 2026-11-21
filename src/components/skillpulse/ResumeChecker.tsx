import { useState } from "react";
import { FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkResume, type Skill } from "@/lib/skillpulse";

export function ResumeChecker({ skills, roleTitle }: { skills: Skill[]; roleTitle: string }) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const result = checkResume(skills, text);
  return <section className="mt-8 border-t border-border pt-7">
    <h2 className="font-display text-xl font-semibold">Resume Checker</h2>
    <p className="mt-1 text-sm text-muted-foreground">{roleTitle} · Your pasted text stays on this page.</p>
    <label htmlFor="resume-skills" className="mt-5 block text-sm font-medium">Resume skills or job description</label>
    <textarea id="resume-skills" value={text} onChange={(e) => { setText(e.target.value); setSubmitted(false); }} rows={6} placeholder="Paste your skills or a job description…" className="mt-2 w-full resize-y rounded-lg border border-input bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
    <Button className="mt-3" disabled={!text.trim()} onClick={() => setSubmitted(true)}><FileSearch /> Check Skills</Button>
    {submitted && <div className="mt-5 border-l-2 border-primary pl-4" aria-live="polite">
      <h3 className="font-semibold">Matched Skills: {result.matched.length} / {skills.length}</h3>
      {result.matched.length > 0 && <p className="mt-2 text-sm text-muted-foreground">{result.matched.map((s) => s.name).join(", ")}</p>}
      <h3 className="mt-4 font-semibold">Missing Skills:</h3>
      {result.missing.length ? <><ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">{result.missing.map((s) => <li key={s.id}>{s.name}</li>)}</ul>
        <p className="mt-4 text-sm font-medium">Add these missing skills to your resume — only after you’ve learned and can demonstrate them.</p></> : <p className="mt-2 text-sm text-status-ready">All selected role skills were found.</p>}
    </div>}
  </section>;
}