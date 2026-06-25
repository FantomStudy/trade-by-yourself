/**
 * Исправляет mojibake: UTF-8 байты, ошибочно прочитанные как Windows-1251.
 * Это стандартная ошибка на Windows: файл сохранён в UTF-8, открыт как cp1251.
 * Каждый UTF-8 байт (например 0xD0 0x9A для «К») превращается в символ cp1251
 * (Р + К), которые хранятся в DB/файле как Unicode. Чтобы откатить:
 * 1. каждый символ строки → его байт в cp1251
 * 2. набор байт → TextDecoder("utf-8")
 */

let _cp1251Map: Map<string, number> | null = null;

function getCp1251Map(): Map<string, number> {
  if (_cp1251Map) return _cp1251Map;
  const map = new Map<string, number>();
  const dec = new TextDecoder("windows-1251");
  for (let b = 0; b < 256; b++) {
    const ch = dec.decode(new Uint8Array([b]));
    // В cp1251 каждый байт — ровно один символ
    map.set(ch, b);
  }
  _cp1251Map = map;
  return map;
}

export function fixMojibake(text: string | null | undefined): string {
  if (!text) return "";

  // Нормальный текст — есть строчные а-я / ё
  if (/[а-яё]/.test(text)) return text;

  // Не похоже на кириллическое mojibake — нет заглавных А-Я
  if (!/[А-ЯЁ]/.test(text)) return text;

  try {
    const map = getCp1251Map();
    const bytes = new Uint8Array(text.length);
    for (let i = 0; i < text.length; i++) {
      const b = map.get(text[i]);
      if (b === undefined) {
        // Символ не входит в cp1251 → не наш вариант mojibake
        return text;
      }
      bytes[i] = b;
    }
    const decoded = new TextDecoder("utf-8").decode(bytes);
    if (/[а-яё]/.test(decoded)) return decoded;
  } catch {
    /* ignore */
  }
  return text;
}
