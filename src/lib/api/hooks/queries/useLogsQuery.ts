import { useQuery } from "@tanstack/react-query";

import { getAllLogs } from "../../requests";

export const useLogsQuery = () => {
  return useQuery({
    queryFn: getAllLogs,
    queryKey: ["logs"],
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000,
  });
};
