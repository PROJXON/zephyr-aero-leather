import getItemInfo from "./getItemInfo"

export default function calculateTotal(cartItems, products) {
    let initialTotal = 0

    cartItems.map(item => {
        const priceInCents = getItemInfo(products, item)[1]
        initialTotal += priceInCents
    })

    return initialTotal
}