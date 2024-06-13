// Services
import { Hasher } from "@/core/cryptography/hasher";

export class MockedHasher implements Hasher {
  async hash(payload: Record<string, string>): Promise<string> {
    return JSON.stringify(payload);
  }

  async decode(value: string): Promise<Record<string, string>> {
    return JSON.parse(value);
  }
}
