import { Storage } from "@/core/storage/storage";

export class MockedStorage implements Storage {
  async upload(files: Buffer[], _: string): Promise<string[]> {
    return files.map(() => "www.photo.com.br");
  }
}
