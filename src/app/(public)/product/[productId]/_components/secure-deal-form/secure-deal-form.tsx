"use client";

import type { CdekCity, CdekPvz, CdekTariffItem, ExtendedProduct } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { MapPin, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  calculateCdekDelivery,
  createDeal,
  getCdekCities,
  getCdekDeliveryPoints,
  getCdekTariffs,
} from "@/api/requests";
import { AuthDialog } from "@/components/AuthDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Typography,
} from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { useCurrentUser } from "@/lib/api/hooks/queries";
import { CHATS_QUERY_KEY } from "@/lib/api/hooks/queries/useChats";
import { MY_RESERVATIONS_QUERY_KEY } from "@/lib/api/hooks/queries/useMyReservations";
import { PRODUCT_RESERVATION_QUERY_KEY } from "@/lib/api/hooks/queries/useProductReservation";
import { toCurrency } from "@/lib/format";

import styles from "./secure-deal-form.module.css";

type ParcelInputMode = "approximate" | "exact";

function getCityFromAddress(address?: string | null) {
  if (!address) return "";
  const normalized = address.trim();
  if (!normalized) return "";

  const parts = normalized
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const directCity = parts.find((part) => /^Рі\.\s*/i.test(part));
  if (directCity) return directCity.replace(/^Рі\.\s*/i, "").trim();

  const cityFromDistrict = parts.find((part) => /^РіРѕСЂРѕРґСЃРєРѕР№ РѕРєСЂСѓРі\s+/i.test(part));
  if (cityFromDistrict) return cityFromDistrict.replace(/^РіРѕСЂРѕРґСЃРєРѕР№ РѕРєСЂСѓРі\s+/i, "").trim();

  const blocked =
    /(\d|СѓР»РёС†|РїСЂРѕСЃРїРµРєС‚|РїРµСЂРµСѓР»|РїСЂРѕРµР·Рґ|С€РѕСЃСЃРµ|Р±СѓР»СЊРІР°СЂ|РїР»РѕС€|СЂР°Р№РѕРЅ|РѕР±Р»Р°СЃС‚СЊ|РєСЂР°Р№|СЂРµСЃРїСѓР±Р»РёРєР°|С„РµРґРµСЂР°Р»СЊРЅС‹Р№|СЂРѕСЃСЃРёСЏ|РёРЅРґРµРєСЃ|РєРѕСЂРїСѓСЃ|СЃС‚СЂРѕРµРЅРёРµ|РєРІР°СЂС‚РёСЂР°|РґРѕРј|РЅРѕРІРѕСЃС‚СЂРѕР№РєР°)/i;
  const candidates = parts.filter((part) => !blocked.test(part));
  return candidates.at(-1) ?? "";
}

interface ParcelPreset {
  id: string;
  name: string;
  dimensions: string;
  weightText: string;
  length: number;
  width: number;
  height: number;
  weight: number;
}

const PARCEL_PRESETS: ParcelPreset[] = [
  {
    id: "envelope",
    name: "РљРѕРЅРІРµСЂС‚",
    dimensions: "34x27x2 СЃРј",
    weightText: "РґРѕ 0.5 РєРі",
    length: 34,
    width: 27,
    height: 2,
    weight: 500,
  },
  {
    id: "box-xs",
    name: "РљРѕСЂРѕР± XS",
    dimensions: "17x12x9 СЃРј",
    weightText: "РґРѕ 0.5 РєРі",
    length: 17,
    width: 12,
    height: 9,
    weight: 500,
  },
  {
    id: "box-s",
    name: "РљРѕСЂРѕР± S",
    dimensions: "23x19x10 СЃРј",
    weightText: "РґРѕ 2 РєРі",
    length: 23,
    width: 19,
    height: 10,
    weight: 2000,
  },
  {
    id: "box-m",
    name: "РљРѕСЂРѕР± M",
    dimensions: "33x25x15 СЃРј",
    weightText: "РґРѕ 5 РєРі",
    length: 33,
    width: 25,
    height: 15,
    weight: 5000,
  },
  {
    id: "box-l",
    name: "РљРѕСЂРѕР± L",
    dimensions: "31x25x38 СЃРј",
    weightText: "РґРѕ 12 РєРі",
    length: 31,
    width: 25,
    height: 38,
    weight: 12000,
  },
  {
    id: "box-xl",
    name: "РљРѕСЂРѕР± XL",
    dimensions: "60x35x30 СЃРј",
    weightText: "РґРѕ 18 РєРі",
    length: 60,
    width: 35,
    height: 30,
    weight: 18000,
  },
  {
    id: "suitcase",
    name: "Р§РµРјРѕРґР°РЅ",
    dimensions: "55x35x77 СЃРј",
    weightText: "РґРѕ 30 РєРі",
    length: 55,
    width: 35,
    height: 77,
    weight: 30000,
  },
  {
    id: "pallet",
    name: "РџР°Р»Р»РµС‚Р°",
    dimensions: "120x120x80 СЃРј",
    weightText: "РґРѕ 200 РєРі",
    length: 120,
    width: 120,
    height: 80,
    weight: 200000,
  },
];

