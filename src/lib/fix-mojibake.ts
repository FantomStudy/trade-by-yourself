/** UTF-8, ошибочно прочитанный как Latin-1 (РџС… вместо русских букв). */
export function fixMojibake(text: string | null | undefined): string {
  if (!text) return "";
  if (/[а-яА-ЯёЁ]/.test(text)) return text;
  if (!/[Р-я]/.test(text)) return text;
  try {
    const bytes = Uint8Array.from(text, (ch) => ch.charCodeAt(0) & 0xff);
    const decoded = new TextDecoder("utf-8").decode(bytes);
    if (/[а-яА-ЯёЁ]/.test(decoded)) return decoded;
  } catch {
    /* ignore */
  }
  return text;
}
