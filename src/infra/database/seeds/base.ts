// Libraries
import { PRICING } from "@prisma/client";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Data
import categories from "@/infra/database/seeds/data/categories.json";

// Libraries
import { hash } from "bcryptjs";

// Environment
import { env } from "@/infra/env";

// Seeds
import { seedDevelopment } from "@/infra/database/seeds/development";

// Utils
import { now } from "@/core/utils/now";

// Entities
import { Warehouse } from "@/core/entities/warehouse";

// Repositories
import { StaticWarehouseRepository } from "@/infra/database/repositories/static-warehouse-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

async function seedBase() {
  console.log("\n");

  const staticWarehouseRepository = new StaticWarehouseRepository();

  try {
    const warehouseAlreadyExists = await staticWarehouseRepository.find();

    if (!warehouseAlreadyExists) {
      const warehouse = Warehouse.create({
        name: env.WAREHOUSE_NAME,
      });

      await staticWarehouseRepository.create(warehouse);
    }
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      const warehouse = Warehouse.create({
        name: env.WAREHOUSE_NAME,
      });

      await staticWarehouseRepository.create(warehouse);
    }

    console.log(
      "⚠️   Para popular o armazém, é necessário executar o comando dentro do container.",
    );
  }

  const administratorAlreadyExists = await prisma.user.findUnique({
    where: { email: "admin@ecoo.org.br" },
  });

  if (administratorAlreadyExists) {
    console.log("⚠️   A base de dados já foi populada.");
    return;
  }

  await prisma.user.create({
    data: {
      first_name: "Administrador",
      last_name: "CDD",
      email: "admin@ecoo.org.br",
      cpf: "00000000000",
      roles: ["USER", "MANAGER"],
      password: await hash(env.EMAIL_PASSWORD, 8),
      phone: "55555555555",
      verified_at: now(),
    },
  });

  await prisma.user.create({
    data: {
      first_name: "Agente",
      last_name: "CDD",
      email: "agent@ecoo.org.br",
      cpf: "11111111111",
      roles: ["USER", "BROKER"],
      password: await hash(env.EMAIL_PASSWORD, 8),
      phone: "66666666666",
      verified_at: now(),
    },
  });

  for (const { name, image, products } of categories) {
    await prisma.category.create({
      data: {
        name,
        image,
        products: {
          create: products.map((product) => ({
            ...product,
            pricing: product.pricing as PRICING,
          })),
        },
      },
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

  const homolog = ["DEVELOPMENT", "STAGING"].includes(env.ENVIRONMENT);

  if (homolog) {
    await seedDevelopment();
  }
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
