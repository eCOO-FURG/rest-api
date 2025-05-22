// Entities
import { Bag } from "@/core/entities/bag";

export function mapBagStatus(status: Bag["status"]): string {
  switch (status) {
    case "PENDING":
      return "PENDENTE";
    case "CANCELLED":
      return "CANCELADA";
    case "DEFERRED":
      return "ADIADA";
    case "DISPATCHED":
      return "ENVIADA";
    case "MOUNTED":
      return "MONTADA";
    case "RECEIVED":
      return "RECEBIDA";
    case "VERIFIED":
      return "VERIFICADA";
    default:
      return status;
  }
}
