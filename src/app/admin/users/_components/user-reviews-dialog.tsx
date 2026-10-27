"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Pencil, Save, Trash2, X } from "lucide-react";
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
import { deleteReview, getUserReviews, updateReview, type Review } from "@/lib/api/requests/reviews";
import type { User } from "@/types";

interface UserReviewsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserReviewsDialog({ user, open, onOpenChange }: UserReviewsDialogProps) {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ text: "", rating: 0 });

  const { data: reviews = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-user-reviews", user?.id],
    queryFn: () => getUserReviews(user!.id),
    enabled: open && user != null,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      toast.success("Отзыв удален");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["admin-user-reviews", user?.id] });
    },
    onError: () => toast.error("Ошибка при удалении"),
  });

  const updateMutation = useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      toast.success("Отзыв обновлен");
      setEditingId(null);
      refetch();
    },
    onError: () => toast.error("Ошибка при обновлении"),
  });

  const handleEdit = (review: Review) => {
    setEditingId(review.id);
    setEditForm({ text: review.text, rating: review.rating });
  };

  const handleSave = async (id: number) => {
    await updateMutation.mutateAsync({ id, ...editForm });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Отзывы пользователя: {user?.fullName}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div>Загрузка...</div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {reviews.map((review) => (
              <div key={review.id} className="border p-4 rounded-lg flex flex-col gap-2">
                {editingId === review.id ? (
                  <div className="space-y-2">
                    <Input 
                        value={editForm.text} 
                        onChange={(e) => setEditForm({...editForm, text: e.target.value})}
                    />
                    <Input 
                        type="number"
                        min={1} max={5} step={0.5}
                        value={editForm.rating} 
                        onChange={(e) => setEditForm({...editForm, rating: parseFloat(e.target.value)})}
                    />
                    <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSave(review.id)}><Save className="h-4 w-4"/></Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="h-4 w-4"/></Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-medium text-sm">{review.reviewer.fullName}</p>
                            <p className="text-gray-600 text-sm">{review.text}</p>
                            <p className="text-xs text-gray-400">Рейтинг: {review.rating}</p>
                        </div>
                        <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(review)}><Pencil className="h-4 w-4"/></Button>
                            <Button size="sm" variant="ghost" className="text-red-500" onClick={() => deleteMutation.mutate(review.id)}><Trash2 className="h-4 w-4"/></Button>
                        </div>
                    </div>
                  </>
                )}
              </div>
            ))}
            {reviews.length === 0 && <p className="text-center text-gray-500">Отзывов нет</p>}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
