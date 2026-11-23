import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { LogIn, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ACCESS_KEY, FREE_ROLE_LIMIT, consumeFreeAccess, parseFreeAccess, type FreeAccess } from "@/lib/free-access";
import { toast } from "sonner";

interface AccessContext {
  user: User | null; ready: boolean; name: string; remaining: number;
  request: (kind: keyof FreeAccess) => boolean;
  signOut: () => Promise<void>;
}
const Context = createContext<AccessContext | null>(null);
export function useStudentAccess() {
  const value = useContext(Context);
  if (!value) throw new Error("Student access provider missing");
  return value;
}
export function StudentAccessProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [counts, setCounts] = useState<FreeAccess>({ roles: 0, skills: 0 });
  const countRef = useRef(counts);
  const router = useRouter();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  useEffect(() => {
    let active = true;
    let generation = 0;
    try {
      const raw = localStorage.getItem(ACCESS_KEY);
      const parsed = parseFreeAccess(raw ? JSON.parse(raw) : null);
      countRef.current = parsed;
      setCounts(parsed);
    } catch { /* unavailable or malformed browser storage */ }
    const refresh = async () => {
      const version = ++generation;
      const { data } = await supabase.auth.getUser();
      if (!active || version !== generation) return;
      setUser(data.user);
      setReady(true);
      setName("");
      if (data.user) {
        const profile = await supabase.from("profiles").select("full_name").eq("id", data.user.id).maybeSingle();
        if (active && version === generation) setName(profile.data?.full_name || "Student");
      }
    };
    void refresh();
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (!["SIGNED_IN", "SIGNED_OUT", "USER_UPDATED"].includes(event)) return;
      if (event === "SIGNED_OUT") { generation++; setUser(null); setName(""); }
      else setTimeout(() => { void refresh(); }, 0);
      void router.invalidate();
      if (event !== "SIGNED_OUT") void queryClient.invalidateQueries();
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, [router, queryClient]);
  const request = (kind: keyof FreeAccess) => {
    if (!ready) return false;
    const result = consumeFreeAccess(countRef.current, kind, Boolean(user));
    if (!result.allowed) {
      void navigate({ to: "/auth", search: { reason: kind, next: router.state.location.pathname } });
      return false;
    }
    if (!user) {
      try { localStorage.setItem(ACCESS_KEY, JSON.stringify(result.next)); }
      catch { toast.error("Browser storage is unavailable. Sign in to continue."); void navigate({ to: "/auth", search: { reason: kind, next: "/" } }); return false; }
      countRef.current = result.next;
      setCounts(result.next);
    }
    return true;
  };
  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/auth", search: { reason: "", next: "/" }, replace: true });
  };
  return <Context.Provider value={{ user, ready, name, remaining: FREE_ROLE_LIMIT - counts.roles, request, signOut }}>{children}</Context.Provider>;
}
export function StudentAccountBar() {
  const access = useStudentAccess();
  const navigate = useNavigate();
  return <div className="border-b border-border bg-card print:hidden"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6">
    <span className="text-sm font-semibold" aria-live="polite">{!access.ready ? "SkillPulse" : access.user ? `Hi, ${access.name || "Student"}` : `Free Chances Left: ${access.remaining}`}</span>
    {access.user ? <Button variant="ghost" size="sm" onClick={() => { void access.signOut(); }}><LogOut /> Logout</Button> : <Button variant="outline" size="sm" onClick={() => { void navigate({ to: "/auth", search: { reason: "", next: "/" } }); }}><LogIn /> Login / Sign Up</Button>}
  </div></div>;
}