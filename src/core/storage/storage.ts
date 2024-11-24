export interface Storage {
  upload(files: Buffer[], folder: string): Promise<string[]>;
}
