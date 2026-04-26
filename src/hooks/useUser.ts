import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/users";

export const useUser = (id?: number) =>
  useQuery({
    queryKey: ["user", "detail", id],
    queryFn: () => getUser(id as number),
    enabled: typeof id === "number" && id > 0,
  });
