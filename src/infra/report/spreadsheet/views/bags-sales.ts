// Libraries
import { SpreadsheetColumn } from "@/core/report/spreadsheet-service";

// Entities
import { BagAndOrders } from "@/core/entities/aggregates/bag-and-orders";

// Report
import { SpreadsheetView } from "@/infra/report/spreadsheet/excel";

// Constants
import { BAG_STATUS } from "@/core/constants/bag-status";

const columns: SpreadsheetColumn[] = [
  { header: "SACOLA", key: "bag", width: 10 },
  { header: "STATUS", key: "status", width: 20 },
  { header: "CONSUMIDOR", key: "consumer", width: 20 },
  { header: "CPF", key: "cpf", width: 20 },
  { header: "ENDEREÇO", key: "address", width: 20 },
  {
    header: "VALOR SACOLA",
    key: "bag_price",
    width: 20,
    style: { numFmt: "R$ #,##0.00" },
  },
  {
    header: "VALOR ENTREGA",
    key: "shipping_price",
    width: 20,
    style: { numFmt: "R$ #,##0.00" },
  },
  {
    header: "VALOR TOTAL",
    key: "total_price",
    width: 20,
    style: { numFmt: "R$ #,##0.00" },
  },
  { header: "DATA DO PEDIDO", key: "date", width: 25 },
  { header: "PAGAMENTO", key: "payment_method", width: 20 },
  { header: "BANDEIRA", key: "flag", width: 20 },
  { header: "DATA DO PAGAMENTO", key: "payment_date", width: 25 },
  { header: "DATA INÍCIO CONSULTA", key: "since", width: 25 },
  { header: "DATA FIM CONSULTA", key: "before", width: 25 },
];

interface BagsSalesReportViewProps {
  since?: Date;
  before?: Date;
  bags: BagAndOrders[];
}

export const BAGS_SALES_VIEW: SpreadsheetView = async ({ bags, since, before }: BagsSalesReportViewProps) => {
  const rows: Record<string, unknown>[] = [];

  for (const bag of bags) {
    rows.push({
      bag: bag.code,
      status: BAG_STATUS[bag.status],
      consumer: `${bag.customer.first_name} ${bag.customer.last_name}`,
      cpf: bag.customer.cpf.format,
      address: bag.address?.format,
      bag_price: bag.subtotal + bag.fee,
      shipping_price: bag.shipping,
      total_price: bag.total,
      date: (bag.updated_at ?? bag.created_at).toLocaleDateString("pt-BR"),
      payment_method: bag.payment?.method ?? "-",
      flag: bag.payment?.flag ?? "-",
      payment_date: bag.payment?.created_at?.toLocaleDateString("pt-BR"),
      since: since?.toLocaleDateString("pt-BR"),
      before: before?.toLocaleDateString("pt-BR"),
    });
  }

  return { columns, rows, name: "Vendas por cliente" };
};
