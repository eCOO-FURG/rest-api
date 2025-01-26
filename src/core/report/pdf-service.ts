// Entities
import { Bag } from "@/core/entities/bag";

export type PDFServiceGenerateRequest = {
  type: "bags-report";
  props: {
    bags: Bag[];
    withdraw: boolean;
  };
};

export interface PDFService {
  generate({ type, props }: PDFServiceGenerateRequest): Promise<Buffer>;
}
