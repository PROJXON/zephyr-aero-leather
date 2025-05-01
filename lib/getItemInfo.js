export default function getItemInfo(products, item) {
    const itemInfo = products.filter(product => product.id === (item.product_id || item.id))[0]
    const priceInCents = itemInfo.price * 100 * item.quantity
    return [itemInfo, priceInCents]
}