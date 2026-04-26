import type { Payment } from "./types";
import { api } from "../instance";

export const getPaymentHistory = () => api<Payment[]>("/payment/history");
