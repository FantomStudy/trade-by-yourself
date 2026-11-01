"use client";

import { Check, Copy, Headset, Mail, MessageSquare, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/contexts";

interface SupportHelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SupportHelpModal = ({ open, onOpenChange }: SupportHelpModalProps) => {
  const { user } = useAuth();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const supportEmail = "support@torguisam.ru";
  const supportPhone = "+7 (905) 891-22-22";

  const handleCopy = (text: string, type: "email" | "phone") => {
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
      toast.success("Email скопирован в буфер обмена");
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
      toast.success("Номер телефона скопирован");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Headset className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Что-то не получается?</DialogTitle>
              <p className="text-xs text-gray-500">Служба поддержки «Торгуй Сам»</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <p className="text-sm text-gray-600 leading-relaxed">
            Если у вас возникли сложности с регистрацией, бронированием, сменой данных, оплатой услуг
            или размещением объявлений — напишите нам! Мы оперативно поможем решить любую проблему.
          </p>

          <div className="space-y-3">
            {/* Карточка: Чат поддержки */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 transition-colors hover:bg-emerald-50">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Онлайн-чат поддержки</h4>
                  <p className="text-xs text-gray-600">Быстрый ответ специалиста прямо на сайте</p>
                </div>
              </div>
              <Link
                href="/profile/messages/support"
                onClick={() => onOpenChange(false)}
                className="shrink-0"
              >
                <Button size="sm" variant="success" className="w-full sm:w-auto">
                  Открыть чат
                </Button>
              </Link>
            </div>

            {/* Карточка: Почта */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4 transition-colors hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Электронная почта</h4>
                  <a
                    href={`mailto:${supportEmail}`}
                    className="text-xs font-mono font-medium text-blue-600 hover:underline"
                  >
                    {supportEmail}
                  </a>
                  <p className="text-xs text-gray-500 mt-0.5">Для детальных обращений и вопросов</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a href={`mailto:${supportEmail}`}>
                  <Button size="sm" variant="outline">
                    Написать
                  </Button>
                </a>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(supportEmail, "email")}
                  title="Скопировать email"
                  className="px-2"
                >
                  {copiedEmail ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-gray-500" />}
                </Button>
              </div>
            </div>

            {/* Карточка: Телефон */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4 transition-colors hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-600 text-white">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Телефон поддержки</h4>
                  <a
                    href="tel:+79058912222"
                    className="text-xs font-mono font-medium text-gray-800 hover:underline"
                  >
                    {supportPhone}
                  </a>
                  <p className="text-xs text-gray-500 mt-0.5">Ежедневно с 09:00 до 21:00 (МСК)</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a href="tel:+79058912222">
                  <Button size="sm" variant="outline">
                    Позвонить
                  </Button>
                </a>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(supportPhone, "phone")}
                  title="Скопировать номер"
                  className="px-2"
                >
                  {copiedPhone ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-gray-500" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
