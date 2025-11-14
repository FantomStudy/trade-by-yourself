import { AddressMap } from "@/components/ui";

export default function TestAddressPage() {
  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">
        Тест карты с автодополнением адресов
      </h1>

      <div className="space-y-4">
        <p className="text-gray-600">
          Попробуйте ввести: &quot;Терешковой 245&quot; и посмотрите на
          предложения автодополнения.
        </p>

        <AddressMap
          onChange={(address) => console.log("Выбранный адрес:", address)}
          onCoordinatesChange={(lat, lng) =>
            console.log("Координаты:", lat, lng)
          }
        />
      </div>
    </div>
  );
}
