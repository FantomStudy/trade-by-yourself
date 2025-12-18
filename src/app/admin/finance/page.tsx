"use client";

import type { User } from "@/types";

import { useEffect, useState } from "react";

import { Typography } from "@/components/ui";
import { findAllUsers } from "@/lib/api";

import { UsersTable } from "./_components/users-table";

const FinancePage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await findAllUsers();
      // Сортируем по ID для сохранения порядка
      const sortedData = data.sort((a, b) => a.id - b.id);
      setUsers(sortedData);
    } catch (err) {
      console.error("Ошибка загрузки пользователей:", err);
      setError("Не удалось загрузить список пользователей");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <Typography className="text-3xl font-bold">
          Управление деньгами
        </Typography>
        <Typography className="mt-2 text-gray-600">
          Финансовая статистика и управление балансами пользователей
        </Typography>
      </div>

      <div className="w-[100%] max-w-full rounded-lg border border-gray-200 bg-white p-4 shadow md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <Typography className="text-xl font-semibold">
            Пользователи
          </Typography>
          <Typography className="text-sm text-gray-500">
            Всего: {users.length}
          </Typography>
        </div>

        {isLoading && (
          <div className="py-12 text-center">
            <Typography className="text-gray-500">Загрузка...</Typography>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <Typography className="text-red-800">{error}</Typography>
          </div>
        )}

        {!isLoading && !error && (
          <UsersTable users={users} onBalanceUpdate={loadUsers} />
        )}
      </div>
    </div>
  );
};

export default FinancePage;
