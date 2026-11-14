import { normalizeText, slugify } from "./role-text";

export type RoleGroup =
  | "Software Engineering"
  | "Testing & QA"
  | "Data & AI"
  | "Cloud & Security"
  | "Electronics (ECE)"
  | "Electrical (EEE)"
  | "Mechanical"
  | "Civil"
  | "Management & HR"
  | "Finance"
  | "Marketing & Sales"
  | "Design";

export interface CatalogRole {
  id: string;
  title: string;
  group: RoleGroup;
  /** Extra keywords that steer the generated checklist. */
  hint?: string;
  /** Alternative names people search for. */
  aliases?: string[];
}

/** Branch / stream words that surface a whole group in search. */
export const GROUP_KEYWORDS: Record<RoleGroup, string[]> = {
  "Software Engineering": ["cs", "cse", "it", "computer science", "software", "coding", "programming"],
  "Testing & QA": ["qa", "testing", "quality assurance"],
  "Data & AI": ["data", "ai", "analytics"],
  "Cloud & Security": ["cloud", "security", "infrastructure"],
  "Electronics (ECE)": ["ece", "electronics", "communication", "hardware"],
  "Electrical (EEE)": ["eee", "electrical"],
  Mechanical: ["mech", "mechanical"],
  Civil: ["civil", "construction"],
  "Management & HR": ["mba", "management", "hr", "bba", "non tech"],
  Finance: ["finance", "commerce", "bcom", "mba", "non tech"],
  "Marketing & Sales": ["marketing", "sales", "mba", "non tech"],
  Design: ["design", "creative", "bdes"],
};

type Row = [title: string, hint?: string, aliases?: string[], id?: string];

