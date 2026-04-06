export type KnowledgeBaseArticle = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateKnowledgeBaseArticleInput = {
  title: string;
  content: string;
};

export type UpdateKnowledgeBaseArticleInput = {
  title: string;
  content: string;
};

