"use client";

import { ExternalLink, Heart, MessageSquare, ShoppingCart, Sparkles, User } from "lucide-react";
import Image from "next/image";
import React from "react";

interface BannerPreviewMockupProps {
  place: string;
  imageUrl?: string | null;
  bannerName?: string;
  targetUrl?: string;
}

export const BANNER_PLACE_LABELS: Record<string, string> = {
  PRODUCT_FEED: "Лента товаров",
  PROFILE: "Профиль",
  CHATS: "Чаты",
  FAVORITES: "Избранное",
};

export const BannerPreviewMockup: React.FC<BannerPreviewMockupProps> = ({
  place,
  imageUrl,
  bannerName,
  targetUrl,
}) => {
  const title = bannerName?.trim() || "Название вашей акции";
  const urlDisplay = targetUrl?.trim() || "https://example.com";

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-b from-purple-50/40 via-white to-gray-50 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between border-b border-purple-100 pb-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white shadow-xs">
            👁️
          </span>
          <span className="text-sm font-semibold text-gray-800">
            Пример отображения:{" "}
            <span className="text-purple-700">
              {BANNER_PLACE_LABELS[place] || "Лента товаров"}
            </span>
          </span>
        </div>
        <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
          Интерактивный макет
        </span>
      </div>

      {/* 1. Мокап для ЛЕНТЫ ТОВАРОВ (PRODUCT_FEED) */}
      {(!place || place === "PRODUCT_FEED") && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">
            Баннер гармонично встраивается в каталог как отдельная карточка среди медицинских товаров:
          </p>
          <div className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 bg-gray-50/70 p-3 sm:grid-cols-3">
            {/* Товар 1 */}
            <div className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-xs">
              <div className="flex h-32 items-center justify-center rounded bg-gray-100 text-gray-400 text-3xl">
                🩺
              </div>
              <div className="mt-2 space-y-1">
                <p className="line-clamp-1 text-xs font-medium text-gray-800">
                  Тонометр автоматический Pro-Med
                </p>
                <p className="text-xs font-bold text-gray-900">2 890 ₽</p>
                <div className="flex items-center justify-between pt-1 text-[10px] text-gray-400">
                  <span>Оренбург</span>
                  <span className="text-green-600">В наличии</span>
                </div>
              </div>
            </div>

            {/* Карточка баннера */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border-2 border-purple-500 bg-white p-3 shadow-md ring-2 ring-purple-100 transition-all">
              <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded bg-purple-600/90 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-xs backdrop-blur-xs">
                <Sparkles className="h-3 w-3" /> Реклама
              </div>
              <div className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100">
                {imageUrl ? (
                  <Image
                    fill
                    alt={title}
                    className="object-cover"
                    src={imageUrl}
                  />
                ) : (
                  <div className="p-3 text-center">
                    <p className="text-2xl">📢</p>
                    <p className="text-xs font-semibold text-purple-700">Ваш баннер</p>
                    <p className="text-[10px] text-purple-500">320×400 px</p>
                  </div>
                )}
              </div>
              <div className="mt-2 space-y-1.5">
                <p className="line-clamp-1 text-xs font-bold text-gray-900">{title}</p>
                <div className="flex items-center justify-between">
                  <span className="truncate text-[10px] text-purple-600 underline">
                    {urlDisplay}
                  </span>
                  <ExternalLink className="h-3 w-3 text-purple-600" />
                </div>
                <button
                  type="button"
                  className="w-full rounded bg-purple-600 py-1 text-center text-xs font-medium text-white shadow-xs hover:bg-purple-700"
                >
                  Подробнее
                </button>
              </div>
            </div>

            {/* Товар 2 */}
            <div className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-xs">
              <div className="flex h-32 items-center justify-center rounded bg-gray-100 text-gray-400 text-3xl">
                🔬
              </div>
              <div className="mt-2 space-y-1">
                <p className="line-clamp-1 text-xs font-medium text-gray-800">
                  Микроскоп бинокулярный лабораторный
                </p>
                <p className="text-xs font-bold text-gray-900">42 500 ₽</p>
                <div className="flex items-center justify-between pt-1 text-[10px] text-gray-400">
                  <span>Москва</span>
                  <span className="text-blue-600">Новинка</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Мокап для ПРОФИЛЯ (PROFILE) */}
      {place === "PROFILE" && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">
            Баннер отображается в личном кабинете пользователей рядом с меню и информацией:
          </p>
          <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50/70 p-3 sm:flex-row">
            {/* Сайдбар кабинета */}
            <div className="w-full space-y-2 rounded-lg border border-gray-200 bg-white p-2.5 sm:w-1/3">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-xs text-purple-700">
                  <User className="h-4 w-4" />
                </div>
                <div className="truncate text-xs font-semibold text-gray-800">Личный кабинет</div>
              </div>
              <div className="space-y-1 text-[11px] text-gray-600">
                <div className="rounded bg-purple-50 px-2 py-1 font-medium text-purple-700">
                  Мой профиль
                </div>
                <div className="px-2 py-1 hover:text-gray-900">Мои объявления</div>
                <div className="px-2 py-1 hover:text-gray-900">Баланс и бонусы</div>
                <div className="px-2 py-1 hover:text-gray-900">Мои сделки</div>
              </div>
            </div>

            {/* Баннер профиля */}
            <div className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-xl border-2 border-purple-500 bg-white p-3 shadow-md">
              <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded bg-purple-600/90 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-xs backdrop-blur-xs">
                <Sparkles className="h-3 w-3" /> Реклама в профиле
              </div>
              <div className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-purple-100 via-indigo-100 to-pink-100">
                {imageUrl ? (
                  <Image
                    fill
                    alt={title}
                    className="object-cover"
                    src={imageUrl}
                  />
                ) : (
                  <div className="p-3 text-center">
                    <p className="text-2xl">🖼️</p>
                    <p className="text-xs font-semibold text-purple-700">{title}</p>
                    <p className="text-[10px] text-purple-500">Размер: 660×400 px</p>
                  </div>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-900">{title}</p>
                  <p className="text-[10px] text-blue-600 truncate">{urlDisplay}</p>
                </div>
                <button
                  type="button"
                  className="rounded bg-purple-600 px-3 py-1 text-xs font-medium text-white shadow-xs hover:bg-purple-700"
                >
                  Перейти
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Мокап для ЧАТОВ (CHATS) */}
      {place === "CHATS" && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">
            Широкий баннер размещается прямо над списком диалогов и окном переписки:
          </p>
          <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50/70 p-3">
            {/* Верхний баннер чатов */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border-2 border-purple-500 bg-white p-3 shadow-md">
              <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded bg-purple-600/90 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-xs backdrop-blur-xs">
                <Sparkles className="h-3 w-3" /> Спецпредложение над чатами
              </div>
              <div className="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-indigo-100 via-purple-100 to-blue-100">
                {imageUrl ? (
                  <Image
                    fill
                    alt={title}
                    className="object-cover"
                    src={imageUrl}
                  />
                ) : (
                  <div className="text-center">
                    <p className="text-xs font-bold text-purple-800">{title}</p>
                    <p className="text-[10px] text-purple-500">Широкий баннер (1280×400 px)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Интерфейс чатов */}
            <div className="flex h-20 gap-2 rounded-lg border border-gray-200 bg-white p-2">
              <div className="w-1/3 space-y-1 border-r border-gray-100 pr-2">
                <div className="flex items-center gap-1 text-[10px] font-semibold text-gray-700">
                  <MessageSquare className="h-3 w-3 text-purple-600" /> Диалоги
                </div>
                <div className="rounded bg-purple-50 p-1 text-[9px] text-purple-800 truncate">
                  ООО "МедСнаб" · Товар в наличии
                </div>
              </div>
              <div className="flex flex-1 items-center justify-center text-[10px] text-gray-400">
                Окно активного диалога и сообщений...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Мокап для ИЗБРАННОГО (FAVORITES) */}
      {place === "FAVORITES" && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">
            Горизонтальный супер-баннер в шапке раздела сохраненных товаров:
          </p>
          <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50/70 p-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              <span>Избранные товары</span>
            </div>

            {/* Баннер избранного */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border-2 border-purple-500 bg-white p-2.5 shadow-md">
              <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded bg-purple-600/90 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-xs backdrop-blur-xs">
                <Sparkles className="h-3 w-3" /> Баннер в избранном
              </div>
              <div className="relative flex h-16 w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100">
                {imageUrl ? (
                  <Image
                    fill
                    alt={title}
                    className="object-cover"
                    src={imageUrl}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-800">{title}</span>
                    <span className="text-[10px] text-purple-500">(1280×200 px)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Карточки избранного */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="rounded border border-gray-200 bg-white p-1.5 text-[10px] text-gray-600 flex justify-between items-center">
                <span>ЭКГ-аппарат 12-канальный</span>
                <span className="font-bold text-gray-900">34 000 ₽</span>
              </div>
              <div className="rounded border border-gray-200 bg-white p-1.5 text-[10px] text-gray-600 flex justify-between items-center">
                <span>Хирургический отсасыватель</span>
                <span className="font-bold text-gray-900">19 200 ₽</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="mt-2 text-center text-[11px] text-gray-400">
        Размеры и пропорции баннера адаптированы для наглядного предпросмотра
      </p>
    </div>
  );
};
