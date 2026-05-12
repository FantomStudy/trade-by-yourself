"use client";

import type { Product } from "@/types";

import { Edit, FileUp, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useDeleteProductMutation, usePublishDraftMutation } from "@/api/hooks";
import { Typography } from "@/components/ui";
import { toCurrency } from "@/lib/format";
import { ProductPreview } from "./product-card/product-preview/product-preview";
import styles from "./product-card/product-card.module.css";

interface DraftProductCardProps {
  product: Product;
}

/** Карточка черновика: без перехода в публичное объявление (ещё не в ленте). */
export const DraftProductCard = ({ product }: DraftProductCardProps) => {
  const router = useRouter();
  const deleteProductMutation = useDeleteProductMutation();
  const publishDraftMutation = usePublishDraftMutation();
  const [isBusy, setIsBusy] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // eslint-disable-next-line no-alert -- как в MyProductCard, без лишнего модального UI
    if (!confirm("Удалить черновик?")) return;
    setIsBusy(true);
    try {
      await deleteProductMutation.mutateAsync(product.id);
      toast.success("Черновик удалён");
      router.refresh();
    } catch {
      toast.error("Не удалось удалить черновик");
    } finally {
      setIsBusy(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/profile/my-products/${product.id}`);
  };

  const handlePublish = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBusy(true);
    try {
      await publishDraftMutation.mutateAsync(product.id);
      toast.success("На модерации");
      router.replace("/profile/my-products");
      router.refresh();
    } catch {
      toast.error("Не удалось опубликовать черновик");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <article className={`${styles.card} border-2 border-dashed border-amber-400/80`}>
      <div className="relative">
        <div className="relative w-full">
          {product.images && product.images.length > 0 ? (
            <ProductPreview images={product.images} />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center bg-gray-100 text-sm text-gray-500">
              Нет фото
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-amber-950/35 backdrop-blur-[1px]">
            <span className="text-center text-sm font-semibold text-amber-100">Черновик</span>
          </div>
        </div>

        <div className="absolute top-2 right-2 flex gap-1">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:scale-110 hover:bg-white disabled:opacity-50"
            disabled={isBusy}
            title="Опубликовать"
            type="button"
            onClick={handlePublish}
          >
            <FileUp className="h-4 w-4 text-emerald-600" />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:scale-110 hover:bg-white disabled:opacity-50"
            disabled={isBusy}
            title="Редактировать"
            type="button"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:scale-110 hover:bg-white disabled:opacity-50"
            disabled={isBusy}
            title="Удалить"
            type="button"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      </div>

      <div className={styles.info}>
        <Typography className={styles.name}>{product.name}</Typography>
        <div className={styles.meta}>
          <Typography>{product.address}</Typography>
          <Typography>{product.createdAt}</Typography>
          <Typography>В наличии: {product.quantity ?? 1} шт.</Typography>
        </div>
        <Typography className={styles.price}>{toCurrency(product.price)}</Typography>
      </div>
    </article>
  );
};
