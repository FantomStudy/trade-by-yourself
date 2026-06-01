"use client";

import type { SetCdekHandoffRequest } from "@/lib/api/requests";

import type { CdekPvz, Deal, DealCdekQrResponse } from "@/types";
import { useMemo, useState } from "react";

import { toast } from "sonner";
import {
  useCancelDealMutation,
  useConfirmDeliveryMutation,
  useMyDeals,
  usePayDealMutation,
  useShipDealMutation,
} from "@/api/hooks";
import { Input, Typography } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { getCdekDeliveryPoints, getDealCdekQr, setCdekHandoff, syncDealPayment } from "@/lib/api/requests";
import { toCurrency } from "@/lib/format";
import { CdekDeliverySteps } from "./_components/cdek-delivery-steps";

import styles from "./page.module.css";

type DealFilter = "all" | "buyer" | "seller";
const WAREHOUSE_TO_WAREHOUSE_TARIFF_CODE = 136;

const FILTER_BUTTONS: Array<{ key: DealFilter; label: string }> = [
  { key: "all", label: "Р’СЃРµ СЃРґРµР»РєРё" },
  { key: "buyer", label: "РњРѕРё РїРѕРєСѓРїРєРё" },
  { key: "seller", label: "РњРѕРё РїСЂРѕРґР°Р¶Рё" },
];

function getFilteredDeals(deals: Deal[], filter: DealFilter) {
  if (filter === "all") return deals;
  return deals.filter((deal) => deal.myRole === filter);
}

function getDealRoleText(role?: Deal["myRole"]) {
  if (role === "buyer") return "РџРѕРєСѓРїРєР°";
  if (role === "seller") return "РџСЂРѕРґР°Р¶Р°";
  return "Р РѕР»СЊ РЅРµ РѕРїСЂРµРґРµР»РµРЅР°";
}

function formatMoney(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return "вЂ”";
  return toCurrency(value);
}

function formatDate(value: string | null | undefined) {
  if (!value) return "вЂ”";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "вЂ”";
  return date.toLocaleString("ru-RU");
}

function getPvzText(deal: Deal) {
  const toPvzCode = deal.cdek.toPvzCode;
  if (!toPvzCode) return "РџР’Р— РЅРµ СѓРєР°Р·Р°РЅ";
  return `РџР’Р— РїРѕРєСѓРїР°С‚РµР»СЏ: ${toPvzCode}`;
}

function canCancelDeal(deal: Deal) {
  return deal.statusCode === "CREATED" || deal.statusCode === "PAID";
}

function mapCancelError(error: unknown) {
  const message = getApiErrorMessage(error, "РќРµ СѓРґР°Р»РѕСЃСЊ РѕС‚РјРµРЅРёС‚СЊ СЃРґРµР»РєСѓ");
  if (message.includes("РћС‚РјРµРЅРёС‚СЊ РјРѕР¶РЅРѕ С‚РѕР»СЊРєРѕ РґРѕ РѕС„РѕСЂРјР»РµРЅРёСЏ РґРѕСЃС‚Р°РІРєРё")) {
    return "РћС‚РјРµРЅРёС‚СЊ РјРѕР¶РЅРѕ С‚РѕР»СЊРєРѕ РґРѕ РѕС„РѕСЂРјР»РµРЅРёСЏ РґРѕСЃС‚Р°РІРєРё";
  }
  if (message.includes("Р”РѕСЃС‚Р°РІРєР° СѓР¶Рµ РѕС„РѕСЂРјР»РµРЅР°, РѕС‚РјРµРЅР° РЅРµРґРѕСЃС‚СѓРїРЅР°")) {
    return "Р”РѕСЃС‚Р°РІРєР° СѓР¶Рµ РѕС„РѕСЂРјР»РµРЅР°, РѕС‚РјРµРЅР° РЅРµРґРѕСЃС‚СѓРїРЅР°";
  }
  return message;
}

