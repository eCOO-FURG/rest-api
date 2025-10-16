// Entities
import { BagAndOrders } from "@/core/entities/aggregates/bag-and-orders";
import { Catalog } from "@/core/entities/aggregates/catalog";

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
    catalogs: Catalog[];
    since?: Date;
    before?: Date;
  };
};

export interface SpreadsheetService {
  generate({ type, props }: SpreadsheetServiceGenerateRequest): Promise<File>;
}
