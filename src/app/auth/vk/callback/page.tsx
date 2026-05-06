import { Suspense } from "react";

import { VkCallbackClient } from "./vk-callback-client";

export default function VkOAuthCallbackPage() {
  return (
    <Suspense fallback={<div>Вход через VK...</div>}>
      <VkCallbackClient />
    </Suspense>
  );
}
