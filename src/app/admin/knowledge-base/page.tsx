"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { KnowledgeBaseArticle } from "@/types";
import {
  createKnowledgeBaseArticle,
  deleteKnowledgeBaseArticle,
  getKnowledgeBaseArticles,
  updateKnowledgeBaseArticle,
} from "@/lib/api";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
  Typography,
} from "@/components/ui";

import { MobileHeader } from "../_components/admin-sidebar";

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const KnowledgeBaseAdminPage = () => {
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await getKnowledgeBaseArticles();
      setArticles(data);
    } catch {
      toast.error("Не удалось загрузить базу знаний");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setDialogOpen(true);
  };

  const openEdit = (article: KnowledgeBaseArticle) => {
    setEditingId(article.id);
    setTitle(article.title);
    setContent(article.content);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (isSubmitting) return;
    setDialogOpen(false);
    setEditingId(null);
    setTitle("");
    setContent("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      toast.error("Введите заголовок");
      return;
    }
    if (!trimmedContent) {
      toast.error("Введите текст статьи");
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingId === null) {
        await createKnowledgeBaseArticle({ title: trimmedTitle, content: trimmedContent });
        toast.success("Статья создана");
      } else {
        await updateKnowledgeBaseArticle(editingId, {
          title: trimmedTitle,
          content: trimmedContent,
        });
        toast.success("Статья обновлена");
      }

      setDialogOpen(false);
      setEditingId(null);
      setTitle("");
      setContent("");
      await loadData();
    } catch {
      toast.error("Не удалось сохранить статью");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, articleTitle: string) => {
    if (!window.confirm(`Удалить статью "${articleTitle}"?`)) return;

    try {
      setDeletingId(id);
      await deleteKnowledgeBaseArticle(id);
      toast.success("Статья удалена");
      await loadData();
    } catch {
      toast.error("Не удалось удалить статью");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 bg-white min-h-[calc(100dvh-200px)]">
        <MobileHeader title="База знаний" />
        <div>
          <Typography className="text-xl font-bold sm:text-3xl">База знаний</Typography>
          <Typography className="mt-2 text-sm text-gray-600">Загрузка статей...</Typography>
        </div>
        <div className="flex min-h-[260px] items-center justify-center rounded-lg bg-white shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white min-h-[calc(100dvh-200px)]">
      <MobileHeader title="База знаний" />

      <div>
        <Typography className="text-xl font-bold sm:text-3xl">База знаний</Typography>
        <Typography className="mt-2 text-sm text-gray-600">Управление статьями</Typography>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button onClick={openCreate} className="bg-blue-500 hover:bg-blue-600">
          <Plus className="mr-2 h-4 w-4" />
          Создать статью
        </Button>

        <Typography className="text-sm text-gray-600">
          Всего: {articles.length}
        </Typography>
      </div>

      <div className="grid gap-3">
        {articles.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <Typography className="text-gray-500">Нет статей в базе знаний</Typography>
          </div>
        ) : (
          articles.map((article) => (
            <div
              key={article.id}
              className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <Typography className="truncate text-base font-semibold">{article.title}</Typography>
                  <div className="text-xs text-gray-500 whitespace-nowrap">
                    {formatDate(article.updatedAt)}
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  ID: {article.id}
                </div>
              </div>

              <div className="flex flex-shrink-0 items-center gap-2">
                <Link
                  href={`/knowledge-base/${article.id}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow-sm transition hover:scale-105"
                  title="Открыть на сайте"
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </Link>

                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow-sm transition hover:scale-105"
                  title="Редактировать"
                  onClick={() => openEdit(article)}
                >
                  <Edit className="h-4 w-4 text-blue-600" />
                </button>

                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow-sm transition hover:scale-105 disabled:opacity-40"
                  title="Удалить"
                  disabled={deletingId === article.id}
                  onClick={() => handleDelete(article.id, article.title)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog();
          else setDialogOpen(open);
        }}
      >
        <DialogContent className="max-w-3xl w-[calc(100vw-32px)] p-6">
          <DialogHeader>
            <DialogTitle>{editingId === null ? "Создать статью" : "Редактировать статью"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="kb-title" className="block text-sm font-medium text-gray-700">
                Заголовок
              </label>
              <Input
                id="kb-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Как оформить заказ"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="kb-content" className="block text-sm font-medium text-gray-700">
                Текст статьи
              </label>
              <Textarea
                id="kb-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Введите текст статьи..."
                className="min-h-56"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={closeDialog} disabled={isSubmitting}>
                Отмена
              </Button>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={isSubmitting}>
                {isSubmitting ? "Сохранение..." : editingId === null ? "Создать" : "Сохранить"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KnowledgeBaseAdminPage;

