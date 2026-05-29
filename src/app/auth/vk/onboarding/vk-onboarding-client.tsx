"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CURRENT_USER_QUERY_KEY } from "@/api/hooks";
import {
  getVkOnboardingStatus,
  vkOnboardingStartEmail,
  vkOnboardingStartPhone,
  vkOnboardingVerifyEmail,
  vkOnboardingVerifyPhone,
} from "@/api/requests";

type Stage = "email_input" | "email_code" | "phone_input" | "phone_code" | "done";

export function VkOnboardingClient() {
  const router = useRouter();
  const search = useSearchParams();
  const queryClient = useQueryClient();

  const [stage, setStage] = useState<Stage>("email_input");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailCode, setEmailCode] = useState("");
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
        const status = await getVkOnboardingStatus();
        setEmail(status.email || "");
        setPhone(status.phoneNumber || "");
        if (!status.required) {
          redirectToNext();
          return;
        }
        if (!status.isEmailVerified) {
          setStage("email_input");
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
  }, [next, redirectToNext, router]);

  const title = useMemo(() => {
    switch (stage) {
      case "email_code":
        return "Подтвердите email";
      case "phone_input":
        return "Введите телефон";
      case "phone_code":
        return "Подтвердите телефон";
      default:
        return "Завершите регистрацию";
    }
  }, [stage]);

  const onStartEmail = async () => {
    setErr(null);
    setMsg(null);
    if (!email.trim()) {
      setErr("Введите email");
      return;
    }
    setBusy(true);
    try {
      const res = await vkOnboardingStartEmail(email.trim());
      setMsg(res.message || "Код отправлен на почту");
      setStage("email_code");
    } catch (e: any) {
      setErr(e?.data?.message || "Не удалось отправить код на почту");
    } finally {
      setBusy(false);
    }
  };

  const onVerifyEmail = async () => {
    setErr(null);
    setMsg(null);
    if (!emailCode.trim()) {
      setErr("Введите код из письма");
      return;
    }
    setBusy(true);
    try {
      await vkOnboardingVerifyEmail(emailCode.trim());
      setMsg("Почта подтверждена");
      setStage("phone_input");
    } catch (e: any) {
      setErr(e?.data?.message || "Неверный код почты");
    } finally {
      setBusy(false);
    }
  };

  const onStartPhone = async () => {
    setErr(null);
    setMsg(null);
    if (!phone.trim()) {
      setErr("Введите номер телефона");
      return;
    }
    setBusy(true);
    try {
      const res = await vkOnboardingStartPhone(phone.trim());
      setMsg(res.message || "Код отправлен на телефон");
      setStage("phone_code");
    } catch (e: any) {
      setErr(e?.data?.message || "Не удалось отправить код на телефон");
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
      await vkOnboardingVerifyPhone(phoneCode.trim());
      await queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
      setStage("done");
      redirectToNext();
    } catch (e: any) {
      setErr(e?.data?.message || "Неверный код телефона");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>{title}</h1>
      <p style={{ marginBottom: 20, opacity: 0.85 }}>
        Для доступа к сайту нужно подтвердить и email, и номер телефона.
      </p>

      {stage === "email_input" && (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 12, marginBottom: 12 }}
          />
          <button disabled={busy} onClick={onStartEmail} style={{ width: "100%", padding: 12 }}>
            Получить код на почту
          </button>
        </>
      )}

      {stage === "email_code" && (
        <>
          <input
            type="text"
            placeholder="Код из письма"
            value={emailCode}
            onChange={(e) => setEmailCode(e.target.value)}
            style={{ width: "100%", padding: 12, marginBottom: 12 }}
          />
          <button disabled={busy} onClick={onVerifyEmail} style={{ width: "100%", padding: 12 }}>
            Подтвердить почту
          </button>
        </>
      )}

      {stage === "phone_input" && (
        <>
          <input
            type="tel"
            placeholder="+7..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: "100%", padding: 12, marginBottom: 12 }}
          />
          <button disabled={busy} onClick={onStartPhone} style={{ width: "100%", padding: 12 }}>
            Получить код на телефон
          </button>
        </>
      )}

      {stage === "phone_code" && (
        <>
          <input
            type="text"
            placeholder="Код из SMS"
            value={phoneCode}
            onChange={(e) => setPhoneCode(e.target.value)}
            style={{ width: "100%", padding: 12, marginBottom: 12 }}
          />
          <button disabled={busy} onClick={onVerifyPhone} style={{ width: "100%", padding: 12 }}>
            Подтвердить телефон
          </button>
        </>
      )}

      {msg && <p style={{ color: "#0a7a35", marginTop: 12 }}>{msg}</p>}
      {err && <p style={{ color: "#b42318", marginTop: 12 }}>{err}</p>}
    </div>
  );
}
