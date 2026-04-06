import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { api } from "@/lib/api/instance";
import type { KnowledgeBaseArticle } from "@/types";

export const metadata: Metadata = {
  title: "База знаний — Торгуй сам",
  description: "Просмотр статьи базы знаний",
};

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const KnowledgeBaseArticlePage = async ({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await params;
  const idNum = Number(id);
  if (!Number.isFinite(idNum) || idNum <= 0) notFound();

  let article: KnowledgeBaseArticle;
  try {
    article = await api<KnowledgeBaseArticle>(`/knowledge-base/${idNum}`);
  } catch {
    notFound();
  }

  return (
    <div className="bg-white h-full flex min-h-0 flex-col knowledge-base-bg">
      <div className="global-container py-10 text-gray-800">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-6 flex items-start justify-between gap-4">
            <Link href="/knowledge-base" className="text-sm font-medium text-blue-600 hover:underline">
              ← Назад к статьям
            </Link>
          </div>

          <h1 className="text-2xl font-bold sm:text-3xl">{article.title}</h1>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <span>Создано: {formatDate(article.createdAt)}</span>
            <span>Обновлено: {formatDate(article.updatedAt)}</span>
          </div>

          <article className="mt-8 whitespace-pre-wrap break-words leading-relaxed">
            {article.content}
          </article>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseArticlePage;

