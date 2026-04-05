import type { VerifyMobileCodeData } from "@/api/types";

import { useMutation } from "@tanstack/react-query";

import { verifyMobileCode } from "@/api/requests";

export const useVerifyMobileCodeMutation = () => {
  return useMutation({
    mutationFn: async (data: VerifyMobileCodeData) => verifyMobileCode(data),
  });
};
