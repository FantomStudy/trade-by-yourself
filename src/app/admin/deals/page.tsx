"use client";

import type { DealLogTone } from "@/lib/deal-log";
import type { Deal } from "@/types";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { adminSetDealStatus, getAdminDealLogs, getAdminDeals } from "@/api/requests";
import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Typography } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { DEAL_STATUS_LABELS, parseDealLog } from "@/lib/deal-log";

import { MobileHeader } from "../_components/admin-sidebar";

const STATUSES = ["CREATED", "PAID", "SHIPPED", "DELIVERED", "COMPLETED", "CANCELLED", "REFUNDED", "DISPUTE"];
const STATUS_LABELS = DEAL_STATUS_LABELS;

/** Классы вынесены статикой: Tailwind не видит классы, собранные конкатенацией. */
const TONE_CLASSES: Record<DealLogTone, { icon: string; dot: string }> = {
  amber: { icon: "bg-amber-100 text-amber-700", dot: "bg-amber-400" },
  blue: { icon: "bg-blue-100 text-blue-700", dot: "bg-blue-400" },
  emerald: { icon: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400" },
  gray: { icon: "bg-gray-200 text-gray-700", dot: "bg-gray-400" },
  indigo: { icon: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-400" },
  purple: { icon: "bg-purple-100 text-purple-700", dot: "bg-purple-400" },
  rose: { icon: "bg-rose-100 text-rose-700", dot: "bg-rose-400" },
  sky: { icon: "bg-sky-100 text-sky-700", dot: "bg-sky-400" },
};

const ROLE_CLASSES: Record<string, string> = {
  Покупатель: "bg-blue-50 text-blue-700 ring-blue-200",
  Продавец: "bg-purple-50 text-purple-700 ring-purple-200",
  Администратор: "bg-gray-100 text-gray-700 ring-gray-300",
  Участник: "bg-gray-100 text-gray-700 ring-gray-300",
};

/** Кем приходится сделке автор записи — так понятно, кто именно что сделал. */
function resolveActorRole(userId: number, deal: Deal | null, fallback: string) {
  if (deal && userId === deal.buyer.id) return "Покупатель";
  if (deal && userId === deal.seller.id) return "Продавец";
  if (fallback === "admin") return "Администратор";
  return "Участник";
}

export default function AdminDealsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [status, setStatus] = useState("CREATED");
  const [isLogsOpen, setIsLogsOpen] = useState(false);

  const { data: deals = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-deals"],
    queryFn: getAdminDeals,
  });

  const { data: logs = [] } = useQuery({
    queryKey: ["admin-deal-logs", selectedDeal?.id],
    queryFn: () => getAdminDealLogs(selectedDeal!.id),
    enabled: isLogsOpen && !!selectedDeal,
  });

  const updateStatus = useMutation({
    mutationFn: ({ dealId, nextStatus }: { dealId: number; nextStatus: string }) =>
      adminSetDealStatus(dealId, nextStatus),
    onSuccess: () => {
      toast.success("Статус сделки обновлен");
      queryClient.invalidateQueries({ queryKey: ["admin-deals"] });
      if (selectedDeal) {
        queryClient.invalidateQueries({ queryKey: ["admin-deal-logs", selectedDeal.id] });
      }
    },
    onError: () => toast.error("Не удалось обновить статус сделки"),
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sorted = [...deals].sort((a, b) => b.id - a.id);
    if (!q) return sorted;
    return sorted.filter((d) => {
      return (
        d.id.toString().includes(q) ||
        d.product.name.toLowerCase().includes(q) ||
        d.buyer.fullName.toLowerCase().includes(q) ||
        d.seller.fullName.toLowerCase().includes(q) ||
        d.statusCode.toLowerCase().includes(q)
      );
    });
  }, [deals, search]);

  return (
    <div>
      <MobileHeader title="Сделки" />
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Typography variant="h1" className="text-xl font-bold sm:text-2xl">Управление сделками</Typography>
          <Typography className="mt-1 text-gray-600">Список всех сделок, смена статуса и просмотр логов.</Typography>
        </div>
        <Button onClick={() => refetch()}><RefreshCw className="mr-2 h-4 w-4" />Обновить</Button>
      </div>

      <div className="mb-4">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск: ID, товар, покупатель, продавец, статус" />
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        {isLoading ? (
          <div className="p-6 text-sm text-gray-600">Загрузка...</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-2 py-2 text-left text-xs font-semibold">ID</th>
                <th className="px-2 py-2 text-left text-xs font-semibold">Товар</th>
                <th className="px-2 py-2 text-left text-xs font-semibold">Покупатель</th>
                <th className="px-2 py-2 text-left text-xs font-semibold">Продавец</th>
                <th className="px-2 py-2 text-left text-xs font-semibold">Сумма</th>
                <th className="px-2 py-2 text-left text-xs font-semibold">Статус</th>
                <th className="px-2 py-2 text-left text-xs font-semibold">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((deal) => (
                <tr key={deal.id} className="border-b hover:bg-gray-50">
                  <td className="px-2 py-2 text-xs">{deal.id}</td>
                  <td className="px-2 py-2 text-xs">{deal.product.name}</td>
                  <td className="px-2 py-2 text-xs">{deal.buyer.fullName}</td>
                  <td className="px-2 py-2 text-xs">{deal.seller.fullName}</td>
                  <td className="px-2 py-2 text-xs">{deal.amounts.totalAmount} ₽</td>
                  <td className="px-2 py-2 text-xs">{STATUS_LABELS[deal.statusCode] ?? deal.statusCode}</td>
                  <td className="px-2 py-2 text-xs">
                    <div className="flex items-center gap-2">
                      <select
                        className="rounded border px-2 py-1 text-xs"
                        value={deal.statusCode}
                        onChange={(e) => updateStatus.mutate({ dealId: deal.id, nextStatus: e.target.value })}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{STATUS_LABELS[s] ?? s}</option>
                        ))}
                      </select>
                      <Button
                        variant="success"
                        onClick={() => {
                          setSelectedDeal(deal);
                          setStatus(deal.statusCode);
                          setIsLogsOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={isLogsOpen} onOpenChange={setIsLogsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Сделка #{selectedDeal?.id}</DialogTitle>
          </DialogHeader>

          {selectedDeal && (
            <div className="mb-3 grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg border bg-gray-50 p-3 text-xs sm:grid-cols-4">
              <div>
                <div className="text-gray-500">Товар</div>
                <div className="font-semibold text-gray-900">{selectedDeal.product.name}</div>
              </div>
              <div>
                <div className="text-gray-500">Покупатель</div>
                <div className="font-semibold text-gray-900">{selectedDeal.buyer.fullName}</div>
              </div>
              <div>
                <div className="text-gray-500">Продавец</div>
                <div className="font-semibold text-gray-900">{selectedDeal.seller.fullName}</div>
              </div>
              <div>
                <div className="text-gray-500">Сумма / статус</div>
                <div className="font-semibold text-gray-900">
                  {selectedDeal.amounts.totalAmount} ₽ · {STATUS_LABELS[selectedDeal.statusCode] ?? selectedDeal.statusCode}
                </div>
              </div>
            </div>
          )}

          <div className="mb-3 flex items-center gap-2">
            <select className="rounded border px-2 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s] ?? s}</option>
              ))}
            </select>
            <Button
              disabled={!selectedDeal || updateStatus.isPending}
              onClick={() => selectedDeal && updateStatus.mutate({ dealId: selectedDeal.id, nextStatus: status })}
            >
              Сменить статус
            </Button>
          </div>

          <div className="max-h-[400px] space-y-3 overflow-auto rounded-lg border bg-gray-50/50 p-3">
            {logs.length === 0 ? (
              <Typography className="py-6 text-center text-sm text-gray-500">
                Логи по сделке пока отсутствуют
              </Typography>
            ) : (
              <>
                <Typography className="text-xs text-gray-500">
                  История сделки, от последнего события к первому — всего шагов: {logs.length}
                </Typography>
                {logs.map((log, index) => {
                  const parsed = parseDealLog(log.action);
                  const tone = TONE_CLASSES[parsed.tone];
                  const Icon = parsed.icon;
                  const stepNumber = logs.length - index;
                  const role = resolveActorRole(log.userId, selectedDeal, parsed.actor);
                  const uName = log.userName || log.user?.fullName;
                  const uEmail = log.userEmail || log.user?.email;

                  return (
                    <div key={log.id} className="relative flex gap-3">
                      {index < logs.length - 1 && (
                        <span className="absolute top-10 bottom-[-12px] left-[15px] w-px bg-gray-200" aria-hidden />
                      )}
                      <div className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tone.icon}`}>
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="flex-1 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">{parsed.title}</span>
                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${ROLE_CLASSES[role]}`}>
                              {role}
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-400">Шаг {stepNumber} из {logs.length}</span>
                        </div>

                        <p className="mt-1 text-xs leading-relaxed text-gray-600">{parsed.description}</p>

                        <div className="mt-2 text-xs text-gray-500">
                          <span className="font-medium text-gray-800">{uName ?? `Пользователь #${log.userId}`}</span>
                          {uEmail && <span className="ml-1 text-gray-400">{uEmail}</span>}
                          <span className="ml-1 text-gray-400">· ID {log.userId}</span>
                        </div>

                        {parsed.fields.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {parsed.fields.map((field) => (
                              <span
                                key={`${field.label}-${field.value}`}
                                className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-700"
                              >
                                <span className="text-gray-500">{field.label}: </span>
                                <span className="font-mono">{field.value}</span>
                              </span>
                            ))}
                          </div>
                        )}

                        <details className="group mt-2">
                          <summary className="cursor-pointer list-none text-[11px] text-gray-400 hover:text-gray-600">
                            Техническая запись #{log.id}
                            {parsed.event ? ` · ${parsed.event}` : ""}
                          </summary>
                          <div className="mt-1 rounded bg-gray-50 p-2 font-mono text-[11px] whitespace-pre-wrap text-gray-600">
                            {log.action}
                          </div>
                        </details>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
