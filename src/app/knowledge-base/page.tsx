import type { Metadata } from "next";
import Link from "next/link";

import { api } from "@/lib/api/instance";
import type { KnowledgeBaseArticle } from "@/types";

export const metadata: Metadata = {
  title: "База знаний — Торгуй сам",
  description: "Полезные статьи и инструкции",
};

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const KnowledgeBasePage = async () => {
  let articles: KnowledgeBaseArticle[] = [];
  let hasError = false;

  try {
    articles = await api<KnowledgeBaseArticle[]>("/knowledge-base/");
  } catch {
    hasError = true;
  }

  return (
    <div className="bg-white h-full flex min-h-0 flex-col knowledge-base-bg">
      <div className="global-container py-10 text-gray-800">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-10">
            <h1 className="text-center text-2xl font-bold sm:text-3xl">База знаний</h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              Статьи с ответами на частые вопросы и подробными инструкциями
            </p>
          </div>

          {hasError ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
              <div className="text-lg font-semibold">Не удалось загрузить статьи</div>
              <div className="mt-2 text-sm text-gray-600">Попробуйте обновить страницу позже</div>
            </div>
          ) : articles.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
              <div className="text-lg font-semibold">Статьи скоро появятся</div>
              <div className="mt-2 text-sm text-gray-600">Пока в базе знаний нет материалов</div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/knowledge-base/${article.id}`}
                  className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="line-clamp-2 text-base font-semibold">{article.title}</h2>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Обновлено: {formatDate(article.updatedAt)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBasePage;

