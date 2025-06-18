"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"
import OrderSummary from "./OrderSummary"
import calculateTotal from "../../lib/calculateTotal"
import type { Product, Review, CartItem } from "../../types/types"
import type { WooOrder, CartItemResponse } from "../../types/woocommerce"

export default function OrderHistory({ products }: { products: Product[] }) {
  const { isAuthenticated, user } = useAuth()
  const [orders, setOrders] = useState<WooOrder[]>([])
  const [localTimes, setLocalTimes] = useState<Date[]>([])
  const [reviewedProductIds, setReviewedProductIds] = useState<number[]>([])

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        try {
          const orderRes = await fetch("/api/order")
          const orderData = await orderRes.json()
          const ordersArray = (orderData.orders || []) as WooOrder[]
          setOrders(ordersArray.reverse())

          const times = ordersArray.map((order: WooOrder) => {
            const timeString = order.meta_data?.find(meta => meta.key === "user_local_time")?.value
            return timeString ? new Date(timeString as string) : new Date()
          })
          setLocalTimes(times)
        } catch (err) {
          console.error("Error fetching orders:", err)
        }
      }
    })()
  }, [isAuthenticated])

  useEffect(() => {
    (async () => {
      if (isAuthenticated && user?.id) {
        try {
          const res = await fetch(`/api/reviews?userId=${user.id}`)
          const data = await res.json()
          const ids = data.map((review: Review) => review.productId)
          setReviewedProductIds(ids)
        } catch (err) {
          console.error("Error fetching user reviews:", err)
        }
      }
    })()
  }, [isAuthenticated, user])

  const convertToCartItem = (item: CartItemResponse): CartItem => ({
    id: item.id,
    quantity: item.quantity,
    name: item.name,
    price: item.price ? parseFloat(item.price) : undefined,
    productId: item.product_id
  })

  return (
    <>
      {isAuthenticated ? (
        <div>
          {orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            <ul>
              {orders.map((order: WooOrder, i: number) => {
                const datePaid = localTimes[i]
                const items = order.items.map(convertToCartItem)
                const total = calculateTotal(items, products)

                return (
                  <li key={order.id}>
                    <h2 className="font-bold text-xl text-center">
                      <div className={`p-2${i !== 0 ? " border-t-2 border-black" : ""}`}>
                        {months[datePaid.getMonth()]} {datePaid.getDate()}, {datePaid.getFullYear()}{" "}
                        {datePaid.toLocaleString([], {
                          hour: "numeric",
                          minute: "2-digit"
                        })}
                      </div>
                    </h2>
                    <OrderSummary
                      cartItems={items}
                      products={products}
                      total={total}
                      showReviewLinks={true}
                      reviewedProductIds={reviewedProductIds}
                      shippingDetails={order.shipping}
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  )
}
