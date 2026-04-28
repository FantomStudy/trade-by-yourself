"use client";

import type { CdekCity, CdekPvz, ExtendedProduct } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  calculateCdekDelivery,
  createDeal,
  getCdekCities,
  getCdekDeliveryPoints,
} from "@/api/requests";
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
import { AuthDialog } from "@/components/auth-dialog";
import { useCurrentUser } from "@/lib/api/hooks/queries";
import { MY_RESERVATIONS_QUERY_KEY } from "@/lib/api/hooks/queries/useMyReservations";
import { PRODUCT_RESERVATION_QUERY_KEY } from "@/lib/api/hooks/queries/useProductReservation";
import { formatPrice } from "@/lib/format";

import styles from "./secure-deal-form.module.css";

const DEFAULT_CDEK_TARIFF_CODE = 136;

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
  const [isCalculating, setIsCalculating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [toCityQuery, setToCityQuery] = useState("");
  const [toCities, setToCities] = useState<CdekCity[]>([]);
  const [toCityCode, setToCityCode] = useState<number | null>(null);

  const [toPvzList, setToPvzList] = useState<CdekPvz[]>([]);
  const [toPvzCode, setToPvzCode] = useState("");

  const [tariffName, setTariffName] = useState("");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [deliveryCost, setDeliveryCost] = useState<number | null>(null);

  const totalPrice = useMemo(() => {
    const currentDelivery = deliveryCost ?? 0;
    return product.price + currentDelivery;
  }, [deliveryCost, product.price]);

  const resetState = () => {
    setToCityQuery("");
    setToCities([]);
    setToCityCode(null);
    setToPvzList([]);
    setToPvzCode("");
    setTariffName("");
    setWeight("");
    setLength("");
    setWidth("");
    setHeight("");
    setDeliveryCost(null);
  };

  const handleSearchCities = async () => {
    if (!toCityQuery.trim()) {
      toast.error("Введите город для поиска");
      return;
    }

    try {
      setIsLoadingCities(true);
      const cities = await getCdekCities(toCityQuery, 10);
      setToCities(cities);
    } catch (error) {
      console.error("Ошибка поиска городов CDEK:", error);
      toast.error(getApiErrorMessage(error, "Не удалось получить список городов CDEK"));
    } finally {
      setIsLoadingCities(false);
    }
  };

  const handleSelectCity = async (code: number) => {
    try {
      setIsLoadingPvz(true);
      const pvzList = await getCdekDeliveryPoints(code);
      setToCityCode(code);
      setToPvzList(pvzList);
      setToPvzCode("");

      setDeliveryCost(null);
    } catch (error) {
      console.error("Ошибка получения ПВЗ CDEK:", error);
      toast.error(getApiErrorMessage(error, "Не удалось получить ПВЗ CDEK"));
    } finally {
      setIsLoadingPvz(false);
    }
  };

  const handleCalculate = async () => {
    if (!toCityCode) {
      toast.error("Выбери город получателя");
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
      const fromCityCode = toCityCode;
      const result = await calculateCdekDelivery({
        tariffCode: DEFAULT_CDEK_TARIFF_CODE,
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
      toast.success("Доставка рассчитана");
    } catch (error) {
      console.error("Ошибка расчета доставки:", error);
      toast.error(getApiErrorMessage(error, "Не удалось рассчитать доставку"));
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCreateDeal = async () => {
    if (!toCityCode) {
      toast.error("Заполни город получения");
      return;
    }

    if (deliveryCost === null) {
      toast.error("Сначала рассчитай доставку");
      return;
    }

    try {
      setIsCreating(true);
      const fromCityCode = toCityCode;
      const deal = await createDeal({
        productId: product.id,
        deliveryCost,
        cdekTariffCode: DEFAULT_CDEK_TARIFF_CODE,
        cdekTariffName: tariffName || undefined,
        cdekFromCityCode: fromCityCode,
        cdekToCityCode: toCityCode,
        cdekToPvzCode: toPvzCode || undefined,
      });

      toast.success(`Сделка #${deal.id} создана`);
      queryClient.invalidateQueries({ queryKey: MY_RESERVATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCT_RESERVATION_QUERY_KEY(product.id) });
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
              <div className={styles.searchRow}>
                <Input
                  value={toCityQuery}
                  onChange={(event) => setToCityQuery(event.target.value)}
                  placeholder="Введите название города"
                />
                <Button
                  disabled={isLoadingCities}
                  type="button"
                  variant="secondary"
                  onClick={handleSearchCities}
                >
                  Найти
                </Button>
              </div>
              <select
                className={styles.select}
                value={toCityCode ?? ""}
                onChange={(event) => handleSelectCity(Number(event.target.value))}
              >
                <option value="">Выбери город получателя</option>
                {toCities.map((city) => (
                  <option key={city.code} value={city.code}>
                    {city.city ?? "Город без названия"} ({city.code})
                  </option>
                ))}
              </select>

              <select
                className={styles.select}
                disabled={isLoadingPvz || !toCityCode}
                value={toPvzCode}
                onChange={(event) => setToPvzCode(event.target.value)}
              >
                <option value="">ПВЗ получателя (опционально)</option>
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
                Тариф CDEK определяется автоматически по выбранному городу получателя.
              </Typography>
              <div className={styles.grid}>
                <label className={styles.inputGroup}>
                  <span className={styles.inputLabel}>Вес, г</span>
                  <Input
                    min={1}
                    type="number"
                    value={weight}
                    onChange={(event) => setWeight(event.target.value)}
                    placeholder="Введите значение"
                  />
                </label>
                <label className={styles.inputGroup}>
                  <span className={styles.inputLabel}>Длина, см</span>
                  <Input
                    min={1}
                    type="number"
                    value={length}
                    onChange={(event) => setLength(event.target.value)}
                    placeholder="Введите значение"
                  />
                </label>
                <label className={styles.inputGroup}>
                  <span className={styles.inputLabel}>Ширина, см</span>
                  <Input
                    min={1}
                    type="number"
                    value={width}
                    onChange={(event) => setWidth(event.target.value)}
                    placeholder="Введите значение"
                  />
                </label>
                <label className={styles.inputGroup}>
                  <span className={styles.inputLabel}>Высота, см</span>
                  <Input
                    min={1}
                    type="number"
                    value={height}
                    onChange={(event) => setHeight(event.target.value)}
                    placeholder="Введите значение"
                  />
                </label>
              </div>

              <Button disabled={isCalculating} type="button" onClick={handleCalculate}>
                {isCalculating ? "Считаем..." : "Рассчитать доставку"}
              </Button>
            </div>

            <div className={styles.summary}>
              <Typography>Товар: {formatPrice(product.price)}</Typography>
              <Typography>Код города CDEK: {toCityCode ?? "не выбран"}</Typography>
              <Typography>
                Доставка: {deliveryCost === null ? "не рассчитана" : formatPrice(deliveryCost)}
              </Typography>
              <Typography>Тариф: {tariffName}</Typography>
              <Typography variant="h2">Итого: {formatPrice(totalPrice)}</Typography>
            </div>
          </div>

          <DialogFooter className={styles.footer}>
            <Button disabled={isCreating} type="button" variant="secondary" onClick={() => setOpen(false)}>
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
