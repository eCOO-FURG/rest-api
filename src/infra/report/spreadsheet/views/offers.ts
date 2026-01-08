// Types
import { SpreadsheetColumn } from "@/core/report/spreadsheet-service";
import { SpreadsheetView } from "@/infra/report/spreadsheet/excel";

// Entities
import { Catalog } from "@/core/entities/aggregates/catalog";

const columns: SpreadsheetColumn[] = [
  { header: "Fazenda", key: "farm", width: 25 },
  { header: "Produto", key: "product", width: 25 },
  {
    header: "Preço (R$)",
    key: "price",
    width: 15,
    style: { numFmt: "R$ #,##0.00" },
  },
  {
    header: "Taxa (R$)",
    key: "fee",
    width: 15,
    style: { numFmt: "R$ #,##0.00" },
  },
  {
    header: "Total (R$)",
    key: "total",
    width: 15,
    style: { numFmt: "R$ #,##0.00" },
  },
  { header: "Unidade", key: "unit", width: 15 },
  { header: "Recorrente", key: "recurring", width: 5 },
  { header: "Criada em", key: "created_at", width: 15 },
];

interface OffersReportViewProps {
  catalogs: Catalog[];
  since?: Date;
  before?: Date;
}

export const OFFERS_VIEW: SpreadsheetView = async ({
  catalogs,
  since,
  before,
}: OffersReportViewProps) => {
  const rows: Record<string, unknown>[] = [];

  for (const catalog of catalogs) {
    for (const offer of catalog.offers) {
      const isOfferInPeriod =
        !offer.closes_at ||
        ((!since || offer.opens_at >= since) && (!before || offer.closes_at <= before));

      if (!isOfferInPeriod) {
        continue;
      }

      rows.push({
        farm: catalog.name,
        product: offer.product.name,
        price: offer.price,
        fee: offer.price * (catalog.fee / 100),
        total: offer.price + offer.price * (catalog.fee / 100),
        unit: offer.product.pricing === "UNIT" ? "Unidade" : "Kg",
        recurring: offer.closes_at ? "Não" : "Sim",
        created_at: offer.created_at.toLocaleDateString("pt-BR"),
      });
    }
  }

  return {
    name: "Relatório de Ofertas",
    columns,
    rows,
  };
};
