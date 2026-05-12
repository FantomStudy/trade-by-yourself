"use client";

import type { SendReviewDto } from "@/api/requests";

import { useMutation } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { sendReview } from "@/api/requests";
import { Textarea, Typography } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/contexts";

interface ReviewFormProps {
  sellerId: number;
  sellerName: string;
}

export const ReviewForm = ({ sellerId, sellerName }: ReviewFormProps) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [text, setText] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: SendReviewDto) => sendReview(data),
    onSuccess: () => {
      toast.success("Отзыв отправлен на модерацию. После проверки он будет опубликован.");
      setRating(0);
      setText("");
      setHasSubmitted(true);
    },
    onError: () => {
      toast.error("Вы уже оставили отзыв об этом продавце");
      setHasSubmitted(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Пожалуйста, поставьте оценку");
      return;
    }

    if (!text.trim()) {
      toast.error("Пожалуйста, напишите текст отзыва");
      return;
    }

    mutation.mutate({
      text: text.trim(),
      rating,
      reviewedUserId: sellerId,
    });
  };

  if (!user) {
    return (
      <div className="mb-8 rounded-lg bg-white p-6">
        <Typography className="text-gray-600">Войдите в систему, чтобы оставить отзыв</Typography>
      </div>
    );
  }

  if (user.id === sellerId) {
    return null; // Не показываем форму, если это свой товар
  }

  if (hasSubmitted) {
    return (
      <div className="mb-8 rounded-lg bg-white p-6">
        <Typography className="mb-2 text-lg font-semibold" variant="h2">
          Отзыв о продавце {sellerName}
        </Typography>
        <Typography className="text-gray-600">Вы уже оставили отзыв об этом продавце</Typography>
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-lg bg-white p-6">
      <Typography className="mb-4 text-lg font-semibold" variant="h2">
        Оставить отзыв о продавце {sellerName}
      </Typography>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Typography className="mb-2 text-sm font-medium">Ваша оценка *</Typography>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                style={{ transition: "transform 0.2s" }}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoveredRating(value)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                <Star
                  className={`h-8 w-8 ${
                    value <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <Typography className="mb-2 text-sm font-medium">Ваш отзыв *</Typography>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Расскажите о вашем опыте покупки у этого продавца..."
            rows={4}
          />
        </div>

        <Button disabled={mutation.isPending} type="submit">
          {mutation.isPending ? "Отправка..." : "Отправить отзыв"}
        </Button>
      </form>
    </div>
  );
};
