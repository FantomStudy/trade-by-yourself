import type { KnowledgeBaseArticle } from "@/types";

import { api } from "@/lib/api/instance";

export const getKnowledgeBaseArticles = async (): Promise<KnowledgeBaseArticle[]> => {
  return api<KnowledgeBaseArticle[]>("/knowledge-base/");
};

