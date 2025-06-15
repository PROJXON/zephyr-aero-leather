"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"
import OrderSummary from "./OrderSummary"
import calculateTotal from "../../lib/calculateTotal"
import type { Product } from "../../types/types"

export default function OrderHistory({ products }: { products: Product[] }) {
  const { isAuthenticated, user } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
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
          const ordersArray = orderData.orders || []
          setOrders(ordersArray.reverse())

          const times = ordersArray.map((order: any) => {
            const timeString = order.meta_data.find((meta: any) => meta.key === "user_local_time")?.value
            return new Date(timeString)
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
          const ids = data.map((review: any) => Number(review.product_id))
          setReviewedProductIds(ids)
        } catch (err) {
          console.error("Error fetching user reviews:", err)
        }
      }
    })()
  }, [isAuthenticated, user])

  return (
    <>
      {isAuthenticated ? (
        <div>
          {orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            <ul>
              {orders.map((order: any, i: number) => {
                const datePaid = localTimes[i]
                const items = order.items
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
