export default function getItemInfo(products, item) {
    const itemInfo = products.find(product => product.id === (item.product_id || item.id))
    const priceInCents = itemInfo.price * 100 * item.quantity
    return [itemInfo, priceInCents]
}