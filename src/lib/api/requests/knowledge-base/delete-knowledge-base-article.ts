import { api } from "@/lib/api/instance";

export const deleteKnowledgeBaseArticle = async (id: number) => {
  return api(`/knowledge-base/${id}`, {
    method: "DELETE",
  });
};

