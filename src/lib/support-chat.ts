// Утилиты для работы с чатом технической поддержки через localStorage

export interface SupportMessage {
  id: string;
  content: string;
  createdAt: string;
  isFromUser: boolean; // true - от пользователя, false - от админа
  isRead: boolean;
  userId?: number; // ID пользователя (только для сообщений от пользователя)
  userName?: string; // Имя пользователя (только для сообщений от пользователя)
}

const SUPPORT_MESSAGES_KEY = "support_messages";
const SUPPORT_UNREAD_KEY = "support_unread_count";

// Получить количество непрочитанных сообщений для пользователя
export const getSupportUnreadCount = (): number => {
  if (typeof window === "undefined") return 0;
  const count = localStorage.getItem(SUPPORT_UNREAD_KEY);
  return count ? Number.parseInt(count, 10) : 0;
};

// Получить все сообщения из поддержки
export const getSupportMessages = (): SupportMessage[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(SUPPORT_MESSAGES_KEY);
  return data ? JSON.parse(data) : [];
};

// Добавить новое сообщение
export const addSupportMessage = (
  content: string,
  isFromUser: boolean,
  userId?: number,
  userName?: string,
): SupportMessage => {
  const message: SupportMessage = {
    id: `${Date.now()}-${Math.random()}`,
    content,
    createdAt: new Date().toISOString(),
    isFromUser,
    isRead: false,
    userId,
    userName,
  };

  const messages = getSupportMessages();
  messages.push(message);
  localStorage.setItem(SUPPORT_MESSAGES_KEY, JSON.stringify(messages));

  // Обновляем счетчик непрочитанных
  if (!isFromUser) {
    // Если сообщение от админа, увеличиваем счетчик для пользователя
    const unread = getSupportUnreadCount() + 1;
    localStorage.setItem(SUPPORT_UNREAD_KEY, unread.toString());
  }

  // Отправляем событие для обновления UI
  window.dispatchEvent(new Event("supportMessageAdded"));

  return message;
};

// Пометить все сообщения как прочитанные
export const markSupportMessagesAsRead = (forUser: boolean): void => {
  const messages = getSupportMessages();
  const updatedMessages = messages.map((msg) => {
    // Если forUser=true, помечаем прочитанными сообщения от админа
    // Если forUser=false, помечаем прочитанными сообщения от пользователя
    if (forUser && !msg.isFromUser) {
      return { ...msg, isRead: true };
    }
    if (!forUser && msg.isFromUser) {
      return { ...msg, isRead: true };
    }
    return msg;
  });

  localStorage.setItem(SUPPORT_MESSAGES_KEY, JSON.stringify(updatedMessages));

  if (forUser) {
    localStorage.setItem(SUPPORT_UNREAD_KEY, "0");
  }

  window.dispatchEvent(new Event("supportMessagesRead"));
};

// Получить количество непрочитанных сообщений для админа
export const getAdminUnreadCount = (): number => {
  const messages = getSupportMessages();
  return messages.filter((msg) => msg.isFromUser && !msg.isRead).length;
};
