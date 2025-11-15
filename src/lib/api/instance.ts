import { ofetch } from "ofetch";

import { isServer } from "../is-server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("API_URL is not defined");
}

export const api = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
  onRequest: async ({ options }) => {
    if (!isServer()) return;

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();

    if (cookieStore) {
      options.headers.append("cookie", cookieStore.toString());
    }
  },
  // onResponseError: async ({ response, options, request }) => {
  //   if (request.toString().includes("/auth/refresh")) {
  //     return;
  //   }
  //   if (response.status !== 401) {
  //   }
  //   console.log("refresh attempt");
  // const queryClient = getQueryClient();
  // try {
  //   if (!refreshPromise) {
  //     const refreshResponse = await refresh()
  //       .then((res) => {
  //         queryClient.setQueryData(CURRENT_USER_QUERY_KEY, res.user);
  //         return res;
  //       })
  //       .finally(() => {
  //         refreshPromise = null;
  //       });
  //   }
  //   await api(request, options);
  // } catch (error) {
  //   queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
  //   throw error;
  // }
  // },
});
