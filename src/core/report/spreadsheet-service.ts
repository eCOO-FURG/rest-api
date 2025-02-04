// Entities
import { Bag } from "@/core/entities/bag";

// Types
import { File } from "@/core/types/file";

export interface SpreadsheetColumn {
  header: string;
  key: string;
  width?: number;
}

export type SpreadsheetServiceGenerateRequest = {
  type: "sales-report";
  props: { bags: Bag[] };
};

export interface SpreadsheetService {
  generate({ type, props }: SpreadsheetServiceGenerateRequest): Promise<File>;
}
