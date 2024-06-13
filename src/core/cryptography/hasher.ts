export interface Hasher {
  hash(payload: Record<string, string>): Promise<string>;
  decode(value: string): Promise<Record<string, string>>;
}
