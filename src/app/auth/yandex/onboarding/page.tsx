import { Suspense } from "react";

import { YandexOnboardingClient } from "./yandex-onboarding-client";

export const dynamic = "force-dynamic";

export default function YandexOnboardingPage() {
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>Загрузка...</div>}>
      <YandexOnboardingClient />
    </Suspense>
  );
}
