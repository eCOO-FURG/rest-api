// Libraries
import { SpreadsheetColumn } from "@/core/report/spreadsheet-service";

// Entities
import { Bag } from "@/core/entities/bag";

// Report
import { SpreadsheetView } from "@/infra/report/spreadsheet/excel";

const columns: SpreadsheetColumn[] = [
  { header: "SACOLA", key: "bag", width: 10 },
  { header: "PRODUTO", key: "product", width: 20 },
  { header: "PRODUTOR", key: "producer", width: 25 },
  { header: "CONSUMIDOR", key: "user", width: 20 },
  {
    header: "TAXA (%)",
    key: "tax",
    width: 15,
    style: { numFmt: "0%" },
  },
  {
    header: "PREÇO SEM TAXA",
    key: "offer_price_without_tax",
    width: 15,
    style: { numFmt: "R$ #,##0.00" },
  },
  {
    header: "VALOR DA OFERTA",
    key: "offer_price",
    width: 20,
    style: { numFmt: "R$ #,##0.00" },
  },
  { header: "QUANTIDADE", key: "amount", width: 15 },
  {
    header: "TOTAL",
    key: "total_price",
    width: 20,
    style: { numFmt: "R$ #,##0.00" },
  },
  {
    header: "TOTAL SEM TAXA",
    key: "total_price_without_tax",
    width: 20,
    style: { numFmt: "R$ #,##0.00" },
  },
  { header: "PRECIFICAÇÃO", key: "pricing", width: 15 },
  { header: "DATA DO PEDIDO", key: "date", width: 25 },
  {
    header: "DATA INÍCIO CONSULTA",
    key: "since",
    width: 25,
  },
  { header: "DATA FIM CONSULTA", key: "before", width: 25 },
];

interface ProductsSalesReportViewProps {
  bags: Bag[];
  since?: Date;
  before?: Date;
}

export const PRODUCTS_SALES_VIEW: SpreadsheetView = async ({
  bags,
  since,
  before,
}: ProductsSalesReportViewProps) => {
  const rows: Record<string, unknown>[] = [];

  console.log("since", since);
  console.log("before", before);

  for (const bag of bags) {
    for (const order of bag.orders) {
      const amount =
        order.offer?.product?.pricing === "UNIT"
          ? order.amount
          : order.amount / 1000;

      const offerPrice = order.offer?.price ?? 0;

      rows.push({
        bag: bag.code,
        product: order.offer?.product?.name,
        producer: order.offer?.catalog?.farm?.name,
        user: `${bag.user?.first_name} ${bag.user?.last_name}`,
        fee: order.fee,
        offer_price_without_tax: offerPrice,
        offer_price: offerPrice + order.fee,
        amount,
        total_price: order.total * amount,
        total_price_without_tax: offerPrice * amount,
        pricing: order.offer?.product?.pricing === "UNIT" ? "Unidade" : "Peso",
        date: order.created_at.toLocaleDateString("pt-BR"),
        since: since?.toLocaleDateString("pt-BR"),
        before: before?.toLocaleDateString("pt-BR"),
      });
    }
  }

  return { columns, rows, name: "Vendas por produto" };
};