const GROUPS: Record<RoleGroup, Row[]> = {
  "Software Engineering": [
    ["Software Developer", "", ["SDE", "Software Engineer"], "software-developer"],
    ["Associate Software Engineer", "", ["ASE"]],
    ["Graduate Engineer Trainee (IT)", "software", ["GET", "Trainee"]],
    ["Java Developer", "", ["Spring Boot Developer"]],
    ["Java Full-Stack Developer"],
    ["Python Developer"],
    ["Django Developer", "python"],
    ["React Developer", "", ["ReactJS Developer"]],
    ["Angular Developer"],
    ["Node.js Developer", "", ["Express Developer"]],
    ["MERN Stack Developer", "react node fullstack"],
    ["C++ Developer"],
    [".NET Developer", "", ["Dotnet Developer"]],
    ["C# Developer", "dotnet"],
    ["Android Developer", "", ["Kotlin Developer"]],
    ["iOS Developer", "", ["Swift Developer"]],
    ["Flutter Developer", "", ["Mobile App Developer"]],
    ["React Native Developer"],
    ["Full-Stack Developer"],
    ["Backend Developer", "", ["Server-side Developer"]],
    ["Frontend Developer", "", ["UI Developer"]],
    ["Web Developer", "fullstack"],
    ["PHP Developer", "", ["Laravel Developer"]],
    ["Golang Developer", "", ["Go Developer"]],
    ["Salesforce Developer", "", ["CRM Developer"]],
    ["SAP ABAP Consultant", "software"],
    ["Game Developer", "", ["Unity Developer"]],
    ["Blockchain Developer", "", ["Web3 Developer"]],
    ["Mainframe Developer"],
    ["Technical Support Engineer", "", ["IT Support", "Helpdesk"]],
  ],
  "Testing & QA": [
    ["QA Automation Engineer", "", ["Automation Tester"], "qa-automation"],
    ["Manual Test Engineer", "", ["Software Tester"]],
    ["SDET", "", ["Software Development Engineer in Test"]],
    ["Performance Test Engineer", "jmeter"],
  ],
  "Data & AI": [
    ["Data Analyst", "", ["MIS Analyst"], "data-analyst"],
    ["Data Scientist"],
    ["Machine Learning Engineer", "", ["ML Engineer"]],
    ["AI Prompt Engineer", "", ["Prompt Engineer", "GenAI Engineer"]],
    ["Generative AI Engineer", "", ["LLM Engineer"]],
    ["NLP Engineer"],
    ["Computer Vision Engineer"],
    ["MLOps Engineer"],
    ["BI Analyst", "powerbi", ["Business Intelligence Analyst"]],
    ["Power BI Developer"],
    ["Tableau Developer"],
    ["Data Engineer"],
    ["Big Data Engineer"],
    ["ETL Developer"],
    ["SQL Developer", "", ["PL/SQL Developer"]],
  ],
  "Cloud & Security": [
    ["AWS Cloud Engineer"],
    ["Azure Administrator", "", ["Azure Admin"]],
    ["GCP Cloud Engineer", "", ["Google Cloud Engineer"]],
    ["Cloud Support Associate"],
    ["DevOps Engineer"],
    ["Site Reliability Engineer (SRE)", "", ["SRE"]],
    ["Kubernetes Engineer", "", ["Platform Engineer"]],
    ["Linux System Administrator", "", ["Sysadmin"]],
    ["Database Administrator", "", ["DBA"]],
    ["Cybersecurity Analyst", "", ["Information Security Analyst"]],
    ["SOC Analyst", "", ["Security Operations Center Analyst"]],
    ["Ethical Hacker", "", ["Penetration Tester", "VAPT"]],
    ["Penetration Tester"],
    ["Network Engineer", "", ["CCNA"]],
    ["Network Security Engineer", "firewall"],
  ],
  "Electronics (ECE)": [
    ["Embedded Systems Engineer"],
    ["Embedded Software Engineer", "embedded firmware"],
    ["VLSI Design Engineer", "", ["RTL Design Engineer"]],
    ["VLSI Verification Engineer", "", ["Design Verification Engineer"]],
    ["FPGA Engineer"],
    ["IoT Engineer", "", ["Internet of Things Developer"]],
    ["Firmware Engineer", "embedded"],
    ["PCB Design Engineer"],
    ["RF Engineer", "", ["Wireless Engineer"]],
    ["Telecom Engineer", "", ["5G Engineer"]],
    ["Robotics Engineer"],
    ["Electronics Hardware Engineer", "pcb"],
  ],
  "Electrical (EEE)": [
    ["Electrical Design Engineer"],
    ["PLC Automation Engineer", "plc scada"],
    ["SCADA Engineer"],
    ["Power Systems Engineer", "power substation"],
    ["Electrical Maintenance Engineer", "electrical maintenance"],
    ["Renewable Energy Engineer", "solar"],
    ["Electric Vehicle Engineer", "ev battery", ["EV Engineer"]],
    ["Instrumentation Engineer"],
    ["Control Systems Engineer", "instrumentation"],
  ],
  Mechanical: [
    ["Mechanical Design Engineer"],
    ["Mechanical CAD Engineer", "mechanical design"],
    ["AutoCAD Draftsman", "mechanical", ["CAD Drafter"]],
    ["CAE / FEA Analyst", "mechanical"],
    ["Production Engineer"],
    ["Manufacturing Engineer"],
    ["Quality Engineer", "mechanical quality control"],
    ["Automobile Engineer", "", ["Automotive Engineer"]],
    ["HVAC Design Engineer"],
    ["Mechanical Maintenance Engineer", "mechanical maintenance"],
  ],
  Civil: [
    ["Civil Site Engineer"],
    ["Structural Design Engineer", "civil"],
    ["Quantity Surveyor", "civil", ["QS", "Billing Engineer"]],
    ["Estimation Engineer", "civil"],
    ["Planning Engineer (Civil)", "civil primavera"],
    ["BIM Modeler", "civil revit"],
    ["Highway Engineer", "civil"],
    ["Construction Project Engineer", "civil site"],
  ],
  "Management & HR": [
    ["Business Analyst", "", ["BA"], "business-analyst"],
    ["Product Manager", "", ["PM"]],
    ["Associate Product Manager", "", ["APM"]],
    ["Project Coordinator"],
    ["Management Trainee"],
    ["Management Consulting Analyst", "consulting", ["Strategy Analyst"]],
    ["Operations Analyst"],
    ["Supply Chain Analyst", "", ["SCM Analyst"]],
    ["Logistics Coordinator"],
    ["Procurement Executive", "", ["Purchase Executive"]],
    ["Customer Success Associate"],
    ["HR Generalist", "", ["Human Resources Executive"]],
    ["HR Recruiter", "", ["Talent Acquisition Executive"]],
    ["Payroll Executive", "hr"],
  ],
  Finance: [
    ["Financial Analyst"],
    ["Investment Banking Analyst", "", ["IB Analyst"]],
    ["Equity Research Analyst"],
    ["Credit Analyst"],
    ["Risk Analyst", "finance"],
    ["FP&A Analyst", "finance", ["Financial Planning Analyst"]],
    ["Accountant", "", ["Accounts Executive"]],
    ["Audit Associate", "finance"],
    ["Tax Consultant", "finance", ["GST Consultant"]],
    ["Actuarial Analyst", "finance"],
    ["Bank Probationary Officer", "banking", ["Bank PO"]],
  ],
  "Marketing & Sales": [
    ["Digital Marketer", "", ["Digital Marketing Executive"]],
    ["SEO Specialist"],
    ["Content Strategist"],
    ["Content Writer", "", ["Copywriter"]],
    ["Social Media Manager"],
    ["Performance Marketing Executive", "", ["PPC Specialist", "Google Ads Specialist"]],
    ["Email Marketing Specialist"],
    ["Brand Executive", "marketing", ["Associate Brand Manager"]],
    ["Growth Marketer"],
    ["Marketing Analyst", "", ["Marketing Data Analyst"]],
    ["Sales Executive"],
    ["Inside Sales Representative", "", ["ISR"]],
    ["Business Development Executive", "", ["BDE"]],
  ],
  Design: [
    ["UI/UX Designer", "", ["UX Designer", "UI Designer"]],
    ["Product Designer"],
    ["UX Researcher"],
    ["Graphic Designer"],
    ["Visual Designer", "graphic"],
    ["Web Designer"],
    ["Motion Graphics Designer", "", ["Motion Designer"]],
    ["Video Editor"],
    ["3D Artist / Animator", "", ["3D Modeler", "Animator"]],
  ],
};

