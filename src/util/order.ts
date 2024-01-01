import { OrderItem, PricingOption, Order } from 'types/order.types'

export function computeOrderItemNetGross(orderItem: OrderItem): OrderItem {
  // Assuming discounts are in percentage and gross is the original price
  const gross = orderItem.product.price * orderItem.quantity
  const net = gross - calculateDiscountAmount(orderItem.discounts, gross)
  return { ...orderItem, gross, net }
}

function calculateDiscountAmount(
  discounts: PricingOption[],
  gross: number,
): number {
  let discountAmount = 0
  for (const discount of discounts) {
    if (discount.type === 'fixed') {
      discountAmount += discount.amount
    } else if (discount.type === 'percentage') {
      discountAmount += (discount.amount / 100) * gross
    }
  }
  return discountAmount
}

export function computeOrderNetGross(order: Order): Order {
  let gross = 0
  let net = 0

  for (const orderItem of order.orderItems) {
    gross += orderItem.gross
    net += orderItem.net
  }

  return { ...order, gross, net }
}
