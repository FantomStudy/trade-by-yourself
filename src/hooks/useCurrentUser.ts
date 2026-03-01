import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api-lab/auth/getCurrentUser";

export const CURRENT_USER_QUERY_KEY = ["user", "current"];

export const useCurrentUser = () =>
  useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUser,
  });
