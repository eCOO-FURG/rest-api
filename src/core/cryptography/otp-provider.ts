export interface OtpProvider {
  generate(): Promise<string>;
}
