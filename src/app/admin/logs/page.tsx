"use client";

import { useMemo, useState } from "react";
import { Input, Typography } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { useLogsQuery } from "@/lib/api/hooks/queries/useLogsQuery";

import { MobileHeader } from "../_components/admin-sidebar";

const EVENT_LABELS: Record<string, { label: string; color: string }> = {
  create: { label: "Создание", color: "bg-blue-100 text-blue-800 border-blue-200" },
  payment_init: { label: "Инициализация оплаты", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  pay: { label: "Оплата", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  pay_sync: { label: "Оплата (синхр.)", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  cdek_handoff: { label: "Передача СДЭК", color: "bg-purple-100 text-purple-800 border-purple-200" },
  ship: { label: "Отправка", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  deliver: { label: "Доставлено", color: "bg-green-100 text-green-800 border-green-200" },
  dispute: { label: "Спор", color: "bg-amber-100 text-amber-800 border-amber-200" },
  cancel: { label: "Отмена", color: "bg-rose-100 text-rose-800 border-rose-200" },
  admin_status: { label: "Смена статуса (Админ)", color: "bg-sky-100 text-sky-800 border-sky-200" },
};

function parseLogAction(action: string) {
  const matchDeal = action.match(/deal_id=(\d+)/i);
  const matchEvent = action.match(/event=([^\s]+)/i);
  
  const dealId = matchDeal ? matchDeal[1] : null;
  const eventKey = matchEvent ? matchEvent[1].toLowerCase() : null;
  const eventInfo = eventKey && EVENT_LABELS[eventKey] ? EVENT_LABELS[eventKey] : null;

  return {
    isDeal: Boolean(dealId),
    dealId,
    eventLabel: eventInfo?.label ?? (eventKey ? eventKey : null),
    badgeColor: eventInfo?.color ?? "bg-gray-100 text-gray-800 border-gray-200",
    rawAction: action,
  };
}

const LogsPage = () => {
  const { data: logs, isLoading, error, refetch } = useLogsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"ALL" | "DEALS">("ALL");

  const filteredLogs = useMemo(() => {
    if (!logs) return [];

    let result = [...logs];

    if (filterTab === "DEALS") {
      result = result.filter((log) => log.action.toLowerCase().includes("deal_id="));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((log) => {
        const uName = log.userName || log.user?.fullName || "";
        const uEmail = log.userEmail || log.user?.email || "";
        return (
          log.id.toString().includes(searchQuery) ||
          log.userId.toString().includes(searchQuery) ||
          log.action.toLowerCase().includes(query) ||
          uName.toLowerCase().includes(query) ||
          uEmail.toLowerCase().includes(query)
        );
      });
    }

    return result.sort((a, b) => b.id - a.id);
  }, [logs, searchQuery, filterTab]);

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
        <div className="text-lg text-red-600">Ошибка загрузки логов: {String(error)}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MobileHeader title="Логи системы" />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Логи системы</h1>
          <p className="text-sm text-gray-600">История действий пользователей и логирование сделок</p>
        </div>
        <Button type="button" onClick={() => refetch()}>
          Обновить
        </Button>
      </div>

      {/* Переключатель табов */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            filterTab === "ALL"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setFilterTab("ALL")}
        >
          Все события ({logs?.length || 0})
        </button>
        <button
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            filterTab === "DEALS"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setFilterTab("DEALS")}
        >
          Логи сделок ({logs?.filter((l) => l.action.toLowerCase().includes("deal_id=")).length || 0})
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          className="w-full bg-white sm:max-w-md"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по ID, сделке, действию, пользователю..."
        />
        <div className="text-sm text-gray-600">
          Найдено: {filteredLogs.length} из {logs?.length || 0}
        </div>
      </div>

      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">
              {searchQuery ? "Логи не найдены по вашему запросу" : "Логи отсутствуют"}
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const parsed = parseLogAction(log.action);
            const uName = log.userName || log.user?.fullName;
            const uEmail = log.userEmail || log.user?.email;

            return (
              <div
                key={log.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                      ID #{log.id}
                    </span>
                    {parsed.isDeal && (
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                        Сделка #{parsed.dealId}
                      </span>
                    )}
                    {parsed.eventLabel && (
                      <span className={`rounded border px-2 py-0.5 text-xs font-semibold ${parsed.badgeColor}`}>
                        {parsed.eventLabel}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Пользователь ID #{log.userId}
                    {uName && <span className="ml-1 font-medium text-gray-800">• {uName}</span>}
                    {uEmail && <span className="ml-1 text-gray-500">({uEmail})</span>}
                  </div>
                </div>

                <div className="mt-2 rounded-md bg-gray-50 p-3 text-sm text-gray-800 font-mono whitespace-pre-wrap border border-gray-100">
                  {log.action}
                </div>
              </div>
            );
          })
        )}
      </div>

      {filteredLogs.length > 0 && (
        <div className="text-sm text-gray-600">Показано {filteredLogs.length} записей</div>
      )}
    </div>
  );
};

export default LogsPage;
