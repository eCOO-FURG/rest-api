// Entities
import { Bag } from "@/core/entities/bag";

// Utils
import { formatPrice } from "@/core/utils/format-price";

export class BagReportMapper {
  static toExcelData(bags: Bag[]) {
    return bags.map(bag => ({
      sacola: bag.code,
      consumidor: bag.user
        ? `${bag.user.first_name} ${bag.user.last_name}`
        : "---",
      preco: formatPrice(bag.price) || 0,
      produto: Array.from(bag.orders.values())
        .map(order => order.offer?.product?.name || "N/A")
        .join(", "),
      produtor: Array.from(bag.orders.values())
        .map(order => order.offer?.catalog?.farm?.admin?.first_name || "N/A")
        .join(", "),
      quantidade: Array.from(bag.orders.values()).reduce(
        (sum, order) => sum + order.amount,
        0
      ),
      valorOferta: formatPrice(Array.from(bag.orders.values()).reduce(
        (sum, order) => sum + order.amount * (order.offer?.price || 0),
        0
      )),
      data: bag.created_at?.toISOString() || "---",
      pagamento: Array.from(bag.payments.values())
        .map(payment => payment.method)
        .join(", "),
      bandeira: Array.from(bag.payments.values())
        .map(payment => payment.flag || "---")
        .join(", "),
      entrega: bag.address
        ? `${bag.address.street}, ${bag.address.number}, ${bag.address.neighborhood}`
        : "Retirada",
    }));
  }
}
