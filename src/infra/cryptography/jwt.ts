// Libraries
import * as jwtService from "jsonwebtoken";

// Services
import { Hasher } from "@/core/cryptography/hasher";

// Environment
import { env } from "@/infra/env";

// Logger
import { Logger } from "@/infra/logs/logger";

export class Jwt implements Hasher {
  async hash(payload: Record<string, string>): Promise<string> {
    try {
      return jwtService.sign(payload, env.JWT_SECRET!);
    } catch (error) {
      Logger.log(error);
      throw error;
    }
  }

  async decode(value: string): Promise<Record<string, string>> {
    try {
      return jwtService.decode(value) as Record<string, string>;
    } catch (error) {
      Logger.log(error);
      throw error;
    }
  }
}
