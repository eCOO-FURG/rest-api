import { prisma } from "@/infra/database/prisma-service";
import { Client } from "pg";

const sourceClient = new Client({
  connectionString: "postgresql://localhost:5432/temp_ecoo_db",
});

export function ENUM(values: string) {
  return values
    .replace(/[{}]/g, "")
    .split(",")
    .map((value: string) => value.trim());
}

async function run() {
  await sourceClient.connect();

  // Users
  const { rows: users } = await sourceClient.query("SELECT * FROM users");

  for (const user of users) {
    const exists = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!exists) {
      await prisma.user.create({
        data: {
          ...user,
          roles: ENUM(user.roles),
        },
      });
    }
  }

  // const users = await prisma.user.findMany();

  // console.log(users);

  await sourceClient.end();
}

run();
