/**
 * Утилиты для работы с телефонными номерами
 * Поддерживает российский формат +7 (XXX) XXX-XX-XX
 */

/**
 * Очищает номер телефона от всех символов кроме цифр и знака +
 */
export function cleanPhoneNumber(value: string): string {
  return value.replace(/[^\d+]/g, "");
}

/**
 * Форматирует номер телефона в формат +7 (XXX) XXX-XX-XX
 */
export function formatPhoneNumber(value: string): string {
  // Очищаем от всех символов кроме цифр
  const cleaned = value.replace(/\D/g, "");

  // Если пустая строка, возвращаем пустое значение
  if (!cleaned) return "";

  // Если начинается с 8, заменяем на 7
  const normalized = cleaned.startsWith("8")
    ? `7${cleaned.slice(1)}`
    : cleaned.startsWith("7")
      ? cleaned
      : `7${cleaned}`;

  // Применяем форматирование
  if (normalized.length <= 1) {
    return "+7";
  } else if (normalized.length <= 4) {
    return `+7 (${normalized.slice(1)}`;
  } else if (normalized.length <= 7) {
    return `+7 (${normalized.slice(1, 4)}) ${normalized.slice(4)}`;
  } else if (normalized.length <= 9) {
    return `+7 (${normalized.slice(1, 4)}) ${normalized.slice(4, 7)}-${normalized.slice(7)}`;
  } else {
    return `+7 (${normalized.slice(1, 4)}) ${normalized.slice(4, 7)}-${normalized.slice(7, 9)}-${normalized.slice(9, 11)}`;
  }
}

/**
 * Валидирует российский номер телефона
 */
export function isValidPhoneNumber(value: string): boolean {
  const cleaned = cleanPhoneNumber(value);

  // Проверяем что номер начинается с +7 или 7 или 8
  // и содержит ровно 11 цифр (включая код страны)
  const phoneRegex = /^(?:\+7|7|8)\d{10}$/;

  return phoneRegex.test(cleaned);
}

/**
 * Преобразует отформатированный номер в чистый формат для отправки на сервер
 */
export function getCleanPhoneForSubmit(formattedPhone: string): string {
  const cleaned = cleanPhoneNumber(formattedPhone);

  // Обеспечиваем что номер начинается с +7
  if (cleaned.startsWith("8")) {
    return `+7${cleaned.slice(1)}`;
  } else if (cleaned.startsWith("7")) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith("+7")) {
    return cleaned;
  }

  return `+7${cleaned}`;
}

/**
 * Получает позицию курсора после форматирования
 */
export function getNewCursorPosition(
  oldValue: string,
  newValue: string,
  oldCursorPos: number,
): number {
  // Если новое значение пустое, курсор в начале
  if (!newValue) return 0;

  // Если старое значение пустое, курсор в конец
  if (!oldValue) return newValue.length;

  // Подсчитываем количество цифр до позиции курсора в старом значении
  const digitsBeforeCursor = oldValue
    .slice(0, oldCursorPos)
    .replace(/\D/g, "").length;

  // Находим позицию в новом значении, где будет такое же количество цифр
  let digitCount = 0;
  let newPos = 0;

  for (let i = 0; i < newValue.length; i++) {
    if (/\d/.test(newValue[i])) {
      if (digitCount >= digitsBeforeCursor) {
        break;
      }
      digitCount++;
    }
    newPos = i + 1;
  }

  // Если курсор был в конце, ставим в конец нового значения
  if (oldCursorPos >= oldValue.length) {
    return newValue.length;
  }

  return Math.min(newPos, newValue.length);
}
