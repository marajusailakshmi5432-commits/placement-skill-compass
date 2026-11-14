import type { Skill } from "./skillpulse";
import { hasKeyword, normalizeText } from "./role-text";

/**
 * Builds an 8–10 skill checklist for any role title by matching keywords
 * against tech "packs" (Java, VLSI, SEO…) and broader branch "domains".
 */

interface Seed {
  key: string;
  name: string;
  tip: string;
}

type DomainId =
  | "software" | "testing" | "data" | "ai" | "cloud" | "security" | "network"
  | "electronics" | "electrical" | "mechanical" | "civil" | "product" | "business"
  | "operations" | "hr" | "finance" | "marketing" | "sales" | "design";

interface Domain {
  id: DomainId;
  match: string[];
  technical: Seed[];
  fundamentals: Seed[];
  soft: Seed[];
}

interface Pack {
  match: string[];
  domain?: DomainId;
  skills: Seed[];
}

const S = (key: string, name: string, tip: string): Seed => ({ key, name, tip });

// ---------- Shared seeds ----------
const L = {
  git: S("git", "Git & GitHub", "Push two projects with clean commits, a README and one branch → pull request → merge flow."),
  unitTest: S("unit-test", "Unit Testing & Debugging", "Write unit tests for one project and debug 3 deliberately broken programs with breakpoints."),
  restApi: S("rest-api", "REST API Design & Integration", "Build a small CRUD API, document it, and test every endpoint with a saved Postman collection."),
  dsa: S("dsa", "Data Structures & Algorithms", "Solve 3 array/string problems daily; finish the week with 4 tree and recursion problems."),
  oop: S("oop", "OOP Concepts", "Revise the 4 pillars with code examples and model a small library-management system in classes."),
  dbms: S("dbms", "DBMS & SQL", "Write 30 queries covering joins, GROUP BY and subqueries; revise normalization up to 3NF."),
  osCn: S("os-cn", "OS & Computer Networks", "Make one-page notes daily: processes, threads, deadlocks, paging, OSI and TCP/IP."),
  sqlAdv: S("sql-adv", "SQL & Window Functions", "Practice 5 queries daily with joins, CTEs, RANK and LAG on a public sales dataset."),
  excel: S("excel", "Advanced Excel", "Master XLOOKUP, pivot tables and conditional formatting; build one KPI summary sheet."),
  dashboards: S("dashboards", "Power BI / Tableau Dashboards", "Build one interactive dashboard with filters, 4+ charts and a clear headline insight."),
  stats: S("stats", "Statistics & Probability", "Cover distributions, hypothesis testing and p-values — one topic per day with worked examples."),
  aptitude: S("aptitude", "Quantitative Aptitude", "Do 20 timed questions daily on percentages, ratios, time-work and data interpretation."),
  reasoning: S("reasoning", "Logical Reasoning", "Solve 20 puzzles daily — seating, blood relations, syllogisms and series — under a timer."),
  pyMl: S("py-ml", "Python for ML (NumPy & Pandas)", "Load, clean and explore 3 Kaggle datasets; write a cheat-sheet of 20 Pandas operations."),
  sklearn: S("sklearn", "Scikit-learn Model Building", "Train, tune and compare 3 models on one dataset; report accuracy, precision, recall and F1."),
  linux: S("linux", "Linux Administration", "Use the terminal daily — users, permissions, services, cron and logs; clear OverTheWire Bandit 0–10."),
  docker: S("docker", "Docker & Containers", "Containerize one app, write a Dockerfile and docker-compose file, and push the image to a registry."),
  cicd: S("cicd", "CI/CD Pipelines", "Set up GitHub Actions or Jenkins to build, test and deploy one project on every push."),
  netFund: S("net-fund", "Networking Fundamentals (TCP/IP, DNS)", "Explain TCP vs UDP, DNS, DHCP and HTTP in your own words; trace requests with Wireshark."),
  osBasics: S("os-basics", "Operating System Concepts", "Revise processes, memory, file systems and scheduling with one diagram per topic."),
  siem: S("siem", "SIEM & Log Analysis (Splunk)", "Install Splunk Free, ingest sample logs and write 5 searches that detect suspicious activity."),
  cEmbedded: S("c-embedded", "Embedded C Programming", "Write bit-manipulation, pointer and register-level programs; blink, debounce and UART on a board."),
  verilog: S("verilog", "Verilog RTL Design", "Code a counter, FSM, FIFO and ALU in Verilog and simulate each with a testbench."),
  electricalCad: S("electrical-cad", "AutoCAD Electrical / ETAP", "Draw a single-line diagram and control panel wiring for a small building."),
  cadModel: S("cad-model", "3D CAD Modeling (SolidWorks / CATIA)", "Model 5 parts and one assembly with proper constraints, then generate their drawings."),
  gdt: S("gdt", "GD&T & Engineering Drawings", "Read 5 industrial drawings and annotate every tolerance, datum and symbol."),
  rcc: S("rcc", "RCC Design (IS 456)", "Hand-design one beam, slab and column per IS 456 and verify with a spreadsheet."),
  estimation: S("estimation", "Quantity Estimation & BOQ", "Prepare a BOQ for a 2-room house — earthwork, concrete, steel and brickwork."),
  siteExec: S("site-exec", "Site Execution & Supervision", "Study pour, shuttering and curing checklists; write a daily progress report template."),
  prd: S("prd", "Writing PRDs & User Stories", "Write a one-page PRD for a feature in an app you use, with user stories and acceptance criteria."),
  metrics: S("product-metrics", "Product Metrics & A/B Testing", "Define north-star and guardrail metrics for 3 apps; design one A/B test end to end."),
  caseStudy: S("case", "Case Studies & Guesstimates", "Solve one guesstimate and one business case daily using a structured framework."),
  agile: S("agile", "Agile & Scrum Basics", "Learn sprints, backlog, stand-ups and retros; run a mock sprint board in Jira or Trello."),
  stakeholder: S("stakeholder", "Stakeholder Management", "Role-play 2 stakeholder conversations; practise asking open-ended discovery questions."),
  present: S("present", "Presentation Skills", "Build a 5-slide recommendation deck and rehearse it on video twice."),
  inventory: S("inventory", "Inventory & Demand Forecasting", "Forecast demand for a sample product in Excel using moving average and EOQ."),
  erp: S("erp", "ERP Basics (SAP MM / Oracle)", "Walk through purchase-to-pay and order-to-cash flows in an ERP demo or tutorial."),
  negotiation: S("negotiation", "Negotiation Skills", "Role-play 3 negotiations (price, deadline, scope) and note what concessions you traded."),
  sourcing: S("sourcing", "Sourcing on LinkedIn & Job Portals", "Write 5 Boolean search strings and shortlist 20 profiles for a sample job description."),
  hrms: S("hrms", "HRMS & Excel for HR", "Build an employee tracker with attendance, leave and headcount pivots."),
  payroll: S("payroll", "Payroll & Compensation Basics", "Compute a sample salary slip with PF, ESI, TDS and CTC breakup."),
  finModel: S("fin-model", "Financial Modeling in Excel", "Build a 3-statement model for one listed company from its annual report."),
  valuation: S("valuation", "Valuation (DCF & Comparables)", "Value one company with DCF and trading comps; write a one-page buy/hold/sell note."),
  statements: S("statements", "Financial Statement Analysis", "Analyse 2 annual reports — compute 15 key ratios and explain what changed year on year."),
  ga: S("ga", "Google Analytics (GA4)", "Complete the GA4 demo account tasks and build one traffic and conversion report."),
  socialAds: S("social-ads", "Meta & Google Ads Basics", "Plan a mock campaign with audience, budget, creatives and target CPA; earn the Google Ads cert."),
  contentCreation: S("content-creation", "Content Creation & Copywriting", "Write 5 pieces this week — a blog, 2 social posts, an ad and an email — and get feedback."),
  market: S("market-research", "Market & User Research", "Interview 5 potential users and summarise their top 3 pains with quotes."),
  crm: S("crm", "CRM Tools (Salesforce / HubSpot)", "Set up a free HubSpot CRM, log 10 mock leads and move them through pipeline stages."),
  figma: S("figma", "Figma (Components & Auto Layout)", "Rebuild 3 screens of a popular app in Figma using components, variants and auto layout."),
  adobe: S("adobe", "Adobe Photoshop & Illustrator", "Recreate 3 posters or logos you admire to learn pen tool, layers and masks."),
  uxResearch: S("ux-research", "UX Research & Usability Testing", "Run 3 usability tests on an app, record issues and propose fixes ranked by severity."),
  storyboard: S("storyboard", "Storyboarding", "Storyboard a 30-second explainer shot by shot before animating or editing it."),
  htmlCss: S("html-css", "HTML, CSS & Responsive Design", "Rebuild 2 landing pages pixel-perfect with Flexbox, Grid and mobile breakpoints."),
  js: S("js", "Modern JavaScript (ES6+)", "Practise closures, promises, async/await and array methods with 15 small exercises."),
  ts: S("ts", "TypeScript", "Convert one JS project to TypeScript with interfaces, generics and strict mode on."),
  featureEng: S("feature-eng", "Feature Engineering", "Engineer 10 features for one dataset and measure how each changes model performance."),
  rf: S("rf", "RF Fundamentals & Smith Chart", "Revise transmission lines, impedance matching and S-parameters with 10 solved problems."),
  agileProj: S("project-plan", "Project Planning & Gantt Charts", "Plan a mock 8-week project with WBS, Gantt chart, milestones and a risk log."),
  storytelling: S("storytelling", "Data Storytelling", "Present one dashboard in 3 minutes to a friend: problem → insight → recommendation."),
  detail: S("detail", "Attention to Detail", "Cross-check every output this week against a manual sample; log mistakes you catch."),
};

