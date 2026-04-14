"use client";

import dynamic from "next/dynamic";

// Динамический импорт компонента карты для избежания проблем с SSR
const AddressMapDynamic = dynamic(
  () => import("./address-map").then((mod) => ({ default: mod.AddressMap })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-80 w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
          <p className="mt-2 text-sm text-gray-500">Загрузка карты...</p>
        </div>
      </div>
    ),
  },
);

export { AddressMapDynamic as AddressMap };
