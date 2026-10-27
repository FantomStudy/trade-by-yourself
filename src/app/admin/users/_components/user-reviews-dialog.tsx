"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MessageSquare, Pencil, Save, Star, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui";
import {
  deleteReview,
  getAllReviewsAdmin,
  getUserReviews,
  updateReview,
  type Review,
} from "@/lib/api/requests/reviews";
import type { User } from "@/types";

interface UserReviewsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserReviewsDialog({ user, open, onOpenChange }: UserReviewsDialogProps) {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ text: "", rating: 5 });

  const {
    data: reviews = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-user-reviews", user?.id],
    queryFn: async (): Promise<Review[]> => {
      if (!user?.id) return [];
      try {
        const res = await getAllReviewsAdmin({ userId: user.id, limit: 100 });
        if (res && Array.isArray(res.reviews)) {
          return res.reviews;
        }
      } catch (err) {
        console.error("Failed to load admin reviews, falling back to public reviews", err);
      }
      try {
        const fallback = await getUserReviews(user.id);
        if (Array.isArray(fallback)) {
          return fallback;
        }
      } catch (err) {
        console.error("Failed fallback reviews", err);
      }
      return [];
    },
    enabled: open && user != null,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      toast.success("Отзыв успешно удален");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["admin-user-reviews", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => toast.error("Не удалось удалить отзыв"),
  });

  const updateMutation = useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      toast.success("Отзыв успешно обновлен");
      setEditingId(null);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["admin-user-reviews", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err: any) => {
      toast.error(err?.data?.message || err?.message || "Не удалось обновить отзыв");
    },
  });

  const handleEdit = (review: Review) => {
    setEditingId(review.id);
    setEditForm({ text: review.text || "", rating: review.rating || 5 });
  };

  const handleSave = async (id: number) => {
    await updateMutation.mutateAsync({ id, text: editForm.text, rating: Number(editForm.rating) });
  };

  const getStatusBadge = (state?: string) => {
    switch (state) {
      case "APPROVED":
        return <span className="rounded bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-800">Одобрен</span>;
      case "MODERATE":
      case "AI_REVIEWED":
        return <span className="rounded bg-yellow-100 px-2 py-0.5 text-[11px] font-semibold text-yellow-800">На модерации</span>;
      case "DENIDED":
        return <span className="rounded bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-800">Отклонён</span>;
      default:
        return null;
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <span>Отзывы пользователя: {user?.fullName || `ID ${user?.id}`}</span>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2 text-sm text-gray-600">Загрузка отзывов...</span>
          </div>
        ) : (
          <div className="max-h-[65vh] space-y-3 overflow-y-auto pr-1">
            {reviews.map((review) => {
              const isReceived = !review.reviewedUser || review.reviewedUser.id === user?.id;
              const authorName = review.reviewer?.fullName || (review as any).fullName || "Пользователь";
              const authorPhone = review.reviewer?.phoneNumber || "";
              const targetName = review.reviewedUser?.fullName || "";

              return (
                <div key={review.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  {editingId === review.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-700">Текст отзыва</label>
                        <textarea
                          rows={3}
                          className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={editForm.text}
                          onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-700">Рейтинг (от 1 до 5)</label>
                        <select
                          className="rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                          value={editForm.rating}
                          onChange={(e) => setEditForm({ ...editForm, rating: parseFloat(e.target.value) })}
                        >
                          <option value={5}>5.0 — Отлично</option>
                          <option value={4.5}>4.5</option>
                          <option value={4}>4.0 — Хорошо</option>
                          <option value={3.5}>3.5</option>
                          <option value={3}>3.0 — Нормально</option>
                          <option value={2.5}>2.5</option>
                          <option value={2}>2.0 — Плохо</option>
                          <option value={1.5}>1.5</option>
                          <option value={1}>1.0 — Ужасно</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          disabled={updateMutation.isPending}
                          onClick={() => handleSave(review.id)}
                        >
                          <Save className="mr-1 h-3.5 w-3.5" />
                          {updateMutation.isPending ? "Сохранение..." : "Сохранить"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                        >
                          <X className="mr-1 h-3.5 w-3.5" />
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-gray-900 text-sm">
                            {isReceived ? `От: ${authorName}` : `Кому: ${targetName}`}
                          </span>
                          {authorPhone && (
                            <span className="text-xs text-gray-500">({authorPhone})</span>
                          )}
                          {getStatusBadge(review.moderateState)}
                          <div className="flex items-center gap-1 text-amber-500 text-xs font-medium">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <span>{review.rating}</span>
                          </div>
                          {review.date && (
                            <span className="text-[11px] text-gray-400">· {review.date}</span>
                          )}
                        </div>

                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {review.text || <span className="text-gray-400 italic">Без текста</span>}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Редактировать отзыв"
                          onClick={() => handleEdit(review)}
                        >
                          <Pencil className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Удалить отзыв"
                          disabled={deleteMutation.isPending}
                          onClick={() => {
                            if (window.confirm("Вы уверены, что хотите удалить этот отзыв?")) {
                              deleteMutation.mutate(review.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {reviews.length === 0 && (
              <div className="py-8 text-center text-sm text-gray-500">
                У данного пользователя пока нет отзывов.
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
