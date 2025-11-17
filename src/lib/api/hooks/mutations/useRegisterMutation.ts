import type { RegisterData } from "../../types";

import { useMutation } from "@tanstack/react-query";

import { register } from "../../requests";

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (credentials: RegisterData) => register(credentials),
  });
};
