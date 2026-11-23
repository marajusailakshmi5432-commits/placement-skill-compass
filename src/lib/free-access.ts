export const FREE_ROLE_LIMIT = 5;
export const FREE_SKILL_LIMIT = 2;
export const ACCESS_KEY = "skillpulse:free-access:v1";
export interface FreeAccess { roles: number; skills: number }
export function parseFreeAccess(value: unknown): FreeAccess {
  const record = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const count = (key: string, limit: number) => typeof record[key] === "number" && Number.isInteger(record[key]) ? Math.min(limit, Math.max(0, record[key] as number)) : 0;
  return { roles: count("roles", FREE_ROLE_LIMIT), skills: count("skills", FREE_SKILL_LIMIT) };
}
export function consumeFreeAccess(current: FreeAccess, kind: keyof FreeAccess, signedIn: boolean): { allowed: boolean; next: FreeAccess } {
  if (signedIn) return { allowed: true, next: current };
  const limit = kind === "roles" ? FREE_ROLE_LIMIT : FREE_SKILL_LIMIT;
  if (current[kind] >= limit) return { allowed: false, next: current };
  return { allowed: true, next: { ...current, [kind]: current[kind] + 1 } };
}