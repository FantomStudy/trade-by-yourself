"use client";

import type { Product } from "@/types";

import { AlertCircle, Edit, Eye, EyeOff, Sparkles, Trash2, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useDeleteProductMutation, useToggleProductMutation, useUserInfo } from "@/api/hooks";
import { Typography } from "@/components/ui";
import { formatCardAddress, toCurrency } from "@/lib/format";
import { fixMojibake } from "@/lib/fix-mojibake";
import { toast } from "sonner";
import { useAuth } from "@/lib/contexts";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";

import { ProductPreview } from "./product-preview/product-preview";

import styles from "./product-card.module.css";

interface MyProductCardProps {
  product: Product;
  selectable?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export const MyProductCard = ({
  product,
  selectable = false,
  isSelected = false,
  onToggleSelect,
}: MyProductCardProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const { data: userInfo } = useUserInfo(user?.id);
  const deleteProductMutation = useDeleteProductMutation();
  const toggleProductMutation = useToggleProductMutation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Вы уверены, что хотите удалить это объявление?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteProductMutation.mutateAsync(product.id);
      toast.success("Объявление удалено");
      router.refresh();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(fixMojibake(getApiErrorMessage(error, "Ошибка при удалении товара")));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/profile/my-products/${product.id}`);
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Если товар скрыт, действие — вернуть в продажу / продлить
    if (product.isHide) {
      const isExpired = Boolean(product.isExpired);
      const remainingFree = userInfo?.adsLimit?.remaining ?? 0;
      const costPerAd = userInfo?.adsLimit?.costPerAd ?? 50;

      // Если срок истёк и бесплатный лимит на месяц исчерпан — предупреждаем о списании 50 ₽
      if (isExpired && remainingFree <= 0) {
        const userBalance = (userInfo?.balance ?? 0) + (userInfo?.bonusBalance ?? 0);
        const confirmMsg =
          userBalance < costPerAd
            ? `Бесплатный лимит объявлений в этом месяце исчерпан (6 из 6).\nДля продления объявления требуется ${costPerAd} ₽, а на вашем балансе ${userBalance} ₽.\nПополните баланс в профиле.`
            : `Бесплатный лимит объявлений в этом месяце исчерпан (6 из 6).\nПродление этого объявления на 30 дней стоит ${costPerAd} ₽.\nСписать ${costPerAd} ₽ с баланса и вернуть объявление в продажу?`;

        if (!confirm(confirmMsg)) {
          return;
        }
      }
    }

    setIsToggling(true);
    try {
      const res = await toggleProductMutation.mutateAsync(product.id);
      toast.success(
        res?.message ||
          (product.isHide ? "Объявление возвращено в продажу" : "Объявление снято с продажи"),
      );
      router.refresh();
    } catch (error) {
      console.error("Error toggling product:", error);
      const message = fixMojibake(getApiErrorMessage(error, "Ошибка при изменении статуса товара"));
      toast.error(message);
    } finally {
      setIsToggling(false);
    }
  };

  const isDenied =
    product.moderateState === "DENIED" || product.moderateState === "DENIDED";
  const isOnModeration =
    product.moderateState === "MODERATE" || product.moderateState === "AI_REVIEWED";

  const getCardClassName = () => {
    if (product.isHide) return `${styles.card} ${styles.hiddenProduct}`;
    if (isOnModeration) return `${styles.card} ${styles.moderateProduct}`;
    if (isDenied) return `${styles.card} ${styles.deniedProduct}`;
    return styles.card;
  };

  const lifetimeLabel =
    typeof product.daysUntilExpiration === "number"
      ? product.isExpired
        ? "Срок истек"
        : `Осталось ${product.daysUntilExpiration} дн.`
      : null;

  return (
    <article className={`${getCardClassName()} ${isSelected ? "ring-2 ring-blue-500 shadow-md" : ""}`}>
      <div className="relative">
        {selectable && (
          <div
            className="absolute top-2 left-2 z-20 flex items-center justify-center p-1.5 rounded-lg bg-white/90 hover:bg-white text-blue-600 shadow-md cursor-pointer transition-transform hover:scale-110"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSelect?.();
            }}
            title={isSelected ? "Снять выбор" : "Выбрать объявление"}
          >
            <input
              type="checkbox"
              checked={isSelected}
              readOnly
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer pointer-events-none"
            />
          </div>
        )}
        <Link href={`/product/${product.id}`}>
          <div className="relative">
            <ProductPreview images={product.images} />
            {product.isHide && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60 backdrop-blur-[2px]">
                <span className="text-center text-lg font-semibold text-red-500">Объявление снято с продажи</span>
              </div>
            )}
            {!product.isHide && product.isReserved && (
              <div className="absolute inset-0 flex items-center justify-center bg-amber-900/55 backdrop-blur-[2px]">
                <span className="text-center text-lg font-semibold text-amber-100">Зарезервировано</span>
              </div>
            )}
            {isOnModeration && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-900/60 backdrop-blur-[2px]">
                <span className="text-center text-lg font-semibold text-blue-200">На модерации</span>
              </div>
            )}
            {isDenied && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-900/60 backdrop-blur-[2px]">
                <span className="text-center text-lg font-semibold text-red-200">Не прошел модерацию</span>
              </div>
            )}
          </div>
        </Link>

        <div className="absolute bottom-2 left-2 flex flex-col gap-1 z-10 pointer-events-none max-w-[60%]">
          {product.promotionLevel && product.promotionLevel >= 100 ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-lg backdrop-blur-[2px] truncate">
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">VIP {product.promotionName ? `• ${product.promotionName}` : ""}</span>
            </span>
          ) : (product.promotionLevel && product.promotionLevel > 0) || product.hasPromotion ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-pink-500 to-pink-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg backdrop-blur-[2px] truncate">
              <Zap className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">В топе {product.promotionName ? `• ${product.promotionName}` : ""}</span>
            </span>
          ) : null}
        </div>

        {typeof product.viewsCount === "number" && (
          <div className="absolute bottom-2 right-2 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-900/80 backdrop-blur-[2px] px-2.5 py-1 text-[11px] font-medium text-white shadow-md">
              <Eye className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />
              <span>{product.viewsCount}</span>
              {Boolean(product.todayViewsCount && product.todayViewsCount > 0) && (
                <span className="text-emerald-400 font-semibold">(+{product.todayViewsCount})</span>
              )}
            </span>
          </div>
        )}

        <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-1">
            {!isOnModeration && !isDenied && !product.isHide && (
              <Link
                href="/profile/promotion-request"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:scale-110 hover:bg-white text-amber-600 hover:text-amber-700"
                title="Продвижение / Продлить"
              >
                <TrendingUp className="h-3.5 w-3.5" />
              </Link>
            )}
            <button
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:scale-110 hover:bg-white disabled:opacity-50"
              disabled={isDeleting || isToggling}
              title={product.isHide ? "Вернуть в продажу" : "Снять с продажи"}
              type="button"
              onClick={handleToggle}
            >
              {product.isHide ? <Eye className="h-3.5 w-3.5 text-green-600" /> : <EyeOff className="h-3.5 w-3.5 text-orange-600" />}
            </button>
            <button
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:scale-110 hover:bg-white disabled:opacity-50"
              disabled={isDeleting || isToggling}
              title="Редактировать"
              type="button"
              onClick={handleEdit}
            >
              <Edit className="h-3.5 w-3.5 text-blue-600" />
            </button>
            <button
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:scale-110 hover:bg-white disabled:opacity-50"
              disabled={isDeleting || isToggling}
              title={isDeleting ? "Удаление..." : "Удалить"}
              type="button"
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5 text-red-600" />
            </button>
          </div>

          {lifetimeLabel ? (
            <div
              className={`${styles.expirationBadge} ${product.isExpired ? styles.expiredBadge : ""}`}
              title={product.expiresAt ? `Действует до ${product.expiresAt}` : undefined}
            >
              {lifetimeLabel}
            </div>
          ) : null}
        </div>
      </div>

      <div className={styles.info}>
        <Link href={`/product/${product.id}`}>
          <Typography className={`${styles.name} ${product.isHide ? styles.hiddenText : ""}`}>
            {product.name}
          </Typography>
        </Link>

        <div className={styles.meta}>
          <Typography className={product.isHide ? styles.hiddenText : ""}>
            {formatCardAddress(product.address)}
          </Typography>
          <Typography className={product.isHide ? styles.hiddenText : ""}>{product.createdAt}</Typography>
          <Typography className={product.isHide ? styles.hiddenText : ""}>
            В наличии: {product.quantity ?? 1} шт.
          </Typography>
        </div>

        <Typography className={`${styles.price} ${product.isHide ? styles.hiddenText : ""}`}>
          {toCurrency(product.price)}
        </Typography>

        {isDenied && (
          <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 leading-relaxed">
            <div className="flex items-start gap-1.5">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              <div>
                <span className="font-semibold">Отклонено модерацией.</span>
                {product.moderationRejectionReason ? (
                  <span className="block mt-0.5">{fixMojibake(product.moderationRejectionReason)}</span>
                ) : (
                  <span className="block mt-0.5 text-red-500">Причина не указана</span>
                )}
              </div>
            </div>
          </div>
        )}

        {product.moderateState === "AI_REVIEWED" && product.moderationRejectionReason && (
          <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 leading-relaxed">
            <div className="flex items-start gap-1.5">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              <div>
                <span className="font-semibold">Требует проверки.</span>
                <span className="block mt-0.5">{fixMojibake(product.moderationRejectionReason)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
