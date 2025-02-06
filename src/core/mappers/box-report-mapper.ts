// Entities
import { Box } from "@/core/entities/box";
import { Order } from "@/core/entities/order";

// Services
import { FormattedBox, OrderDetails } from "@/core/report/pdf-service";

export class BoxReportMapper {
  static formatBoxes(boxes: Box[]): FormattedBox[] {
    return boxes.map((box) => ({
      id: box.id.value,
      status: box.status,
      verified: box.verified,
      catalog: box.catalog?.farm ? { farm: { name: box.catalog.farm.name } } : null,
      orders: this.mergeOrders(
        [...box.orders.values()].filter((order) =>
          ["PENDING", "RECEIVED"].includes(order.status)
        )
      ),
    }));
  }

  private static mergeOrders(orders: Order[]): OrderDetails[] {
    const merged = new Map<string, OrderDetails>();
  
    for (const order of orders) {
      const product = order.offer?.product?.name || "Produto desconhecido";
      const pricing = order.offer?.product?.pricing || "UNIT";
      const status = order.status === "PENDING" ? "PENDING" : "RECEIVED";
  
      const key = `${product}-${pricing}-${status}`;
  
      if (merged.has(key)) {
        merged.get(key)!.quantity += order.amount;
      } else {
        merged.set(key, { quantity: order.amount, product, pricing, status });
      }
    }
  
    return [...merged.values()];
  }
}
