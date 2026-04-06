import type { CreateKnowledgeBaseArticleInput, KnowledgeBaseArticle } from "@/types";

import { api } from "@/lib/api/instance";

export const createKnowledgeBaseArticle = async (
  data: CreateKnowledgeBaseArticleInput,
): Promise<KnowledgeBaseArticle> => {
  return api<KnowledgeBaseArticle>("/knowledge-base/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

