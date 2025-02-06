// Entities
import { Bag } from "@/core/entities/bag";

export type PDFReportType = "bags-report" | "boxes-report";

export interface OrderDetails {
  quantity: number;
  product: string;
  pricing: "UNIT" | "WEIGHT";
  status: "PENDING" | "RECEIVED";
}

interface CatalogInfo {
  farm?: {
    name: string;
  } | null;
}

export interface FormattedBox {
  id: string;
  status: "PENDING" | "VERIFIED";
  verified: number;
  catalog?: CatalogInfo | null;
  orders: OrderDetails[];
}

export interface PDFReportPropsMap {
  "bags-report": {
    bags: Bag[];
    withdraw: boolean;
  };
  "boxes-report": {
    boxes: FormattedBox[];
  };
}

export type PDFServiceGenerateRequest<T extends PDFReportType> = {
  type: T;
  props: PDFReportPropsMap[T];
};

export interface PDFService {
  generate<T extends PDFReportType>(
    request: PDFServiceGenerateRequest<T>
  ): Promise<Buffer>;
}

