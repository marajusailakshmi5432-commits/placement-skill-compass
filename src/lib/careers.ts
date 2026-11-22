import { CAREER_TITLES } from "./career-titles";
import { normalizeText, slugify } from "./role-text";

export const CAREER_CATEGORIES = ["AI & Data", "Software", "Cloud & DevOps", "Cybersecurity", "Design & Product", "Business", "Core Non-IT"] as const;
export type CareerCategory = typeof CAREER_CATEGORIES[number];
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export interface Career {
  id: string;
  title: string;
  category: CareerCategory;
  about: string;
  skills: string[];
  companies: string[];
  fresherSalary: [number, number];
  experiencedSalary: [number, number];
  difficulty: Difficulty;
  project: string;
}

interface Profile {
  skills: string[];
  companies: string[];
  fresherSalary: [number, number];
  experiencedSalary: [number, number];
  difficulty: Difficulty;
  work: string;
  project: string;
}

const PROFILES: Record<string, Profile> = {
  ai: { skills: ["Python", "Machine Learning", "Statistics", "PyTorch", "Model Evaluation"], companies: ["Google", "Microsoft", "Amazon", "Accenture", "TCS"], fresherSalary: [5, 12], experiencedSalary: [15, 40], difficulty: "Advanced", work: "build and evaluate data-driven models, work with training datasets, and translate experiments into useful applications", project: "Train a small prediction model on an open dataset, compare it with a baseline, and document accuracy and limitations." },
  data: { skills: ["SQL", "Excel", "Statistics", "Power BI", "Data Storytelling"], companies: ["Deloitte", "Accenture", "Amazon", "Infosys", "TCS"], fresherSalary: [3.5, 8], experiencedSalary: [10, 25], difficulty: "Intermediate", work: "clean datasets, investigate trends, and communicate evidence-based recommendations to stakeholders", project: "Clean a public sales dataset, build a dashboard, and present three actionable findings." },
  dataEngineering: { skills: ["Python", "SQL", "ETL Pipelines", "Apache Spark", "Data Modeling"], companies: ["Amazon", "Microsoft", "Accenture", "Deloitte", "Infosys"], fresherSalary: [4, 10], experiencedSalary: [12, 32], difficulty: "Intermediate", work: "build reliable data pipelines, model datasets, and maintain quality checks for analytics systems", project: "Build a batch pipeline from a public CSV into a SQL database with validation and a repeatable run script." },
  software: { skills: ["Programming", "Data Structures & Algorithms", "SQL", "Git & GitHub", "Testing"], companies: ["Google", "Microsoft", "Amazon", "TCS", "Infosys", "Accenture"], fresherSalary: [3.5, 10], experiencedSalary: [12, 35], difficulty: "Intermediate", work: "design, implement, test, and maintain software features while collaborating with other engineers", project: "Build a task manager with create, edit, delete, validation, and automated tests; publish a clear README." },
  frontend: { skills: ["HTML & CSS", "JavaScript", "React", "Accessibility", "Git & GitHub"], companies: ["Microsoft", "Amazon", "Accenture", "Infosys", "Zoho"], fresherSalary: [3, 8], experiencedSalary: [10, 28], difficulty: "Intermediate", work: "implement usable interfaces, connect them to APIs, and improve accessibility and browser performance", project: "Build an accessible event-booking interface with search, validation, and layouts for phone and desktop." },
  mobile: { skills: ["Mobile Programming", "UI Layouts", "REST APIs", "Local Storage", "Mobile Testing"], companies: ["Google", "Microsoft", "Accenture", "Infosys", "Zoho"], fresherSalary: [3.5, 9], experiencedSalary: [12, 30], difficulty: "Intermediate", work: "develop mobile interfaces, integrate services, and test behavior across devices and network conditions", project: "Build a habit-tracking app with local persistence, accessible navigation, and tests for its main actions." },
  qa: { skills: ["Test Case Design", "Python or Java", "Selenium", "API Testing", "Bug Reporting"], companies: ["TCS", "Infosys", "Accenture", "Microsoft", "Cognizant"], fresherSalary: [3, 7], experiencedSalary: [9, 22], difficulty: "Beginner", work: "verify software behavior, automate repeatable checks, and report clear, reproducible defects", project: "Create a test plan for a sample shop and automate login, search, and checkout against a local test environment." },
  cloud: { skills: ["Linux", "Cloud Fundamentals", "Networking", "Terraform", "Monitoring"], companies: ["Amazon", "Microsoft", "Google", "TCS", "Accenture"], fresherSalary: [4, 9], experiencedSalary: [12, 32], difficulty: "Intermediate", work: "operate cloud infrastructure, automate changes, and maintain reliability, cost controls, and access security", project: "Deploy a small app in a local container environment, add health checks, and write infrastructure and recovery notes." },
  security: { skills: ["Networking", "Linux", "Security Fundamentals", "Vulnerability Assessment", "Incident Reporting"], companies: ["Deloitte", "Accenture", "Microsoft", "IBM", "TCS"], fresherSalary: [4, 9], experiencedSalary: [12, 30], difficulty: "Advanced", work: "identify security risks, investigate alerts, and improve defenses within explicitly authorized environments", project: "Assess an intentionally vulnerable local lab you own, document findings, and verify one remediation. Never test without permission." },
  design: { skills: ["Figma", "Design Principles", "User Research", "Prototyping", "Visual Communication"], companies: ["Adobe", "Microsoft", "Accenture", "Deloitte", "Infosys"], fresherSalary: [3, 8], experiencedSalary: [10, 25], difficulty: "Beginner", work: "research user needs, create clear visual solutions, and iterate on prototypes using feedback", project: "Design a college-event experience, create three screens, test the prototype with peers, and explain the changes." },
  product: { skills: ["Product Discovery", "Prioritization", "Analytics", "Requirements Writing", "Stakeholder Communication"], companies: ["Amazon", "Microsoft", "Google", "Deloitte", "Accenture"], fresherSalary: [5, 12], experiencedSalary: [15, 40], difficulty: "Intermediate", work: "define user problems, prioritize outcomes, and coordinate product decisions with design, engineering, and business teams", project: "Write a product brief for a campus app, prioritize five features, and define a measurable launch experiment." },
  business: { skills: ["Excel", "Business Analysis", "Research", "Presentation", "Communication"], companies: ["Deloitte", "Accenture", "TCS", "Infosys", "Amazon"], fresherSalary: [3, 7], experiencedSalary: [8, 22], difficulty: "Beginner", work: "analyze business needs, coordinate day-to-day processes, and present practical recommendations", project: "Map a campus-service process, identify two bottlenecks, and present a costed improvement proposal." },
  finance: { skills: ["Accounting", "Excel", "Financial Modeling", "Risk Analysis", "Financial Reporting"], companies: ["Deloitte", "EY", "KPMG", "PwC", "HDFC Bank"], fresherSalary: [3.5, 8], experiencedSalary: [10, 28], difficulty: "Intermediate", work: "analyze financial records, assess performance or risk, and prepare accurate reports subject to relevant regulations", project: "Build a simple budget and financial statement model from a public annual report and explain its assumptions." },
  hr: { skills: ["Recruitment", "Excel", "HR Processes", "Interview Coordination", "Communication"], companies: ["TCS", "Infosys", "Accenture", "Deloitte", "Amazon"], fresherSalary: [2.5, 6], experiencedSalary: [7, 18], difficulty: "Beginner", work: "coordinate hiring and employee processes, maintain accurate records, and communicate fairly with candidates and teams", project: "Create a campus-intern hiring plan with a job description, a fair evaluation rubric, and an interview schedule." },
  marketing: { skills: ["Audience Research", "Content Planning", "SEO", "Campaign Analytics", "Copywriting"], companies: ["Accenture", "Deloitte", "Amazon", "Publicis", "WPP"], fresherSalary: [2.5, 7], experiencedSalary: [8, 22], difficulty: "Beginner", work: "research audiences, develop campaigns or sales outreach, and measure business results responsibly", project: "Plan a one-week campus-event campaign with three posts, a channel budget, and a measurement sheet." },
  mechanical: { skills: ["Engineering Drawing", "CAD", "Mechanics", "Manufacturing Processes", "Quality & Safety"], companies: ["Tata Motors", "Larsen & Toubro", "Bosch", "Mahindra", "Siemens"], fresherSalary: [3, 7], experiencedSalary: [8, 20], difficulty: "Intermediate", work: "apply engineering principles to design, manufacturing, maintenance, and safe technical documentation", project: "Model a simple mechanical assembly, prepare dimensioned drawings, and document materials and manufacturing choices." },
  electrical: { skills: ["Circuit Theory", "Electrical Design", "Power Systems", "Control Systems", "Electrical Safety"], companies: ["Siemens", "ABB", "Schneider Electric", "Larsen & Toubro", "Tata Power"], fresherSalary: [3, 7], experiencedSalary: [9, 22], difficulty: "Intermediate", work: "design or maintain electrical and control systems with attention to standards, verification, and safety", project: "Simulate a small control circuit, document its behavior, and prepare a safety and verification checklist." },
  electronics: { skills: ["Digital Electronics", "Embedded C", "Microcontrollers", "Hardware Debugging", "Circuit Design"], companies: ["Intel", "Qualcomm", "Texas Instruments", "Bosch", "TCS"], fresherSalary: [4, 10], experiencedSalary: [12, 30], difficulty: "Advanced", work: "develop or verify electronic hardware and embedded systems, interpret measurements, and document design decisions", project: "Build a simulated sensor logger, test the firmware, and record the circuit and timing assumptions." },
  civil: { skills: ["Engineering Drawing", "AutoCAD", "Structural Basics", "Quantity Estimation", "Site Safety"], companies: ["Larsen & Toubro", "Tata Projects", "AECOM", "Jacobs", "Shapoorji Pallonji"], fresherSalary: [3, 6], experiencedSalary: [8, 20], difficulty: "Intermediate", work: "support construction planning, design reviews, estimation, and safe site execution using engineering standards", project: "Prepare a sample building quantity estimate, a schedule, and a site-quality checklist using a public example plan." },
  science: { skills: ["Scientific Fundamentals", "Laboratory Methods", "Data Recording", "Quality Control", "Lab Safety"], companies: ["Dr. Reddy's", "Sun Pharma", "Biocon", "SGS", "Bureau Veritas"], fresherSalary: [2.5, 5], experiencedSalary: [6, 14], difficulty: "Intermediate", work: "follow validated methods, record observations accurately, and support scientific analysis with safe laboratory practices", project: "Analyze an open experimental dataset, prepare a results table, and document a quality-control procedure." },
  government: { skills: ["Quantitative Aptitude", "Reasoning", "General Awareness", "English", "Role-specific Fundamentals"], companies: ["SSC", "Indian Railways", "State Public Service Commissions", "Public Sector Undertakings"], fresherSalary: [3.5, 8], experiencedSalary: [8, 16], difficulty: "Advanced", work: "serve in public-sector operations after meeting the relevant eligibility requirements and recruitment process", project: "Read the official recruitment syllabus, complete a timed practice paper, and keep a topic-wise error log. Verify age and degree eligibility." },
  banking: { skills: ["Quantitative Aptitude", "Reasoning", "Banking Awareness", "English", "Computer Basics"], companies: ["SBI", "Bank of Baroda", "Punjab National Bank", "IBPS Participating Banks"], fresherSalary: [3.5, 7], experiencedSalary: [8, 16], difficulty: "Intermediate", work: "support banking operations, customer service, and compliance after clearing the applicable recruitment and eligibility checks", project: "Complete a timed bank-exam practice set, review banking terminology, and maintain an accuracy and speed log." },
};

