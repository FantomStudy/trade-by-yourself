import { useQuery } from "@tanstack/react-query";

import { getAllReviewsToModerate } from "@/api/requests";

export const REVIEWS_TO_MODERATE_QUERY_KEY = ["reviewsToModerate"];

export const useReviewsToModerate = () => {
  return useQuery({
    queryKey: REVIEWS_TO_MODERATE_QUERY_KEY,
    queryFn: getAllReviewsToModerate,
  });
};
