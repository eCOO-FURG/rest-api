// Libs
import { PRICING } from "@prisma/client";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Data
import categories from "@/infra/database/seeds/data/categories.json";

// Libs
import { hash } from "bcryptjs";

// Env
import { env } from "@/infra/env";

async function seed() {
  await Promise.all([
    prisma.product.deleteMany(),
    prisma.cycle.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  for (const { items } of categories) {
    await prisma.product.createMany({
      data: items.map((item) => ({
        ...item,
        pricing: item.pricing as PRICING,
      })),
    });
  }

  await prisma.cycle.create({
    data: {
      alias: "Semanal",
      offer: [1, 7],
      order: [2, 3, 4],
      deliver: [5, 6],
    },
  });

  if (env.ENV === "development") {
    const everyDay = [1, 2, 3, 4, 5, 6, 7];

    await prisma.cycle.create({
      data: {
        alias: "Livre",
        offer: everyDay,
        order: everyDay,
        deliver: everyDay,
      },
    });
  }

  await prisma.user.create({
    data: {
      first_name: "Administrador",
      last_name: "CDD",
      email: "admin@ecoo.org.br",
      cpf: "",
      roles: ["USER", "ADMIN"],
      password: await hash(env.ECOO_EMAIL_PASSWORD, 8),
      phone: "",
      verified_at: new Date(),
    },
  });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
