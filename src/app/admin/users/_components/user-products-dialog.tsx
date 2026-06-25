"use client";

import type { AdminUserProduct } from "@/lib/api/requests/product/get-admin-user-products";
import type { User } from "@/types";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Typography,
} from "@/components/ui";
import { getAdminUserProducts } from "@/lib/api/requests/product/get-admin-user-products";
import { toCurrency } from "@/lib/format";

type ProductTab = "all" | "active" | "moderation" | "drafts" | "hidden" | "denied";

const TAB_LABELS: Record<ProductTab, string> = {
  all: "Все",
  active: "Активные",
  moderation: "Модерация",
  drafts: "Черновики",
  hidden: "Скрытые",
  denied: "Отклонённые",
};

function matchTab(product: AdminUserProduct, tab: ProductTab): boolean {
  const state = product.moderateState;
  if (tab === "all") return true;
  if (tab === "drafts") return state === "DRAFT";
  if (tab === "moderation") return state === "MODERATE" || state === "AI_REVIEWED";
  if (tab === "denied") return state === "DENIDED" || state === "DENIED";
  if (tab === "hidden") return state === "APPROVED" && Boolean(product.isHide);
  if (tab === "active") return state === "APPROVED" && !product.isHide;
  return false;
}

interface UserProductsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProductsDialog({ user, open, onOpenChange }: UserProductsDialogProps) {
  const [tab, setTab] = useState<ProductTab>("all");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-user-products", user?.id],
    queryFn: () => getAdminUserProducts(user!.id),
    enabled: open && user != null,
  });

  const filtered = useMemo(() => products.filter((p) => matchTab(p, tab)), [products, tab]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Объявления: {user?.fullName}</DialogTitle>
        </DialogHeader>

        {user?.adsLimit ? (
          <Typography className="text-sm text-gray-600">
            Бесплатных: {user.adsLimit.remaining}/{user.adsLimit.total} · платное: {user.adsLimit.costPerAd} ₽
          </Typography>
        ) : null}

        <div className="flex flex-wrap gap-2 border-b pb-2">
          {(Object.keys(TAB_LABELS) as ProductTab[]).map((key) => (
            <button
              key={key}
              type="button"
              className={`rounded px-3 py-1 text-sm ${tab === key ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              onClick={() => setTab(key)}
            >
              {TAB_LABELS[key]} ({products.filter((p) => matchTab(p, key)).length})
            </button>
          ))}
        </div>

        {isLoading ? (
          <Typography className="text-gray-500">Загрузка...</Typography>
        ) : filtered.length === 0 ? (
          <Typography className="text-gray-500">Нет объявлений в этой категории</Typography>
        ) : (
          <ul className="space-y-2">
            {filtered.map((product) => (
              <li key={product.id} className="rounded border p-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-gray-600">{toCurrency(product.price)} · ID {product.id}</div>
                    <div className="text-xs text-gray-500">
                      {product.statusLabel ?? product.moderateState ?? "—"}
                    </div>
                  </div>
                  <Link
                    className="text-blue-600 hover:underline"
                    href={`/product/${product.id}`}
                    target="_blank"
                  >
                    Открыть
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
