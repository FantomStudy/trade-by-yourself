import { api } from "../instance";

export interface AddressSuggestion {
  value: string;
}

export const getAddressSuggestions = async (query: string) =>
  api<AddressSuggestion[]>("/address/suggestions", { query: { query } });