// ---------- Domains (branch-level defaults) ----------
const DOMAINS: Domain[] = [
  {
    id: "software",
    match: ["software", "developer", "programmer", "sde", "swe", "coding", "coder", "web", "app", "mobile", "backend", "frontend", "fullstack", "api", "it"],
    technical: [L.git, L.unitTest, L.restApi],
    fundamentals: [L.dsa, L.oop, L.dbms, L.osCn],
    soft: [
      S("think-aloud", "Thinking Aloud While Coding", "Narrate your approach while solving one problem daily; do one mock interview with a peer."),
      S("project-story", "Project Storytelling (STAR)", "Prepare STAR stories for a bug you fixed, a tight deadline and a team conflict."),
    ],
  },
  {
    id: "testing",
    match: ["qa", "test", "tester", "testing", "sdet", "quality assurance"],
    technical: [
      S("test-design", "Test Case Design Techniques", "Write 25 test cases for a login page using boundary values, equivalence classes and decision tables."),
      S("api-testing", "API Testing with Postman", "Build a collection with environment variables and assertions for 10 public API endpoints."),
      S("bug-tracking", "Bug Tracking in Jira", "Log 10 realistic bugs with steps, expected vs actual, severity and screenshots."),
    ],
    fundamentals: [
      S("sdlc", "SDLC & STLC Fundamentals", "Diagram each SDLC model and the STLC phases; note where testing fits in Agile."),
      S("prog-basics", "Programming Basics (Java / Python)", "Practise loops, collections and OOP daily with 3 small programs relevant to test data."),
      S("sql-test", "SQL for Test Data", "Write 20 queries to validate data after UI actions — inserts, updates and joins."),
    ],
    soft: [L.detail, S("bug-report", "Clear Bug Reporting", "Rewrite 5 vague bug reports into clear, reproducible ones; get peer feedback.")],
  },
  {
    id: "data",
    match: ["data", "analytics", "bi", "intelligence", "etl", "warehouse", "sql", "tableau", "powerbi", "reporting", "mis"],
    technical: [L.sqlAdv, L.excel, L.dashboards],
    fundamentals: [L.stats, S("eda", "Data Cleaning & EDA", "Take one messy dataset and handle nulls, duplicates and outliers; document every step."), L.aptitude],
    soft: [L.storytelling, S("biz-acumen", "Business Acumen", "Read 5 short business case studies and list the metrics each company would track.")],
  },
  {
    id: "ai",
    match: ["ai", "ml", "nlp", "vision", "cv", "prompt", "genai", "generative", "llm", "scientist", "mlops", "deep learning"],
    technical: [L.pyMl, L.sklearn, S("dl", "Deep Learning (PyTorch / TensorFlow)", "Train an image or text classifier from scratch and plot training vs validation loss.")],
    fundamentals: [
      S("linalg", "Linear Algebra & Calculus Basics", "Revise vectors, matrices, eigenvalues and gradients — 1 topic a day with NumPy examples."),
      L.stats,
      S("ml-theory", "ML Algorithms & Evaluation Metrics", "Explain 8 core algorithms on one page each, plus when to use ROC-AUC vs F1."),
    ],
    soft: [
      S("explain-models", "Explaining Models to Non-Experts", "Explain one model's predictions to a non-tech friend in 3 minutes without jargon."),
      S("experiment-log", "Experiment Documentation", "Keep a daily experiment log — hypothesis, change, result — for one project."),
    ],
  },
  {
    id: "cloud",
    match: ["cloud", "aws", "azure", "gcp", "devops", "sre", "kubernetes", "docker", "linux", "sysadmin", "administrator", "admin", "infrastructure", "platform", "dba", "database"],
    technical: [L.linux, L.docker, L.cicd],
    fundamentals: [L.netFund, L.osBasics, S("scripting", "Bash / Python Scripting", "Automate 5 chores — backups, log cleanup, health checks — with small scripts.")],
    soft: [
      S("incident-comm", "Calm Incident Communication", "Write 3 mock outage updates: what broke, impact, next update time."),
      S("runbooks", "Runbook & Documentation Writing", "Document one setup as a step-by-step runbook a classmate can follow without help."),
    ],
  },
  {
    id: "security",
    match: ["security", "cyber", "cybersecurity", "hacker", "hacking", "ethical", "penetration", "pentest", "soc", "vapt", "forensics", "infosec", "firewall"],
    technical: [
      L.siem,
      S("vuln-scan", "Vulnerability Scanning (Nmap, Nessus)", "Scan a lab VM with Nmap and Nessus; triage findings by CVSS score."),
      S("owasp", "OWASP Top 10 & Web Security", "Exploit and fix each OWASP Top 10 issue in DVWA or PortSwigger labs."),
    ],
    fundamentals: [
      L.netFund,
      S("crypto", "Cryptography Basics", "Learn hashing, symmetric vs asymmetric encryption, TLS and PKI with diagrams."),
      S("os-internals", "Linux & Windows Internals", "Explore processes, services, registry and permissions on both OSes in a lab."),
    ],
    soft: [
      S("sec-report", "Security Report Writing", "Write one professional finding report: summary, impact, reproduction and fix."),
      S("ethics", "Ethics & Responsible Disclosure", "Read 3 bug-bounty disclosure policies and summarise the rules you must follow."),
    ],
  },
  {
    id: "network",
    match: ["network", "networking", "ccna", "noc", "lan", "wan"],
    technical: [
      S("routing", "Routing & Switching (CCNA level)", "Configure VLANs, OSPF and static routes in Cisco Packet Tracer labs."),
      S("wireshark", "Packet Analysis with Wireshark", "Capture and explain a DNS lookup, TCP handshake and HTTP request packet by packet."),
      S("firewall-vpn", "Firewalls & VPN Configuration", "Set up ACLs and a site-to-site VPN in a lab and test allowed vs blocked traffic."),
    ],
    fundamentals: [
      S("osi", "OSI & TCP/IP Models", "Map 10 common protocols to their OSI layer and explain what each one does."),
      S("subnetting", "IP Addressing & Subnetting", "Solve 30 subnetting questions under a timer until you average under 1 minute each."),
      L.osBasics,
    ],
    soft: [
      S("troubleshoot", "Structured Troubleshooting", "Solve 5 broken-network labs using a written bottom-up troubleshooting checklist."),
      S("user-comm", "Explaining Issues to End Users", "Explain 3 network problems to a non-tech friend in simple, calm language."),
    ],
  },
  {
    id: "electronics",
    match: ["embedded", "vlsi", "iot", "firmware", "electronics", "ece", "pcb", "rf", "telecom", "hardware", "robotics", "robot", "semiconductor", "asic", "fpga", "verification", "chip", "microcontroller", "antenna", "wireless"],
    technical: [L.cEmbedded, S("mcu", "Microcontrollers (Arduino / STM32)", "Build 3 mini projects — sensor read, PWM motor control and I2C display — on a board."), L.verilog],
    fundamentals: [
      S("digital", "Digital Electronics", "Revise K-maps, flip-flops, counters and FSMs; solve 20 previous GATE questions."),
      S("analog", "Analog Circuits & Devices", "Revise diodes, BJTs, MOSFETs and op-amps with 15 solved circuit problems."),
      S("signals", "Signals & Systems", "Cover Fourier, Laplace and Z-transforms with one worked example per day."),
    ],
    soft: [
      S("hw-debug", "Hardware Debugging Mindset", "Debug 3 faulty circuits with a multimeter or oscilloscope and log each step."),
      S("lab-doc", "Lab Documentation & Reporting", "Write a clear report for one project: block diagram, schematic, results and learnings."),
    ],
  },
  {
    id: "electrical",
    match: ["electrical", "eee", "plc", "scada", "power", "instrumentation", "renewable", "solar", "ev", "electric", "substation", "energy", "wind"],
    technical: [
      L.electricalCad,
      S("plc-basics", "PLC & Ladder Logic Basics", "Write ladder logic for a traffic light and a conveyor in a free PLC simulator."),
      S("matlab", "MATLAB / Simulink", "Simulate an RLC circuit, a DC motor and a PID loop in Simulink."),
    ],
    fundamentals: [
      S("circuits", "Electrical Circuits & Network Theory", "Solve 20 problems on Thevenin, Norton, superposition and transients."),
      S("machines", "Electrical Machines", "Revise transformers, induction and DC machines — equivalent circuits and tests."),
      S("power-fund", "Power Systems Fundamentals", "Revise generation, transmission, per-unit system and fault analysis basics."),
    ],
    soft: [
      S("safety-elec", "Safety Standards & Discipline", "Study LOTO, earthing and IE rules; write a one-page safety checklist."),
      S("site-coord", "Coordination with Site Teams", "Prepare STAR stories on coordinating with technicians, vendors and supervisors."),
    ],
  },
  {
    id: "mechanical",
    match: ["mechanical", "mech", "cad", "solidworks", "catia", "creo", "production", "manufacturing", "automobile", "automotive", "hvac", "cae", "fea", "thermal", "plant", "draftsman"],
    technical: [L.cadModel, L.gdt, S("mfg-process", "Manufacturing Processes", "Revise casting, machining, welding and forming; link each to a real component.")],
    fundamentals: [
      S("som", "Strength of Materials", "Solve 20 problems on stress, strain, bending and torsion; revise SFD and BMD."),
      S("thermo", "Thermodynamics & Heat Transfer", "Revise laws, cycles (Otto, Diesel, Rankine) and conduction/convection basics."),
      S("tom", "Theory of Machines", "Cover gears, cams, flywheels and vibrations with one solved problem per topic."),
    ],
    soft: [
      S("shopfloor", "Shop-floor Communication", "Prepare STAR stories on working with operators, supervisors and vendors."),
      S("kaizen", "Continuous Improvement Mindset (Kaizen)", "Spot 5 wasteful steps in a daily routine and propose a fix for each."),
    ],
  },
  {
    id: "civil",
    match: ["civil", "site", "structural", "construction", "surveyor", "bim", "highway", "estimation", "revit", "staad", "building", "primavera", "road"],
    technical: [S("autocad-civil", "AutoCAD for Civil Drawings", "Draft a full house plan — plan, elevation and section — with proper layers."), L.estimation, L.siteExec],
    fundamentals: [
      S("soil", "Soil Mechanics & Foundations", "Revise soil classification, bearing capacity and foundation types with solved examples."),
      L.rcc,
      S("surveying", "Surveying & Levelling", "Revise levelling, contouring and total station basics; solve 15 numericals."),
    ],
    soft: [
      S("contractor-coord", "Coordinating Contractors & Labour", "Prepare STAR stories on managing timelines with contractors and workers."),
      S("site-safety", "Site Safety & Discipline", "Write a site safety checklist covering PPE, scaffolding and excavation."),
    ],
  },
  {
    id: "product",
    match: ["product manager", "product owner", "apm", "product management", "product analyst"],
    technical: [L.prd, L.metrics, S("wireframe", "Wireframing in Figma", "Wireframe 5 screens for a feature you documented and annotate the user flow.")],
    fundamentals: [
      S("product-sense", "Product Sense & Teardowns", "Do one app teardown daily: user, problem, key metric and one improvement."),
      S("prioritization", "Prioritization Frameworks (RICE, MoSCoW)", "Prioritize a backlog of 15 features with RICE and defend your top 3."),
      L.market,
    ],
    soft: [L.stakeholder, S("structured-comm", "Structured Communication", "Answer 5 PM interview questions out loud using a clear 3-point structure.")],
  },
  {
    id: "business",
    match: ["business", "project", "coordinator", "consultant", "consulting", "management", "strategy", "scrum", "pmo", "customer success"],
    technical: [L.excel, S("ppt", "PowerPoint Storylining", "Turn one analysis into a 6-slide deck with action titles and one chart per slide."), S("project-tools", "Jira / Trello / MS Project", "Run a mock project board with tasks, owners, due dates and status updates.")],
    fundamentals: [L.caseStudy, L.agile, S("biz-fund", "Business Fundamentals (P&L)", "Read one company's P&L and explain revenue, costs and margins in plain words.")],
    soft: [L.stakeholder, L.present],
  },
  {
    id: "operations",
    match: ["supply chain", "logistics", "procurement", "operations", "inventory", "scm", "purchase"],
    technical: [L.excel, L.inventory, L.erp],
    fundamentals: [
      S("scm-fund", "Supply Chain Fundamentals", "Map the supply chain of one product you use — suppliers, plants, warehouses, retail."),
      S("ops-research", "Operations Research Basics", "Solve 5 linear-programming and transportation problems in Excel Solver."),
      L.aptitude,
    ],
    soft: [L.negotiation, S("cross-team", "Cross-team Coordination", "Prepare STAR stories on aligning multiple teams to one deadline.")],
  },
  {
    id: "hr",
    match: ["hr", "human resources", "recruiter", "recruitment", "talent", "payroll", "people"],
    technical: [L.sourcing, L.hrms, S("onboarding", "Onboarding & Employee Lifecycle", "Design a 30-day onboarding plan and an exit checklist for a mock company.")],
    fundamentals: [
      S("labour-law", "Labour Laws & Compliance Basics", "Summarise PF, ESI, gratuity, maternity benefit and the new labour codes on one page."),
      S("ob", "Organizational Behaviour", "Revise motivation theories and leadership styles with one workplace example each."),
      L.payroll,
    ],
    soft: [
      S("empathy", "Empathy & Active Listening", "Practise 3 mock employee conversations, summarising what you heard before replying."),
      S("confidentiality", "Confidentiality & Professionalism", "Prepare answers for 5 ethical HR dilemmas involving private employee data."),
    ],
  },
  {
    id: "finance",
    match: ["finance", "financial", "investment", "banking", "bank", "equity", "credit", "accountant", "accounting", "accounts", "audit", "auditor", "tax", "risk", "fpa", "actuarial", "treasury", "wealth", "ca", "cfa", "loan", "insurance", "gst"],
    technical: [L.finModel, L.valuation, L.statements],
    fundamentals: [
      S("accounting-fund", "Accounting Fundamentals", "Revise journal entries, ledgers and the 3 statements; solve 20 entries by hand."),
      S("corp-fin", "Corporate Finance Basics", "Cover time value of money, NPV, IRR and WACC with 10 solved problems."),
      S("markets", "Financial Markets & Economy Awareness", "Read business news daily and summarise 3 market moves and why they happened."),
    ],
    soft: [
      S("accuracy", "Accuracy Under Deadlines", "Do 3 timed Excel tasks and audit your own work for errors before submitting."),
      S("pitch", "Pitching an Investment Idea", "Pitch one stock or deal in 2 minutes on video: thesis, numbers, risks."),
    ],
  },
  {
    id: "marketing",
    match: ["marketing", "marketer", "seo", "sem", "content", "social media", "brand", "branding", "advertising", "ads", "copywriter", "writer", "email marketing", "growth", "pr", "performancemarketing", "digital"],
    technical: [L.ga, L.socialAds, L.contentCreation],
    fundamentals: [
      S("mkt-fund", "Marketing Fundamentals (4Ps, STP)", "Apply 4Ps and STP to 3 brands you know and compare their positioning."),
      S("consumer", "Consumer Behaviour", "Analyse 3 ad campaigns: which buyer motivation and trigger each one targets."),
      S("funnels", "Marketing Funnels & Metrics", "Map a full funnel for one brand with CTR, CPC, CAC and conversion at each stage."),
    ],
    soft: [
      S("creativity", "Creative Ideation", "Brainstorm 20 campaign ideas for one product, then shortlist and justify the best 3."),
      S("trend", "Trend Awareness", "Track 5 brands' social channels daily and note what content performs best."),
    ],
  },
  {
    id: "sales",
    match: ["sales", "business development", "bde", "inside sales", "account executive", "presales", "pre sales"],
    technical: [
      L.crm,
      S("prospecting", "Lead Prospecting & Cold Outreach", "Write 10 cold emails and 5 LinkedIn messages for a product; get feedback on each."),
      S("pipeline", "Sales Pipeline & Forecasting", "Build a pipeline sheet with stages, deal values and a weighted monthly forecast."),
    ],
    fundamentals: [
      S("pitching", "Product Knowledge & Pitching", "Learn one product deeply and deliver a 60-second pitch daily on video."),
      S("sales-process", "Sales Frameworks (AIDA, SPIN)", "Role-play 3 discovery calls using SPIN questions and note the needs you uncover."),
      L.aptitude,
    ],
    soft: [L.negotiation, S("resilience", "Handling Rejection & Resilience", "Practise responses to 10 common objections until each feels natural.")],
  },
  {
    id: "design",
    match: ["designer", "ui", "ux", "graphic", "visual", "motion", "illustrator", "figma", "creative", "animator", "animation", "3d", "video", "editor", "photoshop"],
    technical: [L.figma, S("prototype", "Interactive Prototyping", "Prototype one complete user flow with transitions and test it with 2 people."), L.adobe],
    fundamentals: [
      S("design-principles", "Design Principles (Hierarchy, Contrast)", "Critique 5 apps or posters against hierarchy, alignment, contrast and spacing."),
      S("typography", "Typography & Color Theory", "Design 3 type scales and palettes; check every color pair for accessible contrast."),
      S("portfolio", "Portfolio Case Studies", "Write one case study: problem, process, iterations and outcome with visuals."),
    ],
    soft: [
      S("design-feedback", "Taking & Giving Design Feedback", "Share one design with 3 peers, collect feedback and post a revised version."),
      S("present-design", "Presenting Design Decisions", "Explain the why behind 3 design choices in a 3-minute recorded walkthrough."),
    ],
  },
];

