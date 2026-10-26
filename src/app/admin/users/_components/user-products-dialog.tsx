"use client";

import type { AdminUserProduct } from "@/lib/api/requests/product/get-admin-user-products";
import type { User } from "@/types";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { ExternalLink, Loader2, Power, PowerOff, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
} from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { deleteProduct, toggleProduct } from "@/lib/api/requests/product";
import { getAdminUserProducts } from "@/lib/api/requests/product/get-admin-user-products";
import { toCurrency } from "@/lib/format";

type StatusFilter = "all" | "active" | "inactive" | "moderation" | "drafts" | "hidden" | "denied";
type PaymentFilter = "all" | "paid" | "free";
type SortOption = "newest" | "oldest" | "price_high" | "price_low";

const STATUS_LABELS: Record<StatusFilter, string> = {
  all: "Все статусы",
  active: "Активные",
  inactive: "Неактивные",
  moderation: "На модерации",
  drafts: "Черновики",
  hidden: "Скрытые",
  denied: "Отклонённые",
};

const PAYMENT_LABELS: Record<PaymentFilter, string> = {
  all: "Все (платные и бесплатные)",
  paid: "Платные",
  free: "Бесплатные",
};

function isPaidProduct(product: AdminUserProduct): boolean {
  return Boolean(product.hasPromotion || (product.promotionLevel ?? 0) > 0 || (product as any).isPaid);
}

function matchStatus(product: AdminUserProduct, status: StatusFilter): boolean {
  const state = product.moderateState;
  const isHidden = Boolean(product.isHide);

  if (status === "all") return true;
  if (status === "active") return state === "APPROVED" && !isHidden;
  if (status === "inactive") return state !== "APPROVED" || isHidden;
  if (status === "moderation") return state === "MODERATE" || state === "AI_REVIEWED";
  if (status === "drafts") return state === "DRAFT";
  if (status === "hidden") return state === "APPROVED" && isHidden;
  if (status === "denied") return state === "DENIDED" || state === "DENIED";
  return true;
}

function matchPayment(product: AdminUserProduct, payment: PaymentFilter): boolean {
  const isPaid = isPaidProduct(product);
  if (payment === "all") return true;
  if (payment === "paid") return isPaid;
  if (payment === "free") return !isPaid;
  return true;
}

