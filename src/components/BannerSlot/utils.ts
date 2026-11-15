export function pickRandom<T>(items: T[] | null | undefined): T | null {
  if (!items || !Array.isArray(items) || !items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
}
