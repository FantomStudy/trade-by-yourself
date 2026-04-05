import type { VerifyMobileCodeData, VerifyMobileCodeResponse } from "@/api/types";

import { api } from "@/api/instance";

export const verifyMobileCode = async (data: VerifyMobileCodeData) =>
  api<VerifyMobileCodeResponse>("/auth/verify-mobile-code", {
    method: "POST",
    query: data,
  });
