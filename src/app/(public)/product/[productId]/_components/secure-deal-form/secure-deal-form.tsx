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
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Typography,
} from "@/components/ui";
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

  const directCity = parts.find((part) => /^г\.\s*/i.test(part));
  if (directCity) return directCity.replace(/^г\.\s*/i, "").trim();

  const cityFromDistrict = parts.find((part) => /^городской округ\s+/i.test(part));
  if (cityFromDistrict) return cityFromDistrict.replace(/^городской округ\s+/i, "").trim();

  const blocked =
    /(\d|улиц|проспект|переул|проезд|шоссе|бульвар|плош|район|область|край|республика|федеральный|россия|индекс|корпус|строение|квартира|дом|новостройка)/i;
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
    name: "Конверт",
    dimensions: "34x27x2 см",
    weightText: "до 0.5 кг",
    length: 34,
    width: 27,
    height: 2,
    weight: 500,
  },
  {
    id: "box-xs",
    name: "Короб XS",
    dimensions: "17x12x9 см",
    weightText: "до 0.5 кг",
    length: 17,
    width: 12,
    height: 9,
    weight: 500,
  },
  {
    id: "box-s",
    name: "Короб S",
    dimensions: "23x19x10 см",
    weightText: "до 2 кг",
    length: 23,
    width: 19,
    height: 10,
    weight: 2000,
  },
  {
    id: "box-m",
    name: "Короб M",
    dimensions: "33x25x15 см",
    weightText: "до 5 кг",
    length: 33,
    width: 25,
    height: 15,
    weight: 5000,
  },
  {
    id: "box-l",
    name: "Короб L",
    dimensions: "31x25x38 см",
    weightText: "до 12 кг",
    length: 31,
    width: 25,
    height: 38,
    weight: 12000,
  },
  {
    id: "box-xl",
    name: "Короб XL",
    dimensions: "60x35x30 см",
    weightText: "до 18 кг",
    length: 60,
    width: 35,
    height: 30,
    weight: 18000,
  },
  {
    id: "suitcase",
    name: "Чемодан",
    dimensions: "55x35x77 см",
    weightText: "до 30 кг",
    length: 55,
    width: 35,
    height: 77,
    weight: 30000,
  },
  {
    id: "pallet",
    name: "Паллета",
    dimensions: "120x120x80 см",
    weightText: "до 200 кг",
    length: 120,
    width: 120,
    height: 80,
    weight: 200000,
  },
];

function getApiErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: { message?: string } }).data;
    if (typeof data?.message === "string" && data.message.trim()) return data.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: string }).message;
    if (typeof message === "string" && message.trim()) return message;
  }

  return fallback;
}

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

  const resetState = () => {
    setToCityQuery("");
    setToCities([]);
    setToCityCode(null);
    setShowCitySuggestions(false);
    setToPvzList([]);
    setToPvzCode("");
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
      console.error("Ошибка поиска городов CDEK:", error);
      toast.error(getApiErrorMessage(error, "Не удалось получить список городов CDEK"));
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
      console.error("Ошибка определения города отправителя:", error);
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

      setTariffs([]);
      setSelectedTariffCode(null);
      setTariffCode(null);
      setTariffName("");
      setDeliveryCost(null);
    } catch (error) {
      console.error("Ошибка получения ПВЗ CDEK:", error);
      toast.error(getApiErrorMessage(error, "Не удалось получить ПВЗ CDEK"));
    } finally {
      setIsLoadingPvz(false);
    }
  };

  const handleCalculate = async () => {
    if (!fromCityCode) {
      toast.error("Не удалось определить город отправителя из адреса товара");
      return;
    }

    if (!toCityCode) {
      toast.error("Выбери город получателя");
      return;
    }

    if (!selectedTariffCode) {
      toast.error("Сначала выбери тариф");
      return;
    }

    const parsedWeight = Number(weight);
    const parsedLength = Number(length);
    const parsedWidth = Number(width);
    const parsedHeight = Number(height);

    if (!weight || !length || !width || !height) {
      toast.error("Укажи корректные параметры посылки");
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
      toast.error("Укажи корректные параметры посылки");
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
      toast.success("Доставка рассчитана");
    } catch (error) {
      console.error("Ошибка расчета доставки:", error);
      toast.error(getApiErrorMessage(error, "Не удалось рассчитать доставку"));
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCreateDeal = async () => {
    if (!fromCityCode) {
      toast.error("Не удалось определить город отправителя из адреса товара");
      return;
    }

    if (!toCityCode) {
      toast.error("Заполни город получения");
      return;
    }

    if (!toPvzCode) {
      toast.error("Выбери ПВЗ получателя");
      return;
    }

    if (deliveryCost === null) {
      toast.error("Сначала рассчитай доставку");
      return;
    }

    if (!selectedTariffCode) {
      toast.error("Сначала выбери тариф");
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
        cdekToPvzCode: toPvzCode || undefined,
      });

      toast.success(`Сделка #${deal.id} создана`);
      queryClient.invalidateQueries({ queryKey: MY_RESERVATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCT_RESERVATION_QUERY_KEY(product.id) });
      queryClient.invalidateQueries({ queryKey: CHATS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["chat"] });
      setOpen(false);
      resetState();
    } catch (error) {
      console.error("Ошибка создания сделки:", error);
      toast.error(getApiErrorMessage(error, "Не удалось создать сделку"));
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

    // При ручном изменении текста сбрасываем ранее выбранный город и ПВЗ.
    setToCityCode(null);
    setToPvzList([]);
    setToPvzCode("");
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
    setTariffs([]);
    setSelectedTariffCode(null);
    setTariffCode(null);
    setTariffName("");
    setDeliveryCost(null);
  };

  const handleLoadTariffs = async () => {
    if (!fromCityCode) {
      toast.error("Не удалось определить город отправителя из адреса товара");
      return;
    }
    if (!toCityCode) {
      toast.error("Выбери город получателя");
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
      toast.error("Укажи корректные параметры посылки");
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
          tariffName: item.tariffName ?? item.tariff_name ?? "Тариф",
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
        toast.error("Доступные тарифы не найдены");
        return;
      }
      toast.success("Тарифы получены");
    } catch (error) {
      console.error("Ошибка получения тарифов CDEK:", error);
      toast.error(getApiErrorMessage(error, "Не удалось получить тарифы CDEK"));
    } finally {
      setIsLoadingTariffs(false);
    }
  };

  return (
    <>
      <Button className={styles.dealButton} type="button" onClick={handleOpenSecureDeal}>
        Безопасная сделка
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
            <DialogTitle>Оформление безопасной сделки</DialogTitle>
            <DialogDescription>
              Выбери город и ПВЗ получателя, затем укажи параметры посылки.
            </DialogDescription>
          </DialogHeader>

          <div className={styles.form}>
            <div className={styles.block}>
              <Typography variant="h2">Город получателя</Typography>
              <div ref={citySearchRef} className={styles.searchSection}>
                <div className={styles.inputWrapper}>
                  <Input
                    value={toCityQuery}
                    onChange={(event) => handleCityInputChange(event.target.value)}
                    placeholder="Введите название города"
                  />
                  {toCityQuery ? (
                    <button
                      aria-label="Очистить город"
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
                          {city.city ?? "Город без названия"} ({city.code})
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}

                {isLoadingCities ? (
                  <Typography className={styles.metaText}>Ищем города...</Typography>
                ) : null}
              </div>

              <select
                className={styles.select}
                disabled={isLoadingPvz || !toCityCode}
                value={toPvzCode}
                onChange={(event) => setToPvzCode(event.target.value)}
              >
                <option value="">Выбери ПВЗ получателя</option>
                {toPvzList.map((pvz) => (
                  <option key={pvz.code} value={pvz.code}>
                    {pvz.name ?? "ПВЗ"} - {pvz.location?.address ?? "Без адреса"}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.block}>
              <Typography variant="h2">Параметры посылки и тариф</Typography>
              <Typography className={styles.metaText}>
                Сначала получи список тарифов, затем выбери один и рассчитай доставку.
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
                  Примерно
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
                  Точные
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
                      <div className={styles.presetIcon}>📦</div>
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
                    <span className={styles.inputLabel}>Вес, г</span>
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
                      placeholder="Введите значение"
                    />
                  </label>
                  <label className={styles.inputGroup}>
                    <span className={styles.inputLabel}>Длина, см</span>
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
                      placeholder="Введите значение"
                    />
                  </label>
                  <label className={styles.inputGroup}>
                    <span className={styles.inputLabel}>Ширина, см</span>
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
                      placeholder="Введите значение"
                    />
                  </label>
                  <label className={styles.inputGroup}>
                    <span className={styles.inputLabel}>Высота, см</span>
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
                      placeholder="Введите значение"
                    />
                  </label>
                </div>
              )}

              <Button
                disabled={isLoadingTariffs}
                type="button"
                variant="secondary"
                onClick={handleLoadTariffs}
              >
                {isLoadingTariffs ? "Получаем тарифы..." : "Получить тарифы"}
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
                <option value="">Выбери тариф</option>
                {tariffs.map((item) => (
                  <option key={item.tariffCode} value={item.tariffCode}>
                    {item.tariffName} (код {item.tariffCode})
                    {item.totalSum ? ` - ${item.totalSum} ₽` : ""}
                    {item.periodMin || item.periodMax
                      ? `, ${item.periodMin ?? "?"}-${item.periodMax ?? "?"} дн.`
                      : ""}
                  </option>
                ))}
              </select>

              <Button disabled={isCalculating} type="button" onClick={handleCalculate}>
                {isCalculating ? "Считаем..." : "Рассчитать доставку"}
              </Button>
            </div>

            <div className={styles.summary}>
              <Typography>Товар: {toCurrency(product.price)}</Typography>
              <Typography>
                Город отправителя: {fromCityName || "не определен"} ({fromCityCode ?? "—"})
              </Typography>
              <Typography>Город получателя (код CDEK): {toCityCode ?? "не выбран"}</Typography>
              <Typography>
                Доставка: {deliveryCost === null ? "не рассчитана" : toCurrency(deliveryCost)}
              </Typography>
              <Typography>
                Тариф: {tariffName || "не выбран"} (код {tariffCode ?? "—"})
              </Typography>
              <Typography variant="h2">Итого: {toCurrency(totalPrice)}</Typography>
            </div>
          </div>

          <DialogFooter className={styles.footer}>
            <Button
              disabled={isCreating}
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Отмена
            </Button>
            <Button disabled={isCreating} type="button" onClick={handleCreateDeal}>
              {isCreating ? "Создаем..." : "Создать сделку"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
