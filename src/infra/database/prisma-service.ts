// Libraries
import { PrismaClient } from "@prisma/client";

// Environment
import { env } from "@/infra/env";

export const prisma = new PrismaClient({
  log: env.ENVIRONMENT === "DEVELOPMENT" ? [] : ["error"],
});
