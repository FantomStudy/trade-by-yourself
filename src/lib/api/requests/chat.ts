import { api } from "../instance";

//FIXME: ADD TYPES
export const chatStart = async (productId: number) =>
  api<unknown>("/chat/start", { method: "POST", body: { productId } });

export const getAllChats = async () => api<unknown[]>("/chat");

export const getChatById = async (chatId: number) =>
  api<unknown[]>(`/chat/${chatId}`);

// export const getChatMessages = async (chatId: number, query: unknown) =>
//   api<unknown[]>(`/chat/messages/${chatId}`, { query: { query } });
