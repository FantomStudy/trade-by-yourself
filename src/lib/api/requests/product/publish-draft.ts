import { api } from "@/api/instance";

export const publishDraft = async (draftId: number) =>
  api(`/product/publish-draft/${draftId}`, {
    method: "POST",
  });
