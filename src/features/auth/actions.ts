"use server";

import { login } from "@/lib/api";

export const loginAction = async (_prevState: string, formData: FormData) => {
  const data = {
    login: formData.get("login") as string,
    password: formData.get("password") as string,
  };

  await login(data);

  return "Not implemented";
};

export const registerAction = async (
  _prevState: string,
  formData: FormData
) => {
  return "Not implemented";
};

export const recoverAction = async (_prevState: string, formData: FormData) => {
  return "Not implemented";
};
