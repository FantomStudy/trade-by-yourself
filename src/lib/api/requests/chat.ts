import { api } from "../instance";

//FIXME: ADD TYPES
export const chatStart = async (productId: number) =>
  api.post<unknown>("/chat/start", { productId });

export const getAllChats = async () => api.get<unknown[]>("/chat");

export const getChatById = async (chatId: number) =>
  api.get<unknown[]>(`/chat/${chatId}`);

// export const getChatMessages = async (chatId: number, query: unknown) =>
//   api.get<unknown[]>(`/chat/messages/${chatId}`, { query: { query } });
