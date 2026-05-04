import { Suspense } from "react";

import { VkCallbackClient } from "./vk-callback-client";

/**
 * Обработка code/state. Допустимо на бэке/VK:
 * - полный URL: https://torguisam.ru/auth/vk/callback
 * - корень сайта: https://torguisam.ru → тогда VkOAuthRootRedirect ведёт сюда с /?code=&state=
 */
export default function VkOAuthCallbackPage() {
  return (
    <Suspense fallback={<div>Входим через VK…</div>}>
      <VkCallbackClient />
    </Suspense>
  );
}
