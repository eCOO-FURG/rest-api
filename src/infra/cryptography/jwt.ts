// Libs
import * as jwtService from "jsonwebtoken";

// Services
import { Hasher } from "@/core/cryptography/hasher";

// Env
import { env } from "@/infra/env";

export class Jwt implements Hasher {
  async hash(payload: Record<string, string>): Promise<string> {
    return jwtService.sign(payload, env.JWT_SECRET);
  }

  async decode(value: string): Promise<Record<string, string>> {
    return jwtService.decode(value) as Record<string, string>;
  }
}
