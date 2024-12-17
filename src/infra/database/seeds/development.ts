// Entities
import { UUID } from "@/core/entities/aggregates/uuid";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Libs
import { hash } from "bcryptjs";

// Env
import { env } from "@/infra/env";

export async function seedDevelopment() {
  const cycleId = new UUID();
  const everyDay = [1, 2, 3, 4, 5, 6, 7];

  await prisma.cycle.create({
    data: {
      id: cycleId.value,
      alias: "Livre",
      offer: everyDay,
      order: everyDay,
      deliver: everyDay,
    },
  });

  const farmerId = new UUID();

  await prisma.user.create({
    data: {
      id: farmerId.value,
      first_name: "Fazendeiro",
      last_name: "eCOO",
      email: "farmer@ecoo.org.br",
      cpf: "22222222222",
      roles: ["USER", "PRODUCER"],
      password: await hash(env.ECOO_EMAIL_PASSWORD, 8),
      phone: "77777777777",
      verified_at: new Date(),
    },
  });

  const boxId = new UUID();
  const products = await prisma.product.findMany();

  await prisma.farm.create({
    data: {
      name: "Fazenda do eCOO",
      tally: "12345678",
      tax: 20,
      status: "ACTIVE",
      admin_id: farmerId.value,
      catalogs: {
        create: {
          cycle_id: cycleId.value,
          box: {
            create: {
              id: boxId.value,
              status: "PENDING",
              verified: 0,
            },
          },
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

  const offers = await prisma.offer.findMany({ include: { product: true } });

  await prisma.user.create({
    data: {
      first_name: "Usuário",
      last_name: "APP",
      email: "user@ecoo.org.br",
      cpf: "33333333333",
      roles: ["USER"],
      password: await hash(env.ECOO_EMAIL_PASSWORD, 8),
      phone: "88888888888",
      verified_at: new Date(),
      bags: {
        create: {
          code: "123-456",
          status: "PENDING",
          cycle_id: cycleId.value,
          orders: {
            createMany: {
              data: offers.map((offer) => ({
                box_id: boxId.value,
                offer_id: offer.id,
                amount: offer.amount,
                price:
                  offer.product.pricing === "UNIT"
                    ? Number(offer.price) * offer.amount
                    : (Number(offer.price) / 1000) * offer.amount,
                status: "PENDING",
              })),
            },
          },
        },
      },
    },
  });
}
