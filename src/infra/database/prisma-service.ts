// Libraries
import { PrismaClient } from "@prisma/client";

// Env
import { env } from "@/infra/env";

export const prisma = new PrismaClient({
  log: env.ENV === "development" ? [] : ["error"],
});
