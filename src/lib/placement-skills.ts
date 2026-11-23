import type { Skill } from "./skillpulse";
import { generateSkills } from "./skill-generator";
import { normalizeText, slugify } from "./role-text";

export function collegeTopics(title: string): string[] {
  const n = normalizeText(title);
  if (/data analyst|bi analyst|business intelligence/.test(n)) return ["Statistics", "Excel Basics", "DBMS", "Mathematics"];
  if (/ai|ml |machine|prompt|data|python/.test(n)) return ["Python Basics", "Mathematics", "DBMS", "Operating Systems", "Computer Networks"];
  if (/civil|structur|survey|construction|bim/.test(n)) return ["Engineering Drawing", "Engineering Mechanics", "Building Materials", "Surveying Basics"];
  if (/electrical|power|plc|scada|renewable/.test(n)) return ["Circuit Theory", "Electrical Machines", "Engineering Mathematics", "Control Systems Basics"];
  if (/embedded|vlsi|fpga|electronics|iot|telecom/.test(n)) return ["Digital Electronics", "Analog Circuits", "C Programming", "Microprocessor Basics"];
  if (/mechanical|cad|manufactur|production|automob|hvac/.test(n)) return ["Engineering Drawing", "Thermodynamics", "Engineering Mechanics", "Materials Science"];
  if (/design|ui|ux|graphic|animat/.test(n)) return ["Visual Design Basics", "Drawing & Composition", "Color Theory", "Design Research"];
  if (/finance|account|bank|commerce|audit|investment/.test(n)) return ["Accounting Basics", "Economics", "Business Mathematics", "Statistics"];
  if (/hr|recruit|market|sales|business|product|management/.test(n)) return ["Business Studies", "Economics", "Excel Basics", "Organizational Behavior"];
  if (/lab|chem|scient|biolog|pharma/.test(n)) return ["Scientific Method", "Laboratory Safety", "Basic Chemistry", "Experimental Statistics"];
  if (/government|ssc|railway|officer/.test(n)) return ["General Studies", "Basic Mathematics", "English", "Computer Basics"];
  return ["Programming Basics", "Mathematics", "DBMS", "Computer Networks"];
}

export function placementSkills(title: string, id: string, legacy: Skill[] = [], short = false, hint = ""): Skill[] {
  const generated = generateSkills(title, hint);
  const original = legacy.length ? legacy : generated;
  const out: Skill[] = [];
  const used = new Set<string>();
  const add = (skill: Skill) => { const key = normalizeText(skill.name); if (!used.has(key)) { used.add(key); out.push(skill); } };
  const make = (name: string, category: Skill['category'], source: "College" | "Industry"): Skill => ({ id: `${id}-${category}-${slugify(name)}`, name, category, source, tip: source === "College" ? `Revise ${name} from your college notes and solve five example questions.` : `Learn ${name}, practice it with a small exercise and document your result.` });
  if (legacy.length) {
    const academic = original.filter((s) => s.category === "technical").slice(0, 4);
    for (const s of original) add({ ...s, category: academic.some((a) => a.id === s.id) ? "college" : s.category === "tools" ? "technical" : s.category, scoreCategory: s.category, source: academic.some((a) => a.id === s.id) ? "College" : "Industry" });
  } else {
    for (const topic of collegeTopics(title).slice(0, short ? 2 : 4)) add(make(topic, "college", "College"));
    for (const skill of generated.filter((s) => s.category === "technical").slice(0, short ? 3 : 5)) add({ ...skill, category: "technical", source: "Industry" });
    if (!short) for (const name of ["Practical Project Development", "Quality Checks & Documentation", `${title} Workflows`]) {
      if (out.filter((s) => s.category === "technical").length >= 5) break;
      add(make(name, "technical", "Industry"));
    }
  }
  for (const skill of generated.filter((s) => s.category === "fundamentals")) {
    if (out.filter((s) => s.category === "fundamentals").length >= 3) break;
    add({ ...skill, source: "College" });
  }
  for (const topic of ["Problem Solving", "Logical Reasoning", "Quantitative Analysis"]) {
    if (out.filter((s) => s.category === "fundamentals").length >= 3) break;
    add(make(topic, "fundamentals", "College"));
  }
  for (const name of ["Self-Introduction", "Communication", "Resume & Interview Preparation"]) {
    if (out.filter((s) => s.category === "soft").length >= (short ? 2 : 3)) break;
    add(make(name, "soft", "Industry"));
  }
  return out;
}

export function skillLearning(skill: Skill, roleTitle: string) {
  const source = skill.source ?? (skill.category === "college" || skill.category === "fundamentals" ? "College" : "Industry");
  const topic = skill.name;
  return {
    source,
    description: `${topic} is a ${source === "College" ? "foundational subject you can revise through course notes and worked examples" : "practical capability developed through guided exercises, tools and projects"}.`,
    relevance: `For ${roleTitle}, use ${topic} to understand assignments, solve relevant problems and demonstrate your approach in an interview.`,
    days: [`Read an introduction to ${topic}; write down five key terms.`, `Work through a beginner example and explain each step.`, `Complete three small ${topic} exercises.`, `Apply ${topic} to a ${roleTitle} task.`, `Check your work, identify errors and repeat the hardest exercise.`, `Create a small example and document your approach.`, `Review your notes and explain ${topic} in a mock interview.`],
    youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${topic} beginner free tutorial`)}`,
    practice: /technical|tools/.test(skill.category) && /python|java|sql|program|data structure/.test(normalizeText(topic)) ? "https://www.hackerrank.com/domains/tutorials/10-days-of-javascript" : `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(topic)}`,
    project: `Create a documented ${roleTitle} example applying ${topic}; include your objective, steps, checks and what you would improve.`,
  };
}