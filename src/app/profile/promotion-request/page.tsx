"use client";

import { Package, Send, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button, Input, Typography } from "@/components/ui";

const PromotionRequestPage = () => {
  const [productName, setProductName] = useState("");
  const [promotionType, setPromotionType] = useState("");
  const [days, setDays] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const promotionTypes = [
    { id: "standard", name: "Стандарт", price: 50 },
    { id: "premium", name: "Премиум", price: 100 },
    { id: "vip", name: "VIP", price: 200 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName.trim() || !promotionType || !days) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    setIsSubmitting(true);

    // Имитация отправки
    setTimeout(() => {
      toast.success("Заявка на продвижение успешно отправлена!");
      setProductName("");
      setPromotionType("");
      setDays("");
      setComment("");
      setIsSubmitting(false);
    }, 1000);
  };

  const selectedPromotion = promotionTypes.find((p) => p.id === promotionType);
  const totalPrice = selectedPromotion
    ? selectedPromotion.price * Number(days || 0)
    : 0;

  return (
    <div className="w-full space-y-6">
      <div>
        <Typography className="text-2xl font-bold sm:text-3xl">
          Заявка на продвижение товара
        </Typography>
        <Typography className="mt-2 text-gray-600">
          Отправьте заявку на продвижение вашего товара. Администратор рассмотрит её в течение 24 часов.
        </Typography>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Информация о товаре */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <Package className="h-5 w-5 text-blue-500" />
              <Typography className="text-lg font-semibold">
                Информация о товаре
              </Typography>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="productName">
                Название товара <span className="text-red-500">*</span>
              </label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Введите название товара"
              />
            </div>

          </div>

          {/* Параметры продвижения */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <Typography className="text-lg font-semibold">
                Параметры продвижения
              </Typography>
            </div>

            <div>
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Тип продвижения <span className="text-red-500">*</span>
              </span>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {promotionTypes.map((type) => (
                  <button
                    key={type.id}
                    className={`rounded-lg border-2 p-4 text-left transition-all ${
                      promotionType === type.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    type="button"
                    onClick={() => setPromotionType(type.id)}
                  >
                    <p className="font-semibold text-gray-900">{type.name}</p>
                    <p className="text-sm text-blue-600">{type.price} ₽/день</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="days">
                Количество дней <span className="text-red-500">*</span>
              </label>
              <Input
                id="days"
                min="1"
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                placeholder="Например: 7"
              />
            </div>

            {totalPrice > 0 && (
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Итого к оплате:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {totalPrice} ₽
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Комментарий */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="comment">
              Комментарий к заявке
            </label>
            <textarea
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Дополнительная информация..."
              rows={4}
            />
          </div>

          {/* Кнопка отправки */}
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 sm:w-auto"
            disabled={isSubmitting}
            type="submit"
          >
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? "Отправка..." : "Отправить заявку"}
          </Button>
        </form>
      </div>

      {/* Информационный блок */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <Typography className="font-semibold text-blue-800">
          Как это работает?
        </Typography>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-blue-700">
          <li>Заполните форму и отправьте заявку</li>
          <li>Администратор проверит заявку в течение 24 часов</li>
          <li>После одобрения средства будут списаны с баланса</li>
          <li>Ваш товар появится в продвигаемых</li>
        </ul>
      </div>
    </div>
  );
};

export default PromotionRequestPage;
