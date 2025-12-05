"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";

import { useModerateProductMutation, useProductsToModerate } from "@/api/hooks";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Button, Typography } from "@/components/ui";

const ModerationPage = () => {
  const { data: products, isLoading } = useProductsToModerate();
  const moderateProductMutation = useModerateProductMutation();
  const [moderatingId, setModeratingId] = useState<number | null>(null);

  const handleModerate = async (
    productId: number,
    status: "APPROVED" | "DENIDED",
  ) => {
    setModeratingId(productId);
    try {
      await moderateProductMutation.mutateAsync({ productId, status });
    } catch (error) {
      console.error("Error moderating product:", error);
      alert("Ошибка при модерации товара");
    } finally {
      setModeratingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Typography className="text-3xl font-bold">
            Модерация товаров
          </Typography>
          <Typography className="mt-2 text-gray-600">
            Управление и модерация размещенных товаров
          </Typography>
        </div>
        <div className="flex items-center justify-center rounded-lg bg-white p-12 shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Typography className="text-3xl font-bold">
          Модерация товаров
        </Typography>
        <Typography className="mt-2 text-gray-600">
          Товары ожидающие модерации: {products?.length || 0}
        </Typography>
      </div>

      {!products || products.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
          <Typography className="text-gray-500">
            Нет товаров на модерации
          </Typography>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {products.map((product) => (
            <div key={product.id} className="relative">
              <FeedWrapper products={[product]} />
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:scale-110 hover:bg-white disabled:opacity-50"
                  disabled={moderatingId === product.id}
                  title="Одобрить"
                  type="button"
                  onClick={() => handleModerate(product.id, "APPROVED")}
                >
                  <Check className="h-4 w-4 text-green-600" />
                </button>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:scale-110 hover:bg-white disabled:opacity-50"
                  disabled={moderatingId === product.id}
                  title="Отклонить"
                  type="button"
                  onClick={() => handleModerate(product.id, "DENIDED")}
                >
                  <X className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModerationPage;
