"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"
import OrderSummary from "./OrderSummary"
import calculateTotal from "../../lib/calculateTotal"

export default function OrderHistory({ products }) {
  const { isAuthenticated, user } = useAuth()
  const [orders, setOrders] = useState([])
  const [refreshCount, setRefreshCount] = useState(0)
  const [localTimes, setLocalTimes] = useState([])
  const [reviewedProductIds, setReviewedProductIds] = useState([])
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        try {
          const orderRes = await fetch("/api/order", { cache: "no-store" })
          const orderData = await orderRes.json()
          const ordersArray = orderData.orders || []
          setOrders(ordersArray)

          const times = ordersArray.map(order => {
            const timeString = order.meta_data.find(meta => meta.key === "user_local_time")?.value
            return new Date(timeString)
          })
          setLocalTimes(times)
        } catch (err) {
          console.error("Error fetching orders:", err)
        }
      }
    })()
  }, [isAuthenticated, refreshCount])

  useEffect(() => {
    (async () => {
      if (isAuthenticated && user?.id) {
        try {
          const res = await fetch(`/api/reviews?userId=${user.id}`)
          const data = await res.json()
          const ids = data.map(review => Number(review.product_id))
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
              {orders.map((order, i) => {
                const datePaid = localTimes[i]
                const items = order.items
                const total = calculateTotal(items, products)
                const shipping = order.shipping || JSON.parse(order.metadata?.shipping || "{}")

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
                    <div className="text-sm text-gray-700 px-4 py-2">
                      <h3 className="font-semibold text-lg">Shipping Details</h3>
                      {shipping?.name && (
                        <div className="mt-2 text-sm">
                            <p><strong>Shipped To:</strong> {shipping.name.first} {shipping.name.last}</p>
                            <p>{shipping.address.line1}{shipping.address.line2 && `, ${shipping.address.line2}`}</p>
                            <p>{shipping.city}, {shipping.state} {shipping.zipCode}</p>
                        </div>
                        )}
                    </div>
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
