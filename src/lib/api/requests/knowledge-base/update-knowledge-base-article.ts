import type { KnowledgeBaseArticle, UpdateKnowledgeBaseArticleInput } from "@/types";

import { api } from "@/lib/api/instance";

export const updateKnowledgeBaseArticle = async (
  id: number,
  data: UpdateKnowledgeBaseArticleInput,
): Promise<KnowledgeBaseArticle> => {
  return api<KnowledgeBaseArticle>(`/knowledge-base/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

