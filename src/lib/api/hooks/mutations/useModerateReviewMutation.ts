import type { ModerateReviewData } from "@/api/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moderateReview } from "@/api/requests";

import { REVIEWS_TO_MODERATE_QUERY_KEY } from "../queries/useReviewsToModerate";

export const useModerateReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ModerateReviewData) => moderateReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: REVIEWS_TO_MODERATE_QUERY_KEY,
      });
    },
  });
};