interface UserProductsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProductsDialog({ user, open, onOpenChange }: UserProductsDialogProps) {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-user-products", user?.id],
    queryFn: () => getAdminUserProducts(user!.id),
    enabled: open && user != null,
  });

  const handleToggleProduct = async (product: AdminUserProduct) => {
    try {
      setProcessingId(product.id);
      const res = await toggleProduct(product.id);
      toast.success(
        res?.message || (product.isHide ? "Объявление возвращено в продажу" : "Объявление снято с продажи")
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-user-products", user?.id] }),
        queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
      ]);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Не удалось изменить статус объявления"));
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteProduct = async (product: AdminUserProduct) => {
    const confirmed = window.confirm(
      `Вы действительно хотите удалить объявление «${product.name}» (ID: ${product.id}) пользователя ${user?.fullName || user?.id}?\n\nДействие необратимо. Товар и связанные фото будут удалены.`
    );
    if (!confirmed) return;

    try {
      setProcessingId(product.id);
      await deleteProduct(product.id);
      toast.success(`Объявление «${product.name}» успешно удалено`);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-user-products", user?.id] }),
        queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
      ]);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Не удалось удалить объявление"));
    } finally {
      setProcessingId(null);
    }
  };

  const stats = useMemo(() => {
    const active = products.filter((p) => matchStatus(p, "active")).length;
    const moderation = products.filter((p) => matchStatus(p, "moderation")).length;
    const drafts = products.filter((p) => matchStatus(p, "drafts")).length;
    const hidden = products.filter((p) => matchStatus(p, "hidden")).length;
    const denied = products.filter((p) => matchStatus(p, "denied")).length;
    const paid = products.filter((p) => isPaidProduct(p)).length;
    const free = products.length - paid;

    return { total: products.length, active, moderation, drafts, hidden, denied, paid, free };
  }, [products]);

  const filteredAndSorted = useMemo(() => {
    let result = products.filter((p) => {
      if (!matchStatus(p, statusFilter)) return false;
      if (!matchPayment(p, paymentFilter)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = p.name?.toLowerCase().includes(q);
        const idMatch = p.id?.toString().includes(q);
        if (!nameMatch && !idMatch) return false;
      }
      return true;
    });

    result = [...result].sort((a, b) => {
      if (sortOption === "price_high") return b.price - a.price;
      if (sortOption === "price_low") return a.price - b.price;
      if (sortOption === "oldest") return a.id - b.id;
      return b.id - a.id;
    });

    return result;
  }, [products, statusFilter, paymentFilter, sortOption, searchQuery]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto"
        style={{ "--dialog-max-width": "1100px" } as CSSProperties}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Объявления пользователя: {user?.fullName || `ID ${user?.id}`}
          </DialogTitle>
        </DialogHeader>

        {user?.adsLimit ? (
          <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-900 flex flex-wrap justify-between gap-2 border border-blue-100">
            <span>
              <strong>Лимит бесплатных:</strong> {user.adsLimit.remaining}/{user.adsLimit.total} остаток на месяц
            </span>
            <span>
              <strong>Стоимость платныx:</strong> {user.adsLimit.costPerAd} ₽/объявление
            </span>
          </div>
        ) : null}

        {/* Сводная статистика */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs">
          <div className="rounded-md border p-2 bg-gray-50 text-center">
            <span className="text-gray-500 block text-[11px]">Всего</span>
            <strong className="text-lg leading-tight text-gray-900">{stats.total}</strong>
          </div>
          <div className="rounded-md border p-2 bg-emerald-50 border-emerald-100 text-center">
            <span className="text-emerald-700 block text-[11px]">Активных</span>
            <strong className="text-lg leading-tight text-emerald-900">{stats.active}</strong>
          </div>
          <div className="rounded-md border p-2 bg-amber-50 border-amber-100 text-center">
            <span className="text-amber-700 block text-[11px]">Платных</span>
            <strong className="text-lg leading-tight text-amber-900">{stats.paid}</strong>
          </div>
          <div className="rounded-md border p-2 bg-sky-50 border-sky-100 text-center">
            <span className="text-sky-700 block text-[11px]">Бесплатных</span>
            <strong className="text-lg leading-tight text-sky-900">{stats.free}</strong>
          </div>
          <div className="rounded-md border p-2 bg-indigo-50 border-indigo-100 text-center">
            <span className="text-indigo-700 block text-[11px]">Модерация</span>
            <strong className="text-lg leading-tight text-indigo-900">{stats.moderation}</strong>
          </div>
        </div>

        {/* Фильтры и сортировка */}
        <div className="space-y-3 rounded-lg border bg-gray-50/50 p-3 text-xs">
          <div className="grid gap-2 sm:grid-cols-3">
            {/* Статус */}
            <div>
              <label className="mb-1 block font-medium text-gray-700">Статус объявления</label>
              <select
                className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              >
                {(Object.keys(STATUS_LABELS) as StatusFilter[]).map((key) => (
                  <option key={key} value={key}>
                    {STATUS_LABELS[key]}
                  </option>
                ))}
              </select>
            </div>

            {/* Платные / Бесплатные */}
            <div>
              <label className="mb-1 block font-medium text-gray-700">Тип размещения</label>
              <select
                className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value as PaymentFilter)}
              >
                {(Object.keys(PAYMENT_LABELS) as PaymentFilter[]).map((key) => (
                  <option key={key} value={key}>
                    {PAYMENT_LABELS[key]}
                  </option>
                ))}
              </select>
            </div>

            {/* Сортировка */}
            <div>
              <label className="mb-1 block font-medium text-gray-700">Сортировка</label>
              <select
                className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
              >
                <option value="newest">Сначала новые (ID desc)</option>
                <option value="oldest">Сначала старые (ID asc)</option>
                <option value="price_high">Сначала дорогие</option>
                <option value="price_low">Сначала дешевые</option>
              </select>
            </div>
          </div>

          {/* Поиск */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
            <Input
              className="h-8 pl-8 text-xs"
              placeholder="Поиск по названию или ID товара..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Список товаров */}
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Загрузка объявлений...</div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
            Нет объявлений, соответствующих выбранным фильтрам
          </div>
        ) : (
          <ul className="space-y-2">
            {filteredAndSorted.map((product) => {
              const isPaid = isPaidProduct(product);
              const isHidden = Boolean(product.isHide);
              const isBusy = processingId === product.id;

              return (
                <li
                  key={product.id}
                  className={clsx(
                    "rounded-lg border p-3 shadow-sm transition-all",
                    isHidden ? "bg-gray-50/80 border-gray-200 opacity-90" : "bg-white border-gray-200 hover:border-blue-200"
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-gray-900 break-words">{product.name}</span>
                        {isPaid ? (
                          <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200 shrink-0">
                            Платное ({product.promotionName || "Продвинутое"})
                          </span>
                        ) : (
                          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 shrink-0">
                            Бесплатное
                          </span>
                        )}
                        {isHidden ? (
                          <span className="rounded bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700 border border-rose-200 shrink-0">
                            Снято с продажи
                          </span>
                        ) : product.moderateState === "APPROVED" ? (
                          <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200 shrink-0">
                            Активно
                          </span>
                        ) : null}
                      </div>

                      <div className="text-xs text-gray-600">
                        {toCurrency(product.price)} · ID: {product.id}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span>
                          Статус:{" "}
                          <strong className="text-gray-800 font-semibold">
                            {product.statusLabel ?? product.moderateState ?? "—"}
                          </strong>
                        </span>
                        {product.createdAt && <span>Публикация: {product.createdAt}</span>}
                        {product.expiresAt && (
                          <span className={product.isExpired ? "text-red-600 font-semibold" : "text-emerald-700"}>
                            {product.isExpired
                              ? "Срок истёк"
                              : product.daysUntilExpiration !== undefined
                              ? `Истекает через ${product.daysUntilExpiration} дн.`
                              : ""}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                      {/* Кнопка Отключить / Включить */}
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleToggleProduct(product)}
                        className={clsx(
                          "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                          isHidden
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                        )}
                        title={isHidden ? "Вернуть объявление в продажу" : "Снять объявление с продажи (отключить)"}
                      >
                        {isBusy ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : isHidden ? (
                          <Power className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <PowerOff className="h-3.5 w-3.5 text-amber-600" />
                        )}
                        <span>{isHidden ? "Включить" : "Отключить"}</span>
                      </button>

                      {/* Кнопка Удалить */}
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleDeleteProduct(product)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-red-50 border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        title="Удалить объявление навсегда"
                      >
                        {isBusy ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        )}
                        <span>Удалить</span>
                      </button>

                      {/* Ссылка на просмотр */}
                      <Link
                        className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors"
                        href={`/product/${product.id}`}
                        target="_blank"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-blue-500" />
                        <span>Открыть</span>
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
