import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Activity, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useStudentAccess } from "@/components/skillpulse/StudentAccess";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({ reason: typeof search['reason'] === "string" ? search['reason'] : "", next: typeof search['next'] === "string" && search['next'].startsWith("/") && !search['next'].startsWith("//") && !search['next'].includes("\\") ? search['next'] : "/" }),
  head: () => ({ meta: [{ title: "Sign in — SkillPulse" }, { name: "description", content: "Create your free SkillPulse student account for unlimited role plans." }, { property: "og:title", content: "Sign in — SkillPulse" }, { property: "og:description", content: "Unlimited placement role plans with a free student account." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AuthPage,
});
function AuthPage() {
  const { reason, next } = Route.useSearch();
  const [mode, setMode] = useState<"login" | "signup">(reason ? "signup" : "login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const access = useStudentAccess();
  const navigate = useNavigate();
  useEffect(() => {
    if (access.ready && access.user) void navigate({ to: next === "/auth" ? "/" : next, replace: true });
  }, [access.ready, access.user, next, navigate]);
  const social = async () => {
    setError(""); setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/auth?next=${encodeURIComponent(next)}` });
      if (result.error) setError(result.error.message);
    } catch { setError("Google sign-in could not complete. Please try again."); }
    finally { setBusy(false); }
  };
  return <main className="mx-auto min-h-screen max-w-lg px-5 py-10">
    <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold"><Activity className="text-primary" /> SkillPulse</Link>
    <h1 className="mt-8 text-2xl font-semibold">{reason === "roles" ? "Your 5 Free Chances Over!" : reason === "skills" ? "Your 2 free skill checks are used" : "Your student account"}</h1>
    <p className="mt-3 text-sm text-muted-foreground">{reason ? "To continue, Sign Up Free. Unlock all roles, roadmaps and missing skills." : "Free, unlimited access to your placement plans."}</p>
    <div className="mt-6 grid grid-cols-2 border-b border-border" role="tablist">
      {(["login", "signup"] as const).map((value) => <Button key={value} role="tab" aria-selected={mode === value} variant="ghost" className={mode === value ? "rounded-none border-b-2 border-primary" : "rounded-none"} onClick={() => { setMode(value); setError(""); setSent(false); }}>{value === "login" ? "Login" : "Sign Up"}</Button>)}
    </div>
    {sent ? <div className="mt-8 space-y-3" role="status"><Mail className="text-primary" /><h2 className="text-lg font-semibold">Check your email</h2><p className="text-sm text-muted-foreground">Confirm your email to finish signing up, then return to SkillPulse.</p></div> : <form className="mt-6 space-y-4" onSubmit={async (event) => {
      event.preventDefault(); setBusy(true); setError("");
      const form = new FormData(event.currentTarget);
      const field = (key: string) => String(form.get(key) ?? "").trim();
      try {
        if (mode === "signup") {
          const { data, error: failure } = await supabase.auth.signUp({ email: field("email"), password: String(form.get("password") ?? ""), options: { emailRedirectTo: `${window.location.origin}/auth?next=${encodeURIComponent(next)}`, data: { full_name: field("full_name"), college_name: field("college_name"), branch: field("branch"), year: field("year"), interested_field: field("interested_field") } } });
          if (failure) setError(failure.message); else if (!data.session) setSent(true);
        } else {
          const { error: failure } = await supabase.auth.signInWithPassword({ email: field("email"), password: String(form.get("password") ?? "") });
          if (failure) setError(failure.message);
        }
      } catch { setError("We couldn't connect. Please try again."); }
      finally { setBusy(false); }
    }}>
      {mode === "signup" && <label className="block text-sm font-medium">Full Name<input name="full_name" required maxLength={100} autoComplete="name" className="student-input" /></label>}
      <label className="block text-sm font-medium">Email<input name="email" type="email" required autoComplete="email" className="student-input" /></label>
      <label className="block text-sm font-medium">Password<input name="password" type="password" required minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} className="student-input" /></label>
      {mode === "signup" && <>
        <label className="block text-sm font-medium">College Name<input name="college_name" required maxLength={150} className="student-input" /></label>
        <div className="grid grid-cols-2 gap-3"><label className="text-sm font-medium">Branch<select name="branch" required className="student-input">{["CSE", "ECE", "EEE", "Mech", "Civil", "Commerce", "MBA", "Others"].map((value) => <option key={value}>{value}</option>)}</select></label><label className="text-sm font-medium">Year<select name="year" required className="student-input">{["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate"].map((value) => <option key={value}>{value}</option>)}</select></label></div>
        <label className="block text-sm font-medium">Interested Field<input name="interested_field" required maxLength={100} className="student-input" /></label>
      </>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={busy} className="w-full">{busy ? "Please wait…" : mode === "signup" ? "Sign Up Free" : "Login"}</Button>
      <Button type="button" variant="outline" className="google-signin w-full" disabled={busy} onClick={() => { void social(); }}>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px]"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>Continue with Google
      </Button>
      {mode === "signup" && <Button type="button" variant="link" className="w-full" onClick={() => setMode("login")}>Already have an account? Login</Button>}
    </form>}
  </main>;
}