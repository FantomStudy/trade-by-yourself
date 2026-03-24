import type { Log } from "@/types";

import { api } from "../../instance";

export const getAllLogs = async (): Promise<Log[]> => {
  return api<Log[]>("/log/find-all");
};