// ---------- Packs (keyword-specific technical skills) ----------
const PACKS: Pack[] = [
  // Software
  { match: ["java", "spring", "j2ee"], domain: "software", skills: [S("java-core", "Core Java (OOP, Collections, Streams)", "Write 15 programs using collections, streams and exceptions; revise JVM memory basics."), S("spring", "Spring Boot & REST APIs", "Build a Spring Boot CRUD API with JPA, validation and exception handling.")] },
  { match: ["python", "django", "flask", "fastapi"], domain: "software", skills: [S("py-core", "Core Python (OOP, Modules, Files)", "Solve 15 problems using classes, comprehensions, file I/O and exceptions."), S("django", "Django / Flask Web Apps", "Build a small web app with auth, a database model and 3 REST endpoints.")] },
  { match: ["react", "next", "mern"], domain: "software", skills: [S("react", "React (Hooks & State)", "Build a todo + API-fetch app with useState, useEffect, custom hooks and routing."), L.js] },
  { match: ["angular", "mean"], domain: "software", skills: [S("angular", "Angular (Components, Services, RxJS)", "Build a 3-page Angular app with services, routing, forms and an HTTP call."), L.ts] },
  { match: ["node", "express", "mern", "mean"], domain: "software", skills: [S("node", "Node.js & Express APIs", "Build an Express API with routing, middleware, JWT auth and error handling."), S("mongodb", "MongoDB & Mongoose", "Model 3 related collections and write aggregation queries for a small app.")] },
  { match: ["cpp", "c"], domain: "software", skills: [S("cpp", "C++ (STL & OOP)", "Solve 15 problems using vector, map, set and priority_queue; revise virtual functions."), S("memory", "Pointers & Memory Management", "Implement a linked list and smart-pointer examples; check for leaks with Valgrind.")] },
  { match: ["dotnet", "csharp", "asp"], domain: "software", skills: [S("csharp", "C# & .NET Core", "Write 10 programs using LINQ, async/await, generics and interfaces."), S("aspnet", "ASP.NET Core Web API & Entity Framework", "Build a Web API with EF Core migrations, DTOs and Swagger docs.")] },
  { match: ["android", "kotlin"], domain: "software", skills: [S("kotlin", "Kotlin for Android", "Practise null safety, data classes, coroutines and extension functions daily."), S("jetpack", "Android Jetpack (Compose, Room)", "Build a notes app with Compose UI, ViewModel and a Room database.")] },
  { match: ["ios", "swift"], domain: "software", skills: [S("swift", "Swift Programming", "Practise optionals, protocols, closures and value vs reference types."), S("swiftui", "SwiftUI & UIKit", "Build a 3-screen SwiftUI app with navigation, a list and a network call.")] },
  { match: ["flutter", "dart"], domain: "software", skills: [S("flutter", "Dart & Flutter Widgets", "Build a 3-screen Flutter app with layouts, navigation and a REST call."), S("flutter-state", "Flutter State Management", "Refactor your app's state with Provider or Riverpod and explain the trade-offs.")] },
  { match: ["reactnative"], domain: "software", skills: [S("react-native", "React Native Components & Navigation", "Build a 3-screen app with React Navigation, a FlatList and an API call."), L.js] },
  { match: ["fullstack", "mern", "mean"], domain: "software", skills: [L.htmlCss, S("deploy", "Deploying a Full-Stack App", "Deploy a frontend + API + database project live with environment variables and a custom domain.")] },
  { match: ["backend", "server side"], domain: "software", skills: [S("api-auth", "API Design & Auth (JWT, OAuth)", "Add login, refresh tokens and role-based access to a small API."), S("sys-design", "System Design Basics (Caching, Scaling)", "Design URL-shortener and chat systems on paper — load balancer, cache, DB choice.")] },
  { match: ["frontend", "ui developer"], domain: "software", skills: [L.htmlCss, L.js, S("web-perf", "Web Performance & Accessibility", "Audit 2 sites with Lighthouse and fix 5 performance and accessibility issues.")] },
  { match: ["web developer"], domain: "software", skills: [L.htmlCss, L.js] },
  { match: ["php", "laravel", "wordpress"], domain: "software", skills: [S("php", "PHP & Laravel", "Build a Laravel CRUD app with migrations, Eloquent models and Blade views."), S("wordpress", "WordPress Development", "Build a custom WordPress theme and one simple plugin.")] },
  { match: ["golang", "go"], domain: "software", skills: [S("go", "Go (Goroutines & Channels)", "Write 10 Go programs including a concurrent worker pool with channels."), S("microservices", "Microservices Basics", "Split a small app into 2 services that talk over REST or gRPC.")] },
  { match: ["salesforce", "crm developer"], domain: "software", skills: [S("apex", "Salesforce Apex & SOQL", "Complete Trailhead Apex basics and write 3 triggers with test classes."), S("sf-admin", "Salesforce Admin & Lightning", "Build a custom object, flow and Lightning page in a free dev org.")] },
  { match: ["sap", "abap"], domain: "software", skills: [S("abap", "SAP ABAP Programming", "Write 5 ABAP reports using internal tables, SELECT queries and ALV output."), S("sap-modules", "SAP Module Basics (SD / MM / FICO)", "Learn the order-to-cash and procure-to-pay flows and the tables behind them.")] },
  { match: ["game", "unity", "unreal"], domain: "software", skills: [S("unity", "Unity & C# Scripting", "Build a small 2D game with player movement, collisions, score and a menu."), S("game-math", "Game Math & Physics Basics", "Revise vectors, transforms and collision detection with 5 small demos.")] },
  { match: ["blockchain", "web3", "solidity", "crypto"], domain: "software", skills: [S("solidity", "Solidity Smart Contracts", "Write and test an ERC-20 token and a simple voting contract on a testnet."), S("web3", "Web3.js / Ethers.js dApps", "Connect a frontend to your contract with a wallet login and one transaction.")] },
  { match: ["mainframe", "cobol"], domain: "software", skills: [S("cobol", "COBOL & JCL", "Write 5 COBOL programs and the JCL to run them on a free mainframe emulator."), S("db2", "DB2 & CICS Basics", "Learn embedded SQL in COBOL and the basics of CICS transactions.")] },
  { match: ["support", "helpdesk", "desktop"], domain: "network", skills: [S("troubleshooting", "OS & Hardware Troubleshooting", "Fix 10 common Windows/Linux issues in a VM — boot, drivers, network, permissions."), S("ticketing", "Ticketing Tools (ServiceNow)", "Practise logging, prioritising and closing tickets in a free ServiceNow dev instance.")] },
  // Testing
  { match: ["selenium", "sdet", "test automation", "automation tester", "qa automation"], domain: "testing", skills: [S("selenium", "Selenium WebDriver", "Automate a full e-commerce flow — search, add to cart, checkout — with explicit waits."), S("test-framework", "Test Frameworks (TestNG / PyTest)", "Structure your tests with Page Object Model, assertions and HTML reports.")] },
  { match: ["manual"], domain: "testing", skills: [S("exploratory", "Exploratory Testing", "Explore one website daily for 20 minutes and log every inconsistency you find.")] },
  { match: ["jmeter", "performance test", "load test", "performance testing"], domain: "testing", skills: [S("jmeter", "JMeter Load Testing", "Load-test a demo site with ramp-up users, assertions and an HTML report."), S("perf-metrics", "Performance Metrics & Bottlenecks", "Learn throughput, latency percentiles and error rate; explain one bottleneck you found.")] },
  // Data & AI
  { match: ["sql", "plsql"], domain: "data", skills: [L.sqlAdv, S("plsql", "PL/SQL Procedures & Indexing", "Write 5 stored procedures and compare query plans with and without indexes.")] },
  { match: ["powerbi", "bi"], domain: "data", skills: [S("dax", "Power BI & DAX", "Build a sales report with 10 DAX measures including time intelligence."), S("data-model", "Data Modeling (Star Schema)", "Design a star schema for a retail dataset with fact and dimension tables.")] },
  { match: ["tableau"], domain: "data", skills: [S("tableau", "Tableau Calculations & LOD", "Recreate 2 Tableau Public dashboards using calculated fields and LOD expressions."), S("data-model", "Data Modeling (Star Schema)", "Design a star schema for a retail dataset with fact and dimension tables.")] },
  { match: ["etl", "informatica", "data engineer", "pipeline"], domain: "data", skills: [S("etl", "ETL Pipelines (Airflow / ADF)", "Build a daily pipeline that extracts an API, transforms with Python and loads to a database."), S("warehouse", "Data Warehousing (Snowflake / BigQuery)", "Load a dataset into a free-tier warehouse and model it into fact and dimension tables.")] },
  { match: ["bigdata", "spark", "hadoop", "pyspark"], domain: "data", skills: [S("spark", "Apache Spark / PySpark", "Process a 1M+ row dataset with PySpark — joins, aggregations and window functions."), S("hadoop", "Hadoop Ecosystem Basics", "Learn HDFS, YARN and Hive; run a word-count job on a local cluster.")] },
  { match: ["scientist", "data science"], domain: "ai", skills: [L.pyMl, L.featureEng] },
  { match: ["ml"], domain: "ai", skills: [L.sklearn, L.featureEng] },
  { match: ["nlp", "natural language"], domain: "ai", skills: [S("nlp", "NLP (Tokenization, Embeddings)", "Build a sentiment classifier using TF-IDF, then word embeddings, and compare results."), S("transformers", "Transformers & Hugging Face", "Fine-tune a small BERT model on a text-classification dataset.")] },
  { match: ["computer vision", "vision", "cv", "opencv"], domain: "ai", skills: [S("opencv", "OpenCV & Image Processing", "Implement filtering, edge detection and contours on 10 sample images."), S("cnn", "CNNs & Object Detection (YOLO)", "Train a CNN classifier, then run YOLO on your own images.")] },
  { match: ["prompt", "genai", "generative", "llm", "gpt", "chatgpt"], domain: "ai", skills: [S("prompting", "Prompt Engineering Patterns", "Practise zero-shot, few-shot, chain-of-thought and structured-output prompts on 10 tasks."), S("rag", "LLM APIs & RAG Basics", "Build a small Q&A bot over your own PDFs using embeddings and an LLM API.")] },
  { match: ["mlops"], domain: "ai", skills: [S("model-deploy", "Model Deployment (FastAPI, Docker)", "Serve a trained model behind a FastAPI endpoint inside a Docker container."), S("mlflow", "MLflow & Model Monitoring", "Track 5 experiments in MLflow and set up a simple drift check.")] },
  // Cloud & Security
  { match: ["aws"], domain: "cloud", skills: [S("aws", "AWS Core Services (EC2, S3, IAM)", "Launch an EC2 server, host a site on S3 and set up least-privilege IAM users."), S("aws-cert", "AWS Cloud Practitioner Prep", "Finish one practice exam daily and review every wrong answer.")] },
  { match: ["azure"], domain: "cloud", skills: [S("azure", "Azure Core (VMs, Entra ID, Storage)", "Deploy a VM, a storage account and an App Service; manage users in Entra ID."), S("az-cert", "AZ-900 / AZ-104 Prep", "Complete Microsoft Learn paths and one timed practice test daily.")] },
  { match: ["gcp", "google cloud"], domain: "cloud", skills: [S("gcp", "GCP Core (Compute, GCS, IAM)", "Deploy an app on Cloud Run, store files in GCS and configure IAM roles."), S("gcp-cert", "Associate Cloud Engineer Prep", "Do Google Cloud Skills Boost labs daily and one practice exam.")] },
  { match: ["devops", "cicd", "jenkins"], domain: "cloud", skills: [L.cicd, S("terraform", "Terraform (Infrastructure as Code)", "Provision a VPC, server and bucket with Terraform, then destroy and recreate it.")] },
  { match: ["kubernetes", "k8s", "platform engineer"], domain: "cloud", skills: [S("k8s", "Kubernetes Basics", "Deploy an app on minikube with Deployments, Services, ConfigMaps and scaling."), L.docker] },
  { match: ["sre"], domain: "cloud", skills: [S("monitoring", "Monitoring (Prometheus & Grafana)", "Monitor a demo app with Prometheus and build a Grafana dashboard with alerts."), S("slo", "SLIs, SLOs & Incident Response", "Define SLOs for one service and write a blameless post-mortem for a mock outage.")] },
  { match: ["linux", "sysadmin", "system administrator"], domain: "cloud", skills: [L.linux, S("shell", "Shell Scripting", "Write 5 Bash scripts — user creation, backup, disk alert, log rotation, service check.")] },
  { match: ["dba", "database administrator", "database"], domain: "cloud", skills: [S("db-admin", "Database Backup, Recovery & Tuning", "Back up and restore a database, then speed up 3 slow queries with indexes."), L.sqlAdv] },
  { match: ["soc"], domain: "security", skills: [L.siem, S("incident-resp", "Incident Response Process", "Walk through the NIST IR lifecycle on 2 mock incidents and write the timeline.")] },
  { match: ["ethical", "hacker", "hacking", "penetration", "pentest", "vapt", "bug bounty"], domain: "security", skills: [S("kali", "Kali Linux & Metasploit", "Root 3 easy TryHackMe or HackTheBox machines and write a walkthrough for each."), S("burp", "Burp Suite Web Pentesting", "Finish 10 PortSwigger Academy labs on SQLi, XSS and auth flaws.")] },
  // Electronics
  { match: ["embedded", "microcontroller", "arm", "stm32", "arduino"], domain: "electronics", skills: [L.cEmbedded, S("rtos", "RTOS Concepts (FreeRTOS)", "Run 3 FreeRTOS tasks with queues and semaphores on a dev board or simulator.")] },
  { match: ["vlsi", "asic", "rtl", "physical design"], domain: "electronics", skills: [L.verilog, S("sta", "Static Timing Analysis", "Solve 15 setup/hold timing problems and explain clock skew and slack.")] },
  { match: ["verification", "uvm", "systemverilog"], domain: "electronics", skills: [S("sv-uvm", "SystemVerilog & UVM", "Build a UVM testbench for a FIFO with driver, monitor, scoreboard and coverage."), L.verilog] },
  { match: ["fpga", "vivado"], domain: "electronics", skills: [S("fpga", "FPGA Design (Vivado)", "Synthesize and run a UART or VGA design on an FPGA board or simulator."), L.verilog] },
  { match: ["iot"], domain: "electronics", skills: [S("iot-protocols", "IoT Protocols (MQTT, BLE)", "Send sensor data over MQTT to a cloud dashboard and view it live."), S("esp32", "ESP32 / Raspberry Pi Projects", "Build a Wi-Fi connected sensor node with alerts on your phone.")] },
  { match: ["firmware"], domain: "electronics", skills: [L.cEmbedded, S("drivers", "Device Drivers & Bootloaders", "Write a bare-metal driver for GPIO and UART and study how a bootloader hands off.")] },
  { match: ["pcb", "hardware"], domain: "electronics", skills: [S("pcb", "PCB Design (KiCad / Altium)", "Design a 2-layer PCB for a power supply or sensor board from schematic to Gerber."), S("schematic", "Schematic Reading & Component Selection", "Read 3 dev-board schematics and justify each major component choice.")] },
  { match: ["rf", "antenna", "wireless"], domain: "electronics", skills: [L.rf, S("antenna", "Antenna Design Basics", "Simulate a patch antenna and explain gain, bandwidth and radiation pattern.")] },
  { match: ["telecom", "5g", "4g", "lte"], domain: "electronics", skills: [S("telecom", "Mobile Network Basics (4G / 5G)", "Draw the LTE and 5G architecture and explain each node's role."), L.rf] },
  { match: ["robotics", "robot", "ros"], domain: "electronics", skills: [S("ros", "ROS (Robot Operating System)", "Simulate a mobile robot in ROS + Gazebo with teleop and a simple sensor node."), S("kinematics", "Robot Kinematics & Control", "Derive forward kinematics for a 2-link arm and tune a PID controller in simulation.")] },
  // Electrical
  { match: ["plc", "scada", "hmi", "industrial automation", "dcs"], domain: "electrical", skills: [S("plc", "PLC Programming (Ladder Logic)", "Program a bottle-filling and conveyor sequence in a PLC simulator with timers and counters."), S("scada", "SCADA & HMI Design", "Build an HMI screen with alarms and trends linked to your PLC program.")] },
  { match: ["power", "substation", "grid", "transmission"], domain: "electrical", skills: [S("power-sys", "Power System Analysis (ETAP)", "Run load-flow and short-circuit studies on a sample network."), S("protection", "Switchgear & Protection", "Revise relays, breakers and protection schemes with one coordination example.")] },
  { match: ["ev", "electric vehicle", "battery", "bms"], domain: "electrical", skills: [S("bms", "Battery Management Systems", "Learn cell balancing, SOC estimation and thermal limits; simulate a pack in MATLAB."), S("motor-drives", "Motor Drives & Power Electronics", "Revise inverters and BLDC/PMSM control; simulate a motor drive in Simulink.")] },
  { match: ["renewable", "solar", "wind"], domain: "electrical", skills: [S("solar-pv", "Solar PV System Design (PVsyst)", "Size a rooftop solar system — panels, inverter, cabling — for a sample home."), S("grid-tie", "Grid Integration Basics", "Learn net metering, inverters and grid codes; summarise on one page.")] },
  { match: ["instrumentation", "sensor", "control systems"], domain: "electrical", skills: [S("sensors", "Sensors & Transducers", "Revise RTDs, thermocouples, pressure and flow sensors with selection criteria."), S("pid", "Control Systems & PID Tuning", "Tune a PID loop in simulation and explain overshoot, settling time and stability.")] },
  { match: ["electrical design", "lighting", "cabling"], domain: "electrical", skills: [L.electricalCad, S("load-calc", "Load Calculation & Cable Sizing", "Calculate connected load and size cables and breakers for a small office.")] },
  { match: ["electrical maintenance"], domain: "electrical", skills: [S("elec-maint", "Electrical Testing & Maintenance", "Learn megger, earth-resistance and IR tests; write a monthly maintenance schedule.")] },
  // Mechanical
  { match: ["cad", "solidworks", "catia", "creo", "nx", "mechanical design"], domain: "mechanical", skills: [L.cadModel, L.gdt] },
  { match: ["autocad", "draftsman", "drafting", "drafter"], skills: [S("autocad", "AutoCAD 2D Drafting", "Draft 5 drawings with layers, dimensions, blocks and title blocks."), S("drawing-std", "Drawing Standards & Dimensioning", "Learn BIS/ISO conventions and correct the dimensioning on 3 sample drawings.")] },
  { match: ["cae", "fea", "ansys", "simulation", "cfd"], domain: "mechanical", skills: [S("fea", "FEA with ANSYS", "Run static and modal analysis on a bracket and validate with hand calculations."), S("cfd", "CFD Basics", "Simulate flow over a pipe bend or airfoil and interpret pressure and velocity plots.")] },
  { match: ["hvac"], domain: "mechanical", skills: [S("hvac-load", "HVAC Load Calculation", "Do a heat-load calculation for a classroom using the E-20 sheet method."), S("hvac-duct", "Duct & Piping Design", "Size ducts for a small office with the equal-friction method.")] },
  { match: ["automobile", "automotive", "vehicle"], domain: "mechanical", skills: [S("ic-engines", "IC Engines & Vehicle Dynamics", "Revise engine cycles, performance curves and basic vehicle dynamics."), S("auto-systems", "Automotive Systems (Powertrain, Brakes)", "Draw and explain transmission, braking and steering systems.")] },
  { match: ["production", "manufacturing", "lean", "six sigma", "plant"], domain: "mechanical", skills: [S("lean", "Lean Manufacturing & 5S", "Draw a value-stream map for a simple process and remove 3 wastes."), S("six-sigma", "Six Sigma Basics (DMAIC)", "Solve one DMAIC case study with Pareto, fishbone and control charts.")] },
  { match: ["quality engineer", "quality control", "qc"], domain: "mechanical", skills: [S("qc-tools", "7 QC Tools & SPC", "Apply all 7 QC tools to a sample defect dataset in Excel."), S("iso", "ISO 9001 & Quality Audits", "Learn ISO 9001 clauses and prepare a mock internal audit checklist.")] },
  { match: ["maintenance"], skills: [S("tpm", "Preventive Maintenance & TPM", "Create a preventive maintenance schedule and calculate MTBF and MTTR."), S("rca", "Root Cause Analysis (5 Why)", "Do a 5-Why and fishbone analysis for 3 breakdown scenarios.")] },
  // Civil
  { match: ["site", "site engineer"], domain: "civil", skills: [L.siteExec, S("mb", "Measurement Book & Billing", "Record measurements for 3 work items and prepare a running bill.")] },
  { match: ["structural", "staad", "etabs"], domain: "civil", skills: [S("staad", "STAAD.Pro / ETABS Analysis", "Model and analyse a G+3 frame and compare results with hand calculations."), L.rcc] },
  { match: ["quantity surveyor", "surveyor", "estimation", "estimator", "billing", "qs"], domain: "civil", skills: [L.estimation, S("rate-analysis", "Rate Analysis & Tendering", "Do rate analysis for 5 items using DSR and draft a mock tender document.")] },
  { match: ["bim", "revit"], domain: "civil", skills: [S("revit", "Revit BIM Modeling", "Model a small building in Revit with walls, floors, doors and sheets."), S("navisworks", "Clash Detection (Navisworks)", "Combine architecture and MEP models and resolve 5 clashes.")] },
  { match: ["primavera", "planning engineer", "scheduling"], domain: "civil", skills: [S("primavera", "Primavera P6 / MS Project Scheduling", "Schedule a building project with 30 activities, dependencies and a baseline."), S("cpm", "CPM / PERT Planning", "Solve 5 CPM and PERT problems and identify the critical path.")] },
  { match: ["highway", "road", "transportation", "pavement"], domain: "civil", skills: [S("pavement", "Pavement Design (IRC Codes)", "Design flexible and rigid pavement for sample traffic using IRC 37 and IRC 58."), S("highway-geo", "Highway Geometric Design", "Calculate sight distances, curves and super-elevation for a sample alignment.")] },
  // Management, ops & HR
  { match: ["product manager", "product owner", "apm", "product management"], domain: "product", skills: [L.prd, L.metrics] },
  { match: ["project", "coordinator", "scrum", "pmo"], domain: "business", skills: [L.agileProj, L.agile] },
  { match: ["consultant", "consulting", "strategy"], domain: "business", skills: [L.caseStudy, S("frameworks", "Consulting Frameworks (MECE, 2x2)", "Solve 5 business problems with issue trees and present one as a 3-slide answer.")] },
  { match: ["supply chain", "logistics", "procurement", "scm", "purchase"], domain: "operations", skills: [L.inventory, L.erp] },
  { match: ["recruiter", "recruitment", "talent acquisition", "sourcing"], domain: "hr", skills: [L.sourcing, S("screening", "Screening & Interview Coordination", "Write a screening script and schedule 5 mock interviews end to end.")] },
  { match: ["payroll", "compensation"], domain: "hr", skills: [L.payroll, L.hrms] },
  // Finance
  { match: ["investment banking", "ib", "mergers"], domain: "finance", skills: [L.valuation, S("pitchbook", "Pitch Books & Deal Research", "Summarise 3 recent Indian M&A deals: rationale, valuation and structure.")] },
  { match: ["equity research", "equity", "stock"], domain: "finance", skills: [S("equity-report", "Equity Research Reports", "Write a 2-page initiation note on one listed company with a target price."), L.valuation] },
  { match: ["accountant", "accounting", "accounts", "audit", "auditor", "tax", "gst", "bookkeeping"], domain: "finance", skills: [S("tally", "Tally Prime / Zoho Books", "Record a month of transactions for a mock business and generate the reports."), S("gst-tds", "GST & TDS Basics", "Compute GST and TDS for 10 sample invoices and draft a GSTR-1 summary.")] },
  { match: ["credit", "loan", "lending"], domain: "finance", skills: [S("credit-appraisal", "Credit Appraisal & Ratio Analysis", "Appraise 2 companies for a loan using liquidity, leverage and coverage ratios."), L.statements] },
  { match: ["risk"], domain: "finance", skills: [S("risk-metrics", "Risk Metrics (VaR, Credit Risk)", "Calculate historical VaR for a 3-stock portfolio in Excel or Python."), S("risk-tools", "Python / Excel for Risk Analysis", "Automate one risk report with formulas or a short Python script.")] },
  { match: ["fpa", "budgeting", "forecasting"], domain: "finance", skills: [S("budgeting", "Budgeting & Variance Analysis", "Build a monthly budget vs actual sheet and explain the 3 biggest variances."), L.finModel] },
  { match: ["actuarial", "actuary", "insurance"], domain: "finance", skills: [S("actuarial-exams", "Actuarial Exam Prep (CS1 / CM1)", "Solve 20 past-paper questions on probability and financial mathematics."), S("survival", "Probability & Survival Models", "Build a simple life table and compute premiums for a term policy.")] },
  { match: ["bank", "banking", "probationary officer", "po"], domain: "finance", skills: [S("banking-awareness", "Banking Awareness & Products", "Learn RBI policy terms, loan products and recent banking news — notes daily."), L.reasoning] },
  // Marketing & Sales
  { match: ["seo", "sem"], domain: "marketing", skills: [S("seo", "On-page & Technical SEO", "Audit one website for titles, speed, schema and internal links; fix 10 issues."), S("keyword-research", "Keyword Research (Ahrefs / Semrush)", "Build a keyword map of 30 terms grouped by search intent for one niche.")] },
  { match: ["content", "writer", "writing", "copywriter", "copywriting", "blog", "blogger"], domain: "marketing", skills: [L.contentCreation, S("content-calendar", "Content Strategy & Calendars", "Plan a 1-month content calendar with topics, channels and goals for a brand.")] },
  { match: ["social media", "instagram", "influencer"], domain: "marketing", skills: [S("social-strategy", "Social Media Strategy & Reels", "Plan and post 5 short-form videos for a page; track reach and saves."), S("canva", "Canva Creative Design", "Design 10 on-brand social creatives using one consistent template.")] },
  { match: ["performancemarketing", "ppc", "ads", "google ads", "paid media"], domain: "marketing", skills: [L.socialAds, S("roas", "ROAS, CPA & Campaign Optimization", "Optimise a mock campaign report: cut 3 weak ad sets and reallocate budget.")] },
  { match: ["email marketing", "email"], domain: "marketing", skills: [S("email-campaigns", "Email Campaigns (Mailchimp)", "Build a 3-email welcome sequence with subject-line A/B tests."), S("segmentation", "Audience Segmentation", "Segment a sample customer list by behaviour and write one message per segment.")] },
  { match: ["brand", "branding"], domain: "marketing", skills: [S("brand-positioning", "Brand Positioning", "Write a positioning statement and brand pyramid for 2 competing brands."), L.market] },
  { match: ["growth", "ecommerce"], domain: "marketing", skills: [S("growth-exp", "Growth Experiments & Funnels", "Run 3 small growth experiments on a page or post and record the results."), L.ga] },
  { match: ["marketing analyst"], domain: "marketing", skills: [L.ga, L.sqlAdv] },
  { match: ["sales", "business development", "bde", "inside sales"], domain: "sales", skills: [L.crm, S("prospecting", "Lead Prospecting & Cold Outreach", "Write 10 cold emails and 5 LinkedIn messages for a product; get feedback on each.")] },
  // Design
  { match: ["ui", "ux", "interaction", "product designer", "usability"], domain: "design", skills: [L.figma, L.uxResearch] },
  { match: ["researcher", "ux research"], domain: "design", skills: [L.uxResearch, S("personas", "Personas & Journey Maps", "Create 2 personas and a journey map from 5 user interviews.")] },
  { match: ["graphic", "visual", "photoshop", "illustrator", "logo", "print"], domain: "design", skills: [L.adobe, S("brand-identity", "Logo & Brand Identity Design", "Design a logo, palette and type system for a fictional startup.")] },
  { match: ["motion", "animation", "animator", "after effects"], domain: "design", skills: [S("after-effects", "After Effects Motion Graphics", "Animate a 15-second logo reveal and a kinetic-typography clip."), L.storyboard] },
  { match: ["video", "editor", "editing", "premiere"], domain: "design", skills: [S("premiere", "Premiere Pro / DaVinci Editing", "Edit a 60-second reel with cuts, captions, music and color correction."), L.storyboard] },
  { match: ["3d", "blender", "maya"], domain: "design", skills: [S("blender", "Blender / Maya 3D Modeling", "Model, texture and render one product shot and one character prop."), S("texturing", "Texturing & Lighting", "Light the same scene 3 ways and compare mood and readability.")] },
  { match: ["web designer", "webflow"], domain: "design", skills: [S("webflow", "Webflow / WordPress Site Building", "Build and publish a 3-page responsive portfolio site without code."), L.htmlCss] },
];

