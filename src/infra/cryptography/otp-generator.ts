// Services
import { OtpProvider } from "@/core/cryptography/otp-provider";

// Libs
import { generate } from "otp-generator";

export class OtpGenerator implements OtpProvider {
  private config = {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  };

  async generate(): Promise<string> {
    return generate(6, this.config);
  }
}