"use client";

import type { SubmitHandler } from "react-hook-form";
import type { SendReviewInput } from "@/api/reviews";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { sendReview, sendReviewSchema } from "@/api/reviews";
import { Button, Textarea, Typography } from "@/components/ui";
import styles from "./ReviewForm.module.css";

interface ReviewFormProps {
  sellerId: number;
  sellerName: string;
}

export const ReviewForm = ({ sellerId, sellerName }: ReviewFormProps) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sendReviewSchema),
    defaultValues: { text: "", rating: 0 },
  });

  const rating = watch("rating");

  const mutation = useMutation({
    mutationFn: (data: { text: string; rating: number }) =>
      sendReview({ ...data, reviewedUserId: sellerId }),
    onSuccess: () => {
      toast.success("Отзыв отправлен на модерацию. После проверки он будет опубликован.");
      reset();
    },
    onError: () => {
      toast.error("Вы уже оставили отзыв об этом продавце");
    },
  });

  const onSubmit: SubmitHandler<SendReviewInput> = (data) => mutation.mutate(data);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h2">Оставить отзыв о продавце {sellerName}</Typography>

      <div className={styles.field}>
        <Typography>Ваша оценка *</Typography>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              className={styles.starButton}
              data-filled={value <= (hoveredRating || rating) || undefined}
              onClick={() => setValue("rating", value, { shouldValidate: true })}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
            >
              <StarIcon className={styles.star} />
            </button>
          ))}
        </div>
        {errors.rating && <span className={styles.error}>{errors.rating.message}</span>}
      </div>

      <div className={styles.field}>
        <Typography>Ваш отзыв *</Typography>
        <Textarea
          {...register("text")}
          placeholder="Расскажите о вашем опыте покупки у этого продавца..."
          rows={4}
        />
        {errors.text && <span className={styles.error}>{errors.text.message}</span>}
      </div>

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Отправка..." : "Отправить отзыв"}
      </Button>
    </form>
  );
};