function getCdekRegistrationHint(deal: Deal): string | null {
  const fromApi = deal.cdek.registrationHint?.trim();
  if (fromApi) return fromApi;
  if (deal.cdek.orderUuid?.trim()) return null;
  if (deal.myRole === "buyer") {
    return "РўСЂРµРє Рё С€С‚СЂРёС…РєРѕРґ РїРѕСЏРІСЏС‚СЃСЏ РїРѕСЃР»Рµ РѕРїР»Р°С‚С‹ Рё СЂРµРіРёСЃС‚СЂР°С†РёРё РѕС‚РїСЂР°РІР»РµРЅРёСЏ РІ CDEK.";
  }
  return null;
}

function buildCdekQrMedia(payload: DealCdekQrResponse):
  | { kind: "img"; src: string }
  | { kind: "file"; href: string }
  | { kind: "text"; value: string }
  | null {
  const rawUrl = payload.qrCodeUrl?.trim();
  const rawData = payload.qrCodeData?.trim();
  if (rawUrl) {
    const lower = rawUrl.toLowerCase();
    if (lower.endsWith(".pdf") || lower.includes("application/pdf")) {
      return { kind: "file", href: rawUrl };
    }
    return { kind: "img", src: rawUrl };
  }
  if (rawData) {
    if (rawData.startsWith("data:") || rawData.startsWith("http")) {
      if (rawData.toLowerCase().endsWith(".pdf")) {
        return { kind: "file", href: rawData };
      }
      return { kind: "img", src: rawData };
    }
    // CDEK can return just a numeric barcode value (not an image/base64).
    // In this case render it as text so seller can present it in PVZ.
    const isLikelyBase64 = /^[A-Za-z0-9+/=\s]+$/.test(rawData) && rawData.length > 64;
    if (!isLikelyBase64) {
      return { kind: "text", value: rawData };
    }
    return { kind: "img", src: `data:image/png;base64,${rawData}` };
  }
  return null;
}

function CdekQrImg({ src }: { src: string }) {
  return <img alt="Штрихкод CDEK для ПВЗ" className={styles.qrImage} src={src} />;
}

