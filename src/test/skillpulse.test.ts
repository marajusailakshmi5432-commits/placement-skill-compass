import { describe, expect, it } from "vitest";
import { buildRoadmap, computeScore, getRole, getStatus, ROLES } from "@/lib/skillpulse";

describe("SkillPulse readiness rules", () => {
  it("each role has 10–12 skills across Technical, Tools and Soft Skills", () => {
    for (const role of ROLES) {
      expect(role.skills.length).toBeGreaterThanOrEqual(10);
      expect(role.skills.length).toBeLessThanOrEqual(12);
      const cats = new Set(role.skills.map((s) => s.category));
      expect([...cats].sort()).toEqual(["soft", "technical", "tools"]);
    }
  });

  it("score is 0% with nothing checked and 100% with everything checked", () => {
    const role = getRole("software-developer");
    expect(computeScore(role.skills, [], "product")).toBe(0);
    expect(computeScore(role.skills, role.skills.map((s) => s.id), "service")).toBe(100);
  });

  it("status badge thresholds: Needs Prep < 50, Getting Close 50–79, Placement Ready 80+", () => {
    expect(getStatus(49)).toBe("needs-prep");
    expect(getStatus(50)).toBe("getting-close");
    expect(getStatus(79)).toBe("getting-close");
    expect(getStatus(80)).toBe("placement-ready");
  });

  it("roadmap lists exactly the unchecked skills", () => {
    const role = getRole("data-analyst");
    const checked = role.skills.slice(0, 4).map((s) => s.id);
    const roadmap = buildRoadmap(role.skills, checked, "service");
    expect(roadmap).toHaveLength(role.skills.length - 4);
    expect(roadmap.some((r) => checked.includes(r.skill.id))).toBe(false);
  });
});
