"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import OrderSummary from "./OrderSummary"
import LoadingSpinner from "./LoadingSpinner"
import calculateTotal from "../../lib/calculateTotal"
import type { Product, CartItem } from "../../types/types"
import type { WooOrder, CartItemResponse, WooCommerceReview } from "../../types/woocommerce"

export default function OrderHistory({ products }: { products: Product[] }) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<WooOrder[]>([])
  const [localTimes, setLocalTimes] = useState<Date[]>([])
  const [reviewedProductIds, setReviewedProductIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        try {
          const orderRes = await fetch("/api/order")
          const orderData = await orderRes.json()
          const ordersArray = (orderData.orders || []) as WooOrder[]
          
          // Sort orders by date from newest to oldest
          const sortedOrders = ordersArray.sort((a, b) => {
            const timeA = a.meta_data?.find(meta => meta.key === "user_local_time")?.value
            const timeB = b.meta_data?.find(meta => meta.key === "user_local_time")?.value
            
            const dateA = timeA ? new Date(timeA as string) : new Date(0)
            const dateB = timeB ? new Date(timeB as string) : new Date(0)
            
            return dateB.getTime() - dateA.getTime() // Newest first
          })
          
          setOrders(sortedOrders)

          const times = sortedOrders.map((order: WooOrder) => {
            const timeString = order.meta_data?.find(meta => meta.key === "user_local_time")?.value
            return timeString ? new Date(timeString as string) : new Date()
          })
          setLocalTimes(times)
        } catch (err) {
          console.error("Error fetching orders:", err)
        } finally {
          setLoading(false)
        }
      }
    })()
  }, [isAuthenticated])

  useEffect(() => {
    const fetchReviewedProducts = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`/api/reviews?userId=${user.id}`);
        if (response.ok) {
          const data: WooCommerceReview[] = await response.json();
          // Use the WooCommerce API response directly - product_id is already the field name
          const productIds = data.map((review: WooCommerceReview) => Number(review.product_id));
          setReviewedProductIds(productIds);
        }
      } catch (error) {
        console.error('Error fetching reviewed products:', error);
      }
    };

    fetchReviewedProducts();
  }, [user]);

  const convertToCartItem = (item: CartItemResponse): CartItem => ({
    id: item.id,
    quantity: item.quantity,
    name: item.name,
    price: item.price ? parseFloat(item.price) : undefined,
    productId: item.id
  })

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return <LoadingSpinner message="Loading orders..." />
  }

  return (
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
  )
}
