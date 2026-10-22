"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Flag, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Textarea,
  Button,
} from "@/components/ui";
import { useAuth } from "@/lib/contexts";
import { createSupportTicket } from "@/lib/api/requests/support/send-support-message";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";

interface ReportUserDialogProps {
  targetUserId: number;
  targetUserName?: string;
  productId?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const REPORT_REASONS = [
  { id: "FRAUD", label: "Мошенничество или подозрительные действия" },
  { id: "INCORRECT_DATA", label: "Недостоверная информация или поддельный товар" },
  { id: "SPAM", label: "Спам, реклама или навязчивые сообщения" },
  { id: "OFFENSIVE", label: "Оскорбительное поведение или угрозы" },
  { id: "OTHER", label: "Другая причина" },
];

export const ReportUserDialog = ({
  targetUserId,
  targetUserName,
  productId,
  open,
  onOpenChange,
}: ReportUserDialogProps) => {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0].id);
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Войдите в аккаунт, чтобы отправить жалобу");
      onOpenChange(false);
      router.push("/auth/sign-in");
      return;
    }

    if (currentUser.id === targetUserId) {
      toast.error("Нельзя отправить жалобу на самого себя");
      return;
    }

    if (!details.trim()) {
      toast.error("Пожалуйста, опишите причину жалобы");
      return;
    }

    const reasonObj = REPORT_REASONS.find((r) => r.id === selectedReason);
    const reasonLabel = reasonObj?.label || "Другое";

    const subject = `Жалоба на пользователя ${targetUserName || `ID: ${targetUserId}`}`;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const userUrl = origin ? `${origin}/seller/${targetUserId}` : `/seller/${targetUserId}`;
    const productUrl = productId && origin ? `${origin}/product/${productId}` : productId ? `/product/${productId}` : "";

    const message = [
      `Категория жалобы: ${reasonLabel}`,
      `ID пользователя: ${targetUserId}`,
      `Профиль пользователя: ${userUrl}`,
      productUrl ? `Товар: ${productUrl}` : null,
      "",
      "Подробное описание нарушения:",
      details.trim(),
    ]
      .filter(Boolean)
      .join("\n");

    try {
      setIsSubmitting(true);
      await createSupportTicket(message, subject, "COMPLAINT", "HIGH");
      toast.success("Жалоба успешно отправлена модераторам. Мы проверим информацию.");
      setDetails("");
      setSelectedReason(REPORT_REASONS[0].id);
      onOpenChange(false);
    } catch (err) {
      console.error("Ошибка при отправке жалобы:", err);
      toast.error(getApiErrorMessage(err, "Не удалось отправить жалобу. Попробуйте позже."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-600">
            <Flag className="h-5 w-5" />
            <DialogTitle>Пожаловаться на пользователя</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-500 pt-1">
            {targetUserName ? `Пользователь: ${targetUserName}` : `ID: ${targetUserId}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Причина жалобы
            </label>
            <div className="space-y-1.5">
              {REPORT_REASONS.map((reason) => (
                <label
                  key={reason.id}
                  className="flex items-center gap-2.5 rounded-lg border border-gray-200 p-2.5 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason.id}
                    checked={selectedReason === reason.id}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-gray-800">{reason.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Подробности жалобы *
            </label>
            <Textarea
              required
              rows={4}
              maxLength={2000}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Опишите, что именно произошло, укажите важные детали..."
              className="w-full text-sm resize-none"
            />
            <p className="text-[11px] text-gray-400 text-right">{details.length}/2000</p>
          </div>

          <div className="rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <span>
              Модераторы проверяют все жалобы в приоритетном порядке. Необоснованные массовые жалобы могут повлечь ограничения.
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !details.trim()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? "Отправка..." : "Отправить жалобу"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
