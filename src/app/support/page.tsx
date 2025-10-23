"use client";

import { useState, useEffect } from "react";
import { Button, Input, TextArea } from "@/components/ui";
import styles from "./page.module.css";

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: "resolved" | "pending" | "closed";
  date: string;
  time: string;
}

interface NewTicketData {
  subject: string;
  description: string;
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
          onClick={() => setShowCreateForm(!showCreateForm)}
          className={styles.createButton}
        >
          {showCreateForm ? "Отменить" : "Создать обращение"}
        </Button>
      </div>

      {showCreateForm && (
        <div className={styles.createForm}>
          <h2 className={styles.formTitle}>Новое обращение</h2>
          <div className={styles.formFields}>
            <Input
              placeholder="Тема обращения"
              value={newTicket.subject}
              onChange={(e) =>
                setNewTicket((prev) => ({
                  ...prev,
                  subject: e.target.value,
                }))
              }
              className={styles.subjectInput}
            />
            <TextArea
              placeholder="Опишите вашу проблему подробно..."
              value={newTicket.description}
              onChange={(e) =>
                setNewTicket((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={4}
              className={styles.descriptionInput}
            />
            <div className={styles.formActions}>
              <Button
                onClick={handleCreateTicket}
                disabled={isSubmitting}
                className={styles.submitButton}
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
              onClick={() => setShowCreateForm(true)}
              className={styles.createFirstButton}
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
