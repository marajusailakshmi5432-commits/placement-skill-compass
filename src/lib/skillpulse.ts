export type RoleId = "software-developer" | "data-analyst" | "business-analyst" | "qa-automation";
export type Track = "service" | "product";
export type Category = "technical" | "fundamentals" | "tools" | "soft";

export interface Skill {
  id: string;
  name: string;
  category: Category;
  tip: string;
}

export interface Role {
  id: RoleId;
  title: string;
  short: string;
  skills: Skill[];
}

export const CATEGORY_LABELS: Record<Category, string> = {
  technical: "Technical Skills",
  fundamentals: "Core Fundamentals",
  tools: "Tools",
  soft: "Soft Skills",
};

export const CATEGORY_ORDER: Category[] = ["technical", "tools", "soft"];

/** How much each skill category counts toward the score on each company track. */
export const TRACK_WEIGHTS: Record<Track, Record<Category, number>> = {
  product: { technical: 3, fundamentals: 2, tools: 2, soft: 1 },
  service: { technical: 2, fundamentals: 2, tools: 1, soft: 2 },
};

export const TRACK_LABELS: Record<Track, string> = {
  service: "Service-Based",
  product: "Product-Based",
};

export const TRACK_NOTES: Record<Track, string> = {
  product:
    "Product-based companies weigh technical depth heaviest — core concepts and problem-solving move your score most.",
  service:
    "Service-based companies balance fundamentals with communication — soft skills carry as much weight as technical ones.",
};

