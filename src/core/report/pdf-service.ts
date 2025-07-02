// Entities
import { BoxAndOrders } from "@/core/entities/aggregates/box-and-orders";
import { BagAndOrders } from "@/core/entities/aggregates/bag-and-orders";
import { CatalogAndOffers } from "@/core/entities/aggregates/catalog-and-offers";
// Types
import { File } from "@/core/types/file";

export type PDFServiceGenerateRequest =
  | {
      type: "sales-report";
      props: { bags: BagAndOrders[]; withdraw?: boolean };
    }
  | {
      type: "inbound-report";
      props: { boxes: BoxAndOrders[] };
    }
  | {
      type: "offers-report";
      props: { catalogs: CatalogAndOffers[] };
    };

export interface PDFService {
  generate({ type, props }: PDFServiceGenerateRequest): Promise<File>;
}