function profileKey(title: string, category: CareerCategory): string {
  const t = normalizeText(title);
  if (category === "AI & Data") {
    if (/engineer|etl|sql developer|warehouse|lake|spark|hadoop|kafka|snowflake|databricks|dbt/.test(t) && !/ai|machine|ml|llm|nlp|vision|learning|robotics/.test(t)) return "dataEngineering";
    return /analyst|analytics|reporting|bi |power bi|tableau|steward|visualization/.test(t) ? "data" : "ai";
  }
  if (category === "Software") {
    if (/test|qa|sdet/.test(t)) return "qa";
    if (/mobile|android|ios|flutter|native|swift|dart/.test(t)) return "mobile";
    if (/front|react|angular|vue|svelte|next|nuxt|web designer|javascript|typescript|accessibility/.test(t)) return "frontend";
    return "software";
  }
  if (category === "Cloud & DevOps") return "cloud";
  if (category === "Cybersecurity") return "security";
  if (category === "Design & Product") return /manager|owner|product analyst|product operations/.test(t) ? "product" : "design";
  if (category === "Business") {
    if (/bank probationary/.test(t)) return "banking";
    if (/hr |payroll|recruit|talent|employee|compensation|learning and development/.test(t)) return "hr";
    if (/finance|financial|account|audit|tax|credit|risk|equity|investment|actuarial|treasury|gst|bank|insurance|wealth|trade finance/.test(t)) return "finance";
    if (/market|seo|content|social|brand|growth|sales|business development/.test(t)) return "marketing";
    return "business";
  }
  if (/bank clerk|bank specialist/.test(t)) return "banking";
  if (/government|railway|public sector|ssc |civil services|forest range|officer/.test(t)) return "government";
  if (/laboratory|research assistant|chemist|scientific|biotech|microbio|pharma|science/.test(t)) return "science";
  if (/civil|structural|quantity|estimation|planning|bim|highway|construction|geotechnical|water resources|survey/.test(t)) return "civil";
  if (/electrical|plc|scada|power|renewable|instrumentation|control systems/.test(t)) return "electrical";
  if (/embedded|vlsi|fpga|iot|firmware|pcb|rf |telecom|electronics/.test(t)) return "electronics";
  return "mechanical";
}