export const ROLES: Role[] = [
  {
    id: "software-developer",
    title: "Software Developer",
    short: "SDE",
    skills: [
      { id: "sd-dsa", name: "Data Structures & Algorithms", category: "technical", tip: "Solve 3 array/string problems daily; finish the week with 4 tree and recursion problems." },
      { id: "sd-oop", name: "OOP Concepts", category: "technical", tip: "Revise the 4 pillars with code examples and model a small library-management system in classes." },
      { id: "sd-dbms", name: "DBMS & SQL", category: "technical", tip: "Write 30 queries covering joins, GROUP BY and subqueries; revise normalization up to 3NF." },
      { id: "sd-os", name: "OS & Computer Networks", category: "technical", tip: "Make one-page notes daily: processes, threads, deadlocks, paging, OSI and TCP/IP." },
      { id: "sd-lang", name: "One Language Mastery (Java/C++/Python)", category: "technical", tip: "Rewrite 10 classic programs (sorting, recursion, string ops) without IDE autocomplete." },
      { id: "sd-git", name: "Git & GitHub", category: "tools", tip: "Push two projects with clean commits, a README and one branch → pull request → merge flow." },
      { id: "sd-ide", name: "IDE & Debugging", category: "tools", tip: "Learn breakpoints and step-through; debug 3 deliberately broken programs end to end." },
      { id: "sd-linux", name: "Linux Command Line", category: "tools", tip: "Use the terminal daily — navigation, grep, pipes, permissions; clear OverTheWire Bandit 0–10." },
      { id: "sd-api", name: "REST APIs & Postman", category: "tools", tip: "Build a tiny CRUD API and test every endpoint with a saved Postman collection." },
      { id: "sd-intro", name: "Self-Introduction & Communication", category: "soft", tip: "Record a 90-second 'Tell me about yourself' daily and tighten it for clarity and pace." },
      { id: "sd-think", name: "Thinking Aloud While Solving", category: "soft", tip: "Narrate your approach while solving one problem daily; do one mock interview with a peer." },
      { id: "sd-team", name: "Teamwork & Project Storytelling", category: "soft", tip: "Prepare STAR stories for conflict, a tight deadline and a leadership moment from your projects." },
    ],
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    short: "DA",
    skills: [
      { id: "da-sql", name: "SQL & Window Functions", category: "technical", tip: "Practice 5 queries daily with joins, CTEs, RANK and LAG on a public sales dataset." },
      { id: "da-stats", name: "Statistics & Probability", category: "technical", tip: "Cover mean/median/variance, distributions, hypothesis testing and p-values — one topic per day." },
      { id: "da-python", name: "Python (Pandas & NumPy)", category: "technical", tip: "Load, filter, group and merge 3 Kaggle datasets; write a cheat-sheet of 20 Pandas ops." },
      { id: "da-eda", name: "Data Cleaning & EDA", category: "technical", tip: "Take one messy dataset and handle nulls, duplicates and outliers; document every step." },
      { id: "da-apt", name: "Quantitative Aptitude", category: "technical", tip: "Do 20 timed questions daily on percentages, ratios, data interpretation and probability." },
      { id: "da-excel", name: "Advanced Excel", category: "tools", tip: "Master XLOOKUP, pivot tables, conditional formatting and build one KPI summary sheet." },
      { id: "da-bi", name: "Power BI / Tableau", category: "tools", tip: "Build one interactive dashboard with filters, 4+ charts and a clear headline insight." },
      { id: "da-jupyter", name: "Jupyter Notebooks", category: "tools", tip: "Turn one analysis into a clean notebook with markdown headings, charts and conclusions." },
      { id: "da-portfolio", name: "GitHub Portfolio", category: "tools", tip: "Publish 2 analysis projects with READMEs that state the question, method and key finding." },
      { id: "da-story", name: "Data Storytelling", category: "soft", tip: "Present one dashboard in 3 minutes to a friend: problem → insight → recommendation." },
      { id: "da-biz", name: "Business Acumen", category: "soft", tip: "Read 5 short business case studies and list the metrics each company would track." },
      { id: "da-detail", name: "Attention to Detail", category: "soft", tip: "Cross-check every output this week against a manual sample; log mistakes you catch." },
    ],
  },
  {
    id: "business-analyst",
    title: "Business Analyst",
    short: "BA",
    skills: [
      { id: "ba-req", name: "Requirements Gathering (BRD/FRD)", category: "technical", tip: "Draft a BRD and FRD for a food-delivery app feature using a standard template." },
      { id: "ba-process", name: "Process Modeling (BPMN)", category: "technical", tip: "Map 3 real processes (e.g. college admission) as BPMN diagrams with swimlanes." },
      { id: "ba-sql", name: "SQL for Business Queries", category: "technical", tip: "Answer 20 business questions with SQL — revenue by month, top customers, churn counts." },
      { id: "ba-kpi", name: "Business Metrics & KPIs", category: "technical", tip: "Learn CAC, LTV, churn, conversion and retention; calculate each on a sample dataset." },
      { id: "ba-case", name: "Case Studies & Guesstimates", category: "technical", tip: "Solve one guesstimate and one business case daily using a structured framework." },
      { id: "ba-excel", name: "Advanced Excel", category: "tools", tip: "Build a what-if analysis model with pivot tables, scenario manager and charts." },
      { id: "ba-jira", name: "Jira & Confluence", category: "tools", tip: "Create a mock sprint board with epics, user stories and acceptance criteria." },
      { id: "ba-bi", name: "Power BI / Tableau", category: "tools", tip: "Recreate one public business dashboard and add your own executive summary." },
      { id: "ba-wire", name: "Wireframing (Figma / Lucidchart)", category: "tools", tip: "Wireframe 5 screens for a feature you documented and annotate user flows." },
      { id: "ba-stake", name: "Stakeholder Management", category: "soft", tip: "Role-play 2 stakeholder interviews; practice asking open-ended discovery questions." },
      { id: "ba-present", name: "Presentation Skills", category: "soft", tip: "Build a 5-slide recommendation deck and rehearse it on video twice." },
      { id: "ba-critical", name: "Structured Problem-Solving", category: "soft", tip: "Practice MECE breakdowns and issue trees on 5 everyday business problems." },
    ],
  },
  {
    id: "qa-automation",
    title: "QA Automation Engineer",
    short: "QA",
    skills: [
      { id: "qa-manual", name: "Testing Fundamentals (SDLC/STLC)", category: "technical", tip: "Write 25 test cases for a login page covering positive, negative and boundary cases." },
      { id: "qa-lang", name: "Programming (Java/Python)", category: "technical", tip: "Practice loops, collections and OOP daily with 3 small programs relevant to test data." },
      { id: "qa-selenium", name: "Selenium WebDriver", category: "technical", tip: "Automate a full e-commerce flow: search, add to cart, checkout, with explicit waits." },
      { id: "qa-api", name: "API Testing Concepts", category: "technical", tip: "Learn status codes, headers and auth; test 10 endpoints of a public REST API." },
      { id: "qa-framework", name: "Test Frameworks (TestNG/PyTest)", category: "technical", tip: "Structure your Selenium tests with Page Object Model, assertions and reports." },
      { id: "qa-postman", name: "Postman", category: "tools", tip: "Build a collection with environment variables, pre-request scripts and test assertions." },
      { id: "qa-git", name: "Git & GitHub", category: "tools", tip: "Host your automation framework on GitHub with a README explaining how to run it." },
      { id: "qa-ci", name: "Jenkins / CI Basics", category: "tools", tip: "Set up a pipeline (Jenkins or GitHub Actions) that runs your test suite on every push." },
      { id: "qa-jira", name: "Jira Bug Tracking", category: "tools", tip: "Log 10 realistic bugs with steps, expected vs actual, severity and screenshots." },
      { id: "qa-detail", name: "Attention to Detail", category: "soft", tip: "Explore one website daily for 20 minutes and note every inconsistency you find." },
      { id: "qa-report", name: "Clear Bug Reporting", category: "soft", tip: "Rewrite 5 vague bug reports into clear, reproducible ones; get peer feedback." },
      { id: "qa-collab", name: "Collaboration with Developers", category: "soft", tip: "Prepare STAR stories on handling disagreements about bug priority diplomatically." },
    ],
  },
];

