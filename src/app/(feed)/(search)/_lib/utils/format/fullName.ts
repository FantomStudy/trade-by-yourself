export const formatFullName = (fullName: string) => {
  if (!fullName) return "";

  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return "";

  const surname = parts[0];
  const initials = parts
    .slice(1)
    .map((p) => p[0].toUpperCase())
    .join(".");

  return initials ? `${surname} ${initials}.` : surname;
};
