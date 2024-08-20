// Entities
import { BagMerge } from "@/core/entities/merged/bag-merge";

export type PDFServiceGenerateRequest = {
  type: "delivery-report";
  props: {
    bags: BagMerge[];
  };
};

export interface PDFService {
  generate({ type, props }: PDFServiceGenerateRequest): Promise<Buffer>;
}
