export type SafeResult<T> =
  | {
      data: T;
      success: true;
    }
  | {
      error: string;
      status?: number;
      success: false;
    };