interface SecureDealFormProps {
  product: ExtendedProduct;
}

export const SecureDealForm = ({ product }: SecureDealFormProps) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { data: currentUser } = useCurrentUser();
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingPvz, setIsLoadingPvz] = useState(false);
  const [isLoadingTariffs, setIsLoadingTariffs] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [toCityQuery, setToCityQuery] = useState("");
  const [toCities, setToCities] = useState<CdekCity[]>([]);
  const [toCityCode, setToCityCode] = useState<number | null>(null);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const [toPvzList, setToPvzList] = useState<CdekPvz[]>([]);
  const [toPvzCode, setToPvzCode] = useState("");
  const [toAddress, setToAddress] = useState("");

  const [tariffs, setTariffs] = useState<CdekTariffItem[]>([]);
  const [selectedTariffCode, setSelectedTariffCode] = useState<number | null>(null);
  const [tariffName, setTariffName] = useState("");
  const [tariffCode, setTariffCode] = useState<number | null>(null);
  const [fromCityCode, setFromCityCode] = useState<number | null>(null);
  const [fromCityName, setFromCityName] = useState("");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [parcelMode, setParcelMode] = useState<ParcelInputMode>("approximate");
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [deliveryCost, setDeliveryCost] = useState<number | null>(null);
  const citySearchRef = useRef<HTMLDivElement>(null);
  const citySearchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalPrice = useMemo(() => {
    const currentDelivery = deliveryCost ?? 0;
    return product.price + currentDelivery;
  }, [deliveryCost, product.price]);

  const selectedTariff = useMemo(
    () => tariffs.find((item) => item.tariffCode === selectedTariffCode) ?? null,
    [tariffs, selectedTariffCode],
  );

  const isDoorDelivery = useMemo(() => {
    const flag = selectedTariff?.toDoor;
    return flag === true || flag === 1;
  }, [selectedTariff]);

  const resetState = () => {
    setToCityQuery("");
    setToCities([]);
    setToCityCode(null);
    setShowCitySuggestions(false);
    setToPvzList([]);
    setToPvzCode("");
    setToAddress("");
    setTariffs([]);
    setSelectedTariffCode(null);
    setTariffName("");
    setTariffCode(null);
    setFromCityCode(null);
    setFromCityName("");
    setWeight("");
    setLength("");
    setWidth("");
    setHeight("");
    setParcelMode("approximate");
    setSelectedPresetId(null);
    setDeliveryCost(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (citySearchRef.current && !citySearchRef.current.contains(event.target as Node)) {
        setShowCitySuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (citySearchDebounceRef.current) {
        clearTimeout(citySearchDebounceRef.current);
      }
    };
  }, []);

  const applyPreset = (preset: ParcelPreset) => {
    setSelectedPresetId(preset.id);
    setLength(String(preset.length));
    setWidth(String(preset.width));
    setHeight(String(preset.height));
    setWeight(String(preset.weight));
    setTariffs([]);
    setSelectedTariffCode(null);
    setTariffCode(null);
    setTariffName("");
    setDeliveryCost(null);
  };

  const handleSearchCities = async (query: string) => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      setToCities([]);
      setShowCitySuggestions(false);
      return;
    }

    try {
      setIsLoadingCities(true);
      const cities = await getCdekCities(normalizedQuery, 10);
      setToCities(cities);
      setShowCitySuggestions(true);
    } catch (error) {
      console.error("РћС€РёР±РєР° РїРѕРёСЃРєР° РіРѕСЂРѕРґРѕРІ CDEK:", error);
      toast.error(getApiErrorMessage(error, "РќРµ СѓРґР°Р»РѕСЃСЊ РїРѕР»СѓС‡РёС‚СЊ СЃРїРёСЃРѕРє РіРѕСЂРѕРґРѕРІ CDEK"));
    } finally {
      setIsLoadingCities(false);
    }
  };

  const resolveFromCityByAddress = async () => {
    const cityCandidate = getCityFromAddress(product.address);
    if (!cityCandidate) {
      setFromCityCode(null);
      setFromCityName("");
      return;
    }

    try {
      const cities = await getCdekCities(cityCandidate, 10);
      const exact = cities.find(
        (city) => city.city?.trim().toLowerCase() === cityCandidate.trim().toLowerCase(),
      );
      const picked = exact ?? cities[0];

      if (!picked?.code) {
        setFromCityCode(null);
        setFromCityName("");
        return;
      }

      setFromCityCode(picked.code);
      setFromCityName(picked.city ?? cityCandidate);
    } catch (error) {
      console.error("РћС€РёР±РєР° РѕРїСЂРµРґРµР»РµРЅРёСЏ РіРѕСЂРѕРґР° РѕС‚РїСЂР°РІРёС‚РµР»СЏ:", error);
      setFromCityCode(null);
      setFromCityName("");
    }
  };

  const handleSelectCity = async (code: number) => {
    try {
      setIsLoadingPvz(true);
      const pvzList = await getCdekDeliveryPoints(code);
      const selectedCity = toCities.find((city) => city.code === code);
      setToCityCode(code);
      if (selectedCity?.city) {
        setToCityQuery(selectedCity.city);
      }
      setShowCitySuggestions(false);
      setToPvzList(pvzList);
      setToPvzCode("");
    setToAddress("");

      setTariffs([]);
      setSelectedTariffCode(null);
      setTariffCode(null);
      setTariffName("");
      setDeliveryCost(null);
    } catch (error) {
      console.error("РћС€РёР±РєР° РїРѕР»СѓС‡РµРЅРёСЏ РџР’Р— CDEK:", error);
      toast.error(getApiErrorMessage(error, "РќРµ СѓРґР°Р»РѕСЃСЊ РїРѕР»СѓС‡РёС‚СЊ РџР’Р— CDEK"));
    } finally {
      setIsLoadingPvz(false);
    }
  };

  const handleCalculate = async () => {
    if (!fromCityCode) {
      toast.error("РќРµ СѓРґР°Р»РѕСЃСЊ РѕРїСЂРµРґРµР»РёС‚СЊ РіРѕСЂРѕРґ РѕС‚РїСЂР°РІРёС‚РµР»СЏ РёР· Р°РґСЂРµСЃР° С‚РѕРІР°СЂР°");
      return;
    }

    if (!toCityCode) {
      toast.error("Р’С‹Р±РµСЂРё РіРѕСЂРѕРґ РїРѕР»СѓС‡Р°С‚РµР»СЏ");
      return;
    }

    if (!selectedTariffCode) {
      toast.error("Сначала выбери тариф");
      return;
    }

    if (isDoorDelivery) {
      if (!toAddress.trim()) {
        toast.error("Заполни адрес получателя для доставки до двери");
        return;
      }
    } else if (!toPvzCode) {
      toast.error("Выбери ПВЗ получателя");
      return;
    }

    const parsedWeight = Number(weight);
    const parsedLength = Number(length);
    const parsedWidth = Number(width);
    const parsedHeight = Number(height);

    if (!weight || !length || !width || !height) {
      toast.error("РЈРєР°Р¶Рё РєРѕСЂСЂРµРєС‚РЅС‹Рµ РїР°СЂР°РјРµС‚СЂС‹ РїРѕСЃС‹Р»РєРё");
      return;
    }

    if (
      Number.isNaN(parsedWeight) ||
      Number.isNaN(parsedLength) ||
      Number.isNaN(parsedWidth) ||
      Number.isNaN(parsedHeight) ||
      parsedWeight <= 0 ||
      parsedLength <= 0 ||
      parsedWidth <= 0 ||
      parsedHeight <= 0
    ) {
      toast.error("РЈРєР°Р¶Рё РєРѕСЂСЂРµРєС‚РЅС‹Рµ РїР°СЂР°РјРµС‚СЂС‹ РїРѕСЃС‹Р»РєРё");
      return;
    }

    try {
      setIsCalculating(true);
      const result = await calculateCdekDelivery({
        tariffCode: selectedTariffCode,
        fromCityCode,
        toCityCode,
        weight: parsedWeight,
        length: parsedLength,
        width: parsedWidth,
        height: parsedHeight,
      });

      const calculatedCost = result.delivery_sum ?? result.total_sum ?? 0;
      setDeliveryCost(calculatedCost);
      if (result.tariff_name) setTariffName(result.tariff_name);
      if (typeof result.tariff_code === "number") {
        setTariffCode(result.tariff_code);
      }
      toast.success("Р”РѕСЃС‚Р°РІРєР° СЂР°СЃСЃС‡РёС‚Р°РЅР°");
    } catch (error) {
      console.error("РћС€РёР±РєР° СЂР°СЃС‡РµС‚Р° РґРѕСЃС‚Р°РІРєРё:", error);
      toast.error(getApiErrorMessage(error, "РќРµ СѓРґР°Р»РѕСЃСЊ СЂР°СЃСЃС‡РёС‚Р°С‚СЊ РґРѕСЃС‚Р°РІРєСѓ"));
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCreateDeal = async () => {
    if (!fromCityCode) {
      toast.error("РќРµ СѓРґР°Р»РѕСЃСЊ РѕРїСЂРµРґРµР»РёС‚СЊ РіРѕСЂРѕРґ РѕС‚РїСЂР°РІРёС‚РµР»СЏ РёР· Р°РґСЂРµСЃР° С‚РѕРІР°СЂР°");
      return;
    }

    if (!toCityCode) {
      toast.error("Р—Р°РїРѕР»РЅРё РіРѕСЂРѕРґ РїРѕР»СѓС‡РµРЅРёСЏ");
      return;
    }

    if (deliveryCost === null) {
      toast.error("РЎРЅР°С‡Р°Р»Р° СЂР°СЃСЃС‡РёС‚Р°Р№ РґРѕСЃС‚Р°РІРєСѓ");
      return;
    }

    if (!selectedTariffCode) {
      toast.error("Сначала выбери тариф");
      return;
    }

    if (isDoorDelivery) {
      if (!toAddress.trim()) {
        toast.error("Заполни адрес получателя для доставки до двери");
        return;
      }
    } else if (!toPvzCode) {
      toast.error("Выбери ПВЗ получателя");
      return;
    }

    try {
      setIsCreating(true);
      const deal = await createDeal({
        productId: product.id,
        deliveryCost,
        cdekTariffCode: selectedTariffCode,
        cdekTariffName: tariffName || undefined,
        cdekFromCityCode: fromCityCode,
        cdekToCityCode: toCityCode,
        cdekToPvzCode: isDoorDelivery ? undefined : toPvzCode || undefined,
        cdekToAddress: isDoorDelivery ? toAddress.trim() : undefined,
      });

      toast.success(`РЎРґРµР»РєР° #${deal.id} СЃРѕР·РґР°РЅР°`);
      queryClient.invalidateQueries({ queryKey: MY_RESERVATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCT_RESERVATION_QUERY_KEY(product.id) });
      queryClient.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["chat"] });
      setOpen(false);
      resetState();
    } catch (error) {
      const msg = getApiErrorMessage(error, "РќРµ СѓРґР°Р»РѕСЃСЊ СЃРѕР·РґР°С‚СЊ СЃРґРµР»РєСѓ");
      console.error("РћС€РёР±РєР° СЃРѕР·РґР°РЅРёСЏ СЃРґРµР»РєРё:", msg, error);
      toast.error(msg);
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenSecureDeal = () => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    setOpen(true);
    void resolveFromCityByAddress();
  };

  const handleCityInputChange = (value: string) => {
    setToCityQuery(value);

    // РџСЂРё СЂСѓС‡РЅРѕРј РёР·РјРµРЅРµРЅРёРё С‚РµРєСЃС‚Р° СЃР±СЂР°СЃС‹РІР°РµРј СЂР°РЅРµРµ РІС‹Р±СЂР°РЅРЅС‹Р№ РіРѕСЂРѕРґ Рё РџР’Р—.
    setToCityCode(null);
    setToPvzList([]);
    setToPvzCode("");
    setToAddress("");
    setTariffs([]);
    setSelectedTariffCode(null);
    setTariffCode(null);
    setTariffName("");
    setDeliveryCost(null);

    if (citySearchDebounceRef.current) {
      clearTimeout(citySearchDebounceRef.current);
    }

    citySearchDebounceRef.current = setTimeout(() => {
      void handleSearchCities(value);
    }, 300);
  };

  const handleClearCity = () => {
    setToCityQuery("");
    setToCities([]);
    setToCityCode(null);
    setShowCitySuggestions(false);
    setToPvzList([]);
    setToPvzCode("");
    setToAddress("");
    setTariffs([]);
    setSelectedTariffCode(null);
    setTariffCode(null);
    setTariffName("");
    setDeliveryCost(null);
  };

  const handleLoadTariffs = async () => {
    if (!fromCityCode) {
      toast.error("РќРµ СѓРґР°Р»РѕСЃСЊ РѕРїСЂРµРґРµР»РёС‚СЊ РіРѕСЂРѕРґ РѕС‚РїСЂР°РІРёС‚РµР»СЏ РёР· Р°РґСЂРµСЃР° С‚РѕРІР°СЂР°");
      return;
    }
    if (!toCityCode) {
      toast.error("Р’С‹Р±РµСЂРё РіРѕСЂРѕРґ РїРѕР»СѓС‡Р°С‚РµР»СЏ");
      return;
    }

    const parsedWeight = Number(weight);
    const parsedLength = Number(length);
    const parsedWidth = Number(width);
    const parsedHeight = Number(height);

    if (
      Number.isNaN(parsedWeight) ||
      Number.isNaN(parsedLength) ||
      Number.isNaN(parsedWidth) ||
      Number.isNaN(parsedHeight) ||
      parsedWeight <= 0 ||
      parsedLength <= 0 ||
      parsedWidth <= 0 ||
      parsedHeight <= 0
    ) {
      toast.error("РЈРєР°Р¶Рё РєРѕСЂСЂРµРєС‚РЅС‹Рµ РїР°СЂР°РјРµС‚СЂС‹ РїРѕСЃС‹Р»РєРё");
      return;
    }

    try {
      setIsLoadingTariffs(true);
      const response = await getCdekTariffs({
        fromCityCode,
        toCityCode,
        weight: parsedWeight,
        length: parsedLength,
        width: parsedWidth,
        height: parsedHeight,
      });

      const normalizedTariffs = response
        .map((item) => ({
          ...item,
          tariffCode: item.tariffCode ?? item.tariff_code ?? 0,
          tariffName: item.tariffName ?? item.tariff_name ?? "РўР°СЂРёС„",
          periodMin: item.periodMin ?? item.period_min,
          periodMax: item.periodMax ?? item.period_max,
          totalSum: item.totalSum ?? item.total_sum,
        }))
        .filter((item) => item.tariffCode > 0);

      setTariffs(normalizedTariffs);
      setSelectedTariffCode(null);
      setTariffCode(null);
      setTariffName("");
      setDeliveryCost(null);

      if (normalizedTariffs.length === 0) {
        toast.error("Р”РѕСЃС‚СѓРїРЅС‹Рµ С‚Р°СЂРёС„С‹ РЅРµ РЅР°Р№РґРµРЅС‹");
        return;
      }
      toast.success("РўР°СЂРёС„С‹ РїРѕР»СѓС‡РµРЅС‹");
    } catch (error) {
      console.error("РћС€РёР±РєР° РїРѕР»СѓС‡РµРЅРёСЏ С‚Р°СЂРёС„РѕРІ CDEK:", error);
      toast.error(getApiErrorMessage(error, "РќРµ СѓРґР°Р»РѕСЃСЊ РїРѕР»СѓС‡РёС‚СЊ С‚Р°СЂРёС„С‹ CDEK"));
    } finally {
      setIsLoadingTariffs(false);
    }
  };

  return (
    <>
      <Button className={styles.dealButton} type="button" onClick={handleOpenSecureDeal}>
        Р‘РµР·РѕРїР°СЃРЅР°СЏ СЃРґРµР»РєР°
      </Button>

      <AuthDialog onOpenChange={setIsAuthOpen} open={isAuthOpen} />

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) resetState();
        }}
      >
        <DialogContent className={styles.dialogContent}>
          <DialogHeader>
            <DialogTitle>РћС„РѕСЂРјР»РµРЅРёРµ Р±РµР·РѕРїР°СЃРЅРѕР№ СЃРґРµР»РєРё</DialogTitle>
            <DialogDescription>
              Р’С‹Р±РµСЂРё РіРѕСЂРѕРґ Рё РџР’Р— РїРѕР»СѓС‡Р°С‚РµР»СЏ, Р·Р°С‚РµРј СѓРєР°Р¶Рё РїР°СЂР°РјРµС‚СЂС‹ РїРѕСЃС‹Р»РєРё.
            </DialogDescription>
          </DialogHeader>

          <div className={styles.form}>
            <div className={styles.block}>
              <Typography variant="h2">Р“РѕСЂРѕРґ РїРѕР»СѓС‡Р°С‚РµР»СЏ</Typography>
              <div ref={citySearchRef} className={styles.searchSection}>
                <div className={styles.inputWrapper}>
                  <Input
                    value={toCityQuery}
                    onChange={(event) => handleCityInputChange(event.target.value)}
                    placeholder="Р’РІРµРґРёС‚Рµ РЅР°Р·РІР°РЅРёРµ РіРѕСЂРѕРґР°"
                  />
                  {toCityQuery ? (
                    <button
                      aria-label="РћС‡РёСЃС‚РёС‚СЊ РіРѕСЂРѕРґ"
                      className={styles.clearButton}
                      type="button"
                      onClick={handleClearCity}
                    >
                      <X size={16} />
                    </button>
                  ) : null}
                </div>

                {showCitySuggestions && toCities.length > 0 ? (
                  <div className={styles.suggestions}>
                    {toCities.map((city) => (
                      <button
                        key={city.code}
                        className={styles.suggestionItem}
                        type="button"
                        onClick={() => handleSelectCity(city.code)}
                      >
                        <MapPin className={styles.suggestionIcon} size={16} />
                        <span>
                          {city.city ?? "Р“РѕСЂРѕРґ Р±РµР· РЅР°Р·РІР°РЅРёСЏ"} ({city.code})
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}

                {isLoadingCities ? (
                  <Typography className={styles.metaText}>РС‰РµРј РіРѕСЂРѕРґР°...</Typography>
                ) : null}
              </div>

              <select
                className={styles.select}
                disabled={isLoadingPvz || !toCityCode || isDoorDelivery}
                value={toPvzCode}
                onChange={(event) => setToPvzCode(event.target.value)}
              >
                <option value="">Р’С‹Р±РµСЂРё РџР’Р— РїРѕР»СѓС‡Р°С‚РµР»СЏ</option>
                {toPvzList.map((pvz) => (
                  <option key={pvz.code} value={pvz.code}>
                    {pvz.name ?? "РџР’Р—"} - {pvz.location?.address ?? "Р‘РµР· Р°РґСЂРµСЃР°"}
                  </option>
                ))}
              </select>

              {isDoorDelivery ? (
                <Input
                  value={toAddress}
                  onChange={(event) => setToAddress(event.target.value)}
                  placeholder="Адрес получателя (для доставки до двери)"
                />
              ) : null}
            </div>

            <div className={styles.block}>
              <Typography variant="h2">РџР°СЂР°РјРµС‚СЂС‹ РїРѕСЃС‹Р»РєРё Рё С‚Р°СЂРёС„</Typography>
              <Typography className={styles.metaText}>
                РЎРЅР°С‡Р°Р»Р° РїРѕР»СѓС‡Рё СЃРїРёСЃРѕРє С‚Р°СЂРёС„РѕРІ, Р·Р°С‚РµРј РІС‹Р±РµСЂРё РѕРґРёРЅ Рё СЂР°СЃСЃС‡РёС‚Р°Р№ РґРѕСЃС‚Р°РІРєСѓ.
              </Typography>
              <div className={styles.modeSwitch}>
                <button
                  className={`${styles.modeButton} ${parcelMode === "approximate" ? styles.modeButtonActive : ""}`}
                  type="button"
                  onClick={() => {
                    setParcelMode("approximate");
                    setTariffs([]);
                    setSelectedTariffCode(null);
                    setTariffCode(null);
                    setTariffName("");
                    setDeliveryCost(null);
                  }}
                >
                  РџСЂРёРјРµСЂРЅРѕ
                </button>
                <button
                  className={`${styles.modeButton} ${parcelMode === "exact" ? styles.modeButtonActive : ""}`}
                  type="button"
                  onClick={() => {
                    setParcelMode("exact");
                    setTariffs([]);
                    setSelectedTariffCode(null);
                    setTariffCode(null);
                    setTariffName("");
                    setDeliveryCost(null);
                  }}
                >
                  РўРѕС‡РЅС‹Рµ
                </button>
              </div>

              {parcelMode === "approximate" ? (
                <div className={styles.presetsList}>
                  {PARCEL_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      className={`${styles.presetCard} ${selectedPresetId === preset.id ? styles.presetCardActive : ""}`}
                      type="button"
                      onClick={() => applyPreset(preset)}
                    >
                      <div className={styles.presetIcon}>рџ“¦</div>
                      <div className={styles.presetContent}>
                        <Typography className={styles.presetTitle}>{preset.name}</Typography>
                        <Typography className={styles.presetMeta}>
                          {preset.dimensions}, {preset.weightText}
                        </Typography>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className={styles.grid}>
                  <label className={styles.inputGroup}>
                    <span className={styles.inputLabel}>Р’РµСЃ, Рі</span>
                    <Input
                      min={1}
                      type="number"
                      value={weight}
                      onChange={(event) => {
                        setSelectedPresetId(null);
                        setWeight(event.target.value);
                        setTariffs([]);
                        setSelectedTariffCode(null);
                        setTariffCode(null);
                        setTariffName("");
                        setDeliveryCost(null);
                      }}
                      placeholder="Р’РІРµРґРёС‚Рµ Р·РЅР°С‡РµРЅРёРµ"
                    />
                  </label>
                  <label className={styles.inputGroup}>
                    <span className={styles.inputLabel}>Р”Р»РёРЅР°, СЃРј</span>
                    <Input
                      min={1}
                      type="number"
                      value={length}
                      onChange={(event) => {
                        setSelectedPresetId(null);
                        setLength(event.target.value);
                        setTariffs([]);
                        setSelectedTariffCode(null);
                        setTariffCode(null);
                        setTariffName("");
                        setDeliveryCost(null);
                      }}
                      placeholder="Р’РІРµРґРёС‚Рµ Р·РЅР°С‡РµРЅРёРµ"
                    />
                  </label>
                  <label className={styles.inputGroup}>
                    <span className={styles.inputLabel}>РЁРёСЂРёРЅР°, СЃРј</span>
                    <Input
                      min={1}
                      type="number"
                      value={width}
                      onChange={(event) => {
                        setSelectedPresetId(null);
                        setWidth(event.target.value);
                        setTariffs([]);
                        setSelectedTariffCode(null);
                        setTariffCode(null);
                        setTariffName("");
                        setDeliveryCost(null);
                      }}
                      placeholder="Р’РІРµРґРёС‚Рµ Р·РЅР°С‡РµРЅРёРµ"
                    />
                  </label>
                  <label className={styles.inputGroup}>
                    <span className={styles.inputLabel}>Р’С‹СЃРѕС‚Р°, СЃРј</span>
                    <Input
                      min={1}
                      type="number"
                      value={height}
                      onChange={(event) => {
                        setSelectedPresetId(null);
                        setHeight(event.target.value);
                        setTariffs([]);
                        setSelectedTariffCode(null);
                        setTariffCode(null);
                        setTariffName("");
                        setDeliveryCost(null);
                      }}
                      placeholder="Р’РІРµРґРёС‚Рµ Р·РЅР°С‡РµРЅРёРµ"
                    />
                  </label>
                </div>
              )}

              <Button
                disabled={isLoadingTariffs}
                type="button"
                variant="success"
                onClick={handleLoadTariffs}
              >
                {isLoadingTariffs ? "РџРѕР»СѓС‡Р°РµРј С‚Р°СЂРёС„С‹..." : "РџРѕР»СѓС‡РёС‚СЊ С‚Р°СЂРёС„С‹"}
              </Button>

              <select
                className={styles.select}
                disabled={tariffs.length === 0}
                value={selectedTariffCode ?? ""}
                onChange={(event) => {
                  const nextCode = Number(event.target.value);
                  const selectedTariff = tariffs.find((item) => item.tariffCode === nextCode);
                  setSelectedTariffCode(nextCode || null);
                  setTariffCode(nextCode || null);
                  setTariffName(selectedTariff?.tariffName ?? "");
                  setDeliveryCost(null);
                }}
              >
                <option value="">Р’С‹Р±РµСЂРё С‚Р°СЂРёС„</option>
                {tariffs.map((item) => (
                  <option key={item.tariffCode} value={item.tariffCode}>
                    {item.tariffName} (РєРѕРґ {item.tariffCode})
                    {item.totalSum ? ` - ${item.totalSum} в‚Ѕ` : ""}
                    {item.periodMin || item.periodMax
                      ? `, ${item.periodMin ?? "?"}-${item.periodMax ?? "?"} РґРЅ.`
                      : ""}
                  </option>
                ))}
              </select>

              <Button disabled={isCalculating} type="button" onClick={handleCalculate}>
                {isCalculating ? "РЎС‡РёС‚Р°РµРј..." : "Р Р°СЃСЃС‡РёС‚Р°С‚СЊ РґРѕСЃС‚Р°РІРєСѓ"}
              </Button>
            </div>

            <div className={styles.summary}>
              <Typography>РўРѕРІР°СЂ: {toCurrency(product.price)}</Typography>
              <Typography>
                Р“РѕСЂРѕРґ РѕС‚РїСЂР°РІРёС‚РµР»СЏ: {fromCityName || "РЅРµ РѕРїСЂРµРґРµР»РµРЅ"} ({fromCityCode ?? "вЂ”"})
              </Typography>
              <Typography>Р“РѕСЂРѕРґ РїРѕР»СѓС‡Р°С‚РµР»СЏ (РєРѕРґ CDEK): {toCityCode ?? "РЅРµ РІС‹Р±СЂР°РЅ"}</Typography>
              <Typography>
                Р”РѕСЃС‚Р°РІРєР°: {deliveryCost === null ? "РЅРµ СЂР°СЃСЃС‡РёС‚Р°РЅР°" : toCurrency(deliveryCost)}
              </Typography>
              <Typography>
                РўР°СЂРёС„: {tariffName || "РЅРµ РІС‹Р±СЂР°РЅ"} (РєРѕРґ {tariffCode ?? "вЂ”"})
              </Typography>
              <Typography variant="h2">РС‚РѕРіРѕ: {toCurrency(totalPrice)}</Typography>
            </div>
          </div>

          <DialogFooter className={styles.footer}>
            <Button
              disabled={isCreating}
              type="button"
              variant="success"
              onClick={() => setOpen(false)}
            >
              РћС‚РјРµРЅР°
            </Button>
            <Button disabled={isCreating} type="button" onClick={handleCreateDeal}>
              {isCreating ? "РЎРѕР·РґР°РµРј..." : "РЎРѕР·РґР°С‚СЊ СЃРґРµР»РєСѓ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};



