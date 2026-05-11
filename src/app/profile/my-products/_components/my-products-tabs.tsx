"use client";

import type { Product } from "@/types";

import { Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { DraftProductCard } from "./draft-product-card";
import { MyProductCard } from "./product-card";

export type MyProductsTab = "active" | "drafts";

interface MyProductsTabsProps {
  initialTab: MyProductsTab;
  products: Product[];
  drafts: Product[];
}

/** Вкладки «Активные» / «Черновики» + синхронизация с ?tab=drafts. */
export const MyProductsTabs = ({ initialTab, products, drafts }: MyProductsTabsProps) => {
  const router = useRouter();
  const [tab, setTab] = useState<MyProductsTab>(initialTab);

  const go = (next: MyProductsTab) => {
    setTab(next);
    router.replace(next === "drafts" ? "/profile/my-products?tab=drafts" : "/profile/my-products", {
      scroll: false,
    });
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div
        className="flex gap-2 border-b border-gray-200"
        role="tablist"
        aria-label="Мои объявления"
      >
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "active"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
          role="tab"
          aria-selected={tab === "active"}
          type="button"
          onClick={() => go("active")}
        >
          Активные
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "drafts"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
          role="tab"
          aria-selected={tab === "drafts"}
          type="button"
          onClick={() => go("drafts")}
        >
          Черновики
          {drafts.length > 0 ? (
            <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-900">
              {drafts.length}
            </span>
          ) : null}
        </button>
      </div>

      {tab === "active" ? (
        products.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-sm">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <Package className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">Нет активных объявлений</h3>
            <p className="mb-4 text-gray-600">Создайте объявление или опубликуйте черновик</p>
            <Link
              href="/profile/create-product"
              className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
            >
              Создать объявление
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <MyProductCard key={product.id} product={product} />
            ))}
          </div>
        )
      ) : drafts.length === 0 ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-sm">
          <p className="text-gray-600">Черновиков пока нет</p>
          <Link
            href="/profile/create-product"
            className="mt-4 rounded-lg bg-amber-500 px-6 py-2 text-white hover:bg-amber-600"
          >
            Новое объявление
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {drafts.map((product) => (
            <DraftProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
