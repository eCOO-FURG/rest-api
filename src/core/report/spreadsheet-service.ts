// Entities
import { BagAndOrders } from "@/core/entities/aggregates/bag-and-orders";
import { CatalogAndOffers } from "@/core/entities/aggregates/farm-and-offers";

// Types
import { File } from "@/core/types/file";

export interface SpreadsheetColumn {
  header: string;
  key: string;
  width?: number;
  style?: { numFmt: string };
}

export type SpreadsheetServiceGenerateRequest = {
  type: "sales-report";
  props: {
    bags: BagAndOrders[];
    catalogs: CatalogAndOffers[];
    since?: Date;
    before?: Date;
  };
};

export interface SpreadsheetService {
  generate({ type, props }: SpreadsheetServiceGenerateRequest): Promise<File>;
}