export function getRole(id: RoleId): Role {
  return ROLES.find((r) => r.id === id) ?? ROLES[0]!;
}

export function skillWeight(skill: Skill, track: Track): number {
  return TRACK_WEIGHTS[track][skill.category];
}

/** Weighted readiness score, 0–100, rounded to the nearest whole number. */
export function computeScore(skills: Skill[], checkedIds: Iterable<string>, track: Track): number {
  const checked = new Set(checkedIds);
  let total = 0;
  let earned = 0;
  for (const s of skills) {
    const w = skillWeight(s, track);
    total += w;
    if (checked.has(s.id)) earned += w;
  }
  if (total === 0) return 0;
  return Math.round((earned / total) * 100);
}

export type Status = "needs-prep" | "getting-close" | "placement-ready";

export const STATUS_LABELS: Record<Status, string> = {
  "needs-prep": "Needs Prep",
  "getting-close": "Getting Close",
  "placement-ready": "Placement Ready",
};

export function getStatus(score: number): Status {
  if (score >= 80) return "placement-ready";
  if (score >= 50) return "getting-close";
  return "needs-prep";
}

export type Priority = "High" | "Medium" | "Low";

export interface RoadmapItem {
  skill: Skill;
  week: number;
  priority: Priority;
}

/** Unchecked skills, highest-weighted first, each assigned to its own week. */
export function buildRoadmap(skills: Skill[], checkedIds: Iterable<string>, track: Track): RoadmapItem[] {
  const checked = new Set(checkedIds);
  const weights = TRACK_WEIGHTS[track];
  const max = Math.max(...Object.values(weights));
  const min = Math.min(...Object.values(weights));
  return skills
    .filter((s) => !checked.has(s.id))
    .map((s, i) => ({ s, i, w: weights[s.category] }))
    .sort((a, b) => b.w - a.w || a.i - b.i)
    .map(({ s, w }, idx) => ({
      skill: s,
      week: idx + 1,
      priority: (w === max ? "High" : w === min ? "Low" : "Medium") as Priority,
    }));
}

export function buildSummary(roleId: RoleId, track: Track, checkedIds: string[]): string {
  const role = getRole(roleId);
  const score = computeScore(role.skills, checkedIds, track);
  const status = STATUS_LABELS[getStatus(score)];
  const checked = new Set(checkedIds);
  const roadmap = buildRoadmap(role.skills, checkedIds, track);
  const lines: string[] = [
    "SkillPulse — Placement Readiness Summary",
    "========================================",
    `Target Role: ${role.title}`,
    `Company Track: ${TRACK_LABELS[track]}`,
    `Readiness Score: ${score}% (${status})`,
    "",
  ];
  for (const cat of CATEGORY_ORDER) {
    const items = role.skills.filter((s) => s.category === cat);
    const done = items.filter((s) => checked.has(s.id)).length;
    lines.push(`${CATEGORY_LABELS[cat]} (${done}/${items.length})`);
    for (const s of items) lines.push(`  [${checked.has(s.id) ? "x" : " "}] ${s.name}`);
    lines.push("");
  }
  if (roadmap.length === 0) {
    lines.push("Action Roadmap: All skills covered — keep practising mock interviews!");
  } else {
    lines.push("Action Roadmap");
    for (const r of roadmap) lines.push(`  Week ${r.week} · ${r.skill.name} (${r.priority}) — ${r.skill.tip}`);
  }
  return lines.join("\n");
}
