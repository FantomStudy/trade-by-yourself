import { Suspense } from "react";

import { VkOnboardingClient } from "./vk-onboarding-client";

export const dynamic = "force-dynamic";

export default function VkOnboardingPage() {
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>Загрузка...</div>}>
      <VkOnboardingClient />
    </Suspense>
  );
}
