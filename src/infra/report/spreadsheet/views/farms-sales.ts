// Libraries
import { SpreadsheetColumn } from "@/core/report/spreadsheet-service";

// Entities
import { BagAndOrders } from "@/core/entities/aggregates/bag-and-orders";
import { CatalogAndOffers } from "@/core/entities/aggregates/catalog-and-offers";

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
    style: { numFmt: "R$ #,##0.00" },
  },
  {
    header: "VALOR DA OFERTA",
    key: "offer_price",
    width: 20,
    style: { numFmt: "R$ #,##0.00" },
  },
  {
    header: "TAXA (%)",
    key: "fee",
    width: 15,
    style: { numFmt: "0%" },
  },
  { header: "TOTAL COMERCIALIZADO", key: "total_amount", width: 20 },
  {
    header: "VALOR A RECEBER",
    key: "farm_income",
    width: 20,
    style: { numFmt: "R$ #,##0.00" },
  },
  {
    header: "VALOR DO ARMAZÉM",
    key: "warehouse_income",
    width: 20,
    style: { numFmt: "R$ #,##0.00" },
  },
  { header: "DATA INÍCIO CONSULTA", key: "since", width: 25 },
  { header: "DATA FIM CONSULTA", key: "before", width: 25 },
];

interface FarmsSalesReportViewProps {
  bags: BagAndOrders[];
  catalogs: CatalogAndOffers[];
  since?: Date;
  before?: Date;
}

export const FARMS_PRODUCERS_VIEW: SpreadsheetView = async ({
  bags,
  catalogs,
  since,
  before,
}: FarmsSalesReportViewProps) => {
  const rows: Record<string, unknown>[] = [];

  for (const catalog of catalogs) {
    for (const offer of catalog.offers) {
      const orders = bags
        .flatMap((bag) => bag.orders)
        .filter((order) => order.offer_id.equals(offer.id));

      const amount =
        orders.reduce((acc, order) => acc + order.amount, 0) /
        (offer.product?.pricing === "UNIT" ? 1 : 1000);

      rows.push({
        producer: `${catalog.farm.admin.first_name} ${catalog.farm.admin.last_name}`,
        product: offer.product?.name,
        pricing: offer.product?.pricing === "UNIT" ? "Unidade" : "Peso",
        price_without_tax: offer.price,
        offer_price: offer.price + (offer.price * catalog.fee) / 100,
        fee: catalog.fee / 100,
        total_amount: amount,
        farm_income: amount * offer.price,
        warehouse_income: amount * offer.fee,
        since: since?.toLocaleDateString("pt-BR"),
        before: before?.toLocaleDateString("pt-BR"),
      });
    }
  }

  return { columns, rows, name: "Vendas por produtor" };
};
