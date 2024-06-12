// Services
import { Encrypter } from "@/core/cryptography/encrypter";

export class MockedEncrypter implements Encrypter {
  async encrypt(plain: string): Promise<string> {
    return plain.concat("-hashed");
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat("-hashed") === hash;
  }
}