function buildQrImageUrl(value: string) {
  const normalized = value.trim();
  if (!normalized) return "";
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(normalized)}`;
}

function DealQrContent({ payload }: { payload: DealCdekQrResponse }) {
  const media = buildCdekQrMedia(payload);
  if (!media) {
    return <span className={styles.infoValue}>РќРµС‚ РґР°РЅРЅС‹С… РёР·РѕР±СЂР°Р¶РµРЅРёСЏ</span>;
  }
  if (media.kind === "file") {
    return (
      <a className={styles.trackingLink} href={media.href} rel="noreferrer" target="_blank">
        РћС‚РєСЂС‹С‚СЊ С€С‚СЂРёС…РєРѕРґ CDEK (С„Р°Р№Р»)
      </a>
    );
  }
  if (media.kind === "text") {
    const qrSrc = buildQrImageUrl(media.value);
    if (qrSrc) {
      return <CdekQrImg src={qrSrc} />;
    }
    return <span className={styles.infoValue}>{media.value}</span>;
  }
  return <CdekQrImg src={media.src} />;
}

const DealsPage = () => {
  const [filter, setFilter] = useState<DealFilter>("all");
  const [cdekQrByDealId, setCdekQrByDealId] = useState<Record<number, DealCdekQrResponse>>({});
  const [cdekQrLoadingId, setCdekQrLoadingId] = useState<number | null>(null);
  const [syncPayLoadingId, setSyncPayLoadingId] = useState<number | null>(null);
  const [handoffModeByDealId, setHandoffModeByDealId] = useState<Record<number, "pvz" | "courier">>({});
  const [fromPvzByDealId, setFromPvzByDealId] = useState<Record<number, string>>({});
  const [fromAddressByDealId, setFromAddressByDealId] = useState<Record<number, string>>({});
  const [handoffLoadingId, setHandoffLoadingId] = useState<number | null>(null);
  const [sellerPvzByDealId, setSellerPvzByDealId] = useState<Record<number, CdekPvz[]>>({});
  const [sellerPvzLoadingByDealId, setSellerPvzLoadingByDealId] = useState<Record<number, boolean>>({});

  const { data: deals = [], isLoading, isFetching, refetch } = useMyDeals();
  const cancelDealMutation = useCancelDealMutation();
  const shipDealMutation = useShipDealMutation();
  const payDealMutation = usePayDealMutation();
  const confirmDeliveryMutation = useConfirmDeliveryMutation();

  const filteredDeals = useMemo(() => getFilteredDeals(deals, filter), [deals, filter]);

  const handleCancelDeal = async (dealId: number) => {
    try {
      await cancelDealMutation.mutateAsync(dealId);
      toast.success("РЎРґРµР»РєР° РѕС‚РјРµРЅРµРЅР°");
    } catch (error) {
      toast.error(mapCancelError(error));
    }
  };

  const handleShipDeal = async (deal: Deal) => {
    if (!deal.cdek.sellerHandoff) {
      toast.error("РЎРЅР°С‡Р°Р»Р° СѓРєР°Р¶Рё СЃРїРѕСЃРѕР± РїРµСЂРµРґР°С‡Рё РІ РЎР”Р­Рљ (РџР’Р— РёР»Рё РєСѓСЂСЊРµСЂ)");
      return;
    }
    if (!deal.cdek.orderUuid?.trim()) {
      toast.error("Р”РѕР¶РґРёСЃСЊ СЂРµРіРёСЃС‚СЂР°С†РёРё Р·Р°РєР°Р·Р° РІ РЎР”Р­Рљ РїРѕСЃР»Рµ РІС‹Р±РѕСЂР° РїРµСЂРµРґР°С‡Рё");
      return;
    }

    try {
      await shipDealMutation.mutateAsync({ id: deal.id });
      toast.success("РџРµСЂРµРґР°С‡Р° РІ РЎР”Р­Рљ РїРѕРґС‚РІРµСЂР¶РґРµРЅР° вЂ” РїРѕСЃС‹Р»РєР° РІ Р»РѕРіРёСЃС‚РёРєРµ");
      await refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "РќРµ СѓРґР°Р»РѕСЃСЊ РїРѕРґС‚РІРµСЂРґРёС‚СЊ РїРµСЂРµРґР°С‡Сѓ"));
    }
  };

  const handleSetHandoff = async (deal: Deal) => {
    const selectedMode = handoffModeByDealId[deal.id] ?? deal.cdek.sellerHandoff ?? "pvz";
    const mode =
      deal.cdek.tariffCode === WAREHOUSE_TO_WAREHOUSE_TARIFF_CODE ? "pvz" : selectedMode;
    const body: SetCdekHandoffRequest = { mode };
    if (mode === "pvz") {
      const code = (fromPvzByDealId[deal.id] ?? deal.cdek.fromPvzCode ?? "").trim();
      if (!code) {
        toast.error("РЈРєР°Р¶Рё РєРѕРґ РџР’Р— РЎР”Р­Рљ, РєСѓРґР° СЃРґР°С€СЊ РїРѕСЃС‹Р»РєСѓ");
        return;
      }
      body.cdekFromPvzCode = code;
    } else {
      const addr = (fromAddressByDealId[deal.id] ?? deal.cdek.fromAddress ?? "").trim();
      if (!addr) {
        toast.error("РЈРєР°Р¶Рё Р°РґСЂРµСЃ Р·Р°Р±РѕСЂР° РєСѓСЂСЊРµСЂРѕРј");
        return;
      }
      body.cdekFromAddress = addr;
    }

    setHandoffLoadingId(deal.id);
    try {
      await setCdekHandoff(deal.id, body);
      toast.success("Р—Р°СЏРІРєР° РІ РЎР”Р­Рљ РѕС„РѕСЂРјР»РµРЅР° вЂ” РїСЂРёРЅРµСЃРё РїРѕСЃС‹Р»РєСѓ РІ РїСѓРЅРєС‚ РёР»Рё Р¶РґРё РєСѓСЂСЊРµСЂР°");
      await refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "РќРµ СѓРґР°Р»РѕСЃСЊ РѕС„РѕСЂРјРёС‚СЊ РїРµСЂРµРґР°С‡Сѓ РІ РЎР”Р­Рљ"));
    } finally {
      setHandoffLoadingId(null);
    }
  };

  const loadSellerPvz = async (deal: Deal) => {
    if (!deal.cdek.fromCityCode) {
      toast.error("РќРµ СѓРґР°Р»РѕСЃСЊ РѕРїСЂРµРґРµР»РёС‚СЊ РіРѕСЂРѕРґ РѕС‚РїСЂР°РІРёС‚РµР»СЏ РґР»СЏ РІС‹Р±РѕСЂР° РџР’Р—");
      return;
    }
    if (sellerPvzByDealId[deal.id]?.length) return;

    setSellerPvzLoadingByDealId((prev) => ({ ...prev, [deal.id]: true }));
    try {
      const points = await getCdekDeliveryPoints(deal.cdek.fromCityCode);
      setSellerPvzByDealId((prev) => ({ ...prev, [deal.id]: points || [] }));
      if (!points?.length) {
        toast.error("Р”Р»СЏ РіРѕСЂРѕРґР° РѕС‚РїСЂР°РІРёС‚РµР»СЏ РџР’Р— РЅРµ РЅР°Р№РґРµРЅС‹");
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ РџР’Р— РѕС‚РїСЂР°РІРёС‚РµР»СЏ"));
    } finally {
      setSellerPvzLoadingByDealId((prev) => ({ ...prev, [deal.id]: false }));
    }
  };

  const handlePayDeal = async (dealId: number) => {
    try {
      const result = await payDealMutation.mutateAsync(dealId);
      if (result?.paymentUrl?.trim()) {
        window.open(result.paymentUrl, "_blank");
      }
      toast.success("РЎС‡С‘С‚ РЅР° РѕРїР»Р°С‚Сѓ СЃРґРµР»РєРё СЃРѕР·РґР°РЅ");
      await refetch();
    } catch (error) {
      const details = getApiErrorMessage(error, "");
      const message = details?.trim()
        ? `РќРµ СѓРґР°Р»РѕСЃСЊ СЃРѕР·РґР°С‚СЊ РѕРїР»Р°С‚Сѓ СЃРґРµР»РєРё: ${details}`
        : "РќРµ СѓРґР°Р»РѕСЃСЊ СЃРѕР·РґР°С‚СЊ РѕРїР»Р°С‚Сѓ СЃРґРµР»РєРё. РџСЂРѕРІРµСЂСЊ РЅР°СЃС‚СЂРѕР№РєРё РўРёРЅСЊРєРѕС„С„.";
      toast.error(message);
    }
  };

  const handleConfirmDelivery = async (dealId: number) => {
    try {
      await confirmDeliveryMutation.mutateAsync(dealId);
      toast.success("РџРѕР»СѓС‡РµРЅРёРµ РїРѕРґС‚РІРµСЂР¶РґРµРЅРѕ");
      await refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "РќРµ СѓРґР°Р»РѕСЃСЊ РїРѕРґС‚РІРµСЂРґРёС‚СЊ РїРѕР»СѓС‡РµРЅРёРµ"));
    }
  };

  const handleSyncDealPayment = async (dealId: number) => {
    setSyncPayLoadingId(dealId);
    try {
      await syncDealPayment(dealId);
      toast.success("РЎС‚Р°С‚СѓСЃ РѕРїР»Р°С‚С‹ РѕР±РЅРѕРІР»С‘РЅ");
      await refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "РћРїР»Р°С‚Р° РµС‰С‘ РЅРµ РїРѕРґС‚РІРµСЂР¶РґРµРЅР°"));
    } finally {
      setSyncPayLoadingId(null);
    }
  };

  const handleLoadCdekQr = async (dealId: number) => {
    setCdekQrLoadingId(dealId);
    try {
      const payload = await getDealCdekQr(dealId);
      setCdekQrByDealId((prev) => ({ ...prev, [dealId]: payload }));
      await refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "РќРµ СѓРґР°Р»РѕСЃСЊ РїРѕР»СѓС‡РёС‚СЊ QR РёР· CDEK"));
    } finally {
      setCdekQrLoadingId(null);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Typography variant="h1">Р‘РµР·РѕРїР°СЃРЅС‹Рµ СЃРґРµР»РєРё</Typography>
        <Button disabled={isFetching} type="button" variant="success" onClick={() => refetch()}>
          РћР±РЅРѕРІРёС‚СЊ
        </Button>
      </div>

      <div className={styles.filters}>
        {FILTER_BUTTONS.map((item) => (
          <Button
            key={item.key}
            type="button"
            variant={filter === item.key ? "primary" : "success"}
            onClick={() => setFilter(item.key)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className={styles.emptyState}>Р—Р°РіСЂСѓР·РєР° СЃРґРµР»РѕРє...</div>
      ) : filteredDeals.length === 0 ? (
        <div className={styles.emptyState}>РЎРґРµР»РєРё РЅРµ РЅР°Р№РґРµРЅС‹</div>
      ) : (
        <div className={styles.list}>
          {filteredDeals.map((deal) => {
            const cdekRegHint = getCdekRegistrationHint(deal);
            const onlyPvzHandoff = deal.cdek.tariffCode === WAREHOUSE_TO_WAREHOUSE_TARIFF_CODE;
            return (
              <div key={deal.id} className={styles.card}>
                <div className={styles.cardRow}>
                  <Typography variant="h2">РЎРґРµР»РєР° #{deal.id}</Typography>
                  <span className={styles.badge}>{getDealRoleText(deal.myRole)}</span>
                </div>

                <div className={styles.topMeta}>
                  <span className={styles.status}>РЎС‚Р°С‚СѓСЃ: {deal.status}</span>
                  <span className={styles.date}>РЎРѕР·РґР°РЅР°: {formatDate(deal.createdAt)}</span>
                </div>

                {canCancelDeal(deal) ? (
                  <div className={styles.actionsRow}>
                    <Button
                      disabled={cancelDealMutation.isPending}
                      type="button"
                      variant="destructive"
                      onClick={() => handleCancelDeal(deal.id)}
                    >
                      РћС‚РјРµРЅРёС‚СЊ СЃРґРµР»РєСѓ
                    </Button>
                  </div>
                ) : null}

                {deal.myRole === "buyer" && deal.statusCode === "CREATED" ? (
                  <div className={styles.actionsRow}>
                    <Button disabled={payDealMutation.isPending} type="button" onClick={() => handlePayDeal(deal.id)}>
                      {payDealMutation.isPending ? "РЎРѕР·РґР°С‘Рј РѕРїР»Р°С‚Сѓ..." : "РћРїР»Р°С‚РёС‚СЊ СЃРґРµР»РєСѓ"}
                    </Button>
                    {deal.paymentId?.trim() && !deal.paymentId.trim().toLowerCase().startsWith("mock-") ? (
                      <Button
                        disabled={syncPayLoadingId === deal.id}
                        type="button"
                        variant="success"
                        onClick={() => handleSyncDealPayment(deal.id)}
                      >
                        {syncPayLoadingId === deal.id ? "РџСЂРѕРІРµСЂСЏРµРј РўРёРЅСЊРєРѕС„С„..." : "РћР±РЅРѕРІРёС‚СЊ СЃС‚Р°С‚СѓСЃ РѕРїР»Р°С‚С‹"}
                      </Button>
                    ) : null}
                  </div>
                ) : null}

                {deal.myRole === "buyer" && deal.statusCode === "SHIPPED" ? (
                  <div className={styles.actionsRow}>
                    <Button
                      disabled={confirmDeliveryMutation.isPending}
                      type="button"
                      variant="success"
                      onClick={() => handleConfirmDelivery(deal.id)}
                    >
                      {confirmDeliveryMutation.isPending ? "РџРѕРґС‚РІРµСЂР¶РґР°РµРј..." : "РџРѕРґС‚РІРµСЂРґРёС‚СЊ РїРѕР»СѓС‡РµРЅРёРµ"}
                    </Button>
                  </div>
                ) : null}

                {deal.myRole === "seller" && deal.statusCode === "PAID" ? (
                  <div className={styles.shipBlock}>
                    <Typography variant="h2">РџРµСЂРµРґР°С‡Р° РІ РЎР”Р­Рљ</Typography>
                    <p className={styles.cdekHint}>
                      {deal.cdek.sellerHandoffHint ??
                        "РџСЂРёРЅРµСЃРё РїРѕСЃС‹Р»РєСѓ РІ РџР’Р— РёР»Рё РІС‹Р·РѕРІРё РєСѓСЂСЊРµСЂР° вЂ” СЃРѕС‚СЂСѓРґРЅРёРє РїСЂРѕРІРµСЂРёС‚ Рё СѓРїР°РєСѓРµС‚ РѕС‚РїСЂР°РІР»РµРЅРёРµ."}
                    </p>
                    <>
                        <div className={styles.filters}>
                          <Button
                            type="button"
                            variant={
                              (handoffModeByDealId[deal.id] ?? deal.cdek.sellerHandoff ?? "pvz") === "pvz"
                                ? "primary"
                                : "success"
                            }
                            onClick={() =>
                              setHandoffModeByDealId((prev) => ({ ...prev, [deal.id]: "pvz" }))
                            }
                          >
                            РЎРґР°Рј РІ РџР’Р—
                          </Button>
                          {!onlyPvzHandoff ? (
                            <Button
                              type="button"
                              variant={
                                (handoffModeByDealId[deal.id] ?? deal.cdek.sellerHandoff ?? "pvz") === "courier"
                                  ? "primary"
                                  : "success"
                              }
                              onClick={() =>
                                setHandoffModeByDealId((prev) => ({ ...prev, [deal.id]: "courier" }))
                              }
                            >
                              Р’С‹Р·РѕРІСѓ РєСѓСЂСЊРµСЂР°
                            </Button>
                          ) : null}
                        </div>
                        {(handoffModeByDealId[deal.id] ?? deal.cdek.sellerHandoff ?? "pvz") === "pvz" ? (
                          <div className={styles.shipInput}>
                            <div className={styles.actionsRow}>
                              <Button
                                disabled={sellerPvzLoadingByDealId[deal.id]}
                                type="button"
                                variant="success"
                                onClick={() => loadSellerPvz(deal)}
                              >
                                {sellerPvzLoadingByDealId[deal.id] ? "Р—Р°РіСЂСѓР¶Р°РµРј РџР’Р—..." : "Р’С‹Р±СЂР°С‚СЊ РџР’Р— РѕС‚РїСЂР°РІРёС‚РµР»СЏ"}
                              </Button>
                            </div>
                            {sellerPvzByDealId[deal.id]?.length ? (
                              <select
                                className={styles.shipInput}
                                value={fromPvzByDealId[deal.id] ?? deal.cdek.fromPvzCode ?? ""}
                                onChange={(event) =>
                                  setFromPvzByDealId((prev) => ({ ...prev, [deal.id]: event.target.value }))
                                }
                              >
                                <option value="">Р’С‹Р±РµСЂРё РџР’Р—, РѕС‚РєСѓРґР° РѕС‚РїСЂР°РІРёС€СЊ</option>
                                {sellerPvzByDealId[deal.id].map((pvz) => (
                                  <option key={pvz.code} value={pvz.code}>
                                    {pvz.code}
                                    {pvz.location?.address ? ` вЂ” ${pvz.location.address}` : ""}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <Input
                                className={styles.shipInput}
                                placeholder="РљРѕРґ РџР’Р— РЎР”Р­Рљ (РµСЃР»Рё РІС‹Р±РёСЂР°РµС€СЊ РІСЂСѓС‡РЅСѓСЋ)"
                                value={fromPvzByDealId[deal.id] ?? deal.cdek.fromPvzCode ?? ""}
                                onChange={(event) =>
                                  setFromPvzByDealId((prev) => ({ ...prev, [deal.id]: event.target.value }))
                                }
                              />
                            )}
                          </div>
                        ) : (
                          <Input
                            className={styles.shipInput}
                            placeholder="РђРґСЂРµСЃ Р·Р°Р±РѕСЂР° РєСѓСЂСЊРµСЂРѕРј"
                            value={fromAddressByDealId[deal.id] ?? deal.cdek.fromAddress ?? ""}
                            onChange={(event) =>
                              setFromAddressByDealId((prev) => ({ ...prev, [deal.id]: event.target.value }))
                            }
                          />
                        )}
                        <Button
                          disabled={handoffLoadingId === deal.id}
                          type="button"
                          onClick={() => handleSetHandoff(deal)}
                        >
                          {handoffLoadingId === deal.id ? "РћС„РѕСЂРјР»СЏРµРј..." : "РЎРѕС…СЂР°РЅРёС‚СЊ РїРµСЂРµРґР°С‡Сѓ РІ РЎР”Р­Рљ"}
                        </Button>
                        {deal.cdek.orderUuid ? (
                          <>
                            <p className={styles.cdekHint}>
                              Р—Р°РєР°Р· РІ РЎР”Р­Рљ: {deal.cdek.orderUuid}
                              {deal.cdek.trackNumber ? ` В· С‚СЂРµРє ${deal.cdek.trackNumber}` : ""}
                            </p>
                            <Button
                              disabled={shipDealMutation.isPending}
                              type="button"
                              variant="success"
                              onClick={() => handleShipDeal(deal)}
                            >
                              {shipDealMutation.isPending
                                ? "РЎРѕС…СЂР°РЅСЏРµРј..."
                                : "РџРѕСЃС‹Р»РєСѓ РїРµСЂРµРґР°Р» РІ РЎР”Р­Рљ"}
                            </Button>
                          </>
                        ) : null}
                    </>
                  </div>
                ) : null}

                <div className={styles.section}>
                  <Typography variant="h2">РўРѕРІР°СЂ</Typography>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>РўРѕРІР°СЂ</span>
                      <span className={styles.infoValue}>{deal.product.name}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>ID С‚РѕРІР°СЂР°</span>
                      <span className={styles.infoValue}>{deal.product.id}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.section}>
                  <Typography variant="h2">РЎСѓРјРјС‹</Typography>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>РЎСѓРјРјР° С‚РѕРІР°СЂР°</span>
                      <span className={styles.infoValue}>{formatMoney(deal.amounts.productAmount)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Р”РѕСЃС‚Р°РІРєР°</span>
                      <span className={styles.infoValue}>{formatMoney(deal.amounts.deliveryCost)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>РС‚РѕРіРѕ Рє РѕРїР»Р°С‚Рµ</span>
                      <span className={styles.infoValueStrong}>{formatMoney(deal.amounts.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.section}>
                  <Typography variant="h2">Р”РѕСЃС‚Р°РІРєР° РЎР”Р­Рљ</Typography>
                  <CdekDeliverySteps stages={deal.cdek.deliveryStages} />
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>РўР°СЂРёС„</span>
                      <span className={styles.infoValue}>{deal.cdek.tariffName ?? `РљРѕРґ ${deal.cdek.tariffCode}`}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>РўСЂРµРє-РЅРѕРјРµСЂ</span>
                      <span className={styles.infoValue}>
                        {deal.cdek.trackNumber?.trim()
                          ? deal.cdek.trackNumber
                          : deal.cdek.trackPending
                            ? "Р–РґС‘Рј РѕС‚ CDEK..."
                            : "Р•С‰С‘ РЅРµ РїСЂРёСЃРІРѕРµРЅ"}
                      </span>
                    </div>
                    {deal.cdek.trackingUrl ? (
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>РўСЂРµРєРёРЅРі</span>
                        <a className={styles.trackingLink} href={deal.cdek.trackingUrl} rel="noreferrer" target="_blank">
                          РћС‚РєСЂС‹С‚СЊ РЅР° cdek.ru
                        </a>
                      </div>
                    ) : null}
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>UUID Р·Р°РєР°Р·Р° CDEK</span>
                      <span className={styles.infoValue}>{deal.cdek.orderUuid?.trim() ? deal.cdek.orderUuid : "РќРµ СѓРєР°Р·Р°РЅ"}</span>
                    </div>
                    {deal.cdek.package?.weight ? (
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>РџРѕСЃС‹Р»РєР°</span>
                        <span className={styles.infoValue}>
                          {deal.cdek.package.weight} Рі
                          {deal.cdek.package.length
                            ? ` В· ${deal.cdek.package.length}Г—${deal.cdek.package.width}Г—${deal.cdek.package.height} СЃРј`
                            : ""}
                        </span>
                      </div>
                    ) : null}
                    {deal.myRole === "buyer" ? (
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>РџР’Р— РїРѕР»СѓС‡РµРЅРёСЏ</span>
                        <span className={styles.infoValue}>{getPvzText(deal)}</span>
                      </div>
                    ) : (
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>РРЅС„РѕСЂРјР°С†РёСЏ РґР»СЏ РїСЂРѕРґР°РІС†Р°</span>
                        <span className={styles.infoValue}>
                          {deal.cdek.sellerHandoffHint?.trim() ??
                            (deal.cdek.toPvzCode
                              ? `РџРµСЂРµРґР°Р№С‚Рµ РѕС‚РїСЂР°РІР»РµРЅРёРµ РІ CDEK РґР»СЏ РІС‹РґР°С‡Рё РІ РџР’Р— РїРѕРєСѓРїР°С‚РµР»СЏ: ${deal.cdek.toPvzCode}.`
                              : "РћР¶РёРґР°РµС‚СЃСЏ РІС‹Р±РѕСЂ РџР’Р— РїРѕРєСѓРїР°С‚РµР»СЏ.")}
                        </span>
                      </div>
                    )}
                  </div>
                  {cdekRegHint ? <p className={styles.cdekHint}>{cdekRegHint}</p> : null}

                  {deal.cdek.orderUuid?.trim() ? (
                    <div className={styles.pickupQrBlock}>
                      <Typography variant="h3">РЁС‚СЂРёС…РєРѕРґ РґР»СЏ РџР’Р—</Typography>
                      <p className={styles.pickupHint}>
                        {deal.myRole === "buyer"
                          ? "Р—Р°Р±РёСЂР°РµС€СЊ РїРѕСЃС‹Р»РєСѓ вЂ” РЅР°Р¶РјРё, РїРѕРґС‚СЏРЅРµРј С€С‚СЂРёС…РєРѕРґ СЃ CDEK. РџРѕРєР°Р¶Рё СЌРєСЂР°РЅ СЃРѕС‚СЂСѓРґРЅРёРєСѓ РІ РџР’Р—."
                          : "РЁС‚СЂРёС…РєРѕРґ Р·Р°РєР°Р·Р° РІ CDEK РїРѕ СЌС‚РѕР№ СЃРґРµР»РєРµ (РµСЃР»Рё РЅСѓР¶РµРЅ РґР»СЏ РџР’Р— РёР»Рё РїРµС‡Р°С‚Рё)."}
                      </p>
                      <Button
                        disabled={cdekQrLoadingId === deal.id}
                        type="button"
                        variant="success"
                        onClick={() => handleLoadCdekQr(deal.id)}
                      >
                        {cdekQrLoadingId === deal.id ? "Р“СЂСѓР·РёРј РёР· CDEK..." : "РџРѕР»СѓС‡РёС‚СЊ QR РёР· CDEK"}
                      </Button>

                      {cdekQrByDealId[deal.id] ? (
                        <div className={styles.qrResult}>
                          {cdekQrByDealId[deal.id].trackNumber ? (
                            <div className={styles.infoItem}>
                              <span className={styles.infoLabel}>РўСЂРµРє (СЃ СЃРµСЂРІРµСЂР° CDEK)</span>
                              <span className={styles.infoValue}>{cdekQrByDealId[deal.id].trackNumber}</span>
                            </div>
                          ) : null}
                          {cdekQrByDealId[deal.id].trackingUrl ? (
                            <a
                              className={styles.trackingLink}
                              href={cdekQrByDealId[deal.id].trackingUrl ?? undefined}
                              rel="noreferrer"
                              target="_blank"
                            >
                              РћС‚СЃР»РµРґРёС‚СЊ РЅР° cdek.ru
                            </a>
                          ) : null}
                          <DealQrContent payload={cdekQrByDealId[deal.id]} />
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DealsPage;

