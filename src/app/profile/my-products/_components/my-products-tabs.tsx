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
    router.replace(myProductsTabHref(next) as "/profile/my-products", { scroll: false });
  };

  const current = lists[tab];

  return (
    <div className="flex w-full flex-col gap-4">
      <div
        className="flex flex-wrap gap-2 border-b border-gray-200"
        role="tablist"
        aria-label="Мои объявления"
      >
        {(Object.keys(TAB_LABELS) as MyProductsTab[]).map((key) => (
          <button
            key={key}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === key
                ? "border-b-2 border-blue-600 text-blue-600"
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
      ) : tab === "drafts" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {current.map((product) => (
            <DraftProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {current.map((product) => (
            <MyProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
