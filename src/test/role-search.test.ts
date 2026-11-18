import { describe, expect, it } from "vitest";
import { ROLE_CATALOG, searchRoles } from "@/lib/role-catalog";
import { buildSummary, computeScore, resolveRole, roleRefFromInput } from "@/lib/skillpulse";

describe("Role search & any-role checklists", () => {
  it("offers at least 100 distinct roles", () => {
    expect(new Set(ROLE_CATALOG.map((r) => r.title)).size).toBeGreaterThanOrEqual(100);
    expect(new Set(ROLE_CATALOG.map((r) => r.id)).size).toBe(ROLE_CATALOG.length);
  });

  it("finds the roles named in the request", () => {
    for (const q of ["React Developer", "AI Prompt Engineer", "Ethical Hacker", "VLSI Design", "PLC Automation", "Civil Site Engineer", "Investment Banking Analyst", "UI/UX Designer"]) {
      expect(searchRoles(q)[0]?.title.toLowerCase()).toContain(q.toLowerCase().split(" ")[0]);
    }
  });

  it("every catalog role gets 8–10 skills (quick picks keep their 10–12)", () => {
    for (const r of ROLE_CATALOG) {
      const n = resolveRole({ id: r.id, title: r.title }).skills.length;
      const quick = ["software-developer", "data-analyst", "business-analyst", "qa-automation"].includes(r.id);
      if (quick) expect(n).toBeGreaterThanOrEqual(10);
      else {
        expect(n, r.title).toBeGreaterThanOrEqual(8);
        expect(n, r.title).toBeLessThanOrEqual(10);
      }
    }
  });

  it("a custom typed role gets 8–10 skills mixing Technical, Core Fundamentals and Soft Skills", () => {
    const ref = roleRefFromInput("Mining Engineer")!;
    expect(ref.id.startsWith("custom:")).toBe(true);
    const role = resolveRole(ref);
    expect(role.skills.length).toBeGreaterThanOrEqual(8);
    expect(role.skills.length).toBeLessThanOrEqual(10);
    expect(new Set(role.skills.map((s) => s.category))).toEqual(new Set(["technical", "fundamentals", "soft"]));
    expect(computeScore(role.skills, role.skills.map((s) => s.id), "product")).toBe(100);
    expect(buildSummary(role, "service", [])).toContain("Target Role: Mining Engineer");
  });

  it("typing an exact catalog title or alias picks the catalog role, not a custom one", () => {
    expect(roleRefFromInput("sde")?.id).toBe("software-developer");
    expect(roleRefFromInput("  ")).toBeNull();
  });
});
