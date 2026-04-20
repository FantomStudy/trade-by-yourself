export interface SupportMessage {
  id: number;
  content: string;
  isFromUser: boolean;
  createdAt: string;
  userId?: number;
  userName?: string;
  isReadByUser?: boolean;
  isReadByAdmin?: boolean;
}

const STORAGE_KEY = "support_messages";
const EVENT_MESSAGE_ADDED = "supportMessageAdded";
const EVENT_MESSAGES_READ = "supportMessagesRead";

const hasWindow = () => typeof window !== "undefined";

const readMessages = (): SupportMessage[] => {
  if (!hasWindow()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as SupportMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeMessages = (messages: SupportMessage[]) => {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
};

const dispatchSupportEvent = (eventName: string) => {
  if (!hasWindow()) {
    return;
  }

  window.dispatchEvent(new Event(eventName));
};

export const getSupportMessages = () => readMessages();

export const addSupportMessage = (
  content: string,
  isFromUser: boolean,
  userId?: number,
  userName?: string,
) => {
  const nextMessage: SupportMessage = {
    id: Date.now(),
    content,
    isFromUser,
    createdAt: new Date().toISOString(),
    userId,
    userName,
    isReadByUser: isFromUser,
    isReadByAdmin: !isFromUser,
  };

  const messages = readMessages();
  messages.push(nextMessage);
  writeMessages(messages);
  dispatchSupportEvent(EVENT_MESSAGE_ADDED);

  return nextMessage;
};

export const markSupportMessagesAsRead = (forUser: boolean) => {
  const messages = readMessages();

  const updatedMessages = messages.map((message) => {
    if (forUser && !message.isFromUser) {
      return { ...message, isReadByUser: true };
    }

    if (!forUser && message.isFromUser) {
      return { ...message, isReadByAdmin: true };
    }

    return message;
  });

  writeMessages(updatedMessages);
  dispatchSupportEvent(EVENT_MESSAGES_READ);

  return updatedMessages;
};

