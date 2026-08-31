import { Suspense } from "react";

import { YandexCallbackClient } from "./yandex-callback-client";

export default function YandexOAuthCallbackPage() {
  return (
    <Suspense fallback={<div>Вход через Яндекс...</div>}>
      <YandexCallbackClient />
    </Suspense>
  );
}
