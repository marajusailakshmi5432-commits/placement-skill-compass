/** Text helpers shared by the role catalog search and the skill generator. */

const COMPOUNDS: [RegExp, string][] = [
  [/\bcyber security\b/g, "cybersecurity"],
  [/\bui ux\b/g, "ui ux"],
  [/\bfull ?stack\b/g, "fullstack"],
  [/\bfront ?end\b/g, "frontend"],
  [/\bback ?end\b/g, "backend"],
  [/\bpower bi\b/g, "powerbi"],
  [/\breact native\b/g, "reactnative"],
  [/\bsite reliability\b/g, "sre"],
  [/\bperformance marketing\b/g, "performancemarketing"],
  [/\bbig data\b/g, "bigdata"],
  [/\bdev ops\b/g, "devops"],
  [/\be commerce\b/g, "ecommerce"],
  [/\bmachine learning\b/g, "ml"],
  [/\bartificial intelligence\b/g, "ai"],
  [/\bgen ai\b/g, "genai"],
  [/\bci cd\b/g, "cicd"],
  [/\bsystem verilog\b/g, "systemverilog"],
  [/\binternet of things\b/g, "iot"],
];

/** Lowercase, map tech spellings (C++, .NET, Node.js…) to tokens, collapse to single spaces. */
export function normalizeText(input: string): string {
  let t = ` ${input.toLowerCase()} `;
  t = t
    .replace(/c\+\+/g, " cpp ")
    .replace(/c#/g, " csharp ")
    .replace(/\.net\b/g, " dotnet ")
    .replace(/node\.?js\b/g, " node ")
    .replace(/react\.?js\b/g, " react ")
    .replace(/next\.?js\b/g, " next ")
    .replace(/vue\.?js\b/g, " vue ")
    .replace(/fp&a/g, " fpa ")
    .replace(/m&a/g, " mergers ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  for (const [re, rep] of COMPOUNDS) t = t.replace(re, rep);
  return t;
}

/** Whole-word / whole-phrase match on normalized text (single words also match a trailing "s"). */
export function hasKeyword(normalized: string, keyword: string): boolean {
  const padded = ` ${normalized} `;
  if (keyword.includes(" ")) return padded.includes(` ${keyword} `);
  return padded.includes(` ${keyword} `) || padded.includes(` ${keyword}s `);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/c\+\+/g, "cpp")
    .replace(/c#/g, "csharp")
    .replace(/\.net\b/g, "dotnet")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Clean up a user-typed role title: trim, collapse spaces, cap length. */
export function cleanRoleTitle(input: string): string {
  return input.replace(/\s+/g, " ").trim().slice(0, 60);
}
