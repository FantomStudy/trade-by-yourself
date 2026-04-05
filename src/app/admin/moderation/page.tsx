"use client";

import type { ModerationFilter, ModerationProduct, ModerationState } from "@/types";
import { AlertCircle, Check, ChevronLeft, ChevronRight, Clock, Eye, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import {
  useModerateProductMutation,
  useModerationProduct,
  useProductsToModerate,
} from "@/api/hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
  Typography,
} from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { MobileHeader } from "../_components/admin-sidebar";

// ─── State badge ──────────────────────────────────────────────────────────────

const ModerateBadge = ({
  state,
  reason,
  size = "sm",
}: {
  state: ModerationState;
  reason: string | null;
  size?: "sm" | "lg";
}) => {
  const cls =
    size === "lg"
      ? "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium"
      : "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium";
  const iconCls = size === "lg" ? "h-4 w-4" : "h-3 w-3";

  if (state === "DENIDED") {
    return (
      <span className={`${cls} bg-red-100 text-red-700`}>
        <AlertCircle className={iconCls} />
        Отклонено ИИ
      </span>
    );
  }
  if (state === "APPROVED" && reason === "Одобрено ИИ автоматически") {
    return (
      <span className={`${cls} bg-green-100 text-green-700`}>
        <Check className={iconCls} />
        Одобрено ИИ
      </span>
    );
  }
  if (state === "AI_REVIEWED") {
    return (
      <span className={`${cls} bg-blue-100 text-blue-700`}>
        <Clock className={iconCls} />
        После ИИ → Руч. проверка
      </span>
    );
  }
  // MODERATE — new, awaiting AI
  return (
    <span className={`${cls} bg-amber-100 text-amber-700`}>
      <Clock className={iconCls} />
      {size === "lg" ? "Ручная проверка" : "Руч. проверка"}
    </span>
  );
};

// ─── Filter tabs ─────────────────────────────────────────────────────────────

const FILTERS: { value: ModerationFilter; label: string }[] = [
  { value: "ALL", label: "Все" },
  { value: "DENIED", label: "Отклонено ИИ" },
  { value: "MANUAL", label: "Ручная проверка" },
  { value: "APPROVED_AI", label: "Одобрено ИИ" },
];

// ─── Detail dialog ────────────────────────────────────────────────────────────

