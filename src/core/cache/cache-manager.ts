export interface CacheManager {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<void>;
}
