"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import OrderSummary from "./OrderSummary"
import LoadingSpinner from "./LoadingSpinner"
import calculateTotal from "../../lib/calculateTotal"
import type { Product, CartItem } from "../../types/types"
import type { WooOrder, CartItemResponse, WooCommerceReview, WooOrderLineItem } from "../../types/woocommerce"

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
        } catch {
          // Handle error silently or show user-friendly message
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
      } catch {
        // Handle error silently
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

  // Helper function to convert WooOrderLineItem to CartItem
  const convertLineItemToCartItem = (lineItem: WooOrderLineItem): CartItem => ({
    id: lineItem.product_id, // Use product_id as the id
    quantity: lineItem.quantity,
    name: lineItem.name,
    price: lineItem.price ? parseFloat(lineItem.price) : undefined,
    productId: lineItem.product_id
  })

  // Helper function to safely convert order items
  const convertOrderItems = (order: WooOrder): CartItem[] => {
    try {
      // First try to use line_items (standard WooCommerce field)
      if (order.line_items && Array.isArray(order.line_items)) {
        return order.line_items.map(convertLineItemToCartItem);
      }
      
      // Fallback to items (custom field that might not exist on older orders)
      if (order.items && Array.isArray(order.items)) {
        return order.items.map(convertToCartItem);
      }
      
      return [];
    } catch (error) {
      return [];
    }
  };

  // Helper function to get order amounts in cents
  const getOrderAmounts = (order: WooOrder) => {
    try {
      // Get the order total (always available)
      const total = order.total ? Math.round(parseFloat(order.total) * 100) : 0;
      
      // Only use breakdown fields if they exist and are valid
      // For older orders, these fields won't exist, so we return undefined
      const subtotal = order.subtotal ? Math.round(parseFloat(order.subtotal) * 100) : undefined;
      const shipping = order.shipping_total ? Math.round(parseFloat(order.shipping_total) * 100) : undefined;
      const tax = order.total_tax ? Math.round(parseFloat(order.total_tax) * 100) : undefined;
      
      return { subtotal, shipping, tax, total };
    } catch (error) {
      // Return safe defaults if there's an error
      return { subtotal: undefined, shipping: undefined, tax: undefined, total: 0 };
    }
  };

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
            try {
              const datePaid = localTimes[i] || new Date()
              const items = convertOrderItems(order)
              const { subtotal, shipping, tax, total } = getOrderAmounts(order)

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
                    subtotal={subtotal}
                    shipping={shipping}
                    tax={tax}
                    showReviewLinks={true}
                    reviewedProductIds={reviewedProductIds}
                    shippingDetails={order.shipping || undefined}
                  />
                </li>
              )
            } catch (error) {
              return (
                <li key={order.id}>
                  <div className="p-4 border rounded bg-red-50">
                    <h3 className="font-bold text-red-600">Order #{order.id}</h3>
                    <p className="text-red-500">Error displaying order details: {error instanceof Error ? error.message : 'Unknown error'}</p>
                  </div>
                </li>
              );
            }
          })}
        </ul>
      )}
    </div>
  )
}
