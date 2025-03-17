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

export type SpreadsheetServiceGenerateRequest = {
  type: "sales-report";
  props: {
    bags: Bag[];
    catalogs: Catalog[];
    since?: Date;
    before?: Date;
  };
};

export interface SpreadsheetService {
  generate({ type, props }: SpreadsheetServiceGenerateRequest): Promise<File>;
}
