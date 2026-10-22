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

/**
 * Извлекает город или область из адреса для компактного отображения на карточке товара.
 */
export const formatCardAddress = (address?: string | null): string => {
  if (!address || typeof address !== "string") return "";
  const trimmed = address.trim();
  if (!trimmed) return "";

  const isRegionWord = /(?:область|обл\b|обл\.|край|республик|автономн)/i;
  const cleanRegion = (val: string) => val.replace(/^(?:г\.?|город)\s*/i, "").trim();

  const parts = trimmed
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 0) return "";
  if (parts.length === 1) {
    const single = parts[0];
    if (isRegionWord.test(single)) {
      return cleanRegion(single);
    }
    return single;
  }

  const isHouseOrNumber = /^(\d+|д\.|дом|двлд|вл|влад|корп|к\.|стр|строение|кв\.|помещение|литер)/i;
  const isPostcode = /^\d{5,6}$/;
  const isCountry = /^(россия|рф|российская федерация|russia|соединённые штаты америки|usa)$/i;
  const isStreet =
    /(?:^|\s)(ул\.|улица|просп\.|проспект|пр-кт|пр\.|пер\.|переулок|проезд|шоссе|ш\.|тупик|наб\.|набережная|бульвар|бул\.|б-р|тракт|аллея|линия|квартал|микрорайон|мкр-н|мкр)(?:\s|[.,]|$)/i;
  const isDistrictOnly = /(?:район|р-н|поселение|федеральный округ)(?:\s|[.,]|$)/i;

  // 1. Прямой поиск префикса города: "г Самара", "г. Оренбург", "город Уфа"
  for (const part of parts) {
    const cityMatch = part.match(/^(?:г\.?|город)\s+([А-Яа-яA-Za-z0-9\-–\s]+)$/i);
    if (cityMatch) {
      const name = cityMatch[1].trim();
      if (isRegionWord.test(name)) {
        return cleanRegion(name);
      }
      return `г. ${name}`;
    }
  }

  // 2. Село, посёлок, деревня
  for (const part of parts) {
    const settleMatch = part.match(
      /^(?:п\.?|пос\.?|посёлок|поселок|с\.?|село|д\.?|деревня|пгт|р\.п\.?|ст-ца|станица|хутор|аул)\s+([А-Яа-яA-Za-z0-9\-–\s]+)$/i
    );
    if (settleMatch) {
      return part;
    }
  }

  // 3. Федеральные города
  for (const part of parts) {
    if (/^(Москва|Санкт-Петербург|Севастополь)$/i.test(part)) {
      return `г. ${part}`;
    }
  }

  // 4. Анализ длинных адресов (Nominatim / DaData) с конца к началу
  let cityCandidate = "";
  let regionCandidate = "";

  const reversedParts = [...parts].reverse();

  for (const part of reversedParts) {
    if (
      isHouseOrNumber.test(part) ||
      isPostcode.test(part) ||
      isCountry.test(part) ||
      isStreet.test(part) ||
      /федеральный округ/i.test(part)
    ) {
      continue;
    }

    if (isRegionWord.test(part)) {
      if (!regionCandidate) {
        regionCandidate = cleanRegion(part);
      }
      continue;
    }

    // Если это "городской округ Оренбург"
    const okrugMatch = part.match(/городской округ\s+([А-Яа-яA-Za-z0-9\-–]+)/i);
    if (okrugMatch && !cityCandidate) {
      cityCandidate = okrugMatch[1].trim();
      continue;
    }

    if (isDistrictOnly.test(part)) {
      continue;
    }

    if (!cityCandidate && /^[А-Яа-яA-Za-z0-9\-–\s]+$/.test(part)) {
      const candidate = part.replace(/^г\.?\s*/i, "").trim();
      if (isRegionWord.test(candidate)) {
        if (!regionCandidate) regionCandidate = cleanRegion(candidate);
      } else {
        cityCandidate = candidate;
      }
    }
  }

  if (cityCandidate) {
    if (isRegionWord.test(cityCandidate)) {
      return cleanRegion(cityCandidate);
    }
    return `г. ${cityCandidate}`;
  }

  if (regionCandidate) {
    return cleanRegion(regionCandidate);
  }

  const fallback = parts.find((p) => !isHouseOrNumber.test(p) && !isPostcode.test(p) && !isCountry.test(p));
  const res = fallback || parts[0];
  if (isRegionWord.test(res)) {
    return cleanRegion(res);
  }
  return res;
};
