// Entities
import { Bag } from "@/core/entities/bag";

export interface SpreadsheetColumn {
  header: string;
  key: string;
  width?: number;
}

export type SpreadsheetServiceGenerateRequest = {
  type: "bags-report";
  props: { bags: Bag[] };
};

export interface SpreadsheetService {
  generate({ type, props }: SpreadsheetServiceGenerateRequest): Promise<Buffer>;
}
