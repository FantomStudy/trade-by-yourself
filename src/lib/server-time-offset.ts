let serverOffsetMs = 0;

/** Сохраняем смещение времени между сервером и клиентом по Date header. */
export function updateServerTimeOffset(dateHeader: string | null) {
  if (!dateHeader) return;
  const serverMs = new Date(dateHeader).getTime();
  if (Number.isNaN(serverMs)) return;
  serverOffsetMs = serverMs - Date.now();
}

/** Текущее серверное время с учётом последнего смещения. */
export function getServerNowMs() {
  return Date.now() + serverOffsetMs;
}
