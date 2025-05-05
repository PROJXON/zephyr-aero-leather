import Image from "next/image"
import ChangeQuantitySpans from "./ChangeQuantitySpans"
import getItemInfo from "../../lib/getItemInfo"

export default function OrderSummary({ cartItems, products, total, quantityControls = {} }) {
    const { updateQuantity, editID, setEditID, newQty, setNewQty, changeQuantity } = quantityControls
    const editable = Object.keys(quantityControls).length > 0

    const formatPrice = priceInCents => {
        const dollars = Math.floor(priceInCents / 100)
        const cents = priceInCents % 100
        return `$${dollars}.${cents.toString().padStart(2, '0')}`
    }

    return (<div>
        <h2 className="font-bold text-xl mb-2">Order Summary</h2>
        <ul>
            {cartItems.map(item => {
                const [itemInfo, priceInCents] = getItemInfo(products, item)
                const imageInfo = itemInfo.images[0]

                return (<li
                    key={item.product_id || item.id}
                    className="grid grid-cols-[100px_auto] gap-2 mb-2"
                >
                    <Image
                        src={imageInfo.src}
                        alt={imageInfo.alt}
                        width={100}
                        height={100}
                        className="object-cover aspect-square"
                    />
                    <div className="text-sm">
                        <p>{itemInfo.name}</p>
                        <div className="grid grid-cols-2">
                            <div className="flex items-center flex-wrap gap-1">
                                {editable && editID === item.id ? (<input
                                    className="w-12 text-xs p-2 pr-0"
                                    type="number"
                                    min="0"
                                    value={newQty}
                                    autoFocus
                                    onChange={e => setNewQty(e.target.value)}
                                    onBlur={() => {
                                        const qty = parseInt(newQty)
                                        if (!isNaN(qty) && qty >= 0) updateQuantity(item.id, qty)
                                        setEditID(null)
                                    }}
                                    onKeyDown={e => {
                                        if (e.key === "Enter") e.target.blur()
                                    }}
                                />) : (<>
                                    {item.quantity > 1 && (
                                        <span className="text-zinc-300 mr-1 align-middle whitespace-nowrap">
                                            x {item.quantity}
                                        </span>
                                    )}
                                </>)}
                                {editable && <ChangeQuantitySpans cqs={changeQuantity} item={item} />}
                            </div>
                            <p className="text-right text-green-600">{formatPrice(priceInCents)}</p>
                        </div>
                    </div>
                </li>)
            })}
        </ul>
        <hr />
        <div className="grid grid-cols-2 text-sm mt-2">
            <p className="font-bold">Total</p>
            <p className="text-right">{formatPrice(total)}</p>
        </div>
    </div>)
}