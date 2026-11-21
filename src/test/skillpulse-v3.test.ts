import { describe, expect, it } from "vitest";
import { ROLE_CATALOG, searchRoles } from "@/lib/role-catalog";
import { buildFourWeekPlan, checkResume, computeScore, createCustomRole, getRole, parseSavedRoles, resolveRole, type Skill } from "@/lib/skillpulse";

describe("SkillPulse V3", () => {
  it("keeps at least 20 roles and finds the requested searches", () => {
    expect(ROLE_CATALOG.length).toBeGreaterThanOrEqual(20);
    for (const query of ["Python Developer", "Data Analyst", "UI UX", "HR", "Marketing", "Cyber Security"]) expect(searchRoles(query).length, query).toBeGreaterThan(0);
  });

  it("creates and restores exactly five user-defined skills", () => {
    const names = ["Mineralogy", "Surveying", "Safety", "AutoCAD", "Communication"];
    const custom = createCustomRole("Mining Engineer", names);
    if (!custom) throw new Error("Custom role not created");
    expect(custom.skills).toHaveLength(5);
    expect(custom.skills.map((s) => s.name)).toEqual(names);
    const restored = parseSavedRoles(JSON.parse(JSON.stringify([custom])));
    expect(resolveRole(custom, restored).skills.map((s) => s.name)).toEqual(names);
  });

  it("rejects custom roles without exactly five distinct skills", () => {
    expect(createCustomRole("New Role", ["One", "Two", "Three", "Four"])).toBeNull();
    expect(createCustomRole("New Role", ["One", "Two", "Three", "Four", " one "])).toBeNull();
    expect(parseSavedRoles([{ title: "New Role", skills: [null] }])).toEqual([]);
  });

  it.each(["service", "product"] as const)("uses 60–25–15 category completion on %s track", (track) => {
    const role = getRole("software-developer");
    for (const [category, score] of [["technical", 60], ["tools", 25], ["soft", 15]] as const) {
      expect(computeScore(role.skills, role.skills.filter((s) => s.category === category).map((s) => s.id), track)).toBe(score);
    }
    expect(computeScore(role.skills, role.skills.map((s) => s.id), track)).toBe(100);
  });

  it("combines core fundamentals with technical and handles absent categories", () => {
    const skills: Skill[] = [
      { id: "a", name: "A", category: "technical", tip: "A" },
      { id: "b", name: "B", category: "fundamentals", tip: "B" },
      { id: "c", name: "C", category: "soft", tip: "C" },
    ];
    expect(computeScore(skills, ["a", "b"], "service")).toBe(80);
    expect(computeScore(skills, ["a", "b", "c"], "service")).toBe(100);
  });

  it("makes four weeks with 3 topics, 2 tasks, 1 project and 3 questions for every role", () => {
    for (const ref of ROLE_CATALOG) {
      const plan = buildFourWeekPlan(resolveRole(ref), "service");
      expect(plan.map((w) => w.week)).toEqual([1, 2, 3, 4]);
      expect(plan.map((w) => w.items.length)).toEqual([3, 2, 1, 3]);
      expect(plan.map((w) => w.title)).toEqual(["Learn Basics", "Practice", "Mini Project", "Interview Prep"]);
    }
    expect(buildFourWeekPlan(getRole("data-analyst"), "service")).not.toEqual(buildFourWeekPlan(getRole("software-developer"), "service"));
  });

  it("matches resume skills with token boundaries and lists all gaps", () => {
    const role = createCustomRole("Python Developer", ["Python", "SQL", "Git", "Excel", "Communication"]);
    if (!role) throw new Error("Custom role not created");
    const result = checkResume(role.skills, "PYTHON, SQL and Git. Excellent communicator.");
    expect(result.matched.map((s) => s.name)).toEqual(["Python", "SQL", "Git"]);
    expect(result.missing.map((s) => s.name)).toEqual(["Excel", "Communication"]);
    expect(checkResume(role.skills, "").matched).toHaveLength(0);
    expect(checkResume(role.skills, "Python SQL Git Excel Communication").missing).toHaveLength(0);
  });
});