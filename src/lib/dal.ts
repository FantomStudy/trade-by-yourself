import { redirect } from "next/navigation";
import { cache } from "react";
import { getCurrentUser } from "@/api/auth";
import "server-only";

export const verifySession = cache(async () => {
  const user = await getCurrentUser().catch(() => null);

  if (!user) return redirect("/?auth");

  return { user };
});
