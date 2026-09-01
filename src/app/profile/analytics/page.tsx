"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  BarChart3,
  Eye,
  Heart,
  Lock,
  MessageSquare,
  Package,
  Phone,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAnalytics } from "@/components/_deprecated/useAnalytics";
import { Typography } from "@/components/ui";
import { useCategories, useChats } from "@/lib/api/hooks";
import { getFavorites, getSearchQueriesStats } from "@/lib/api/requests";

import styles from "./page.module.css";

type TabType = "overview" | "search-queries";

const Analytics = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("year");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [searchDays, setSearchDays] = useState(30);

  // Загружаем категории
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();

  // Загружаем чаты и избранное
  const { data: chats } = useChats();
  const { data: favorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });

  // Загружаем базовую аналитику
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useAnalytics({
    period: selectedPeriod,
    categoryId: selectedCategoryId,
  });

  // Загружаем поисковую аналитику (PRO)
  const {
    data: searchStats,
    isLoading: searchLoading,
    error: searchError,
  } = useQuery({
    queryKey: ["search-queries-stats", searchDays],
    queryFn: () => getSearchQueriesStats(searchDays),
  });

  const isLoading = categoriesLoading || analyticsLoading;
  const error = categoriesError || analyticsError;

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedCategoryId(value === "" ? undefined : Number.parseInt(value));
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Загрузка аналитики...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>
          <h2>Ошибка</h2>
          <p>{error}</p>
          <button className={styles.retryButton} onClick={() => window.location.reload()}>
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Заголовок */}
      <div className={styles.header}>
        <div>
          <Typography className={styles.title} variant="h1">
            Аналитика и спрос
          </Typography>
        </div>

        {activeTab === "overview" && (
          <div className={styles.filters}>
            <select
              className={styles.filterSelect}
              value={selectedPeriod}
              onChange={handlePeriodChange}
            >
              <option value="day">День</option>
              <option value="week">Неделя</option>
              <option value="month">Месяц</option>
              <option value="quarter">Квартал</option>
              <option value="half-year">Полгода</option>
              <option value="year">Год</option>
            </select>
            <select
              className={styles.filterSelect}
              value={selectedCategoryId || ""}
              onChange={handleCategoryChange}
            >
              <option value="">Все категории</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {activeTab === "search-queries" && (
          <div className={styles.filters}>
            <select
              className={styles.filterSelect}
              value={searchDays}
              onChange={(e) => setSearchDays(Number(e.target.value))}
            >
              <option value={7}>За 7 дней</option>
              <option value={30}>За 30 дней</option>
              <option value={90}>За 90 дней</option>
            </select>
          </div>
        )}
      </div>

      {/* Вкладки переключения */}
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabBtn} ${activeTab === "overview" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("overview")}
          type="button"
        >
          Сводка активности
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === "search-queries" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("search-queries")}
          type="button"
        >
          Поисковые запросы и спрос
          <span className={styles.tabProBadge}>PRO</span>
        </button>
      </div>

      {/* ВКЛАДКА 1: Сводка */}
      {activeTab === "overview" && (
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricContent}>
              <Typography className={styles.metricLabel}>Просмотры объявлений</Typography>
              <Typography className={styles.metricValue}>
                {analyticsData?.views?.toString() || "0"}
              </Typography>
              <Typography className={styles.metricPeriod}>за выбранный период</Typography>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricContent}>
              <Typography className={styles.metricLabel}>Активные диалоги</Typography>
              <Typography className={styles.metricValue}>{chats?.length || 0}</Typography>
              <Typography className={styles.metricPeriod}>всего чатов с покупателями</Typography>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricContent}>
              <Typography className={styles.metricLabel}>Добавили в избранное</Typography>
              <Typography className={styles.metricValue}>{favorites?.length || 0}</Typography>
              <Typography className={styles.metricPeriod}>сохранений ваших товаров</Typography>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricContent}>
              <Typography className={styles.metricLabel}>Просмотры контактов</Typography>
              <Typography className={styles.metricValue}>
                {analyticsData?.phone?.toString() || "0"}
              </Typography>
              <Typography className={styles.metricPeriod}>открытий номера телефона</Typography>
            </div>
          </div>
        </div>
      )}

      {/* ВКЛАДКА 2: Поисковые запросы (Платный доступ) */}
      {activeTab === "search-queries" && (
        <div className="flex flex-col gap-6">
          {/* Баннер блокировки / Paywall, если нет активного продвижения */}
          {searchStats?.isLocked && (
            <div className={styles.paywallCard}>
              <div className={styles.paywallHeader}>
                <div className={styles.paywallIcon}>
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className={styles.paywallTitle}>Полная аналитика поискового спроса</h2>
                  <p className={styles.paywallText}>
                    Узнайте, какие поисковые фразы вводят покупатели на площадке и по каким словам
                    находят ваши товары. Доступ открывается при активном платном продвижении объявлений.
                  </p>
                </div>
              </div>
              <Link className={styles.paywallActionBtn} href="/profile/my-products">
                <Sparkles className="w-4 h-4" />
                Подключить продвижение
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Таблица запросов */}
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <div>
                <h3 className={styles.tableTitle}>Популярные поисковые запросы</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Фразы, которые искали покупатели на площадке за {searchDays} дней
                </p>
              </div>
              {searchStats?.totalCount ? (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  Всего запросов: {searchStats.totalCount}
                </span>
              ) : null}
            </div>

            <div className={styles.tableWrapper}>
              {searchLoading ? (
                <div className={styles.loading}>
                  <div className={styles.spinner}></div>
                  <p className="text-sm text-slate-500">Загрузка поисковых запросов...</p>
                </div>
              ) : !searchStats?.isLocked && (!searchStats?.items || searchStats.items.length === 0) ? (
                <div className={styles.emptyState}>
                  <Search className={styles.emptyIcon} />
                  <p className="font-medium text-slate-700">Поисковых запросов пока не зафиксировано</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Статистика обновится, как только пользователи начнут искать товары на сайте
                  </p>
                </div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Поисковый запрос</th>
                      <th>Количество поисков</th>
                      <th>Найдено товаров</th>
                      <th>Последний поиск</th>
                      <th>Уровень спроса</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchStats.items.map((row, idx) => {
                      const isHighDemand = row.searches >= 20;
                      const isMediumDemand = row.searches >= 5 && row.searches < 20;

                      return (
                        <tr key={row.query + idx}>
                          <td>
                            <span className={styles.queryCell}>
                              <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              {row.query}
                            </span>
                          </td>
                          <td className="font-semibold text-slate-800">{row.searches}</td>
                          <td className="text-slate-600">{row.avgResults}</td>
                          <td className="text-xs text-slate-500">
                            {row.lastSearched
                              ? new Date(row.lastSearched).toLocaleDateString("ru-RU", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "—"}
                          </td>
                          <td>
                            {isHighDemand ? (
                              <span className={styles.demandHigh}>
                                <TrendingUp className="w-3 h-3" />
                                Высокий
                              </span>
                            ) : isMediumDemand ? (
                              <span className={styles.demandMedium}>
                                <TrendingUp className="w-3 h-3" />
                                Средний
                              </span>
                            ) : (
                              <span className={styles.demandLow}>Базовый</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Размытые строки для демонстрации платного контента */}
                    {searchStats.isLocked && (
                      <>
                        <tr className={styles.blurredRow}>
                          <td>
                            <span className={styles.queryCell}>
                              <Search className="w-3.5 h-3.5" />
                              оборудование стерилизационное
                            </span>
                          </td>
                          <td className="font-semibold">84</td>
                          <td>12</td>
                          <td className="text-xs">Вчера, 18:40</td>
                          <td>
                            <span className={styles.demandHigh}>Высокий</span>
                          </td>
                        </tr>
                        <tr className={styles.blurredRow}>
                          <td>
                            <span className={styles.queryCell}>
                              <Search className="w-3.5 h-3.5" />
                              одноразовые расходники оптом
                            </span>
                          </td>
                          <td className="font-semibold">61</td>
                          <td>25</td>
                          <td className="text-xs">2 дня назад</td>
                          <td>
                            <span className={styles.demandMedium}>Средний</span>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;

