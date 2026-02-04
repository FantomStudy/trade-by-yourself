import { api } from "../../instance";

interface PathResponse {
  type: "category" | "subcategory" | "subcategoryType";
  data: {
    id: number;
    name: string;
    slug: string;
    fields?: Array<{
      id: number;
      name: string;
      isRequired: boolean;
    }>;
  };
}

export const getCategoryPath = async (slugPath: string) =>
  api<PathResponse>(`/category/path/${slugPath}`);
