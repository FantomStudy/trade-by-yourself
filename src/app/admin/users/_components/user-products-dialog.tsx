"use client";

import type { AdminUserProduct } from "@/lib/api/requests/product/get-admin-user-products";
import type { User } from "@/types";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Typography,
} from "@/components/ui";
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
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-user-products", user?.id],
    queryFn: () => getAdminUserProducts(user!.id),
    enabled: open && user != null,
  });

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
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="rounded-md border p-2 bg-gray-50 text-center">
            <span className="text-gray-500 block">Всего объявлений</span>
            <strong className="text-sm text-gray-900">{stats.total}</strong>
          </div>
          <div className="rounded-md border p-2 bg-emerald-50 border-emerald-100 text-center">
            <span className="text-emerald-700 block">Активных</span>
            <strong className="text-sm text-emerald-900">{stats.active}</strong>
          </div>
          <div className="rounded-md border p-2 bg-amber-50 border-amber-100 text-center">
            <span className="text-amber-700 block">Платные / Бесплатные</span>
            <strong className="text-sm text-amber-900">
              Платные: {stats.paid} · Бесплатные: {stats.free}
            </strong>
          </div>
          <div className="rounded-md border p-2 bg-indigo-50 border-indigo-100 text-center">
            <span className="text-indigo-700 block">Модерация / Неактивные</span>
            <strong className="text-sm text-indigo-900">
              Модерация: {stats.moderation} · Неактивные: {stats.drafts + stats.hidden + stats.denied}
            </strong>
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
              return (
                <li key={product.id} className="rounded-lg border bg-white p-3 shadow-sm hover:border-blue-200">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{product.name}</span>
                        {isPaid ? (
                          <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
                            Платное ({product.promotionName || "Продвинутое"})
                          </span>
                        ) : (
                          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                            Бесплатное
                          </span>
                        )}
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
                    <Link
                      className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors"
                      href={`/product/${product.id}`}
                      target="_blank"
                    >
                      Открыть карточку
                    </Link>
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
