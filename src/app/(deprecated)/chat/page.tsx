"use client";

import React from "react";
import styles from "./page.module.css";
import { Button } from "@/components/ui"; // Reuse existing button styling if present

// Static chat page UI without logic
export default function ChatPage() {
  return (
    <div className={styles.chatPage}>
      <div className={styles.chatWrapper}>
        {/* Header */}
        <div className={styles.chatHeader}>
          <div className={styles.productThumb}>
            <img src="/placeholder.png" alt="Товар" />
          </div>
          <div className={styles.productInfo}>
            <h1 className={styles.productTitle}>Медицинский халат б/у</h1>
            <div className={styles.productPrice}>3000 рублей</div>
            <div className={styles.productSeller}>Виктор Землев</div>
          </div>
          <Button className={styles.showPhoneButton}>Показать номер</Button>
        </div>

        {/* Messages */}
        <div className={styles.messagesArea}>
          <div className={styles.messageGroup}>
            {/* Incoming message */}
            <div className={styles.messageRow}>
              <div className={styles.avatar}>ВЗ</div>
              <div className={styles.bubbleWrapper}>
                <div className={styles.messageBubble}>
                  Помогите решить не пришло зачисление в размере 5000 р
                </div>
                <div className={styles.metaRow}>
                  <span className={`${styles.status} ${styles.seen}`}>
                    Просмотрено
                  </span>
                  <span className={styles.timestamp}>11.06.25, 10:45</span>
                </div>
              </div>
            </div>

            {/* Outgoing message */}
            <div className={`${styles.messageRow} ${styles.outgoing}`}>
              <div className={styles.bubbleWrapper}>
                <div className={`${styles.messageBubble} ${styles.outgoing}`}>
                  Помогите решить не пришло зачисление в размере 5000 р
                </div>
                <div className={`${styles.metaRow} ${styles.outgoing}`}>
                  <span className={`${styles.status} ${styles.seen}`}>
                    Просмотрено
                  </span>
                  <span className={styles.timestamp}>11.06.25, 11:44</span>
                </div>
              </div>
              <div className={`${styles.avatar} ${styles.self}`}>НП</div>
            </div>

            {/* Additional repeated pairs to show scroll */}
            <div className={styles.messageRow}>
              <div className={styles.avatar}>ВЗ</div>
              <div className={styles.bubbleWrapper}>
                <div className={styles.messageBubble}>
                  Помогите решить не пришло зачисление в размере 5000 р
                </div>
                <div className={styles.metaRow}>
                  <span className={`${styles.status} ${styles.seen}`}>
                    Просмотрено
                  </span>
                  <span className={styles.timestamp}>11.06.25, 10:45</span>
                </div>
              </div>
            </div>
            <div className={`${styles.messageRow} ${styles.outgoing}`}>
              <div className={styles.bubbleWrapper}>
                <div className={`${styles.messageBubble} ${styles.outgoing}`}>
                  Помогите решить не пришло зачисление в размере 5000 р
                </div>
                <div className={`${styles.metaRow} ${styles.outgoing}`}>
                  <span className={`${styles.status} ${styles.seen}`}>
                    Просмотрено
                  </span>
                  <span className={styles.timestamp}>11.06.25, 11:44</span>
                </div>
              </div>
              <div className={`${styles.avatar} ${styles.self}`}>НП</div>
            </div>
            <div className={styles.messageRow}>
              <div className={styles.avatar}>ВЗ</div>
              <div className={styles.bubbleWrapper}>
                <div className={styles.messageBubble}>
                  Помогите решить не пришло зачисление в размере 5000 р
                </div>
                <div className={styles.metaRow}>
                  <span className={`${styles.status} ${styles.seen}`}>
                    Просмотрено
                  </span>
                  <span className={styles.timestamp}>11.06.25, 10:45</span>
                </div>
              </div>
            </div>
            <div className={`${styles.messageRow} ${styles.outgoing}`}>
              <div className={styles.bubbleWrapper}>
                <div className={`${styles.messageBubble} ${styles.outgoing}`}>
                  Помогите решить не пришло зачисление в размере 5000 р
                </div>
                <div className={`${styles.metaRow} ${styles.outgoing}`}>
                  <span className={`${styles.status} ${styles.unseen}`}>
                    Не просмотрено
                  </span>
                  <span className={styles.timestamp}>11.06.25, 11:44</span>
                </div>
              </div>
              <div className={`${styles.avatar} ${styles.self}`}>НП</div>
            </div>
          </div>
        </div>

        {/* Composer */}
        <div className={styles.composer}>
          <textarea
            className={styles.textInput}
            placeholder="Сообщение"
            disabled
          />
          <button className={styles.sendButton} disabled>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
