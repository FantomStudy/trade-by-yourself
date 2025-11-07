"use client";

import { useEffect, useState } from "react";

import { Button, Input } from "@/components/ui";
import { TextArea } from "@/features/deprecated/components";

import styles from "./page.module.css";

interface SupportTicket {
  id: string;
  date: string;
  description: string;
  status: "closed" | "pending" | "resolved";
  subject: string;
  time: string;
}

interface NewTicketData {
  description: string;
  subject: string;
}

const Support = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTicket, setNewTicket] = useState<NewTicketData>({
    subject: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setIsLoading(true);
    try {
      // Симуляция API запроса - замените на реальный endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockTickets: SupportTicket[] = [
        {
          id: "1",
          subject: "Не пришло пополнение, что делать..",
          description: "Здравствуйте, вы еще продаете товар?",
          status: "resolved",
          date: "11.12.25",
          time: "14:23",
        },
        {
          id: "2",
          subject: "Не пришло пополнение, что делать..",
          description: "Здравствуйте, вы еще продаете товар?",
          status: "resolved",
          date: "11.12.25",
          time: "14:23",
        },
        {
          id: "3",
          subject: "Не пришло пополнение, что делать..",
          description: "Здравствуйте, вы еще продаете товар?",
          status: "resolved",
          date: "11.12.25",
          time: "14:23",
        },
        {
          id: "4",
          subject: "Не пришло пополнение, что делать..",
          description: "Здравствуйте, вы еще продаете товар?",
          status: "resolved",
          date: "11.12.25",
          time: "14:23",
        },
        {
          id: "5",
          subject: "Не пришло пополнение, что делать..",
          description: "Здравствуйте, вы еще продаете товар?",
          status: "resolved",
          date: "11.12.25",
          time: "14:23",
        },
        {
          id: "6",
          subject: "Не пришло пополнение, что делать..",
          description: "Здравствуйте, вы еще продаете товар?",
          status: "resolved",
          date: "11.12.25",
          time: "14:23",
        },
        {
          id: "7",
          subject: "Не пришло пополнение, что делать..",
          description: "Здравствуйте, вы еще продаете товар?",
          status: "resolved",
          date: "11.12.25",
          time: "14:23",
        },
      ];

      setTickets(mockTickets);
    } catch (error) {
      console.error("Error loading tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    setIsSubmitting(true);
    try {
      // Симуляция создания тикета
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const createdTicket: SupportTicket = {
        id: Date.now().toString(),
        subject: newTicket.subject,
        description: newTicket.description,
        status: "pending",
        date: new Date().toLocaleDateString("ru-RU"),
        time: new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setTickets((prev) => [createdTicket, ...prev]);
      setNewTicket({ subject: "", description: "" });
      setShowCreateForm(false);
      alert("Обращение успешно создано!");
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Ошибка при создании обращения");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusText = (status: SupportTicket["status"]) => {
    switch (status) {
      case "resolved":
        return "Решено";
      case "pending":
        return "В обработке";
      case "closed":
        return "Закрыто";
      default:
        return "Неизвестно";
    }
  };

  const getStatusClass = (status: SupportTicket["status"]) => {
    switch (status) {
      case "resolved":
        return styles.statusResolved;
      case "pending":
        return styles.statusPending;
      case "closed":
        return styles.statusClosed;
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Загрузка обращений...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Техническая поддержка</h1>
        <Button
          className={styles.createButton}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Отменить" : "Создать обращение"}
        </Button>
      </div>

      {showCreateForm && (
        <div className={styles.createForm}>
          <h2 className={styles.formTitle}>Новое обращение</h2>
          <div className={styles.formFields}>
            <Input
              className={styles.subjectInput}
              value={newTicket.subject}
              onChange={(e) =>
                setNewTicket((prev) => ({
                  ...prev,
                  subject: e.target.value,
                }))
              }
              placeholder="Тема обращения"
            />
            <TextArea
              className={styles.descriptionInput}
              value={newTicket.description}
              onChange={(e) =>
                setNewTicket((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Опишите вашу проблему подробно..."
              rows={4}
            />
            <div className={styles.formActions}>
              <Button
                className={styles.submitButton}
                disabled={isSubmitting}
                onClick={handleCreateTicket}
              >
                {isSubmitting ? "Отправка..." : "Отправить обращение"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.ticketsList}>
        {tickets.length === 0 ? (
          <div className={styles.emptyState}>
            <p>У вас пока нет обращений в техподдержку</p>
            <Button
              className={styles.createFirstButton}
              onClick={() => setShowCreateForm(true)}
            >
              Создать первое обращение
            </Button>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className={styles.ticketCard}>
              <div className={styles.ticketHeader}>
                <div className={styles.ticketInfo}>
                  <h3 className={styles.ticketSubject}>
                    Тема: {ticket.subject}
                  </h3>
                  <p className={styles.ticketDescription}>
                    {ticket.description}
                  </p>
                </div>
                <div className={styles.ticketMeta}>
                  <div className={styles.ticketDate}>{ticket.date}</div>
                  <div className={styles.ticketTime}>{ticket.time}</div>
                  <div
                    className={`${styles.ticketStatus} ${getStatusClass(
                      ticket.status
                    )}`}
                  >
                    {getStatusText(ticket.status)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Support;
