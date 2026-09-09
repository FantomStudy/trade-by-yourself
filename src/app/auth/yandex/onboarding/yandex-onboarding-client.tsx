"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { CURRENT_USER_QUERY_KEY } from "@/api/hooks";
import {
  getYandexOnboardingStatus,
  getYandexRegistrationStatus,
  yandexOnboardingStartPhone,
  yandexOnboardingVerifyPhone,
  yandexRegistrationSendCode,
  yandexRegistrationVerifyCode,
} from "@/api/requests";
import { Input, PhoneField, Typography } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { YANDEX_REGISTRATION_TICKET_KEY } from "@/lib/auth/yandex-oauth";
import { formatPhoneNumber, getCleanPhoneForSubmit, isValidPhoneNumber } from "@/lib/phone";

type Stage = "loading" | "phone_input" | "phone_code" | "done";

export function YandexOnboardingClient() {
  const router = useRouter();
  const search = useSearchParams();
  const queryClient = useQueryClient();

  const [stage, setStage] = useState<Stage>("loading");
  /** Тикет незавершённой регистрации: аккаунта в базе ещё нет, сессии тоже. */
  const [ticket, setTicket] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const next = search.get("next") || "/profile/my-products";
  const redirectToNext = useCallback(() => {
    const target = next.startsWith("/") ? next : "/profile/my-products";
    window.location.replace(target);
  }, [next]);

  useEffect(() => {
    void (async () => {
      const savedTicket = sessionStorage.getItem(YANDEX_REGISTRATION_TICKET_KEY);

      // Режим регистрации: пользователь ещё не создан, всё держится на тикете.
      if (savedTicket) {
        try {
          const status = await getYandexRegistrationStatus(savedTicket);
          setTicket(savedTicket);
          setPhone(formatPhoneNumber(status.phoneNumber || ""));
          setStage(status.codeSent ? "phone_code" : "phone_input");
          return;
        } catch {
          sessionStorage.removeItem(YANDEX_REGISTRATION_TICKET_KEY);
          router.replace("/?auth=1&error=yandex_registration_expired");
          return;
        }
      }

      // Режим дозаполнения для аккаунтов, созданных до обязательного подтверждения телефона.
      try {
        const status = await getYandexOnboardingStatus();
        setPhone(formatPhoneNumber(status.phoneNumber || ""));
        if (!status.required) {
          redirectToNext();
          return;
        }
        setStage("phone_input");
      } catch {
        router.replace("/?auth=1");
      }
    })();
  }, [redirectToNext, router]);

  const onStartPhone = async () => {
    setErr(null);
    setMsg(null);
    if (!isValidPhoneNumber(phone)) {
      setErr("Введите корректный номер телефона");
      return;
    }
    setBusy(true);
    try {
      const cleanPhone = getCleanPhoneForSubmit(phone);
      const res = ticket
        ? await yandexRegistrationSendCode(ticket, cleanPhone)
        : await yandexOnboardingStartPhone(cleanPhone);
      setMsg(res.message || "Код подтверждения отправлен в SMS");
      setStage("phone_code");
    } catch (e) {
      setErr(getApiErrorMessage(e, "Не удалось отправить SMS с кодом"));
    } finally {
      setBusy(false);
    }
  };

  const onVerifyPhone = async () => {
    setErr(null);
    setMsg(null);
    if (!phoneCode.trim()) {
      setErr("Введите код из SMS");
      return;
    }
    setBusy(true);
    try {
      if (ticket) {
        // Только здесь создаётся аккаунт и выдаётся сессия.
        await yandexRegistrationVerifyCode(ticket, phoneCode.trim());
        sessionStorage.removeItem(YANDEX_REGISTRATION_TICKET_KEY);
      } else {
        await yandexOnboardingVerifyPhone(phoneCode.trim());
      }
      await queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
      setStage("done");
      redirectToNext();
    } catch (e) {
      setErr(getApiErrorMessage(e, "Неверный код подтверждения"));
    } finally {
      setBusy(false);
    }
  };

  if (stage === "loading") {
    return <div style={{ padding: 16 }}>Загрузка...</div>;
  }

  return (
    <div className="mx-auto my-12 max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 text-center">
        <Typography variant="h1" className="text-2xl font-bold text-slate-900">
          {stage === "phone_code" ? "Подтверждение телефона" : "Завершение регистрации"}
        </Typography>
        <Typography className="mt-2 text-sm text-slate-600">
          {stage === "phone_code"
            ? `Введите код из SMS, отправленный на номер ${phone}`
            : "Чтобы завершить регистрацию через Яндекс, укажите номер телефона — мы подтвердим его по SMS"}
        </Typography>
      </div>

      {stage === "phone_input" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onStartPhone();
          }}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Номер телефона
            </label>
            <PhoneField value={phone} onChange={setPhone} disabled={busy} />
          </div>

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Отправляем SMS..." : "Получить код по SMS"}
          </Button>
        </form>
      )}

      {stage === "phone_code" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onVerifyPhone();
          }}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Код из SMS
            </label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="000000"
              maxLength={6}
              value={phoneCode}
              onChange={(e) => setPhoneCode(e.target.value)}
              className="w-full text-center text-xl tracking-widest"
              autoFocus
            />
          </div>

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Проверяем код..." : "Подтвердить номер и завершить регистрацию"}
          </Button>

          <button
            type="button"
            className="w-full text-center text-xs text-blue-600 hover:underline"
            onClick={() => {
              setStage("phone_input");
              setPhoneCode("");
              setErr(null);
              setMsg(null);
            }}
          >
            Изменить номер телефона
          </button>
        </form>
      )}

      {msg && (
        <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-700">
          {msg}
        </div>
      )}
      {err && (
        <div className="mt-4 rounded-lg bg-rose-50 p-3 text-center text-sm font-medium text-rose-700">
          {err}
        </div>
      )}
    </div>
  );
}
