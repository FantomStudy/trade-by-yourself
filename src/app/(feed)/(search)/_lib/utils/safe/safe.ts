import type { SafeResult } from "./types";

import { ResponseError } from "../fetcher";

export const safe = async <T>(promise: Promise<T>): Promise<SafeResult<T>> => {
  try {
    const data = await promise;
    console.log(data);

    return { success: true, data };
  } catch (err) {
    if (err instanceof ResponseError) {
      return {
        success: false,
        error: err.response.data?.message || err.message,
        status: err.response.status,
      };
    }

    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
};
