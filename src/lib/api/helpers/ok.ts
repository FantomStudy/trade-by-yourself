import type { FetchesResponse } from "./fetches";

import { ResponseError } from "./fetches";

export type OkResult<T> =
  | {
      data: T;
      success: true;
    }
  | {
      error: string;
      status?: number;
      success: false;
    };

export interface OkOptions {
  context?: string;
}

export const ok = async <T>(
  promise: Promise<FetchesResponse<T>>,
  _options?: OkOptions,
): Promise<OkResult<T>> => {
  try {
    const response = await promise;
    return { success: true, data: response.data };
  } catch (err) {
    if (err instanceof ResponseError) {
      const message = err.message || "Unexpected API error";

      return {
        success: false,
        error: message,
        status: err.response.status,
      };
    }

    return {
      success: false,
      error: "Unexpected error",
    };
  }
};
