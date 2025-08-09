// Services
import { Storage } from "@/core/storage/storage";

// Libraries
import { v2 as cloudinary } from "cloudinary";

// Logs
import { Logger } from "@/infra/logs/logger";

// Environment
import { env } from "@/infra/env";

// Types
import { File } from "@/core/types/file";

export class Cloudinary implements Storage {
  client: typeof cloudinary;

  constructor() {
    const [credentials, cloud_name] = env.STORAGE_URL.replace(
      "cloudinary://",
      "",
    ).split("@");

    const [api_key, api_secret] = credentials.split(":");

    cloudinary.config({
      api_key,
      api_secret,
      cloud_name,
    });

    this.client = cloudinary;
  }

  async upload(files: File[], folder: string): Promise<string[]> {
    const promises = files.map((file) => this.save(file, folder));

    try {
      return await Promise.all(promises);
    } catch (error) {
      Logger.log(error);
      throw error;
    }
  }

  async delete(url: string, folder: string): Promise<void> {
    await this.client.uploader.destroy(`${folder}/${url}`);
  }

  private async save(file: File, folder: string): Promise<string> {
    try {
      const url = await new Promise<string>((resolve, reject) => {
        this.client.uploader
          .upload_stream(
            { folder, resource_type: "image" },
            (error, result) => {
              if (error) reject(error);
              if (result) resolve(result.secure_url);
            },
          )
          .end(file.content);
      });

      return url;
    } catch (error) {
      Logger.log(error);
      throw error;
    }
  }
}
