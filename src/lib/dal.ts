import { cache } from "react";
import { getCurrentUser } from "./api";
import "server-only";

export const verifySession = cache(async () => {
  const user = await getCurrentUser().catch(() => null);

  return { user };
});
