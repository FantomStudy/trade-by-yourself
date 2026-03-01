import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api-lab/auth/getCurrentUser";

export const useCurrentUser = () =>
  useQuery({
    queryKey: ["user", "current"],
    queryFn: getCurrentUser,
  });
