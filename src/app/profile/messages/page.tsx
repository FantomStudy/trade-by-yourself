"use client";

import Link from "next/link";

import { useChats } from "@/lib/api/hooks";
import { formatPrice } from "@/lib/format";

const MessagesPage = () => {
  const { data: chats, isLoading } = useChats();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Сообщения</h1>
        <p className="text-gray-500">Загрузка...</p>
      </div>
    );
  }

  if (!chats || chats.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Сообщения</h1>
        <p className="text-gray-500">У вас пока нет сообщений</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Сообщения</h1>

      <div className="space-y-2">
        {chats.map((chat) => {
          const companion = chat.companion;
          const initials =
            companion.fullName
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2) || "??";

          return (
            <Link
              className="block rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
              href={`/profile/messages/${chat.id}` as any}
              key={chat.id}
            >
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{chat.product.name}</h3>
                  <p className="text-sm text-blue-600">
                    {formatPrice(chat.product.price)}
                  </p>
                </div>
                {chat.lastMessage && (
                  <span className="text-xs text-gray-500">
                    {new Date(chat.lastMessage.createdAt).toLocaleString(
                      "ru-RU",
                      {
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      },
                    )}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-medium text-white">
                  {initials}
                </div>
                {chat.lastMessage ? (
                  <p className="flex-1 truncate text-sm text-gray-600">
                    <span className="font-medium text-gray-800">
                      {companion.fullName}:
                    </span>{" "}
                    {chat.lastMessage.content}
                  </p>
                ) : (
                  <p className="flex-1 text-sm text-gray-400">Нет сообщений</p>
                )}
                {chat.unreadCount && chat.unreadCount > 0 ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                    {chat.unreadCount}
                  </div>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MessagesPage;
