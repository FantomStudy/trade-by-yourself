export interface SupportTicket {
  id: string;
  date: string;
  description: string;
  status: "closed" | "pending" | "resolved";
  subject: string;
  time: string;
}

export interface CreateTicketRequest {
  description: string;
  subject: string;
}

/**
 * Получить все тикеты пользователя (упрощенная версия)
 *
 * @returns Promise с массивом тикетов
 */
export const getSupportTickets = async (): Promise<SupportTicket[]> => {
  try {
    const response = await fetch("/api/support/tickets", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Ошибка при загрузке тикетов");
    }

    const data = await response.json();
    return data.tickets || data;
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    throw error;
  }
};

/**
 * Создать новый тикет в техподдержку (упрощенная версия)
 *
 * @param ticketData - Данные для создания тикета
 * @returns Promise с созданным тикетом
 */
export const createSupportTicket = async (
  ticketData: CreateTicketRequest
): Promise<SupportTicket> => {
  try {
    const response = await fetch("/api/support/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
      throw new Error("Ошибка при создании тикета");
    }

    return response.json();
  } catch (error) {
    console.error("Error creating support ticket:", error);
    throw error;
  }
};