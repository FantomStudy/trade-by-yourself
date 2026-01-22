"use client";

import { useMemo, useState } from "react";

import { Button, Input } from "@/components/ui";
import { useLogsQuery } from "@/lib/api/hooks/queries/useLogsQuery";

const LogsPage = () => {
  const { data: logs, isLoading, error, refetch } = useLogsQuery();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = useMemo(() => {
    if (!logs) return [];
    
    let result = [...logs];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((log) => {
        return (
          log.id.toString().includes(searchQuery) ||
          log.userId.toString().includes(searchQuery) ||
          log.action.toLowerCase().includes(query) ||
          log.user?.fullName.toLowerCase().includes(query) ||
          log.user?.email?.toLowerCase().includes(query) ||
          log.user?.id.toString().includes(searchQuery)
        );
      });
    }
    
    // Сортируем по ID в обратном порядке (новые сверху)
    return result.sort((a, b) => b.id - a.id);
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

      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">
              {searchQuery
                ? "Логи не найдены по вашему запросу"
                : "Логи отсутствуют"}
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-500">
                      Log ID: {log.id}
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                      User ID: {log.userId}
                    </span>
                  </div>
                  
                  <div className="mt-2 rounded-md bg-blue-50 px-3 py-2">
                    <div className="whitespace-pre-wrap text-sm font-medium text-blue-900">
                      {log.action.split('\\n').join('\n')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
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
