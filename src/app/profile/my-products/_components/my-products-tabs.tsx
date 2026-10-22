"use client";

import type { Product } from "@/types";

import { Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { DraftProductCard } from "./draft-product-card";
import { myProductsTabHref } from "./categorize-my-products";
import { MyProductCard } from "./product-card";

export type MyProductsTab = "active" | "moderation" | "hidden" | "denied" | "drafts";

interface MyProductsTabsProps {
  initialTab: MyProductsTab;
  active: Product[];
  moderation: Product[];
  hidden: Product[];
  denied: Product[];
  drafts: Product[];
}

const TAB_LABELS: Record<MyProductsTab, string> = {
  active: "Активные",
  moderation: "На модерации",
  hidden: "Скрытые",
  denied: "Отклонённые",
  drafts: "Черновики",
};

/** Вкладки по статусам объявления + синхронизация с ?tab= */
import { useToggleProductMutation } from "@/api/hooks";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export const MyProductsTabs = ({
  initialTab,
  active,
  moderation,
  hidden,
  denied,
  drafts,
}: MyProductsTabsProps) => {
  const router = useRouter();
  const [tab, setTab] = useState<MyProductsTab>(initialTab);
  const toggleProductMutation = useToggleProductMutation();
  const [isReactivatingAll, setIsReactivatingAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const counts: Record<MyProductsTab, number> = {
    active: active.length,
    moderation: moderation.length,
    hidden: hidden.length,
    denied: denied.length,
    drafts: drafts.length,
  };

  const lists: Record<MyProductsTab, Product[]> = {
    active,
    moderation,
    hidden,
    denied,
    drafts,
  };

  const go = (next: MyProductsTab) => {
    setTab(next);
    setSelectedIds([]);
    router.replace(myProductsTabHref(next) as "/profile/my-products", { scroll: false });
  };

  const [searchQuery, setSearchQuery] = useState("");
  const current = lists[tab];
  const filtered = current.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.address && p.address.toLowerCase().includes(q)) ||
      String(p.id).includes(q)
    );
  });

  const isAllSelected = filtered.length > 0 && filtered.every((p) => selectedIds.includes(p.id));

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((p) => p.id));
    }
  };

  const handleReactivateSelected = async () => {
    if (selectedIds.length === 0) return;
    if (
      !confirm(
        `Реактивировать и вернуть в продажу выбранные объявления (${selectedIds.length} шт.)?`,
      )
    ) {
      return;
    }
    setIsReactivatingAll(true);
    let successCount = 0;
    try {
      for (const id of selectedIds) {
        try {
          await toggleProductMutation.mutateAsync(id);
          successCount++;
        } catch (e) {
          console.warn("Failed to reactivate product", id, e);
        }
      }
      toast.success(`Успешно реактивировано: ${successCount} объявлений`);
      setSelectedIds([]);
      router.refresh();
    } catch {
      toast.error("Ошибка при реактивации выбранных объявлений");
    } finally {
      setIsReactivatingAll(false);
    }
  };

  const handleReactivateAll = async () => {
    if (!confirm(`Реактивировать и вернуть в продажу все объявления из этой вкладки (${filtered.length} шт.)?`)) {
      return;
    }
    setIsReactivatingAll(true);
    let successCount = 0;
    try {
      for (const item of filtered) {
        try {
          await toggleProductMutation.mutateAsync(item.id);
          successCount++;
        } catch (e) {
          console.warn("Failed to reactivate product", item.id, e);
        }
      }
      toast.success(`Успешно отправлено на реактивацию: ${successCount} объявлений`);
      setSelectedIds([]);
      router.refresh();
    } catch {
      toast.error("Ошибка при массовой реактивации");
    } finally {
      setIsReactivatingAll(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-2">
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Мои объявления"
        >
          {(Object.keys(TAB_LABELS) as MyProductsTab[]).map((key) => (
            <button
              key={key}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                tab === key
                  ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              role="tab"
              aria-selected={tab === key}
              type="button"
              onClick={() => go(key)}
            >
              {TAB_LABELS[key]}
              {counts[key] > 0 ? (
                <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                  {counts[key]}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {tab === "hidden" && filtered.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs h-8"
                onClick={handleSelectAll}
              >
                {isAllSelected ? "Снять выделение" : "Выбрать все"}
              </Button>

              {selectedIds.length > 0 ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-600 bg-green-50 text-green-700 hover:bg-green-100 text-xs h-8 font-semibold shadow-sm"
                  disabled={isReactivatingAll}
                  onClick={handleReactivateSelected}
                >
                  {isReactivatingAll
                    ? "Реактивация..."
                    : `⚡ Реактивировать выбранные (${selectedIds.length})`}
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-600 text-green-700 hover:bg-green-50 text-xs h-8"
                  disabled={isReactivatingAll}
                  onClick={handleReactivateAll}
                >
                  {isReactivatingAll ? "Реактивация..." : `⚡ Реактивировать все (${filtered.length})`}
                </Button>
              )}
            </div>
          )}

          {(current.length > 0 || searchQuery) && (
            <div className="relative min-w-[200px] max-w-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по объявлениям..."
                className="w-full rounded-md border border-gray-300 px-3 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {current.length === 0 ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-sm">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <Package className="h-10 w-10 text-green-500" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-800">
            Нет объявлений: «{TAB_LABELS[tab]}»
          </h3>
          {tab === "active" || tab === "drafts" ? (
            <Link
              href="/profile/create-product"
              className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
            >
              Создать объявление
            </Link>
          ) : (
            <p className="text-gray-600">Объявления с этим статусом появятся здесь</p>
          )}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg bg-white p-6 text-center shadow-sm">
          <p className="text-gray-600">По запросу «{searchQuery}» ничего не найдено</p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Сбросить поиск
          </button>
        </div>
      ) : tab === "drafts" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <DraftProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <MyProductCard
              key={product.id}
              product={product}
              selectable={tab === "hidden"}
              isSelected={selectedIds.includes(product.id)}
              onToggleSelect={() => handleToggleSelect(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
