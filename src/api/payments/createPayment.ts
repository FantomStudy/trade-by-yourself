import type { CreatePaymentDto, CreatePaymentResponse } from "./types";
import { api } from "../instance";

export const createPayment = (data: CreatePaymentDto) =>
  api<CreatePaymentResponse>("/payment/create", {
    method: "POST",
    body: data,
  });

