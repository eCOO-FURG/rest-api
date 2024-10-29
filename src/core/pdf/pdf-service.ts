// Entities
import { BagMerge } from "@/core/entities/merged/bag-merge";

export type PDFServiceGenerateRequest = {
  type: "bags-report";
  props: {
    bags: BagMerge[];
    withdraw: boolean;
  };
};

export interface PDFService {
  generate({ type, props }: PDFServiceGenerateRequest): Promise<Buffer>;
}
