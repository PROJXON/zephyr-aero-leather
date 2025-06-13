export default function getItemInfo(products, item) {
  const itemInfo = products.find(product => product.id === item.id)

  if (!itemInfo) {
    console.warn(`Product not found for item ID: ${item.id}`)
    return [null, 0]
  }

  // 🔐 Fix: Round to nearest integer to avoid floating point Stripe errors
  const priceInCents = Math.round(itemInfo.price * 100 * item.quantity)

  return [itemInfo, priceInCents]
}
