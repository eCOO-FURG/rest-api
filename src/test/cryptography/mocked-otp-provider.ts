// Services
import { OtpProvider } from "@/core/cryptography/otp-provider";

export class MockedOtpProvider implements OtpProvider {
  async generate(): Promise<string> {
    const value = Math.floor(Math.random() * 1000000);

    return value.toString().padStart(6, "0");
  }
}