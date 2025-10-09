// Services
import { Storage } from "@/core/storage/storage";

// Libraries
import path from "path";
import * as fs from "fs";

// Entities
import { UUID } from "@/core/entities/aggregates/uuid";

// Types
import { File } from "@/core/types/file";

// Environment
import { env } from "@/infra/env";

export class MockedStorage implements Storage {
  async upload(files: File[], folder: string): Promise<string[]> {
    const directory = this.useDirectory(folder);

    const urls = await Promise.all(files.map((file) => this.save(file.content, directory)));

    return urls;
  }

  async save(file: Buffer, folder: string): Promise<string> {
    const name = `${new UUID().value}.png`;

    const url = path.join(folder, name);

    fs.writeFileSync(url, Uint8Array.from(file));

    folder = folder.split("/").reverse()[0];

    return `file://${env.STORAGE_URL}/${folder}/${name}`;
  }

  async delete(url: string, folder: string): Promise<void> {
    const name = url.replace(`file://${env.STORAGE_URL}/${folder}/`, "");

    const file = path.join(__dirname, "temp", folder, name);

    fs.unlinkSync(file);
  }

  private useDirectory(folder: string): string {
    const directory = path.join(__dirname, "temp", folder);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    return directory;
  }
}
