// Cache
import { CacheManager } from "@/core/cache/cache-manager";

// Libraries
import { createClient, RedisClientType } from "redis";

// Env
import { env } from "@/infra/env";

export class RedisCacheManager implements CacheManager {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({ url: env.CACHE_URL! });
    this.client.connect();
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);

    if (!value) return null;

    return JSON.parse(value) as T;
  }

  async set(key: string, value: unknown): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }
}
