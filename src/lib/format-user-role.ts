export function formatUserRole(role?: string | null): string {
  const normalized = (role ?? "").trim().toLowerCase();
  if (!normalized || normalized === "default" || normalized === "user") return "USER";
  return role?.trim().toUpperCase() ?? "USER";
}
