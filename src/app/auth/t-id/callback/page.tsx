import { Suspense } from "react";

import { TIDCallbackClient } from "./tid-callback-client";

export default function TIDOAuthCallbackPage() {
  return (
    <Suspense fallback={<div>Вход через T-ID...</div>}>
      <TIDCallbackClient />
    </Suspense>
  );
}
