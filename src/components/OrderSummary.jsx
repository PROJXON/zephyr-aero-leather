import Image from "next/image"
import ChangeQuantitySpans from "./ChangeQuantitySpans"
import getItemInfo from "../../lib/getItemInfo"

export default function OrderSummary({ cartItems, products, total, quantityControls = {} }) {
  const { updateQuantity, editID, setEditID, newQty, setNewQty, changeQuantity } = quantityControls
  const editable = Object.keys(quantityControls).length > 0

  const formatPrice = priceInCents => {
    const price = (priceInCents / 100).toFixed(2)
    return `$${price}`
  }


  return (
    <div className="space-y-6 border p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold">Order Summary</h2>

      <div className="space-y-4">
        {cartItems.map((item) => {
          const [itemInfo, priceInCents] = getItemInfo(products, item)

          if (!itemInfo) {
            return (
              <div key={item.id} className="flex gap-4 border rounded-lg p-4">
                <p className="text-red-500">Product no longer available (ID: {item.id})</p>
              </div>
            )
          }

          const imageInfo = itemInfo.images[0]

          return (
            <div key={item.id} className="flex gap-4 border rounded-lg p-4">
              <div className="relative w-24 h-24">
                <Image
                  src={imageInfo?.src || "/images/placeholder.svg"}
                  alt={imageInfo?.alt || itemInfo.name}
                  fill
                  className="object-cover rounded"
                />
              </div>

              <div className="flex-1">
                <p className="font-medium">{itemInfo.name}</p>
                <div className="flex justify-between mt-1 items-center">
                  <div className="flex items-center gap-2 flex-wrap">
                    {editable && editID === item.id ? (
                      <input
                        className="w-16 text-sm border px-2 py-1 rounded"
                        type="number"
                        min="0"
                        value={newQty}
                        autoFocus
                        onChange={(e) => setNewQty(e.target.value)}
                        onBlur={() => {
                          const qty = parseInt(newQty)
                          if (!isNaN(qty) && qty >= 0) updateQuantity(item.id, qty)
                          setEditID(null)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.target.blur()
                        }}
                      />
                    ) : (
                      <>
                        {item.quantity > 1 && (
                          <span className="text-gray-400 text-sm">x{item.quantity}</span>
                        )}
                      </>
                    )}
                    {editable && <ChangeQuantitySpans cqs={changeQuantity} item={item} />}
                  </div>
                  <p className="text-green-600 font-semibold text-sm">{formatPrice(priceInCents)}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="space-y-2 text-sm pt-4 border-t">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="flex justify-between font-bold pt-2">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}
