import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { sendReview } from "@/api/reviews";

export const useSendReview = (sellerId: number, onSuccess: () => void) =>
  useMutation({
    mutationFn: (data: { text: string; rating: number }) =>
      sendReview({ ...data, reviewedUserId: sellerId }),
    onSuccess: () => {
      toast.success("Отзыв отправлен на модерацию. После проверки он будет опубликован.");
      onSuccess();
    },
    onError: () => {
      toast.error("Вы уже оставили отзыв об этом продавце");
    },
  });
