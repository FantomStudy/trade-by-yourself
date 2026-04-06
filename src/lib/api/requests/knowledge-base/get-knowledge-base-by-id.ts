import type { KnowledgeBaseArticle } from "@/types";

import { api } from "@/lib/api/instance";

export const getKnowledgeBaseArticleById = async (id: number): Promise<KnowledgeBaseArticle> => {
  return api<KnowledgeBaseArticle>(`/knowledge-base/${id}`);
};

