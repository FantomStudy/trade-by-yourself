export const toShortName = (fullName: string) => {
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

export const toCurrency = (price: number, locale = "ru-RU", currency = "RUB") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return dateStr;
  }
};
