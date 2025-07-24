// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { CycleWeek } from "@/core/entities/cycle";

// Services
import { prisma } from "@/infra/database/prisma-service";

// Libraries
import { hash } from "bcryptjs";

// Env
import { env } from "@/infra/env";

// Utils
import { first } from "@/core/utils/first";
import { last } from "@/core/utils/last";
import { now } from "@/core/utils/now";

export async function seedDevelopment() {
  const cycleId = new UUID();
  const everyDay: CycleWeek = [1, 2, 3, 4, 5, 6, 7];

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
      password: await hash(env.EMAIL_PASSWORD, 8),
      phone: "77777777777",
      verified_at: now(),
    },
  });

  const boxId = new UUID();
  const products = await prisma.product.findMany({
    take: 2,
  });

  await prisma.farm.create({
    data: {
      name: "Fazenda do eCOO",
      tally: "12345678",
      fee: 20,
      status: "ACTIVE",
      admin_id: farmerId.value,
      catalogs: {
        create: {
          fee: 20,
          cycle_id: cycleId.value,
          boxes: {
            create: {
              id: boxId.value,
              status: "PENDING",
            },
          },
          offers: {
            createMany: {
              data: products.map((product) => {
                const price = Math.floor(Math.random() * 20 + 1);
                return {
                  product_id: product.id,
                  fee: price * (20 / 100),
                  price: price,
                  active: true,
                  opens_at: first(everyDay),
                  closes_at: last(everyDay),
                  amount: product.pricing === "UNIT" ? Math.floor(Math.random() * 20 + 1) : Math.floor(Math.random() * 20 + 1) * 100,
                  expires_at: product.perishable ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null,
                };
              }),
            },
          },
        },
      },
    },
  });

  const offers = await prisma.offer.findMany({ include: { product: true } });

  const price = offers.reduce((acc, offer) => {
    return acc + (offer.product.pricing === "UNIT" ? Number(offer.price) : Number(offer.price) / 1000);
  }, 0);

  await prisma.user.create({
    data: {
      first_name: "Usuário",
      last_name: "APP",
      email: "user@ecoo.org.br",
      cpf: "33333333333",
      roles: ["USER"],
      password: await hash(env.EMAIL_PASSWORD, 8),
      phone: "88888888888",
      verified_at: now(),
      bags: {
        create: {
          code: "418293",
          subtotal: price,
          fee: price * (20 / 100),
          status: "PENDING",
          cycle_id: cycleId.value,
          address_id: null,
          shipping: 0,
          orders: {
            createMany: {
              data: offers.map((offer) => ({
                box_id: boxId.value,
                offer_id: offer.id,
                amount: offer.amount,
                subtotal:
                  offer.product.pricing === "UNIT" ? Number(offer.price) * offer.amount : Number(offer.price) * (offer.amount / 1000),
                fee:
                  offer.product.pricing === "UNIT"
                    ? Number(offer.price) * offer.amount * (20 / 100)
                    : Number(offer.price) * (offer.amount / 1000) * (20 / 100),
                status: "PENDING",
              })),
            },
          },
        },
      },
    },
  });
}
