import fetches from "./utils/fetches";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("API_URL is not defined");
}

export const api = fetches.create({
  baseURL: API_URL,
  withCredentials: true,
});
