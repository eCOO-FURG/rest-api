export interface Encrypter {
  encrypt(plain: string): Promise<string>;
  compare(plain: string, hash: string): Promise<boolean>;
}
