"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { CURRENT_USER_QUERY_KEY } from "@/api/hooks";
import {
  getYandexOnboardingStatus,
  yandexOnboardingStartPhone,
  yandexOnboardingVerifyPhone,
} from "@/api/requests";
import { Input, Typography } from "@/components/ui";
import { Button } from "@/components/ui/Button";

type Stage = "phone_input" | "phone_code" | "done";

export function YandexOnboardingClient() {
  const router = useRouter();
  const search = useSearchParams();
  const queryClient = useQueryClient();

  const [stage, setStage] = useState<Stage>("phone_input");
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
      try {
        const status = await getYandexOnboardingStatus();
        setPhone(status.phoneNumber || "");
        if (!status.required) {
          redirectToNext();
          return;
        }
        if (!status.isPhoneVerified) {
          setStage("phone_input");
          return;
        }
        setStage("done");
        redirectToNext();
      } catch {
        router.replace("/?auth=1");
      }
    })();
  }, [redirectToNext, router]);

  const onStartPhone = async () => {
    setErr(null);
    setMsg(null);
    if (!phone.trim()) {
      setErr("Введите номер телефона");
      return;
    }
    setBusy(true);
    try {
      const res = await yandexOnboardingStartPhone(phone.trim());
      setMsg(res.message || "Код подтверждения отправлен в SMS");
      setStage("phone_code");
    } catch (e: any) {
      setErr(e?.data?.message || "Не удалось отправить SMS с кодом");
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
      await yandexOnboardingVerifyPhone(phoneCode.trim());
      await queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
      setStage("done");
      redirectToNext();
    } catch (e: any) {
      setErr(e?.data?.message || "Неверный код подтверждения");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto my-12 max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 text-center">
        <Typography variant="h1" className="text-2xl font-bold text-slate-900">
          {stage === "phone_code" ? "Подтверждение телефона" : "Завершение регистрации"}
        </Typography>
        <Typography className="mt-2 text-sm text-slate-600">
          {stage === "phone_code"
            ? `Введите 4-значный SMS-код, отправленный на номер ${phone}`
            : "Для входа через Яндекс укажите ваш номер телефона для подтверждения по SMS"}
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
            <Input
              type="tel"
              placeholder="+7 (999) 000-00-00"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full"
              autoFocus
            />
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
              placeholder="0000"
              maxLength={6}
              value={phoneCode}
              onChange={(e) => setPhoneCode(e.target.value)}
              className="w-full text-center text-xl tracking-widest"
              autoFocus
            />
          </div>

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Проверяем код..." : "Подтвердить номер телефона"}
          </Button>

          <button
            type="button"
            className="w-full text-center text-xs text-blue-600 hover:underline"
            onClick={() => {
              setStage("phone_input");
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
