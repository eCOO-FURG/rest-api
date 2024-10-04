// Entities
import { UUID } from "@/core/entities/aggregates/uuid";

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
    prisma.order.deleteMany(),
    prisma.box.deleteMany(),
    prisma.bag.deleteMany(),
    prisma.offer.deleteMany(),
    prisma.catalog.deleteMany(),
    prisma.cycle.deleteMany(),
    prisma.product.deleteMany(),
    prisma.farm.deleteMany(),
    prisma.otp.deleteMany(),
    prisma.session.deleteMany(),
    prisma.user.deleteMany(), 
  ]);

  const cddId = new UUID();

  await prisma.user.create({
    data: {
      id: cddId.value,
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

  if (["development", "staging"].includes(env.ENV)) {
    const everyDay = [1, 2, 3, 4, 5, 6, 7];

    const cycleId = new UUID();

    await prisma.cycle.create({
      data: {
        id: cycleId.value,
        alias: "Livre",
        offer: everyDay,
        order: everyDay,
        deliver: everyDay,
      },
    });

    const products = await prisma.product.findMany();

    await prisma.farm.create({
      data: {
        name: "Farm do CDD",
        caf: "12345678",
        tax: 20,
        active: true,
        admin_id: cddId.value,
        catalogs: {
          create: {
            cycle_id: cycleId.value,
            offers: {
              createMany: {
                data: products.map((product) => ({
                  product_id: product.id,
                  amount:
                    product.pricing === "UNIT"
                      ? Math.floor(Math.random() * 20 + 1)
                      : Math.floor(Math.random() * 20 + 1) * 100,
                  price: "10",
                })),
              },
            },
          },
        },
      },
    });

    await prisma.user.update({
      where: {
        id: cddId.value,
      },
      data: {
        roles: {
          push: "PRODUCER",
        },
      },
    });
  }
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
