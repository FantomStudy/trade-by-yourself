import { Typography } from "@/components/ui";

const ModerationPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <Typography className="text-3xl font-bold">
          Модерация товаров
        </Typography>
        <Typography className="mt-2 text-gray-600">
          Управление и модерация размещенных товаров
        </Typography>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <Typography className="text-gray-500">
          Функционал модерации товаров в разработке...
        </Typography>
      </div>
    </div>
  );
};

export default ModerationPage;
