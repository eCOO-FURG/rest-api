import { BagStatus } from "@/core/entities/bag";

export const BAG_STATUS: Record<BagStatus, string> = {
  CANCELLED: "cancelada",
  PENDING: "pendente",
  VERIFIED: "verificada",
  MOUNTED: "montada",
  DISPATCHED: "despachada",
  RECEIVED: "recebida",
  DEFERRED: "recusada",
};