export const ROLE_CATALOG: CatalogRole[] = (Object.keys(GROUPS) as RoleGroup[]).flatMap((group) =>
  GROUPS[group].map(([title, hint, aliases, id]) => ({
    id: id ?? slugify(title),
    title,
    group,
    hint: hint || undefined,
    aliases,
  })),
);

const BY_ID = new Map(ROLE_CATALOG.map((r) => [r.id, r]));
const BY_TITLE = new Map(ROLE_CATALOG.map((r) => [normalizeText(r.title), r]));

export function findCatalogRole(id: string): CatalogRole | undefined {
  return BY_ID.get(id);
}

/** Exact (case/punctuation-insensitive) match on a catalog title or alias. */
export function findCatalogRoleByTitle(title: string): CatalogRole | undefined {
  const n = normalizeText(title);
  if (!n) return undefined;
  return BY_TITLE.get(n) ?? ROLE_CATALOG.find((r) => r.aliases?.some((a) => normalizeText(a) === n));
}

interface Indexed {
  role: CatalogRole;
  title: string;
  words: string[];
  aliases: string[];
  group: string[];
}

const INDEX: Indexed[] = ROLE_CATALOG.map((role) => {
  const title = normalizeText(role.title);
  return {
    role,
    title,
    words: title.split(" "),
    aliases: (role.aliases ?? []).map(normalizeText),
    group: GROUP_KEYWORDS[role.group].map(normalizeText),
  };
});

function scoreRole(entry: Indexed, q: string, qTokens: string[]): number {
  if (entry.title === q) return 1000;
  if (entry.aliases.includes(q)) return 900;
  if (entry.title.startsWith(q)) return 800;
  if (entry.aliases.some((a) => a.startsWith(q))) return 600;
  const tokenHit = (t: string) =>
    entry.words.some((w) => w.startsWith(t)) || entry.aliases.some((a) => a.split(" ").some((w) => w.startsWith(t)));
  if (qTokens.every(tokenHit)) return 500 - entry.words.findIndex((w) => w.startsWith(qTokens[0]!)) * 10;
  if (entry.title.includes(q)) return 300;
  if (entry.group.some((g) => g === q || g.startsWith(q))) return 100;
  return 0;
}

/** Ranked catalog matches for a search query (empty query → no results). */
export function searchRoles(query: string, limit = 8): CatalogRole[] {
  const q = normalizeText(query);
  if (!q) return [];
  const qTokens = q.split(" ");
  return INDEX.map((e, i) => ({ e, i, s: scoreRole(e, q, qTokens) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.e.title.length - b.e.title.length || a.i - b.i)
    .slice(0, limit)
    .map((x) => x.e.role);
}
