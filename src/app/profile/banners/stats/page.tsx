"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, Eye, Image as ImageIcon } from "lucide-react";
import { getProfileBannerStats } from "@/api/banners";
import { Typography } from "@/components/ui";
import styles from "./page.module.css";

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
    queryFn: getProfileBannerStats,
  });

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <Typography className={styles.title}>Статистика баннеров</Typography>
          <Typography className={styles.subtitle}>Просмотры ваших рекламных баннеров</Typography>
        </div>
        <div className={styles.stateCard}>
          <div className={styles.spinner} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <Typography className={styles.title}>Статистика баннеров</Typography>
        </div>
        <div className={styles.errorCard}>
          <Typography className={styles.errorText}>Ошибка загрузки статистики</Typography>
        </div>
      </div>
    );
  }

  const totalViews = stats?.reduce((sum, s) => sum + s.totalViews, 0) ?? 0;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Typography className={styles.title}>Статистика баннеров</Typography>
        <Typography className={styles.subtitle}>Просмотры ваших рекламных баннеров</Typography>
      </div>

      {/* Общая статистика */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryCardContent}>
            <div className={`${styles.summaryIconWrap} ${styles.summaryIconWrapPurple}`}>
              <ImageIcon className={styles.summaryIcon} />
            </div>
            <div>
              <p className={styles.summaryLabel}>Всего баннеров</p>
              <p className={styles.summaryValue}>{stats?.length ?? 0}</p>
            </div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryCardContent}>
            <div className={`${styles.summaryIconWrap} ${styles.summaryIconWrapBlue}`}>
              <Eye className={styles.summaryIcon} />
            </div>
            <div>
              <p className={styles.summaryLabel}>Всего просмотров</p>
              <p className={styles.summaryValue}>{totalViews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Список баннеров */}
      <div className={styles.listCard}>
        <div className={styles.listHeader}>
          <BarChart3 className={styles.listHeaderIcon} />
          <Typography className={styles.listTitle}>Статистика по баннерам</Typography>
        </div>

        {!stats || stats.length === 0 ? (
          <div className={styles.emptyState}>
            <ImageIcon className={styles.emptyIcon} />
            <Typography className={styles.emptyTitle}>У вас пока нет активных баннеров</Typography>
            <Typography className={styles.emptySubtitle}>
              Создайте заявку на размещение баннера
            </Typography>
          </div>
        ) : (
          <div className={styles.bannersList}>
            {stats.map((bannerStat, index) => (
              <div
                key={bannerStat.bannerId ?? `${bannerStat.bannerName}-${bannerStat.place}-${index}`}
                className={styles.bannerItem}
              >
                <div className={styles.bannerTop}>
                  <div className={styles.bannerMain}>
                    <div className={styles.bannerTitleRow}>
                      <h3 className={styles.bannerName}>{bannerStat.bannerName}</h3>
                      <span className={styles.bannerPlace}>
                        {placeLabelMap[bannerStat.place] || bannerStat.place}
                      </span>
                    </div>
                  </div>

                  <div className={styles.bannerMetrics}>
                    <div className={styles.metricItem}>
                      <Eye className={styles.metricIcon} />
                      <div className={styles.metricText}>
                        <p className={styles.metricLabel}>Просмотры</p>
                        <p className={styles.metricValue}>{bannerStat.totalViews}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* График по дням (если есть данные) */}
                {bannerStat.viewsByDate && bannerStat.viewsByDate.length > 0 && (
                  <div className={styles.chartSection}>
                    <p className={styles.chartTitle}>Просмотры за последние дни</p>
                    <div className={styles.chartBars}>
                      {bannerStat.viewsByDate.slice(-14).map((day) => {
                        const maxViews = Math.max(...bannerStat.viewsByDate.map((d) => d.views), 1);
                        const height = (day.views / maxViews) * 60 + 4;

                        return (
                          <div key={day.date} className={styles.chartDay}>
                            <div className={styles.chartBar} style={{ height: `${height}px` }} />
                            <span className={styles.chartDayLabel}>
                              {new Date(day.date).getDate()}
                            </span>
                            <div className={styles.chartTooltip}>{day.views}</div>
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
      <div className={styles.infoCard}>
        <Typography className={styles.infoTitle}>Как считается статистика?</Typography>
        <ul className={styles.infoList}>
          <li>Просмотры — количество кликов на баннер</li>
          <li>Статистика обновляется в реальном времени</li>
        </ul>
      </div>
    </div>
  );
};

export default BannerStatsPage;
