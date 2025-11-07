export const formatToInitials = (fullName: string) => {
  if (!fullName) return "";

  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];

  const surname = parts[0];
  const initials = parts
    .slice(1) // остальные части
    .map((part) => `${part[0].toUpperCase()}.`)
    .join("");

  return `${surname} ${initials}`;
};
