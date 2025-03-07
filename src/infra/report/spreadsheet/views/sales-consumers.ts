// Libraries
import { SpreadsheetColumn } from "@/core/report/spreadsheet-service";

// Entities
import { Bag } from "@/core/entities/bag";

// Utils
import { toCurrencyColumnStyle } from "@/infra/utils/to-currency-column-style";

const columns: SpreadsheetColumn[] = [
  { header: "SACOLA", key: "bag", width: 10 },
  { header: "CONSUMIDOR", key: "consumer", width: 20 },
  { header: "CPF", key: "cpf", width: 20 },
  { header: "ENDEREÇO", key: "address", width: 20 },
  {
    header: "VALOR SACOLA",
    key: "bag_price",
    width: 20,
    style: toCurrencyColumnStyle("BRL"),
  },
  {
    header: "VALOR ENTREGA",
    key: "delivery_price",
    width: 20,
    style: toCurrencyColumnStyle("BRL"),
  },
  {
    header: "VALOR TOTAL",
    key: "total_price",
    width: 20,
    style: toCurrencyColumnStyle("BRL"),
  },
  { header: "DATA DO PEDIDO", key: "date", width: 25 },
  { header: "PAGAMENTO", key: "payment_method", width: 20 },
  { header: "BANDEIRA", key: "flag", width: 20 },
  { header: "DATA DO PAGAMENTO", key: "payment_date", width: 25 },
  { header: "DATA INÍCIO CONSULTA", key: "start_date", width: 25 },
  { header: "DATA FIM CONSULTA", key: "end_date", width: 25 },
];

interface SalesConsumersReportViewProps {
  start_date: Date;
  end_date: Date;
  bags: Bag[];
}

export const SALES_CONSUMERS_VIEW = async ({
  start_date,
  end_date,
  bags,
}: SalesConsumersReportViewProps) => {
  const rows: Record<string, unknown>[] = [];

  for (const bag of bags) {
    const payments = Array.from(bag.payments.values());

    const mostRecentPayment = !!payments.length
      ? payments.reduce((acc, payment) => {
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
      bag_price: bag.price,
      delivery_price: 10,
      total_price: bag.price + 10,
      date: (bag.updated_at ?? bag.created_at).toLocaleDateString("pt-BR"),
      payment_method: mostRecentPayment?.method ?? "-",
      flag: mostRecentPayment?.flag ?? "-",
      payment_date: (
        mostRecentPayment?.updated_at ?? mostRecentPayment?.created_at
      )?.toLocaleDateString("pt-BR"),
      ...(start_date && {
        start_date: start_date.toLocaleDateString("pt-BR"),
      }),
      ...(end_date && { end_date: end_date.toLocaleDateString("pt-BR") }),
    });
  }

  return { columns, rows, type: "sales-consumers" };
};
