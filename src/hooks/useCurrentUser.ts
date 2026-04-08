import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/api/auth";

export const useCurrentUser = () =>
  useQuery({
    queryKey: ["user", "current"],
    queryFn: getCurrentUser,
  });
