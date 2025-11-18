import { Typography } from "@/components/ui";

const SupportPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <Typography className="text-3xl font-bold">Чат поддержки</Typography>
        <Typography className="mt-2 text-gray-600">
          Общение с пользователями и поддержка
        </Typography>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <Typography className="text-gray-500">
          Функционал чата поддержки в разработке...
        </Typography>
      </div>
    </div>
  );
};

export default SupportPage;
