// Env
import "dotenv/config";

// Services
import { Storage } from "@/core/storage/storage";

// Libraries
import { v2 as cloudinary } from "cloudinary";

// Logs
import { Logger } from "@/infra/logs/sentry";

// Env
import { env } from "@/infra/env";

export class Cloudinary implements Storage {
  client: typeof cloudinary;

  constructor() {
    const [credentials, cloud_name] = env.STORAGE_URL.replace(
      "cloudinary://",
      ""
    ).split("@");

    const [api_key, api_secret] = credentials.split(":");

    cloudinary.config({
      api_key,
      api_secret,
      cloud_name,
    });

    this.client = cloudinary;
  }

  async upload(files: Buffer[], folder: string): Promise<string[]> {
    const promises = files.map((file) => this.save(file, folder));

    try {
      return await Promise.all(promises);
    } catch (error) {
      Logger.log(error);
      return [];
    }
  }

  private async save(file: Buffer, folder: string): Promise<string> {
    const url = await new Promise<string>((resolve, reject) => {
      this.client.uploader
        .upload_stream({ folder, resource_type: "image" }, (error, result) => {
          if (error) reject(error);
          if (result) resolve(result.secure_url);
        })
        .end(file);
    });

    return url;
  }
}
