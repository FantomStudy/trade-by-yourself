"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, Eye, Image as ImageIcon } from "lucide-react";

import { getMyBannerStats } from "@/api/requests/banner";
import { Typography } from "@/components/ui";

const placeLabelMap: Record<string, string> = {
  PRODUCT_FEED: "Лента товаров",
  PROFILE: "Профиль",
  CHATS: "Чаты",
  FAVORITES: "Избранное",
};

const BannerStatsPage = () => {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["banner-stats", "my"],
    queryFn: getMyBannerStats,
  });

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div>
          <Typography className="text-2xl font-bold sm:text-3xl">Статистика баннеров</Typography>
          <Typography className="mt-2 text-gray-600">Просмотры ваших рекламных баннеров</Typography>
        </div>
        <div className="flex min-h-[300px] items-center justify-center rounded-lg bg-white p-8 shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-purple-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full space-y-6">
        <div>
          <Typography className="text-2xl font-bold sm:text-3xl">Статистика баннеров</Typography>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <Typography className="text-red-600">Ошибка загрузки статистики</Typography>
        </div>
      </div>
    );
  }

  const totalViews = stats?.reduce((sum, s) => sum + s.totalViews, 0) ?? 0;

  return (
    <div className="w-full space-y-6">
      <div>
        <Typography className="text-2xl font-bold sm:text-3xl">Статистика баннеров</Typography>
        <Typography className="mt-2 text-gray-600">Просмотры ваших рекламных баннеров</Typography>
      </div>

      {/* Общая статистика */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-3">
              <ImageIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Всего баннеров</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.length ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Всего просмотров</p>
              <p className="text-2xl font-bold text-gray-900">{totalViews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Список баннеров */}
      <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-500" />
          <Typography className="text-lg font-semibold">Статистика по баннерам</Typography>
        </div>

        {!stats || stats.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <ImageIcon className="mx-auto mb-3 h-12 w-12 text-gray-400" />
            <Typography className="font-medium text-gray-600">
              У вас пока нет активных баннеров
            </Typography>
            <Typography className="mt-1 text-sm text-gray-500">
              Создайте заявку на размещение баннера
            </Typography>
          </div>
        ) : (
          <div className="space-y-4">
            {stats.map((bannerStat) => (
              <div
                key={bannerStat.bannerId}
                className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{bannerStat.bannerName}</h3>
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                        {placeLabelMap[bannerStat.place] || bannerStat.place}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 sm:gap-6">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-gray-500">Просмотры</p>
                        <p className="font-semibold text-gray-900">{bannerStat.totalViews}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* График по дням (если есть данные) */}
                {bannerStat.viewsByDate && bannerStat.viewsByDate.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <p className="mb-2 text-sm font-medium text-gray-600">
                      Просмотры за последние дни
                    </p>
                    <div className="flex items-end gap-1 overflow-x-auto">
                      {bannerStat.viewsByDate.slice(-14).map((day) => {
                        const maxViews = Math.max(...bannerStat.viewsByDate.map((d) => d.views), 1);
                        const height = (day.views / maxViews) * 60 + 4;

                        return (
                          <div
                            key={day.date}
                            className="group relative flex min-w-[24px] flex-col items-center"
                          >
                            <div
                              className="w-4 rounded-t bg-purple-500 transition-all group-hover:bg-purple-600"
                              style={{ height: `${height}px` }}
                            />
                            <span className="mt-1 text-[10px] text-gray-400">
                              {new Date(day.date).getDate()}
                            </span>
                            <div className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
                              {day.views}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Информационный блок */}
      <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
        <Typography className="font-semibold text-purple-800">Как считается статистика?</Typography>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-purple-700">
          <li>Просмотры — количество кликов на баннер</li>
          <li>Статистика обновляется в реальном времени</li>
        </ul>
      </div>
    </div>
  );
};

export default BannerStatsPage;
