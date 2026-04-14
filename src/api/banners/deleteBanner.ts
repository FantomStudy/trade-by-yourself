import { api } from "../instance";

export const deleteBanner = (id: number) => api(`/banner/${id}`, { method: "DELETE" });