const ProductDetailDialog = ({
  productId,
  open,
  onOpenChange,
  onApprove,
  onReject,
  isActing,
}: {
  productId: number | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  isActing: boolean;
}) => {
  const { data: product, isLoading } = useModerationProduct(open ? productId : null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-5xl w-[calc(100vw-32px)] p-0 overflow-hidden">
        {/* Inner wrapper owns height + flex so it's free from the CSS module's display:grid */}
        <div className="flex flex-col" style={{ height: "90vh" }}>
          {/* Header */}
          <div className="flex-shrink-0 border-b px-6 py-4">
            <DialogTitle className="text-lg font-semibold">Детали товара</DialogTitle>
          </div>

          {isLoading || !product ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
            </div>
          ) : (
            <>
              {/* Two-column scrollable body */}
              <div className="flex flex-1 overflow-hidden min-h-0">
                {/* Left column — images + seller */}
                <div className="flex w-72 flex-shrink-0 flex-col gap-4 overflow-y-auto border-r bg-gray-50 p-5">
                  {/* Images */}
                  {product.images.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl border bg-white shadow-sm">
                        <Image
                          alt={product.name}
                          className="object-cover"
                          fill
                          sizes="272px"
                          src={product.images[0]}
                        />
                      </div>
                      {product.images.length > 1 && (
                        <div className="grid grid-cols-3 gap-2">
                          {product.images.slice(1).map((src, i) => (
                            <div
                              key={i}
                              className="relative aspect-square overflow-hidden rounded-lg border bg-white"
                            >
                              <Image
                                alt={product.name}
                                className="object-cover"
                                fill
                                sizes="84px"
                                src={src}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex aspect-square w-full items-center justify-center rounded-xl border bg-white text-sm text-gray-400">
                      Нет фото
                    </div>
                  )}

                  {/* Seller */}
                  <div className="rounded-xl border bg-white p-4 text-sm shadow-sm">
                    <p className="mb-3 font-semibold text-gray-800">Продавец</p>
                    <div className="space-y-1.5">
                      <InfoRow label="ID" value={String(product.user.id)} />
                      <InfoRow label="Имя" value={product.user.fullName} />
                      <InfoRow label="Email" value={product.user.email} />
                      <InfoRow label="Телефон" value={product.user.phoneNumber} />
                      <InfoRow
                        label="Тип"
                        value={
                          product.user.profileType === "INDIVIDUAL"
                            ? "Физ. лицо"
                            : product.user.profileType === "OOO"
                              ? "ООО"
                              : product.user.profileType === "IP"
                                ? "ИП"
                                : product.user.profileType
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Right column — details (scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Status badge */}
                  <div>
                    <ModerateBadge
                      state={product.moderateState}
                      reason={product.moderationRejectionReason}
                      size="lg"
                    />
                  </div>

                  {product.moderationRejectionReason && product.moderateState !== "APPROVED" && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 leading-relaxed">
                      <span className="font-semibold">Причина: </span>
                      {product.moderationRejectionReason}
                    </div>
                  )}

                  {/* Main info */}
                  <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Основная информация
                    </p>
                    <div className="space-y-3 text-sm">
                      <InfoRow label="Название" value={product.name} />
                      <InfoRow label="Цена" value={`${product.price.toLocaleString("ru-RU")} ₽`} />
                      <InfoRow
                        label="Категория"
                        value={`${product.category.name} / ${product.subCategory.name}${product.type ? ` / ${product.type.name}` : ""}`}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Описание
                    </p>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {product.description || "—"}
                    </p>
                  </div>

                  {/* Field values */}
                  {product.fieldValues.length > 0 && (
                    <div className="rounded-xl border bg-white p-5 shadow-sm">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Характеристики
                      </p>
                      <div className="flex flex-col gap-2.5 text-sm">
                        {product.fieldValues.map((fv, i) => (
                          <InfoRow key={i} label={fv.field.name} value={fv.value} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions — pinned bottom */}
              <div className="flex-shrink-0 flex gap-3 border-t bg-white px-6 py-4">
                <Button
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  disabled={isActing}
                  onClick={() => onApprove(product.id)}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Одобрить
                </Button>
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  disabled={isActing}
                  onClick={() => onReject(product.id)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Отклонить
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-2">
    <span className="min-w-24 flex-shrink-0 font-medium text-gray-500">{label}:</span>
    <span className="text-gray-900 break-all">{value}</span>
  </div>
);

// ─── Reject modal ─────────────────────────────────────────────────────────────

const RejectModal = ({
  open,
  onClose,
  onConfirm,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isPending: boolean;
}) => {
  const [reason, setReason] = useState("");

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Причина отклонения</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          Укажите причину — она будет отправлена владельцу товара.
        </p>
        <Textarea
          className="min-h-28"
          placeholder="Например: некачественные фотографии, неполное описание..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex gap-2 pt-1">
          <Button className="flex-1" variant="success" onClick={onClose}>
            Отмена
          </Button>
          <Button
            className="flex-1 bg-red-500 hover:bg-red-600"
            disabled={!reason.trim() || isPending}
            onClick={() => onConfirm(reason.trim())}
          >
            Отклонить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── Product row ──────────────────────────────────────────────────────────────

const ProductRow = ({
  product,
  onView,
  onApprove,
  onReject,
  isActing,
}: {
  product: ModerationProduct;
  onView: (id: number) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  isActing: boolean;
}) => {
  const thumb = product.images[0];

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-white p-4 shadow-sm sm:flex-row sm:items-start">
      {/* Thumbnail */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-gray-100">
        {thumb ? (
          <Image alt={product.name} className="object-cover" fill sizes="80px" src={thumb} />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            Нет фото
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-start gap-2">
          <span className="font-medium text-gray-900 truncate">{product.name}</span>
          <ModerateBadge state={product.moderateState} reason={product.moderationRejectionReason} />
        </div>

        <p className="text-sm text-gray-500">
          {product.category.name} / {product.subCategory.name}
        </p>

        <p className="text-sm font-medium text-gray-800">
          {product.price.toLocaleString("ru-RU")} ₽
        </p>

        <p className="text-xs text-gray-500">
          {product.user.fullName} · {product.user.email}
        </p>

        {product.moderationRejectionReason && (
          <p className="text-xs text-red-600">
            <span className="font-medium">Причина: </span>
            {product.moderationRejectionReason}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-shrink-0 gap-1.5">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow-sm transition hover:scale-105 disabled:opacity-40"
          disabled={isActing}
          title="Просмотр"
          type="button"
          onClick={() => onView(product.id)}
        >
          <Eye className="h-4 w-4 text-blue-600" />
        </button>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow-sm transition hover:scale-105 disabled:opacity-40"
          disabled={isActing}
          title="Одобрить"
          type="button"
          onClick={() => onApprove(product.id)}
        >
          <Check className="h-4 w-4 text-green-600" />
        </button>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow-sm transition hover:scale-105 disabled:opacity-40"
          disabled={isActing}
          title="Отклонить"
          type="button"
          onClick={() => onReject(product.id)}
        >
          <X className="h-4 w-4 text-red-600" />
        </button>
      </div>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const ModerationPage = () => {
  const [filter, setFilter] = useState<ModerationFilter>("ALL");
  const [page, setPage] = useState(1);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [rejectTargetId, setRejectTargetId] = useState<number | null>(null);
  const [actingId, setActingId] = useState<number | null>(null);

  const { data, isLoading } = useProductsToModerate(filter, page);
  const moderateMutation = useModerateProductMutation();

  const handleApprove = async (productId: number) => {
    setActingId(productId);
    try {
      await moderateMutation.mutateAsync({ productId, status: "APPROVED" });
      toast.success("Товар одобрен");
      setDetailId(null);
    } catch {
      toast.error("Ошибка при одобрении товара");
    } finally {
      setActingId(null);
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectTargetId) return;
    setActingId(rejectTargetId);
    try {
      await moderateMutation.mutateAsync({
        productId: rejectTargetId,
        status: "DENIDED",
        reason,
      });
      toast.success("Товар отклонён");
      setRejectTargetId(null);
      setDetailId(null);
    } catch {
      toast.error("Ошибка при отклонении товара");
    } finally {
      setActingId(null);
    }
  };

  const handleFilterChange = (f: ModerationFilter) => {
    setFilter(f);
    setPage(1);
  };

  const isActing = actingId !== null;

  return (
    <div className="space-y-6">
      <MobileHeader title="Модерация товаров" />

      <div>
        <Typography className="text-2xl font-bold sm:text-3xl">Модерация товаров</Typography>
        <Typography className="mt-1 text-sm text-gray-600">
          {data ? `Всего: ${data.total}` : "Управление товарами на проверке"}
        </Typography>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-lg border bg-white p-1 shadow-sm w-fit">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f.value ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
            type="button"
            onClick={() => handleFilterChange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center rounded-lg bg-white p-16 shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
        </div>
      ) : !data?.items.length ? (
        <div className="rounded-lg bg-white p-16 text-center shadow-sm">
          <Typography className="text-gray-500">Нет товаров на модерации</Typography>
        </div>
      ) : (
        <div className="space-y-3">
          {data.items.map((product) => (
            <ProductRow
              key={product.id}
              isActing={isActing}
              product={product}
              onApprove={handleApprove}
              onReject={(id) => {
                setRejectTargetId(id);
              }}
              onView={(id) => setDetailId(id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow-sm disabled:opacity-40"
            disabled={page === 1}
            type="button"
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-600">
            Страница {data.page} из {data.pages}
          </span>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow-sm disabled:opacity-40"
            disabled={page === data.pages}
            type="button"
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Detail dialog */}
      <ProductDetailDialog
        isActing={isActing}
        open={detailId !== null}
        productId={detailId}
        onApprove={handleApprove}
        onOpenChange={(v) => !v && setDetailId(null)}
        onReject={(id) => setRejectTargetId(id)}
      />

      {/* Reject reason modal */}
      <RejectModal
        isPending={moderateMutation.isPending}
        open={rejectTargetId !== null}
        onClose={() => setRejectTargetId(null)}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
};

export default ModerationPage;
