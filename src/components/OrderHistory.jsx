"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"
import OrderSummary from "./OrderSummary"
import calculateTotal from "../../lib/calculateTotal"

export default function OrderHistory({ products }) {
  const { isAuthenticated, user } = useAuth()
  const [orders, setOrders] = useState([])
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
          const orderRes = await fetch("/api/order")
          const orderData = await orderRes.json()
          const ordersArray = orderData.orders || []
          setOrders(ordersArray.reverse())

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
  }, [isAuthenticated])

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

                        const shippingMetaEntry = order.meta_data.find(meta => meta.key === "_shipping_address_index");
                        let shippingLines = null;

                        if (shippingMetaEntry?.value) {
                          const shippingText = shippingMetaEntry.value.trim();
                          const parts = shippingText.trim().split(/\s{2,}/);

                          if (parts.length >= 3 && parts[2]?.includes(" ")) {
                            const cityStateZipCountry = parts[2].split(" ");
                            if (cityStateZipCountry.length >= 4) {
                              shippingLines = [
                                `Name: ${parts[0] || ""}`,
                                `Address: ${parts[1] || ""}`,
                                `City: ${cityStateZipCountry[0] || ""}`,
                                `State: ${cityStateZipCountry[1] || ""}`,
                                `Zip Code: ${cityStateZipCountry[2] || ""}`,
                                `Country: ${cityStateZipCountry[3] || ""}`,
                              ];
                            }
                          }
                        }

                        return (<li key={order.id}>
                            <h2 className={"font-bold text-xl text-center"}>
                                <div className={`p-2${i !== 0 ? " border-t-2 border-black" : ""}`}>
                                    {months[datePaid.getMonth()]} {datePaid.getDate()}, {datePaid.getFullYear()} {datePaid.toLocaleString([], {
                                        hour: "numeric",
                                        minute: "2-digit"
                                    })}
                                </div>
                            </h2>
                            <div className="text-sm text-gray-700 px-4 py-2">
                              <h3 className="font-semibold text-lg">Shipping Details</h3>
                              {shippingLines ? (
                                <div className="whitespace-pre-line">
                                  {shippingLines.map((line, index) => (
                                    <p key={index}>{line}</p>
                                  ))}
                              </div>
                              ) : (
                                <p>No shipping information available.</p>
                              )}
                            </div>
                            <OrderSummary
                                cartItems={items}
                                products={products}
                                total={total}
                            />
                        </li>)
                    })}
                </ul>
            }
        </div>) : <p>Loading...</p>}
    </>)
}
=======
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