const UNIVERSAL_SOFT = S("hr-interview", "Self-Introduction & HR Interview", "Record a 90-second 'Tell me about yourself' daily and prepare answers to 10 common HR questions.");

const ROLE_WORDS = new Set([
  "engineer", "engineering", "developer", "specialist", "executive", "associate", "analyst", "trainee",
  "manager", "officer", "intern", "junior", "senior", "jr", "sr", "lead", "consultant", "assistant",
  "coordinator", "professional", "fresher", "entry", "level", "graduate", "staff", "representative",
  "of", "and", "the", "for", "in", "a", "an",
]);

/** The role's subject with job-title words removed ("Mining Engineer" → "Mining"). */
export function roleSubject(title: string): string {
  const words = title.replace(/[()]/g, " ").split(/\s+/).filter(Boolean);
  const kept = words.filter((w) => !ROLE_WORDS.has(w.toLowerCase().replace(/[^a-z]/g, "")));
  return (kept.length ? kept : words).join(" ");
}

function generalDomain(title: string): Omit<Domain, "id" | "match"> {
  const sub = roleSubject(title);
  return {
    technical: [
      S("gen-core", `Core ${sub} Concepts`, `List the 10 topics every ${title} interview covers and revise 2 per day with short notes.`),
      S("gen-tools", `${sub} Tools & Software`, `Find the 3 tools ${title} job posts mention most and complete a beginner tutorial for each.`),
      S("gen-project", `Hands-on ${sub} Project`, `Finish one small, real ${sub.toLowerCase()} project this week and write up what you did and learned.`),
      S("gen-industry", `${sub} Industry Awareness`, `Read 5 recent articles or reports on the ${sub.toLowerCase()} field and note key trends and companies.`),
    ],
    fundamentals: [
      L.aptitude,
      L.reasoning,
      S("office", "MS Office & Email Etiquette", "Format a report in Word, a tracker in Excel and write 3 professional emails."),
    ],
    soft: [
      S("problem-solving", "Structured Problem-Solving", "Break 5 everyday problems into causes and options using a simple issue tree."),
      S("adaptability", "Adaptability & Learning Agility", "Learn one unfamiliar skill this week and prepare a STAR story about it."),
    ],
  };
}

