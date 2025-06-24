import { OrderStatus } from "@/core/entities/order";

export const ORDER_STATUS: Record<OrderStatus, string> = {
  CANCELLED: "cancelado",
  PENDING: "pendente",
  RECEIVED: "recebido",
  REJECTED: "rejeitado",
};
