"use client";

import { useMemo, useState } from "react";

import { Button, Input } from "@/components/ui";
import { useLogsQuery } from "@/lib/api/hooks/queries/useLogsQuery";

const LogsPage = () => {
  const { data: logs, isLoading, error, refetch } = useLogsQuery();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = useMemo(() => {
    if (!logs) return [];
    if (!searchQuery.trim()) return logs;

    const query = searchQuery.toLowerCase();
    return logs.filter((log) => {
      return (
        log.id.toString().includes(searchQuery) ||
        log.userId.toString().includes(searchQuery) ||
        log.action.toLowerCase().includes(query) ||
        log.user?.fullName.toLowerCase().includes(query) ||
        log.user?.email?.toLowerCase().includes(query)
      );
    });
  }, [logs, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-lg text-gray-600">Загрузка логов...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-lg text-red-600">
          Ошибка загрузки логов: {String(error)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Логи системы</h1>
        <Button type="button" onClick={() => refetch()}>
          Обновить
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          className="max-w-md bg-white"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по ID, действию, пользователю..."
        />
        <div className="text-sm text-gray-600">
          Найдено: {filteredLogs.length} из {logs?.length || 0}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                ID
              </th>
              <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                User ID
              </th>
              <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Пользователь
              </th>
              <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Действие
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={5}>
                  {searchQuery
                    ? "Логи не найдены по вашему запросу"
                    : "Логи отсутствуют"}
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="border-b px-4 py-3 text-sm text-gray-900">
                    {log.id}
                  </td>
                  <td className="border-b px-4 py-3 text-sm text-gray-900">
                    {log.userId}
                  </td>
                  <td className="border-b px-4 py-3 text-sm text-gray-900">
                    {log.user?.fullName || "-"}
                  </td>
                  <td className="border-b px-4 py-3 text-sm text-gray-600">
                    {log.user?.email || "-"}
                  </td>
                  <td className="border-b px-4 py-3 text-sm">
                    <code className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-800">
                      {log.action}
                    </code>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredLogs.length > 0 && (
        <div className="text-sm text-gray-600">
          Показано {filteredLogs.length} записей
        </div>
      )}
    </div>
  );
};

export default LogsPage;
