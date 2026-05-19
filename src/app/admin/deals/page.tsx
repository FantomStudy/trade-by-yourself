"use client";

import type { Deal } from "@/types";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { adminSetDealStatus, getAdminDealLogs, getAdminDeals } from "@/api/requests";
import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Typography } from "@/components/ui";
import { Button } from "@/components/ui/Button";

import { MobileHeader } from "../_components/admin-sidebar";

const STATUSES = ["CREATED", "PAID", "SHIPPED", "DELIVERED", "COMPLETED", "CANCELLED", "REFUNDED", "DISPUTE"];

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
                  <td className="px-2 py-2 text-xs">{deal.statusCode}</td>
                  <td className="px-2 py-2 text-xs">
                    <div className="flex items-center gap-2">
                      <select
                        className="rounded border px-2 py-1 text-xs"
                        value={deal.statusCode}
                        onChange={(e) => updateStatus.mutate({ dealId: deal.id, nextStatus: e.target.value })}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
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

          <div className="mb-3 flex items-center gap-2">
            <select className="rounded border px-2 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <Button
              disabled={!selectedDeal || updateStatus.isPending}
              onClick={() => selectedDeal && updateStatus.mutate({ dealId: selectedDeal.id, nextStatus: status })}
            >
              Сменить статус
            </Button>
          </div>

          <div className="max-h-[360px] space-y-2 overflow-auto rounded border p-3">
            {logs.length === 0 ? (
              <Typography className="text-sm text-gray-500">Логи по сделке пока отсутствуют</Typography>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="rounded border bg-gray-50 p-2 text-sm">
                  <div className="text-xs text-gray-500">log #{log.id} • user #{log.userId}</div>
                  <div>{log.action}</div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
