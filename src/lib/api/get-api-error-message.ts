import { FetchError } from "ofetch";

/** Вытаскиваем message из тела ответа API (Fiber: { statusCode, message }). */
function readMessageFromPayload(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const m = o.message ?? o.Message;
  if (typeof m === "string" && m.trim()) return m.trim();
  return null;
}

/**
 * Текст ошибки для тоста: ofetch кладёт JSON в FetchError.data (getter), а не в Error.message.
 * Сырой message вида [POST] "…": 400 не показываем — только fallback.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof FetchError) {
    const fromData = readMessageFromPayload(error.data);
    if (fromData) return fromData;
    const rd = error.response as { _data?: unknown } | undefined;
    const fromBody = readMessageFromPayload(rd?._data);
    if (fromBody) return fromBody;
  }

  if (typeof error === "object" && error !== null) {
    const e = error as Record<string, unknown>;
    const fromData = readMessageFromPayload(e.data);
    if (fromData) return fromData;
    if (e.response && typeof e.response === "object") {
      const r = e.response as { _data?: unknown };
      const fromBody = readMessageFromPayload(r._data);
      if (fromBody) return fromBody;
    }
  }

  return fallback;
}
