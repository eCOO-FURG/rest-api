// Libraries
import { PRICING } from "@prisma/client";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Data
import categories from "@/infra/database/seeds/data/categories.json";

// Libraries
import { hash } from "bcryptjs";

// Env
import { env } from "@/infra/env";

// Seeds
import { seedDevelopment } from "@/infra/database/seeds/development";

async function seedBase() {
  await prisma.user.create({
    data: {
      first_name: "Administrador",
      last_name: "CDD",
      email: "admin@ecoo.org.br",
      cpf: "00000000000",
      roles: ["USER", "MANAGER"],
      password: await hash(env.ECOO_EMAIL_PASSWORD, 8),
      phone: "55555555555",
      verified_at: new Date(),
    },
  });

  await prisma.user.create({
    data: {
      first_name: "Agente",
      last_name: "CDD",
      email: "agent@ecoo.org.br",
      cpf: "11111111111",
      roles: ["USER", "BROKER"],
      password: await hash(env.ECOO_EMAIL_PASSWORD, 8),
      phone: "66666666666",
      verified_at: new Date(),
    },
  });

  for (const { products } of categories) {
    await prisma.product.createMany({
      data: products.map((product) => ({
        ...product,
        pricing: product.pricing as PRICING,
      })),
    });
  }

  await prisma.cycle.create({
    data: {
      alias: "Semanal",
      offer: [1, 6, 7],
      order: [2, 3, 4],
      deliver: [5],
    },
  });

  const homolog = ["development", "staging"].includes(env.ENV);

  if (homolog) await seedDevelopment();
}

seedBase()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
