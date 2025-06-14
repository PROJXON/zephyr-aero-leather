import Link from "next/link";
import Image from "next/image";
import ChangeQuantitySpans from "./ChangeQuantitySpans";
import getItemInfo from "../../lib/getItemInfo";

export default function OrderSummary({
  cartItems,
  products,
  total,
  quantityControls = {},
  showReviewLinks = false,
  reviewedProductIds = [],
}) {
  const { updateQuantity, editID, setEditID, newQty, setNewQty, changeQuantity } = quantityControls;
  const editable = Object.keys(quantityControls).length > 0;

  const formatPrice = priceInCents => `$${(priceInCents / 100).toFixed(2)}`;

  return (
    <div className="space-y-6 border p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold">Order Summary</h2>

      <div className="space-y-4">
        {cartItems.map((item) => {
          const [itemInfo, priceInCents] = getItemInfo(products, item);
          if (!itemInfo) return null;

          const imageInfo = itemInfo.images?.[0];
          const productLink = `/product/${item.id}`;
          const alreadyReviewed = reviewedProductIds.includes(item.id);

          return (
            <div key={item.id} className="flex gap-4 border rounded-lg p-4">
              <Link href={productLink} className="relative w-24 h-24 block">
                <Image
                  src={imageInfo?.src || "/images/placeholder.svg"}
                  alt={imageInfo?.alt || itemInfo.name}
                  fill
                  className="object-cover rounded"
                />
              </Link>

              <div className="flex-1">
                <Link href={productLink} className="font-medium hover:underline block">
                  {itemInfo.name}
                </Link>

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
                          const qty = parseInt(newQty);
                          if (!isNaN(qty) && qty >= 0) updateQuantity(item.id, qty);
                          setEditID(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.target.blur();
                        }}
                      />
                    ) : (
                      item.quantity > 1 && (
                        <span className="text-gray-400 text-sm">x{item.quantity}</span>
                      )
                    )}
                    {editable && <ChangeQuantitySpans cqs={changeQuantity} item={item} />}
                  </div>

                  <p className="text-green-600 font-semibold text-sm">
                    {formatPrice(priceInCents)}
                  </p>
                </div>

                {showReviewLinks && (
                  <div className="text-sm mt-2">
                    <Link
                      href={`${productLink}#reviews`}
                      className={alreadyReviewed
                        ? "line-through text-gray-400"
                        : "text-gray-400 hover:underline"}
                    >
                      {alreadyReviewed ? "Review Submitted" : "Leave a Review"}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
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
  );
}
