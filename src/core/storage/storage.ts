// Types
import { File } from "@/core/types/file";

export interface Storage {
  upload(files: File[], folder: string): Promise<string[]>;
}
