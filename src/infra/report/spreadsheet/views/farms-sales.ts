// Libraries
import { SpreadsheetColumn } from "@/core/report/spreadsheet-service";

// Entities
import { Catalog } from "@/core/entities/catalog";

// Utils
import { toCurrencyColumnStyle } from "@/infra/utils/to-currency-column-style";
import { toPercentageColumnStyle } from "@/infra/utils/to-percentage-column-style";
import { toUntaxed } from "@/infra/utils/to-untaxed";

// Report
import { SpreadsheetView } from "@/infra/report/spreadsheet/excel";

const columns: SpreadsheetColumn[] = [
  { header: "PRODUTOR", key: "producer", width: 20 },
  { header: "PRODUTO", key: "product", width: 25 },
  { header: "PRECIFICAÇÃO", key: "pricing", width: 15 },
  {
    header: "PREÇO SEM TAXA",
    key: "price_without_tax",
    width: 15,
    style: toCurrencyColumnStyle("BRL"),
  },
  {
    header: "VALOR DA OFERTA",
    key: "offer_price",
    width: 20,
    style: toCurrencyColumnStyle("BRL"),
  },
  {
    header: "TAXA (%)",
    key: "tax",
    width: 15,
    style: toPercentageColumnStyle(),
  },
  { header: "TOTAL COMERCIALIZADO", key: "total_amount", width: 20 },
  {
    header: "VALOR A RECEBER",
    key: "total_price",
    width: 20,
    style: toCurrencyColumnStyle("BRL"),
  },
  {
    header: "VALOR DO ARMAZÉM",
    key: "warehouse_price",
    width: 20,
    style: toCurrencyColumnStyle("BRL"),
  },
  { header: "DATA INÍCIO CONSULTA", key: "start_date", width: 25 },
  { header: "DATA FIM CONSULTA", key: "end_date", width: 25 },
];

interface FarmsSalesReportViewProps {
  catalogs: Catalog[];
  since?: Date;
  before?: Date;
}

export const FARMS_PRODUCERS_VIEW: SpreadsheetView = async ({
  catalogs,
  since,
  before,
}: FarmsSalesReportViewProps) => {
  const rows: Record<string, unknown>[] = [];

  for (const catalog of catalogs) {
    const offers = Array.from(catalog.offers.values());

    if (!offers.length) continue;

    if (!catalog.farm) continue;

    if (!catalog.farm.admin) continue;

    for (const offer of offers) {
      if (!offer.orders) continue;

      const orders = Array.from(offer.orders.values());

      if (!orders.length) continue;

      const totalAmount =
        orders.reduce((acc, order) => acc + order.amount, 0) /
        (offer.product?.pricing === "UNIT" ? 1 : 1000);

      const totalPrice = totalAmount * offer.price;

      rows.push({
        producer: `${catalog.farm.admin.first_name} ${catalog.farm.admin.last_name}`,
        product: offer.product?.name,
        pricing: offer.product?.pricing === "UNIT" ? "Unidade" : "Peso",
        price_without_tax: toUntaxed(offer.price, catalog.tax),
        offer_price: offer.price,
        tax: catalog.tax / 100,
        total_amount: totalAmount,
        total_price: toUntaxed(totalPrice, catalog.tax),
        warehouse_price: totalPrice - toUntaxed(totalPrice, catalog.tax),
        ...(since && {
          since: since.toLocaleDateString("pt-BR"),
        }),
        ...(before && { before: before.toLocaleDateString("pt-BR") }),
      });
    }
  }

  return { columns, rows, name: "Vendas por produtor" };
};
