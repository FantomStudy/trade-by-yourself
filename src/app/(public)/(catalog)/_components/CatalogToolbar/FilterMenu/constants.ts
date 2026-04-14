export const STATE_LABELS: Record<string, string> = {
  NEW: "Новый",
  USED: "Б/У",
};

export const PROFILE_TYPE_LABELS: Record<string, string> = {
  INDIVIDUAL: "Физ. лицо",
  OOO: "ООО",
  IP: "ИП",
};

export const SORT_BY_LABELS: Record<string, string> = {
  date_desc: "Сначала новые",
  date_asc: "Сначала старые",
  price_asc: "Сначала дешевле",
  price_desc: "Сначала дороже",
  relevance: "По релевантности",
};

export const FILTER_KEYS = [
  "minPrice",
  "maxPrice",
  "state",
  "profileType",
  "minRating",
  "maxRating",
  "sortBy",
  "fieldValues",
] as const;
