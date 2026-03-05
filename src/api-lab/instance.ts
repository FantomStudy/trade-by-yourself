import { ofetch } from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!BASE_URL) {
  throw new Error("API_URL is not defined");
}

export const api = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
  retry: false,
  onRequest: async ({ options }) => {
    if (typeof window !== "undefined") return;

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    if (cookieStore) {
      options.headers.append(
        "cookie",
        cookieStore
          .getAll()
          .map((cookie) => `${cookie.name}=${cookie.value}`)
          .join("; "),
      );
    }
  },
});
