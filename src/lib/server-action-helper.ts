import { ResponseError } from "./api";

export type ActionResult<T = void> =
  | { data: T; success: true }
  | {
      details?: unknown;
      error: string | string[];
      status: number;
      success: false;
    };

export const actionSuccess = <T>(data: T): ActionResult<T> => {
  return { success: true, data };
};

export function actionError<T = void>(
  error: string,
  status: number,
  details?: unknown
): ActionResult<T> {
  return { success: false, error, status, details };
}

export const wrapApiCall = async <T>(
  apiCall: () => Promise<T>
): Promise<ActionResult<T>> => {
  try {
    const data = await apiCall();
    return actionSuccess(data);
  } catch (error) {
    if (error instanceof ResponseError) {
      const response = error.response;

      const errorMessage = error.message || "Ошибка запроса";

      console.error("[Server Action Error]", {
        status: response.status,
        message: errorMessage,
        url: error.request.url,
        details: response.data,
      });

      return actionError(errorMessage, response.status, response.data);
    }

    console.error("[Server Action Unexpected Error]", error);

    return actionError(
      error instanceof Error ? error.message : "Неизвестная ошибка",
      500
    );
  }
};
