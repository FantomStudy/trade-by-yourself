"use client";

import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BannerSlot } from "@/components/BannerSlot";
import { useChats } from "@/lib/api/hooks";
import { getMySupportTickets } from "@/lib/api/requests";
import { resolveChatTitle } from "@/lib/chat-title";
import { toCurrency } from "@/lib/format";
import { MODERATION_CENTER_NAME, SUPPORT_CENTER_NAME } from "@/lib/support-display";

function SupportPreviewCard({
  lastMessage,
  hasStaffReply,
}: {
  lastMessage?: string;
  hasStaffReply?: boolean;
}) {
  return (
    <Link
      href="/profile/messages/support"
      className="block rounded-lg border-2 border-purple-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-2 flex items-start gap-3">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-purple-100">
          <MessageSquare className="h-8 w-8 text-purple-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{SUPPORT_CENTER_NAME}</h3>
          <p className="text-sm text-purple-600">Единый центр обращений — не личная переписка</p>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500 text-xs font-medium text-white">
          ТП
        </div>
        {lastMessage ? (
          <p className="flex-1 text-sm text-gray-600">
            <span className="line-clamp-2">{lastMessage}</span>
          </p>
        ) : (
          <p className="flex-1 text-sm text-gray-400">Напишите вопрос — ответит {SUPPORT_CENTER_NAME}</p>
        )}
        {hasStaffReply ? (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-xs text-white">
            1
          </div>
        ) : null}
      </div>
    </Link>
  );
}

const MessagesPage = () => {
  const { data: chats, isLoading } = useChats();
  const [supportPreview, setSupportPreview] = useState<{ text?: string; hasStaffReply: boolean }>({
    hasStaffReply: false,
  });

  useEffect(() => {
    void (async () => {
      try {
        const list = await getMySupportTickets();
        const open = list.tickets.find((t) => t.status === "OPEN" || t.status === "IN_PROGRESS");
        const last = open?.lastMessage;
        const hasStaffReply = Boolean(last && last.authorId !== open?.userId);
        setSupportPreview({
          text: last?.text,
          hasStaffReply,
        });
      } catch {
        setSupportPreview({ hasStaffReply: false });
      }
    })();
  }, []);

  const productChats = (chats ?? []).filter((chat) => !chat.isModerationChat);
  const moderationChats = (chats ?? []).filter((chat) => chat.isModerationChat);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg bg-white p-8 shadow-sm">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Сообщения</h1>

      <BannerSlot place="CHATS" />

      <div className="space-y-2">
        <SupportPreviewCard
          hasStaffReply={supportPreview.hasStaffReply}
          lastMessage={supportPreview.text}
        />

        {moderationChats.map((chat) => (
          <Link
            key={chat.id}
            href={`/profile/messages/${chat.id}` as "/profile/messages/1"}
            className="block rounded-lg border border-amber-200 bg-amber-50/40 p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-2 flex items-start gap-3">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-amber-100">
                <MessageSquare className="h-8 w-8 text-amber-700" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{MODERATION_CENTER_NAME}</h3>
                <p className="text-sm text-amber-800">Уведомления по объявлениям</p>
              </div>
            </div>
            {chat.lastMessage ? (
              <p className="line-clamp-2 text-sm text-gray-700">{chat.lastMessage.content}</p>
            ) : null}
          </Link>
        ))}

        {productChats.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-sm">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
              <MessageSquare className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">Нет переписки по объявлениям</h3>
            <p className="mb-4 text-gray-600">
              Чаты с покупателями и продавцами появятся после «Написать по товару»
            </p>
            <a
              href="/"
              className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
            >
              Посмотреть объявления
            </a>
          </div>
        ) : (
          productChats.map((chat) => {
          const companion = chat.companion;
          const chatTitle = resolveChatTitle(chat.product?.name, companion.fullName);
          const initials =
            companion.fullName
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "??";

            return (
              <Link
                href={`/profile/messages/${chat.id}` as "/profile/messages/1"}
                key={chat.id}
                className="block rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-2 flex items-start gap-3">
                  {chat.product?.image ? (
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                      <img
                        alt={chat.product.name}
                        className="h-full w-full object-cover"
                        src={chat.product.image}
                      />
                    </div>
                  ) : null}
                  <div className="flex-1">
                    <h3 className="font-semibold">{chatTitle}</h3>
                    {chat.product?.price != null ? (
                      <p className="text-sm text-blue-600">{toCurrency(chat.product.price)}</p>
                    ) : null}
                    {chat.lastMessage ? (
                      <span className="text-xs text-gray-500">
                        {new Date(chat.lastMessage.createdAt).toLocaleString("ru-RU", {
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })}
                      </span>
                    ) : null}
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
          })
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
