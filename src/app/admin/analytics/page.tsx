"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileCheck,
  FolderKanban,
  MapPin,
  PackageCheck,
  TrendingUp,
  UserCheck,
  Users,
  AlertOctagon,
  Eye,
} from "lucide-react";
import { useState } from "react";

import { Typography } from "@/components/ui";
import { getAdminAnalytics } from "@/lib/api/requests/statistics/get-admin-analytics";
import { toCurrency } from "@/lib/format";

import { MobileHeader } from "../_components/admin-sidebar";

const PERIOD_OPTIONS = [
  { value: 7, label: "7 дней" },
  { value: 30, label: "30 дней" },
  { value: 90, label: "90 дней" },
  { value: 365, label: "1 год" },
];

export default function AdminAnalyticsPage() {
  const [days, setDays] = useState(30);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-analytics", days],
    queryFn: () => getAdminAnalytics(days),
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <MobileHeader title="Аналитика платформы" />

      {/* Header & Period selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <Typography variant="h1" className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-blue-600" />
            Аналитика панели администратора
          </Typography>
          <Typography className="text-sm text-gray-500 mt-1">
            Комплексная статистика объявлений (платные/бесплатные), пользователей, регионов и доходов
          </Typography>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 p-1 self-start sm:self-auto">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                days === opt.value
                  ? "bg-white text-blue-600 shadow-sm font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setDays(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Typography className="text-gray-500">Загрузка аналитики...</Typography>
        </div>
      ) : isError || !data ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">
          <p className="font-semibold">Не удалось загрузить данные аналитики</p>
          <button
            type="button"
            className="mt-3 rounded-md bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700"
            onClick={() => void refetch()}
          >
            Повторить попытку
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Revenue */}
            <div className="rounded-xl border bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-emerald-700">
                <span className="text-xs font-medium uppercase tracking-wider">Выручка ({data.days} дн.)</span>
                <DollarSign className="h-5 w-5" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-emerald-900">{toCurrency(data.periodRevenue)}</span>
              </div>
              <p className="mt-1 text-[11px] text-emerald-700">
                Всего за всё время: <strong>{toCurrency(data.totalRevenue)}</strong>
              </p>
            </div>

            {/* Active Products */}
            <div className="rounded-xl border bg-gradient-to-br from-blue-50 to-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-blue-700">
                <span className="text-xs font-medium uppercase tracking-wider">Активные объявления</span>
                <PackageCheck className="h-5 w-5" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-blue-900">{data.activeProducts}</span>
                <span className="text-xs text-blue-600 font-medium">из {data.totalProducts} всего</span>
              </div>
              <p className="mt-1 text-[11px] text-blue-700">
                Платные: <strong>{data.paidProducts}</strong> · Бесплатные: <strong>{data.freeProducts}</strong>
              </p>
            </div>

            {/* Total Users */}
            <div className="rounded-xl border bg-gradient-to-br from-purple-50 to-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-purple-700">
                <span className="text-xs font-medium uppercase tracking-wider">Пользователи</span>
                <Users className="h-5 w-5" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-purple-900">{data.totalUsers}</span>
                <span className="text-xs text-purple-600 font-medium">+{data.newUsersCount} за период</span>
              </div>
              <p className="mt-1 text-[11px] text-purple-700">
                👤 Физлица: <strong>{data.individualUsersCount}</strong> · 🏢 Юрлица/ИП: <strong>{data.legalUsersCount}</strong>
              </p>
            </div>

            {/* Total Deals */}
            <div className="rounded-xl border bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-amber-700">
                <span className="text-xs font-medium uppercase tracking-wider">Всего сделок</span>
                <FileCheck className="h-5 w-5" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-amber-900">{data.totalDeals}</span>
              </div>
              <p className="mt-1 text-[11px] text-amber-700">
                Новых объявлений за {data.days} дн.: <strong>+{data.newProductsCount}</strong>
              </p>
            </div>
          </div>

          {/* Detailed Slices Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Slice 1: Объявления по статусам и типу оплаты */}
            <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-base">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Срез по статусам объявлений и типу оплаты
                </h3>
              </div>

              <div className="space-y-3">
                {/* Active Paid */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-amber-900 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      Активные платные объявления
                    </span>
                    <span className="font-bold text-gray-900">
                      {data.paidProducts} ({data.activeProducts > 0 ? Math.round((data.paidProducts / data.activeProducts) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{
                        width: `${data.activeProducts > 0 ? (data.paidProducts / data.activeProducts) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Active Free */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-emerald-900 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Активные бесплатные объявления
                    </span>
                    <span className="font-bold text-gray-900">
                      {data.freeProducts} ({data.activeProducts > 0 ? Math.round((data.freeProducts / data.activeProducts) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{
                        width: `${data.activeProducts > 0 ? (data.freeProducts / data.activeProducts) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Moderation */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-blue-900 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      На модерации (ручная + ИИ)
                    </span>
                    <span className="font-bold text-gray-900">{data.moderationCount}</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{
                        width: `${data.totalProducts > 0 ? (data.moderationCount / data.totalProducts) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Drafts */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-gray-400" />
                      Черновики
                    </span>
                    <span className="font-bold text-gray-900">{data.draftsCount}</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-gray-400 rounded-full transition-all"
                      style={{
                        width: `${data.totalProducts > 0 ? (data.draftsCount / data.totalProducts) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Hidden & Denied */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs">
                  <div className="rounded-lg bg-gray-50 p-2 text-center">
                    <span className="text-gray-500 block">Скрытые</span>
                    <strong className="text-sm font-semibold text-gray-800">{data.hiddenCount}</strong>
                  </div>
                  <div className="rounded-lg bg-red-50 p-2 text-center">
                    <span className="text-red-600 block">Отклонённые</span>
                    <strong className="text-sm font-semibold text-red-800">{data.deniedCount}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Slice 2: Срез по пользователям */}
            <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-base">
                  <UserCheck className="h-5 w-5 text-purple-600" />
                  Срез по аудитории пользователей
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border p-3 bg-purple-50/50">
                  <div className="flex items-center gap-2 text-purple-800 font-medium mb-1">
                    <Users className="h-4 w-4" />
                    Физические лица
                  </div>
                  <div className="text-xl font-bold text-purple-950">{data.individualUsersCount}</div>
                  <div className="text-[11px] text-purple-700 mt-1">
                    {data.totalUsers > 0 ? Math.round((data.individualUsersCount / data.totalUsers) * 100) : 0}% от общей базы
                  </div>
                </div>

                <div className="rounded-lg border p-3 bg-blue-50/50">
                  <div className="flex items-center gap-2 text-blue-800 font-medium mb-1">
                    <Building2 className="h-4 w-4" />
                    Юрлица и ИП (ООО / ИП)
                  </div>
                  <div className="text-xl font-bold text-blue-950">{data.legalUsersCount}</div>
                  <div className="text-[11px] text-blue-700 mt-1">
                    {data.totalUsers > 0 ? Math.round((data.legalUsersCount / data.totalUsers) * 100) : 0}% от общей базы
                  </div>
                </div>

                <div className="rounded-lg border p-3 bg-emerald-50/50">
                  <div className="flex items-center gap-2 text-emerald-800 font-medium mb-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Подтверждённый E-mail
                  </div>
                  <div className="text-xl font-bold text-emerald-950">{data.emailVerifiedCount}</div>
                </div>

                <div className="rounded-lg border p-3 bg-indigo-50/50">
                  <div className="flex items-center gap-2 text-indigo-800 font-medium mb-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Подтверждённый Телефон
                  </div>
                  <div className="text-xl font-bold text-indigo-950">{data.phoneVerifiedCount}</div>
                </div>
              </div>

              {data.bannedUsersCount > 0 && (
                <div className="rounded-lg bg-red-50 border border-red-100 p-3 text-xs flex items-center justify-between text-red-800">
                  <span className="flex items-center gap-1.5 font-medium">
                    <AlertOctagon className="h-4 w-4 text-red-600" />
                    Заблокированных пользователей
                  </span>
                  <strong className="text-sm">{data.bannedUsersCount}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Regional & Category Breakdown */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Regions */}
            <div className="rounded-xl border bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-base">
                  <MapPin className="h-5 w-5 text-red-500" />
                  Срез по регионам (Топ-10)
                </h3>
              </div>

              {data.topRegions.length === 0 ? (
                <p className="text-xs text-gray-500 p-4 text-center">Нет данных по регионам</p>
              ) : (
                <div className="space-y-2">
                  {data.topRegions.map((reg, idx) => (
                    <div key={reg.region} className="flex items-center justify-between text-xs py-1 border-b last:border-0">
                      <span className="font-medium text-gray-800 flex items-center gap-2">
                        <span className="w-5 text-gray-400 text-right">{idx + 1}.</span>
                        {reg.region}
                      </span>
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 font-semibold text-gray-700">
                        {reg.count} объв.
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Categories */}
            <div className="rounded-xl border bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-base">
                  <FolderKanban className="h-5 w-5 text-emerald-600" />
                  Срез по категориям (Топ-10)
                </h3>
              </div>

              {data.topCategories.length === 0 ? (
                <p className="text-xs text-gray-500 p-4 text-center">Нет данных по категориям</p>
              ) : (
                <div className="space-y-2">
                  {data.topCategories.map((cat, idx) => (
                    <div key={cat.id} className="flex items-center justify-between text-xs py-1 border-b last:border-0">
                      <span className="font-medium text-gray-800 flex items-center gap-2">
                        <span className="w-5 text-gray-400 text-right">{idx + 1}.</span>
                        {cat.name}
                      </span>
                      <span className="rounded-full bg-emerald-50 text-emerald-800 px-2.5 py-0.5 font-semibold">
                        {cat.count} активных
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Daily Timeline Table */}
          {data.dailyDynamics && data.dailyDynamics.length > 0 && (
            <div className="rounded-xl border bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-base">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Ежедневная динамика регистраций, объявлений и выручки ({data.days} дн.)
                </h3>
              </div>

              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50 text-gray-600">
                      <th className="py-2 px-3 font-semibold">Дата</th>
                      <th className="py-2 px-3 font-semibold text-center">Регистраций пользоватей</th>
                      <th className="py-2 px-3 font-semibold text-center">Создано объявлений</th>
                      <th className="py-2 px-3 font-semibold text-right">Выручка за день</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...data.dailyDynamics].reverse().map((row) => (
                      <tr key={row.date} className="border-b hover:bg-gray-50/80">
                        <td className="py-2 px-3 font-medium text-gray-900">{row.date}</td>
                        <td className="py-2 px-3 text-center text-purple-700 font-semibold">
                          {row.usersCount > 0 ? `+${row.usersCount}` : "0"}
                        </td>
                        <td className="py-2 px-3 text-center text-blue-700 font-semibold">
                          {row.productsCount > 0 ? `+${row.productsCount}` : "0"}
                        </td>
                        <td className="py-2 px-3 text-right text-emerald-700 font-bold">
                          {row.revenue > 0 ? toCurrency(row.revenue) : "0 ₽"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
