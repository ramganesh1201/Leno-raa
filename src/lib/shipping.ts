/**
 * Lenoraa Delivery Fee Rule:
 * - Order amount ₹500 or below -> Delivery fee = ₹70
 * - Order amount above ₹500 -> Delivery fee = ₹0 (FREE)
 */
export function calculateDeliveryFee(subtotal: number): number {
  if (subtotal > 500) {
    return 0;
  }
  return 70;
}
