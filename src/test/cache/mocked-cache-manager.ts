import { CacheManager } from "@/core/cache/cache-manager";

export class MockedCacheManager implements CacheManager {
  private cache: Record<string, unknown> = {};

  async set(key: string, value: unknown): Promise<void> {
    this.cache[key] = value;
  }

  async get<T>(key: string): Promise<T | null> {
    return this.cache[key] as T | null;
  }
}
