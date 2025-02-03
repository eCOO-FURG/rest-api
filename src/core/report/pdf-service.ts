// Entities
import { Bag } from "@/core/entities/bag";

// Types
import { File } from "@/core/types/file";

export type PDFServiceGenerateRequest = {
  type: "lista-de-sacolas";
  props: {
    bags: Bag[];
    withdraw: boolean;
  };
};

export interface PDFService {
  generate({ type, props }: PDFServiceGenerateRequest): Promise<File>;
}
