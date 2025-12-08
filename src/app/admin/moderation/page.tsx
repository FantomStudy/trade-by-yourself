"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";

import { useModerateProductMutation, useProductsToModerate } from "@/api/hooks";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Button, Dialog, Textarea, Typography } from "@/components/ui";

const ModerationPage = () => {
  const { data: products, isLoading } = useProductsToModerate();
  const moderateProductMutation = useModerateProductMutation();
  const [moderatingId, setModeratingId] = useState<number | null>(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = async (productId: number) => {
    setModeratingId(productId);
    try {
      await moderateProductMutation.mutateAsync({
        productId,
        status: "APPROVED",
      });
    } catch (error) {
      console.error("Error approving product:", error);
      alert("Ошибка при одобрении товара");
    } finally {
      setModeratingId(null);
    }
  };

  const handleRejectClick = (productId: number) => {
    setSelectedProductId(productId);
    setRejectReason("");
    setShowReasonModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedProductId || !rejectReason.trim()) {
      alert("Пожалуйста, укажите причину отказа");
      return;
    }

    setModeratingId(selectedProductId);
    try {
      await moderateProductMutation.mutateAsync({
        productId: selectedProductId,
        status: "DENIDED",
        reason: rejectReason.trim(),
      });
      setShowReasonModal(false);
      setSelectedProductId(null);
      setRejectReason("");
    } catch (error) {
      console.error("Error rejecting product:", error);
      alert("Ошибка при отклонении товара");
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
                  onClick={() => handleApprove(product.id)}
                >
                  <Check className="h-4 w-4 text-green-600" />
                </button>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:scale-110 hover:bg-white disabled:opacity-50"
                  disabled={moderatingId === product.id}
                  title="Отклонить"
                  type="button"
                  onClick={() => handleRejectClick(product.id)}
                >
                  <X className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модалка для ввода причины отказа */}
      {showReasonModal && (
        <Dialog onOpenChange={setShowReasonModal} open={showReasonModal}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold">Причина отклонения</h2>
              <p className="mb-4 text-sm text-gray-600">
                Укажите причину, по которой товар не прошел модерацию. Это
                сообщение будет отправлено владельцу товара.
              </p>
              <Textarea
                className="mb-4 min-h-32"
                placeholder="Например: Некачественные фотографии, неполное описание товара..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  variant="secondary"
                  onClick={() => {
                    setShowReasonModal(false);
                    setSelectedProductId(null);
                    setRejectReason("");
                  }}
                >
                  Отмена
                </Button>
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  disabled={!rejectReason.trim()}
                  onClick={handleRejectConfirm}
                >
                  Отклонить товар
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default ModerationPage;
