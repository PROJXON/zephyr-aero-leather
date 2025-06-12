export default function getItemInfo(products, item) {
  const itemInfo = products.find((product) => product.id === item.id);

  if (!itemInfo) {
    console.warn(`Product with ID ${item.id} not found in fetched products.`);
    return [null, 0]; // Avoid crashing
  }

  const priceInCents = itemInfo.price * 100 * item.quantity;
  return [itemInfo, priceInCents];
}
