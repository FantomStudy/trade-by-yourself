"use client";

import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ChatsBanner } from "@/components/product-feed-banner";
import { useChats } from "@/lib/api/hooks";
import { formatPrice } from "@/lib/format";
import { getSupportMessages, getSupportUnreadCount } from "@/lib/support-chat";

const MessagesPage = () => {
  const { data: chats, isLoading } = useChats();
  const [supportUnread, setSupportUnread] = useState(0);
  const [lastSupportMessage, setLastSupportMessage] = useState<string>("");

  useEffect(() => {
    const updateSupportData = () => {
      setSupportUnread(getSupportUnreadCount());
      const messages = getSupportMessages();
      if (messages.length > 0) {
        setLastSupportMessage(messages.at(-1)?.content ?? "");
      }
    };

    updateSupportData();

    window.addEventListener("supportMessageAdded", updateSupportData);
    window.addEventListener("supportMessagesRead", updateSupportData);

    return () => {
      window.removeEventListener("supportMessageAdded", updateSupportData);
      window.removeEventListener("supportMessagesRead", updateSupportData);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg bg-white p-8 shadow-sm">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
      </div>
    );
  }

  if (!chats || chats.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Сообщения</h1>

        <ChatsBanner />

        {/* Чат тех поддержки */}
        <Link
          href="/profile/messages/support"
          className="block rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md border-2 border-purple-200"
        >
          <div className="mb-2 flex items-start gap-3">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-purple-100 flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Техническая поддержка</h3>
              <p className="text-sm text-purple-600">Задайте вопрос администрации</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500 text-xs font-medium text-white">
              ТП
            </div>
            {lastSupportMessage ? (
              <p className="flex-1 text-sm text-gray-600">
                <span className="line-clamp-2">{lastSupportMessage}</span>
              </p>
            ) : (
              <p className="flex-1 text-sm text-gray-400">Начните диалог</p>
            )}
            {supportUnread > 0 && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-xs text-white">
                {supportUnread}
              </div>
            )}
          </div>
        </Link>

        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-sm">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
            <MessageSquare className="h-10 w-10 text-blue-500" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-800">У вас пока нет сообщений</h3>
          <p className="mb-4 text-gray-600">
            Сообщения появятся здесь, когда вы начнете общение с продавцами или покупателями
          </p>
          <a
            href="/"
            className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
          >
            Посмотреть объявления
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Сообщения</h1>

      <ChatsBanner />

      <div className="space-y-2">
        {/* Чат тех поддержки - всегда первый */}
        <Link
          href="/profile/messages/support"
          className="block rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md border-2 border-purple-200"
        >
          <div className="mb-2 flex items-start gap-3">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-purple-100 flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Техническая поддержка</h3>
              <p className="text-sm text-purple-600">Задайте вопрос администрации</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500 text-xs font-medium text-white">
              ТП
            </div>
            {lastSupportMessage ? (
              <p className="flex-1 text-sm text-gray-600">
                <span className="line-clamp-2">{lastSupportMessage}</span>
              </p>
            ) : (
              <p className="flex-1 text-sm text-gray-400">Начните диалог</p>
            )}
            {supportUnread > 0 && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-xs text-white">
                {supportUnread}
              </div>
            )}
          </div>
        </Link>

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
              href={`/profile/messages/${chat.id}` as any}
              key={chat.id}
              className="block rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-2 flex items-start gap-3">
                {chat.product.image && (
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                    <img
                      alt={chat.product.name}
                      className="h-full w-full object-cover"
                      src={chat.product.image}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{chat.product.name}</h3>
                  <p className="text-sm text-blue-600">{formatPrice(chat.product.price)}</p>
                  {chat.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {new Date(chat.lastMessage.createdAt).toLocaleString("ru-RU", {
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-xs font-medium text-white">
                  {initials}
                </div>
                {chat.lastMessage ? (
                  <p className="flex-1 text-sm text-gray-600">
                    <span className="font-medium text-gray-800">{companion.fullName}:</span>{" "}
                    <span className="line-clamp-2">{chat.lastMessage.content}</span>
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
