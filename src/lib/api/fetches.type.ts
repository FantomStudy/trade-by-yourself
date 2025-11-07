// Типы для ответа
export type ResponseParseFunction = (data: unknown) => Promise<unknown>;
export type ResponseParseMode =
  | "arrayBuffer"
  | "blob"
  | "formData"
  | "json"
  | "raw"
  | "text";
export type ResponseParse = ResponseParseFunction | ResponseParseMode;

// Типы для запроса
export type RequestMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
export type RequestBody = BodyInit | Record<string, any> | null | undefined;
export interface RequestSearchParams {
  [key: string]:
    | boolean
    | number
    | string
    | number[]
    | string[]
    | null
    | undefined;
}

export interface RequestOptions extends Omit<RequestInit, "body" | "method"> {
  baseURL?: string;
  body?: RequestBody;
  headers?: Record<string, any>;
  onRequestFailure?: FailureRequestFunction;
  onRequestSuccess?: SuccessRequestFunction;
  onResponseFailure?: FailureResponseFunction;
  onResponseSuccess?: SuccessResponseFunction;
  parse?: ResponseParse;
  query?: RequestSearchParams;
}

export type RequestConfig = RequestInit & {
  _retry?: boolean;
  headers?: Record<string, string>;
  method: RequestMethod;
  parse?: ResponseParse;
  url: string;
};

// Типы для настройки Fetches
export interface FetchesParams {
  baseURL: string;
  cache?: RequestCache;
  headers?: Record<string, string>;
  parse?: ResponseParse;
  withCredentials?: boolean;
}

export interface FetchesResponse<Data> {
  config: RequestConfig;
  data: Data;
  headers: Headers;
  options: RequestOptions;
  status: number;
  statusText: string;
  url: string;
}

// Класс ошибки ответа
export class ResponseError extends Error {
  response: FetchesResponse<any>;
  request: RequestConfig;

  constructor(
    message: string,
    options: { request: RequestConfig; response: FetchesResponse<any> }
  ) {
    super(message, { cause: options });
    this.response = options.response;
    this.request = options.request;
  }
}

// Типы для интерсепторов
export type SuccessResponseFunction = <Data = any>(
  response: FetchesResponse<Data>
) => FetchesResponse<Data> | Promise<FetchesResponse<Data>>;

export type SuccessRequestFunction = (
  config: RequestConfig
) => Promise<RequestConfig> | RequestConfig;

export type FailureResponseFunction = (error: ResponseError) => any;
export type FailureRequestFunction = (error: ResponseError) => any;

export interface RequestInterceptor {
  onFailure?: FailureRequestFunction;
  onSuccess?: SuccessRequestFunction;
}

export interface ResponseInterceptor {
  onFailure?: FailureResponseFunction;
  onSuccess?: SuccessResponseFunction;
}
export interface Interceptors {
  request?: RequestInterceptor[];
  response?: ResponseInterceptor[];
}
