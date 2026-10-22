const STAFF_ROLES = new Set(["SENIOR_MODERATOR", "ADMIN", "SUPERADMIN"]);

export const SUPPORT_CENTER_NAME = "Служба поддержки";
export const MODERATION_CENTER_NAME = "Модерация платформы";

export function isSupportStaffRole(role?: string | null): boolean {
  return role != null && STAFF_ROLES.has(role);
}

export function supportAuthorLabel(role?: string | null, fullName?: string | null): string {
  if (isSupportStaffRole(role)) return SUPPORT_CENTER_NAME;
  return fullName?.trim() || "Пользователь";
}

export function isImageMessage(text?: string | null): boolean {
  if (!text) return false;
  const t = text.trim();
  return (
    t.startsWith("data:image/") ||
    /^(https?:\/\/|\/uploads\/).*\.(png|jpg|jpeg|webp|gif)(\?.*)?$/i.test(t)
  );
}

export function formatSupportMessagePreview(text?: string | null): string {
  if (!text) return "";
  if (isImageMessage(text)) return "📷 Изображение";
  return text.trim();
}

