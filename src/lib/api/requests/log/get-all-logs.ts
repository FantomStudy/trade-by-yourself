import { api } from "../../instance";

import type { Log } from "@/types";

export const getAllLogs = async (): Promise<Log[]> => {
  return api<Log[]>("/log/find-all");
};
