import type { ForgotPasswordData } from "@/lib/api";

import { useMutation } from "@tanstack/react-query";

import { forgotPassword } from "@/lib/api";

export const useRecoverMutation = () => {
  return useMutation({
    mutationFn: async (payload: ForgotPasswordData) => forgotPassword(payload),
  });
};
