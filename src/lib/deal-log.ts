import type { LucideIcon } from "lucide-react";

import {
  Ban,
  CreditCard,
  FilePlus2,
  Gavel,
  PackageCheck,
  RotateCcw,
  Settings2,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";

export const DEAL_STATUS_LABELS: Record<string, string> = {
  CREATED: "Создана",
  PAID: "Оплачена",
  SHIPPED: "Отправлена",
  DELIVERED: "Доставлена",
  COMPLETED: "Завершена",
  CANCELLED: "Отменена",
  REFUNDED: "Возврат",
  DISPUTE: "Спор",
};

export type DealLogTone = "amber" | "blue" | "emerald" | "gray" | "indigo" | "purple" | "rose" | "sky";

export interface DealLogField {
  label: string;
  value: string;
}

export interface ParsedDealLog {
  /** ID сделки из строки лога. */
  dealId: number | null;
  /** Машинное имя события (create, pay, ship...). */
  event: string | null;
  /** Человеческий заголовок: что произошло. */
  title: string;
  /** Пояснение: что это значит для сделки. */
  description: string;
  /** Кто обычно совершает это действие. */
  actor: "admin" | "buyer" | "party" | "seller" | "system";
  /** Разобранные параметры события (ID платежа, новый статус и т.д.). */
  fields: DealLogField[];
  icon: LucideIcon;
  tone: DealLogTone;
  /** Исходная строка из БД. */
  raw: string;
}

const FIELD_LABELS: Record<string, string> = {
  paymentid: "ID платежа",
  orderid: "Номер заказа",
  trackid: "Трек-номер",
  tracknumber: "Трек-номер",
};

/** Достаёт пары key=value из хвоста лога, кроме служебных deal_id и event. */
function extractFields(tail: string): { fields: DealLogField[]; text: string } {
  const fields: DealLogField[] = [];
  const text = tail
    .replace(/([A-Z_]\w*)=(\S+)/gi, (match, key: string, value: string) => {
      fields.push({ label: FIELD_LABELS[key.toLowerCase()] ?? key, value });
      return "";
    })
    .replace(/\s+/g, " ")
    .trim();

  return { fields, text };
}

/**
 * Превращает строку лога вида
 * `deal_id=22 event=payment_init payment initialized paymentId=... orderId=...`
 * в понятную человеку карточку события сделки.
 */
export function parseDealLog(action: string): ParsedDealLog {
  const raw = action ?? "";
  const dealMatch = raw.match(/deal_id=(\d+)/i);
  const eventMatch = raw.match(/event=(\S+)/i);
  const event = eventMatch ? eventMatch[1].toLowerCase() : null;

  const tail = raw
    .replace(/deal_id=\d+/i, "")
    .replace(/event=\S+/i, "")
    .trim();
  const { fields, text } = extractFields(tail);

  const base: ParsedDealLog = {
    dealId: dealMatch ? Number(dealMatch[1]) : null,
    event,
    title: event ? `Событие «${event}»` : "Системная запись",
    description: text || "Дополнительных данных нет.",
    actor: "system",
    fields,
    icon: Settings2,
    tone: "gray",
    raw,
  };

  const isMock = /\(mock\)/i.test(text);
  const mockNote = isMock ? " Платёж проведён в тестовом режиме, без реального списания." : "";

  switch (event) {
    case "create":
      return {
        ...base,
        title: "Сделка создана",
        description: "Покупатель оформил сделку: товар зарезервирован, условия и доставка зафиксированы. Ожидается оплата.",
        actor: "buyer",
        icon: FilePlus2,
        tone: "blue",
      };

    case "payment_init":
      return {
        ...base,
        title: "Покупатель перешёл к оплате",
        description: "Создан платёж и сформирована ссылка на оплату. Деньги ещё не списаны — ждём подтверждения от банка.",
        actor: "buyer",
        icon: CreditCard,
        tone: "sky",
      };

    case "pay":
    case "pay_sync":
      return {
        ...base,
        title: "Сделка оплачена",
        description:
          `Оплата подтверждена${event === "pay_sync" ? " (проверка статуса платежа по запросу)" : ""}. ` +
          `Деньги удерживаются платформой до получения товара покупателем.${mockNote}`,
        actor: "buyer",
        icon: Wallet,
        tone: "emerald",
      };

    case "cdek_handoff": {
      const isCourier = /courier/i.test(text);
      const mode = isCourier ? "Вызов курьера" : /pvz/i.test(text) ? "Сдача в ПВЗ" : null;
      return {
        ...base,
        title: "Продавец оформил передачу в СДЭК",
        description: isCourier
          ? "Продавец выбрал забор посылки курьером СДЭК по адресу."
          : "Продавец выбрал самостоятельную сдачу посылки в пункт выдачи СДЭК.",
        actor: "seller",
        icon: PackageCheck,
        tone: "purple",
        fields: mode ? [{ label: "Способ передачи", value: mode }, ...fields] : fields,
      };
    }

    case "ship":
      return {
        ...base,
        title: "Товар отправлен",
        description: "Продавец передал посылку в доставку. Товар в пути к покупателю, деньги всё ещё удерживаются платформой.",
        actor: "seller",
        icon: Truck,
        tone: "indigo",
      };

    case "deliver":
      return {
        ...base,
        title: "Товар получен покупателем",
        description: "Покупатель подтвердил получение. Сделка может быть завершена, деньги готовы к выплате продавцу.",
        actor: "buyer",
        icon: ShieldCheck,
        tone: "emerald",
      };

    case "dispute":
      return {
        ...base,
        title: "Открыт спор",
        description: "Участник сделки не согласен с ходом сделки. Выплата приостановлена до решения администратора.",
        actor: "party",
        icon: Gavel,
        tone: "amber",
      };

    case "cancel": {
      const withRefund = /refund/i.test(text);
      return {
        ...base,
        title: withRefund ? "Сделка отменена с возвратом" : "Сделка отменена",
        description: withRefund
          ? "Сделка прекращена, оплата возвращена покупателю."
          : "Сделка прекращена до оплаты — взаимных обязательств не возникло.",
        actor: "party",
        icon: withRefund ? RotateCcw : Ban,
        tone: "rose",
      };
    }

    case "admin_status": {
      const statusMatch = text.match(/status to\s+([A-Z_]+)/i);
      const code = statusMatch ? statusMatch[1].toUpperCase() : null;
      const label = code ? (DEAL_STATUS_LABELS[code] ?? code) : null;
      return {
        ...base,
        title: "Администратор сменил статус",
        description: label
          ? `Статус сделки изменён вручную на «${label}» — это ручное вмешательство, а не действие участников.`
          : "Статус сделки изменён вручную администратором.",
        actor: "admin",
        icon: Settings2,
        tone: "gray",
        fields: label ? [{ label: "Новый статус", value: label }, ...fields] : fields,
      };
    }

    default:
      return base;
  }
}
