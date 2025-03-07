// Libraries
import { SpreadsheetColumn } from "@/core/report/spreadsheet-service";

// Entities
import { Bag } from "@/core/entities/bag";

// Utils
import { toCurrencyColumnStyle } from "@/infra/utils/to-currency-column-style";
import { toPercentageColumnStyle } from "@/infra/utils/to-percentage-column-style";
import { toUntaxed } from "@/infra/utils/to-untaxed";

const columns: SpreadsheetColumn[] = [
  { header: "SACOLA", key: "bag", width: 10 },
  { header: "PRODUTO", key: "product", width: 20 },
  { header: "PRODUTOR", key: "producer", width: 25 },
  { header: "CONSUMIDOR", key: "user", width: 20 },
  {
    header: "TAXA (%)",
    key: "tax",
    width: 15,
    style: toPercentageColumnStyle(),
  },
  {
    header: "PREÇO SEM TAXA",
    key: "offer_price_without_tax",
    width: 15,
    style: toCurrencyColumnStyle("BRL"),
  },
  {
    header: "VALOR DA OFERTA",
    key: "offer_price",
    width: 20,
    style: toCurrencyColumnStyle("BRL"),
  },
  { header: "QUANTIDADE", key: "amount", width: 15 },
  {
    header: "TOTAL",
    key: "total_price",
    width: 20,
    style: toCurrencyColumnStyle("BRL"),
  },
  {
    header: "TOTAL SEM TAXA",
    key: "total_price_without_tax",
    width: 20,
    style: toCurrencyColumnStyle("BRL"),
  },
  { header: "PRECIFICAÇÃO", key: "pricing", width: 15 },
  { header: "DATA DO PEDIDO", key: "date", width: 25 },
  {
    header: "DATA INÍCIO CONSULTA",
    key: "start_date",
    width: 25,
  },
  { header: "DATA FIM CONSULTA", key: "end_date", width: 25 },
];

interface SalesProductsReportViewProps {
  start_date?: Date;
  end_date?: Date;
  bags: Bag[];
}

export const SALES_PRODUCTS_VIEW = async ({
  start_date,
  end_date,
  bags,
}: SalesProductsReportViewProps) => {
  const rows: Record<string, unknown>[] = [];

  for (const bag of bags) {
    const orders = Array.from(bag.orders.values());

    for (const order of orders) {
      const offerPrice = order.offer?.price ?? 0;
      const tax = order.offer?.catalog?.tax ?? 0;
      const amount =
        order.offer?.product?.pricing === "UNIT"
          ? order.amount
          : order.amount / 1000;

      rows.push({
        bag: bag.code,
        product: order.offer?.product?.name,
        producer: order.offer?.catalog?.farm?.name,
        user: `${bag.user?.first_name} ${bag.user?.last_name}`,
        tax: (order.offer?.catalog?.tax ?? 0) / 100,
        offer_price_without_tax: toUntaxed(offerPrice, tax),
        offer_price: offerPrice,
        amount,
        total_price: offerPrice * amount,
        total_price_without_tax: toUntaxed(offerPrice * amount, tax),
        pricing: order.offer?.product?.pricing === "UNIT" ? "Unidade" : "Peso",
        date: order.created_at.toLocaleDateString("pt-BR"),
        ...(start_date && {
          start_date: start_date.toLocaleDateString("pt-BR"),
        }),
        ...(end_date && { end_date: end_date.toLocaleDateString("pt-BR") }),
      });
    }
  }

  return { columns, rows, type: "sales-products" };
};
