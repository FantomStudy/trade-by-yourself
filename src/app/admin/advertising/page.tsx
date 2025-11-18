import { Typography } from "@/components/ui";

const AdvertisingPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <Typography className="text-3xl font-bold">
          Управление рекламой
        </Typography>
        <Typography className="mt-2 text-gray-600">
          Управление рекламными материалами и размещениями
        </Typography>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <Typography className="text-gray-500">
          Функционал управления рекламой в разработке...
        </Typography>
      </div>
    </div>
  );
};

export default AdvertisingPage;
