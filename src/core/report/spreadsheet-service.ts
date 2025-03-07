// Entities
import { Bag } from "@/core/entities/bag";
import { Catalog } from "@/core/entities/catalog";

// Types
import { File } from "@/core/types/file";

export interface SpreadsheetColumn {
  header: string;
  key: string;
  width?: number;
  style?: { numFmt: string };
}

export type SpreadsheetServiceGenerateRequest =
  | {
      type: "sales-report";
      props: {
        start_date?: Date;
        end_date?: Date;
        bags: Bag[];
        catalogs: Catalog[];
      };
    }
  | {
      type: "sales-products";
      props: { start_date?: Date; end_date?: Date; bags: Bag[] };
    }
  | {
      type: "sales-producers";
      props: { start_date?: Date; end_date?: Date; catalogs: Catalog[] };
    }
  | {
      type: "sales-consumers";
      props: { start_date?: Date; end_date?: Date; bags: Bag[] };
    };

export interface SpreadsheetService {
  generate({ type, props }: SpreadsheetServiceGenerateRequest): Promise<File>;
}
