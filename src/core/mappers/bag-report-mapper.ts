// Entities
import { Bag } from "@/core/entities/bag";

// Utils
import { formatPrice } from "@/core/utils/format-price";
import { formatDate } from "../utils/format-date";

interface BagReportRow {
  sacola: string | number;
  consumidor: string;
  preco: string;
  produto: string;
  produtor: string;
  quantidade: number;
  valorOferta: string;
  precificacao: string;
  data: string;
  pagamento: string;
  bandeira: string;
  entrega: string;
}

export class BagReportMapper {
  static toExcelData(bags: Bag[]): BagReportRow[] {
    const data: BagReportRow[] = [];

    bags.forEach(bag => {
      Array.from(bag.orders.values()).forEach(order => {
        const pricingType = order.offer?.product?.pricing || "N/A";
        const unitPrice = order.offer?.price ? Number(order.offer.price) : 0;
        const totalPrice = Number(order.amount) * unitPrice;

        data.push({
          sacola: bag.code,
          consumidor: bag.user
            ? `${bag.user.first_name} ${bag.user.last_name}`
            : "---",
          preco: formatPrice(totalPrice),
          produto: order.offer?.product?.name || "N/A",
          produtor: order.offer?.catalog?.farm?.admin?.first_name || "N/A",
          quantidade: order.amount,
          valorOferta: formatPrice(unitPrice),
          precificacao: pricingType === "UNIT" ? "Unidade" : pricingType === "WEIGHT" ? "Peso" : "N/A",
          data: bag.created_at ? formatDate(new Date(bag.created_at)) : "---",
          pagamento: Array.from(bag.payments.values())
            .map(payment => payment.method)
            .join(", "),
          bandeira: Array.from(bag.payments.values())
            .map(payment => payment.flag || "---")
            .join(", "),
          entrega: bag.address
            ? `${bag.address.street}, ${bag.address.number}, ${bag.address.neighborhood}`
            : "Retirada",
        });
      });
    });

    return data;
  }
}