const SPECIAL_SKILLS: [RegExp, string][] = [
  [/python|django|flask|fastapi/i, "Python"], [/java\b|spring/i, "Java"], [/react/i, "React"], [/angular/i, "Angular"], [/node/i, "Node.js"], [/c\+\+/i, "C++"], [/\.net|c#/i, "C# & .NET"], [/flutter/i, "Flutter & Dart"], [/android|kotlin/i, "Kotlin"], [/ios|swift/i, "Swift"], [/aws/i, "AWS"], [/azure/i, "Azure"], [/gcp|google cloud/i, "Google Cloud"], [/kubernetes/i, "Kubernetes"], [/terraform/i, "Terraform"], [/sql/i, "SQL"], [/power bi/i, "Power BI"], [/tableau/i, "Tableau"], [/nlp/i, "Natural Language Processing"], [/computer vision/i, "Computer Vision"], [/prompt|generative|llm|rag/i, "LLM Prompting & Evaluation"], [/vlsi|fpga/i, "Verilog"], [/plc|scada/i, "PLC & SCADA"], [/seo/i, "SEO"], [/graphic|visual|illustrat/i, "Adobe Illustrator"], [/soc|siem|splunk|sentinel/i, "SIEM Analysis"], [/penetration|ethical hacker/i, "Authorized Penetration Testing"],
];

const QUICK_IDS: Record<string, string> = { "Software Developer": "software-developer", "Data Analyst": "data-analyst", "Business Analyst": "business-analyst", "QA Automation Engineer": "qa-automation" };
export const CAREERS: Career[] = CAREER_TITLES.map(({ title, category }) => {
  const profile = PROFILES[profileKey(title, category)] ?? PROFILES["business"];
  if (!profile) throw new Error("Missing career profile");
  const special = SPECIAL_SKILLS.find(([pattern]) => pattern.test(title))?.[1];
  const skills = special ? [special, ...profile.skills.filter((s) => s !== special)].slice(0, 5) : [...profile.skills];
  return { id: QUICK_IDS[title] ?? slugify(title), title, category, about: `As a ${title}, you ${profile.work}. Entry requirements vary by employer; use projects and practical examples to demonstrate your skills.`, skills, companies: [...profile.companies], fresherSalary: [...profile.fresherSalary], experiencedSalary: [...profile.experiencedSalary], difficulty: profile.difficulty, project: profile.project };
});

const BY_ID = new Map(CAREERS.map((role) => [role.id, role]));
export const CAREER_COMPANIES = [...new Set(CAREERS.flatMap((role) => role.companies))].sort();
export function findCareer(id: string): Career | undefined { return BY_ID.get(id); }

export interface CareerFilters { query: string; category: string; salary: string; difficulty: string; company: string }
export const EMPTY_CAREER_FILTERS: CareerFilters = { query: "", category: "all", salary: "all", difficulty: "all", company: "all" };

export function filterCareers(filters: CareerFilters): Career[] {
  const tokens = normalizeText(filters.query).split(" ").filter(Boolean);
  return CAREERS.filter((role) => {
    const haystack = normalizeText(`${role.title} ${role.category} ${role.skills.join(" ")} ${role.companies.join(" ")}`);
    return tokens.every((token) => haystack.includes(token))
      && (filters.category === "all" || role.category === filters.category)
      && (filters.difficulty === "all" || role.difficulty === filters.difficulty)
      && (filters.company === "all" || role.companies.includes(filters.company))
      && (filters.salary === "all" || role.fresherSalary[1] >= Number(filters.salary));
  });
}

export function buildCareerRoadmap(role: Career) {
  const [first = "fundamentals", second = "tools", third = "practice", fourth = "verification", fifth = "communication"] = role.skills;
  return [
    { month: 1, title: "Basics", items: [`Study ${first} and ${second} using official documentation or a beginner course.`, `Practice ${third} in small exercises and record what you learned.`, `Review ${fourth} and ${fifth}; explain an example of each in your own words.`] },
    { month: 2, title: "Projects", items: [role.project, `Apply ${first} and ${second} to the project, with clear checks for correctness.`, `Prepare a ${role.title} portfolio case study: problem, method, result, and limitations.`] },
    { month: 3, title: "Interview Preparation", items: [`Practice explaining ${role.skills.join(", ")} with concrete examples.`, `Run two ${role.title} mock interviews each week and review your answers.`, `Tailor your resume to relevant evidence, research employers, and check each opening's eligibility requirements.`] },
  ];
}

export function careerInterviewQuestions(role: Career): string[] {
  const [first = "fundamentals", second = "tools", third = "practice", fourth = "verification", fifth = "communication"] = role.skills;
  return [`Explain ${first} and describe a practical use in ${role.title} work.`, `When would you use ${second}, and what limitations would you consider?`, `Walk through a project where you applied ${third}; how did you check the result?`, `How would you diagnose a problem involving ${fourth}?`, `How would you apply ${fifth} while collaborating on a ${role.title} assignment?`];
}