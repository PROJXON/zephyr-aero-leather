import Link from "next/link";
import Image from "next/image";
import ChangeQuantitySpans from "./ChangeQuantitySpans";
import getItemInfo from "../../lib/getItemInfo";
import type { OrderSummaryProps, QuantityControls } from "../../types/types";

export default function OrderSummary({
  cartItems,
  products,
  total,
  quantityControls = {},
  showReviewLinks = false,
  reviewedProductIds = [],
  shippingDetails,
  subtotal,
  shipping,
  tax,
  isLoading = false
}: OrderSummaryProps & { isLoading?: boolean }) {
  const {
    updateQuantity,
    editID,
    setEditID,
    newQty,
    setNewQty,
    changeQuantity = [],
  } = quantityControls as QuantityControls;
  const editable =
    typeof updateQuantity === "function" &&
    typeof setEditID === "function" &&
    typeof setNewQty === "function" &&
    changeQuantity.length > 0;

  const formatPrice = (priceInCents: number) => `$${(priceInCents / 100).toFixed(2)}`;

  return (
    <div className="space-y-6 border p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold">Order Summary</h2>

      <div className="space-y-4">
        {cartItems.map((item, index) => {
          const [itemInfo, priceInCents] = getItemInfo(products, item);
          if (!itemInfo) return null;

          const imageInfo = itemInfo.images?.[0];
          const productLink = `/product/${item.id}`;
          const alreadyReviewed = item.productId ? reviewedProductIds.includes(item.productId) : false;

          return (
            <div key={`${item.id}-${index}`} className="flex gap-4 border rounded-lg p-4 bg-amber-50/30">
              <Link href={productLink} className="relative w-24 h-24 block">
                <Image
                  src={imageInfo?.src || "/images/placeholder.svg"}
                  alt={imageInfo?.alt || itemInfo.name}
                  fill
                  sizes="(max-width: 768px) 96px, 96px"
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
                        onChange={(e) => setNewQty && setNewQty(e.target.value)}
                        onBlur={() => {
                          const qty = parseInt(newQty || "0");
                          if (!isNaN(qty) && qty >= 0 && updateQuantity) updateQuantity(item.id, qty);
                          if (setEditID) setEditID(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                        }}
                      />
                    ) : (
                      item.quantity > 1 && (
                        <span className="text-gray-400 text-sm">x{item.quantity}</span>
                      )
                    )}
                    {editable && changeQuantity.length > 0 && <ChangeQuantitySpans cqs={changeQuantity} item={item} />}
                  </div>

                  <p className="text-green-600 font-semibold text-sm pr-6">
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
        {shippingDetails && (
          <div className="text-sm bg-amber-50/50 border rounded p-4 pr-8">
            <h3 className="font-semibold mb-2">Shipped to:</h3>
            <p>
              {shippingDetails.first_name} {shippingDetails.last_name}
            </p>
            <p>
              {shippingDetails.address_1}
              {shippingDetails.address_2 ? `, ${shippingDetails.address_2}` : ""}
            </p>
            <p>
              {shippingDetails.city}, {shippingDetails.state} {shippingDetails.postcode}
            </p>
          </div>
        )}

      <div className="space-y-2 text-sm pt-4 border-t p-6">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{isLoading ? 'Loading...' : (typeof subtotal === 'number' && subtotal > 0 ? formatPrice(subtotal) : (total > 0 ? formatPrice(total) : '$0.00'))}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{isLoading ? 'Loading...' : (typeof shipping === 'number' && shipping > 0 ? formatPrice(shipping) : (typeof shipping === 'number' ? '$0.00' : 'Calculated at checkout'))}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>
            {isLoading ? (
              <span>Loading...</span>
            ) : typeof tax === 'number' && tax >= 0 ? (
              formatPrice(tax)
            ) : (
              '-'
            )}
          </span>
        </div>
        <div className="flex justify-between font-bold pt-2">
          <span>Total</span>
          <span>
            {isLoading ? (
              <span>Loading...</span>
            ) : total > 0 ? (
              formatPrice(total)
            ) : (
              '$0.00'
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
