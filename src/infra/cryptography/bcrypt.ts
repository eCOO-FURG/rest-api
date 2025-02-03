// Services
import { Encrypter } from "@/core/cryptography/encrypter";

// Libraries
import { hash, compare } from "bcryptjs";

export class BcrypterHasher implements Encrypter {
  private HASH_SALT_LENGTH = 8;

  encrypt(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }
  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
