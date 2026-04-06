import { isServer } from "@/lib/is-server";

type RequestMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
type RequestBody = BodyInit | Record<string, any> | null | undefined;

interface RequestSearchParams {
  [key: string]: any;
}

export interface RequestOptions<T = undefined> extends Omit<RequestInit, "body"> {
  body?: T extends undefined ? RequestBody : T;
  method?: RequestMethod;
  query?: RequestSearchParams;
}

interface ErrorResponseData {
  data: any;
  status: number;
}

export class ResponseError extends Error {
  request: RequestOptions;
  response: ErrorResponseData;

  constructor(message: string, options: { request: RequestOptions; response: ErrorResponseData }) {
    super(message, { cause: options });
    this.request = options.request;
    this.response = options.response;
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const prepareBody = (body: RequestBody) => {
  if (body instanceof FormData || body instanceof Blob) return body;
  return JSON.stringify(body);
};

const createSearchParams = (query: RequestSearchParams) => {
  const searchParams = new URLSearchParams();

  for (const key in query) {
    if (key in query) {
      const value = query[key];

      if (value === undefined || value === null) continue;

      if (Array.isArray(value)) {
        value.forEach((currentValue) => searchParams.append(key, currentValue.toString()));
      } else {
        searchParams.set(key, value.toString());
      }
    }
  }

  return `?${searchParams.toString()}`;
};

export const fetcher = async <T>(endpoint?: string, options: RequestOptions = {}): Promise<T> => {
  const { body, query, method = "GET", headers, ...rest } = options;

  // TODO: сделать проксирование Next, чтобы не давать публичный доступ к API
  let url = `${BASE_URL}${endpoint}`;
  if (query && Object.keys(query).length) {
    url += createSearchParams(query);
  }

  let cookiesHeader: string | undefined;
  if (isServer()) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();

    if (cookieStore) {
      const session = cookieStore.get("session_id");
      if (session) {
        cookiesHeader = `session_id=${session.value}`;
      }
    }
  }

  const config = {
    ...rest,
    ...(body && { body: prepareBody(body) }),
    method,
    headers: {
      ...headers,
      ...(cookiesHeader && { cookie: cookiesHeader }),
      ...(body &&
        !(body instanceof FormData || body instanceof Blob) && {
          "content-type": "application/json",
        }),
    },
  };

  const response = await fetch(url, {
    credentials: "include",
    ...config,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ResponseError(response.statusText, {
      request: config,
      response: {
        status: response.status,
        data,
      },
    });
  }

  return data;
};
