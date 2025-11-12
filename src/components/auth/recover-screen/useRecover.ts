import { useMutation } from "@tanstack/react-query";

import { forgotPassword } from "@/lib/api";

export const useRecover = () => {
  return useMutation({
    mutationFn: async (email: string) =>
      forgotPassword({ email }).then((r) => r.data),
  });
};
