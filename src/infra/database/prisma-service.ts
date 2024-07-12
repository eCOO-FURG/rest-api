// Libs
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: true ? ["query"] : ["error"],
});
