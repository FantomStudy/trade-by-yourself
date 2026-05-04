export const ROLE_LEVEL: Record<string, number> = {
  GUEST: 0,
  USER: 10,
  USER_VERIFIED: 15,
  SENIOR_MODERATOR: 70,
  ADMIN: 90,
  SUPERADMIN: 100,
};

export function hasMinRole(role: string | undefined, level: number) {
  return (ROLE_LEVEL[role || "GUEST"] ?? 0) >= level;
}
