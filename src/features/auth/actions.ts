"use server";

import { login } from "@/lib/api";
import { wrapApiCall } from "@/lib/server-action-helper";

export const loginAction = async (_prevState: unknown, formData: FormData) => {
  const data = {
    login: formData.get("login") as string,
    password: formData.get("password") as string,
  };

  const result = await wrapApiCall(() => login(data));

  if (result.success) {
    console.log("[LOG] User logged in:", result.data);
  }

  return result;
};

// export const registerAction = async (
//   _prevState: string,
//   formData: FormData
// ) => {
//   return "Not implemented";
// };

// export const recoverAction = async (_prevState: string, formData: FormData) => {
//   return "Not implemented";
// };
