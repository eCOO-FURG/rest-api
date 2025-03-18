// Libraries
import { SpreadsheetColumn } from "@/core/report/spreadsheet-service";

// Entities
import { Bag } from "@/core/entities/bag";

// Report
import { SpreadsheetView } from "@/infra/report/spreadsheet/excel";

const columns: SpreadsheetColumn[] = [
  { header: "SACOLA", key: "bag", width: 10 },
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
  bags: Bag[];
}

export const BAGS_SALES_VIEW: SpreadsheetView = async ({
  bags,
  since,
  before,
}: BagsSalesReportViewProps) => {
  const rows: Record<string, unknown>[] = [];

  for (const bag of bags) {
    const mostRecentPayment = bag.payments.length
      ? bag.payments.reduce((acc, payment) => {
          if (payment.created_at > acc.created_at) {
            return payment;
          }

          return acc;
        })
      : null;

    rows.push({
      bag: bag.code,
      consumer: `${bag.user?.first_name} ${bag.user?.last_name}`,
      cpf: bag.user?.cpf.format,
      address: bag.address?.format,
      bag_price: bag.subtotal + bag.fee,
      shipping_price: bag.shipping,
      total_price: bag.total,
      date: (bag.updated_at ?? bag.created_at).toLocaleDateString("pt-BR"),
      payment_method: mostRecentPayment?.method ?? "-",
      flag: mostRecentPayment?.flag ?? "-",
      payment_date: mostRecentPayment?.created_at?.toLocaleDateString("pt-BR"),
      since: since?.toLocaleDateString("pt-BR"),
      before: before?.toLocaleDateString("pt-BR"),
    });
  }

  return { columns, rows, name: "Vendas por cliente" };
};
