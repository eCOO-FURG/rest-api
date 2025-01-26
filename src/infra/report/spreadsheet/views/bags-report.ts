// Libs
import { SpreadsheetColumn } from "@/core/report/spreadsheet-service";

// Entities
import { Bag } from "@/core/entities/bag";

// Utils
import { toPrice } from "@/infra/utils/to-price";

const columns: SpreadsheetColumn[] = [
  { header: "SACOLA", key: "bag", width: 10 },
  { header: "CONSUMIDOR", key: "user", width: 20 },
  { header: "PREÇO", key: "price", width: 15 },
  { header: "PRODUTO", key: "product", width: 20 },
  { header: "PRODUTOR", key: "producer", width: 25 },
  { header: "QUANTIDADE", key: "amount", width: 15 },
  { header: "VALOR DA OFERTA", key: "offer_price", width: 20 },
  { header: "PRECIFICAÇÃO", key: "pricing", width: 15 },
  { header: "DATA", key: "date", width: 25 },
  { header: "PAGAMENTO", key: "payments", width: 15 },
  { header: "BANDEIRA", key: "flags", width: 15 },
  { header: "ENTREGA", key: "delivery", width: 15 },
];

interface BagsReportViewProps {
  bags: Bag[];
}

export const BAGS_REPORT_VIEW = async ({ bags }: BagsReportViewProps) => {
  const rows: Record<string, unknown>[] = [];

  for (const bag of bags) {
    const orders = Array.from(bag.orders.values());

    for (const order of orders) {
      const offerPrice = order.offer?.price ? Number(order.offer.price) : 0;

      const payments = Array.from(bag.payments.values())
        .map((payment) => payment.method)
        .join(", ");

      const flags = Array.from(bag.payments.values())
        .map((payment) => payment.flag)
        .join(", ");

      rows.push({
        bag: bag.code,
        user: `${bag.user?.first_name} ${bag.user?.last_name}`,
        price: toPrice(order.price),
        product: order.offer?.product?.name,
        producer: order.offer?.catalog?.farm?.admin?.first_name,
        amount: order.amount,
        offer_price: toPrice(offerPrice),
        pricing: order.offer?.product?.pricing === "UNIT" ? "Unidade" : "Peso",
        date: bag.created_at.toLocaleDateString("pt-BR"),
        payments,
        flags,
        delivery: bag.address
          ? `${bag.address.street}, ${bag.address.number}, ${bag.address.neighborhood}`
          : "Retirada",
      });
    }
  }

  return { columns, rows };
};
