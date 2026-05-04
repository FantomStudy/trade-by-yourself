import { useMutation } from "@tanstack/react-query";

import { publishDraft } from "@/api/requests";

export const usePublishDraftMutation = () =>
  useMutation({
    mutationFn: publishDraft,
  });