const toSkill = (seed: Seed, category: Skill["category"]): Skill => ({
  id: seed.key,
  name: seed.name,
  category,
  tip: seed.tip,
});

/** Generate a tailored 8–10 skill checklist (technical, core fundamentals, soft) for any role title. */
export function generateSkills(title: string, hint = ""): Skill[] {
  const text = normalizeText(`${title} ${hint}`);
  const packs = PACKS.filter((p) => p.match.some((k) => hasKeyword(text, k)));

  const scores = DOMAINS.map((d, i) => {
    let s = 0;
    for (const k of d.match) if (hasKeyword(text, k)) s += k.split(" ").length;
    for (const p of packs) if (p.domain === d.id) s += 2;
    return { d, i, s };
  })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.i - b.i);

  const general = generalDomain(title);
  const primary = scores[0]?.d ?? general;
  const secondary = scores[1]?.d;

  const used = new Set<string>();
  const usedNames = new Set<string>();
  const out: Skill[] = [];
  const take = (seeds: Seed[], category: Skill["category"], cap: number) => {
    let n = out.filter((s) => s.category === category).length;
    for (const seed of seeds) {
      if (n >= cap) break;
      const nameKey = seed.name.toLowerCase();
      if (used.has(seed.key) || usedNames.has(nameKey)) continue;
      used.add(seed.key);
      usedNames.add(nameKey);
      out.push(toSkill(seed, category));
      n++;
    }
  };

  // Technical: round-robin through keyword packs, then the branch defaults.
  const techCap = packs.length >= 2 ? 5 : 4;
  const packSeeds: Seed[] = [];
  const maxLen = Math.max(0, ...packs.map((p) => p.skills.length));
  for (let i = 0; i < maxLen; i++) for (const p of packs) if (p.skills[i]) packSeeds.push(p.skills[i]!);
  take(packSeeds, "technical", techCap);
  take(primary.technical, "technical", techCap);
  if (secondary) take(secondary.technical, "technical", techCap);
  take(general.technical, "technical", techCap);

  // Core fundamentals: mostly the primary branch, one from a secondary branch.
  if (secondary) {
    take(primary.fundamentals, "fundamentals", 2);
    take(secondary.fundamentals, "fundamentals", 3);
  }
  take(primary.fundamentals, "fundamentals", 3);
  take(general.fundamentals, "fundamentals", 3);

  // Soft skills: one branch-specific plus the universal HR-interview skill.
  take(primary.soft, "soft", 1);
  take([UNIVERSAL_SOFT], "soft", 2);
  take(general.soft, "soft", 2);

  return out;
}
