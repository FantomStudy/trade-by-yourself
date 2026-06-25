/** Заголовок чата в списке и в шапке диалога. */
export function resolveChatTitle(
  productName: string | null | undefined,
  companionName: string | null | undefined,
): string {
  const name = productName?.trim();
  if (name && !/^объявление$/i.test(name)) return name;
  const companion = companionName?.trim();
  return `Чат с ${companion || "пользователем"}`;
}
