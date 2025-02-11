// Entities
import { Bag } from "@/core/entities/bag";
import { Box } from "@/core/entities/box";

// Types
import { File } from "@/core/types/file";

export type PDFServiceGenerateRequest =
  | {
      type: "sales-report";
      props: { bags: Bag[]; withdraw?: boolean };
    }
  | {
      type: "inbound-report";
      props: { boxes: Box[] };
    };

export interface PDFService {
  generate({ type, props }: PDFServiceGenerateRequest): Promise<File>;
}
