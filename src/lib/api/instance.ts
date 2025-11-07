import { isServer } from "../is-server";
import fetches from "./fetches";
import { refresh } from "./requests";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

if (!BASE_URL) {
  throw new Error("API_URL is not defined");
}

export const api = fetches.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  if (!isServer()) return config;

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  if (cookieStore && config.headers) {
    config.headers.cookie = cookieStore.toString();
  }

  console.log("@interceptor config", config);
  return config;
});
