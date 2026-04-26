"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getChats } from "@/api/chats";
import { BannerSlot } from "@/components/BannerSlot";
import { formatPrice } from "@/lib/format";
import styles from "./page.module.css";

const MessagesPage = () => {
  const { data: chats = [], isLoading } = useQuery({
    queryKey: ["chats", "list"],
    queryFn: getChats,
  });

  const supportUnread = 0;
  const lastSupportMessage = "";

  if (isLoading) {
    return (
      <div className={styles.loadingCard}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Сообщения</h1>

        <BannerSlot place="FAVORITES" />

        <Link href="/profile/messages/support" className={styles.supportCard}>
          <div className={styles.supportCardTop}>
            <div className={styles.supportThumb}>
              <MessageSquare className={styles.supportThumbIcon} />
            </div>
            <div className={styles.supportMain}>
              <h3 className={styles.supportTitle}>Техническая поддержка</h3>
              <p className={styles.supportSubtitle}>Задайте вопрос администрации</p>
            </div>
          </div>
          <div className={styles.supportCardBottom}>
            <div className={styles.supportBadge}>ТП</div>
            {lastSupportMessage ? (
              <p className={styles.supportMessage}>
                <span className={styles.lineClamp2}>{lastSupportMessage}</span>
              </p>
            ) : (
              <p className={styles.supportMessageEmpty}>Начните диалог</p>
            )}
            {supportUnread > 0 && <div className={styles.unreadBadge}>{supportUnread}</div>}
          </div>
        </Link>

        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrap}>
            <MessageSquare className={styles.emptyIcon} />
          </div>
          <h3 className={styles.emptyTitle}>У вас пока нет сообщений</h3>
          <p className={styles.emptyDescription}>
            Сообщения появятся здесь, когда вы начнете общение с продавцами или покупателями
          </p>
          <Link href="/" className={styles.browseLink}>
            Посмотреть объявления
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Сообщения</h1>

      <BannerSlot place="FAVORITES" />

      <div className={styles.list}>
        {/* Чат тех поддержки - всегда первый */}
        <Link href="/profile/messages/support" className={styles.supportCard}>
          <div className={styles.supportCardTop}>
            <div className={styles.supportThumb}>
              <MessageSquare className={styles.supportThumbIcon} />
            </div>
            <div className={styles.supportMain}>
              <h3 className={styles.supportTitle}>Техническая поддержка</h3>
              <p className={styles.supportSubtitle}>Задайте вопрос администрации</p>
            </div>
          </div>
          <div className={styles.supportCardBottom}>
            <div className={styles.supportBadge}>ТП</div>
            {lastSupportMessage ? (
              <p className={styles.supportMessage}>
                <span className={styles.lineClamp2}>{lastSupportMessage}</span>
              </p>
            ) : (
              <p className={styles.supportMessageEmpty}>Начните диалог</p>
            )}
            {supportUnread > 0 && <div className={styles.unreadBadge}>{supportUnread}</div>}
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
            <Link href={`/profile/messages/${chat.id}`} key={chat.id} className={styles.chatCard}>
              <div className={styles.chatTop}>
                {chat.product.image && (
                  <div className={styles.chatImageWrap}>
                    <Image
                      width={64}
                      height={64}
                      alt={chat.product.name}
                      className={styles.chatImage}
                      src={chat.product.image}
                    />
                  </div>
                )}
                <div className={styles.chatMain}>
                  <h3 className={styles.chatProductName}>{chat.product.name}</h3>
                  <p className={styles.chatProductPrice}>{formatPrice(chat.product.price)}</p>
                  {chat.lastMessage && (
                    <span className={styles.chatDate}>
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
              <div className={styles.chatBottom}>
                <div className={styles.chatInitialsBadge}>{initials}</div>
                {chat.lastMessage ? (
                  <p className={styles.chatMessage}>
                    <span className={styles.chatMessageAuthor}>{companion.fullName}:</span>{" "}
                    <span className={styles.lineClamp2}>{chat.lastMessage.content}</span>
                  </p>
                ) : (
                  <p className={styles.chatMessageEmpty}>Нет сообщений</p>
                )}
                {chat.unreadCount && chat.unreadCount > 0 ? (
                  <div className={styles.unreadBadgeBlue}>{chat.unreadCount}</div>
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
