import type { MyProductsTab } from "./my-products-tabs";
import { Package } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUserOrNull, getCurrentUserProducts, getMyDrafts } from "@/lib/api";
import { categorizeMyProducts } from "./categorize-my-products";
import { MyProductsTabs } from "./my-products-tabs";

interface MyProductsFeedProps {
  initialTab: MyProductsTab;
}

export const MyProductsFeed = async ({ initialTab }: MyProductsFeedProps) => {
  const currentUser = await getCurrentUserOrNull();
  if (!currentUser) {
    redirect("/");
  }

  const products = await getCurrentUserProducts(currentUser.id);
  const drafts = await getMyDrafts().catch((err) => {
    console.warn("getMyDrafts:", err);
    return [];
  });

  if (!products) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-sm">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <Package className="h-10 w-10 text-red-500" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-800">Ошибка загрузки</h3>
        <p className="text-gray-600">Не удалось загрузить ваши объявления</p>
      </div>
    );
  }

  const { active, moderation, hidden, denied } = categorizeMyProducts(products, drafts);

  const hasAnything =
    active.length + moderation.length + hidden.length + denied.length + drafts.length > 0;

  if (!hasAnything) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-sm">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <Package className="h-10 w-10 text-green-500" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-800">У вас пока нет объявлений</h3>
        <p className="mb-4 text-gray-600">
          Создайте свое первое объявление, чтобы начать продавать
        </p>
        <Link
          href="/profile/create-product"
          className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Создать объявление
        </Link>
      </div>
    );
  }

  return (
    <MyProductsTabs
      key={initialTab}
      active={active}
      moderation={moderation}
      hidden={hidden}
      denied={denied}
      drafts={drafts}
      initialTab={initialTab}
    />
  );
};
