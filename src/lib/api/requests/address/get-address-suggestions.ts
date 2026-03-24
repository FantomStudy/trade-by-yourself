import { api } from "../../instance";

export interface AddressSuggestion {
  value: string;
}

export const getAddressSuggestions = async (query: string): Promise<AddressSuggestion[]> => {
  return api<AddressSuggestion[]>("/address/suggestions", {
    method: "GET",
    query: { query },
  });
};
