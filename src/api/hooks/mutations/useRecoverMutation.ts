import { useMutation } from "@tanstack/react-query";

import { forgotPassword } from "@/api";

export const useRecoverMutation = () => {
  return useMutation({
    mutationFn: async (email: string) => forgotPassword({ email }),
  });
};
