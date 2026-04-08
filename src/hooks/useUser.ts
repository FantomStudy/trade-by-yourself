import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/users/getUser";

export const useUser = (userId: number) =>
  useQuery({
    queryKey: ["user", userId],
    queryFn: async () => getUser(userId),
  });
