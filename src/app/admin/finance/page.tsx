"use client";

import { Typography } from "@/components/ui";

const FinancePage = () => {
  return (
    <div className="space-y-6">
      <div>
        <Typography className="text-3xl font-bold">
          Управление деньгами
        </Typography>
        <Typography className="mt-2 text-gray-600">
          Финансовая статистика и управление транзакциями
        </Typography>
      </div>
    </div>
  );
};

export default FinancePage;
