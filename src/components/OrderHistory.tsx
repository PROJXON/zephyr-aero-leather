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
          console.log("Fetching orders...");
          const orderRes = await fetch("/api/order")
          console.log("Order response status:", orderRes.status);
          const orderData = await orderRes.json()
          console.log("Order data:", orderData);
          const ordersArray = (orderData.orders || []) as WooOrder[]
          console.log("Orders array length:", ordersArray.length);
          
          // Sort orders by date from newest to oldest
          console.log("Starting to sort orders...");
          const sortedOrders = ordersArray.sort((a, b) => {
            const timeA = a.meta_data?.find(meta => meta.key === "user_local_time")?.value
            const timeB = b.meta_data?.find(meta => meta.key === "user_local_time")?.value
            
            const dateA = timeA ? new Date(timeA as string) : new Date(0)
            const dateB = timeB ? new Date(timeB as string) : new Date(0)
            
            return dateB.getTime() - dateA.getTime() // Newest first
          })
          console.log("Orders sorted, setting state...");
          setOrders(sortedOrders)

          console.log("Processing local times...");
          const times = sortedOrders.map((order: WooOrder) => {
            const timeString = order.meta_data?.find(meta => meta.key === "user_local_time")?.value
            return timeString ? new Date(timeString as string) : new Date()
          })
          console.log("Setting local times...");
          setLocalTimes(times)
          console.log("Setting loading to false...");
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
        console.log("Fetching reviewed products for user:", user.id);
        const response = await fetch(`/api/reviews?userId=${user.id}`);
        console.log("Reviews response status:", response.status);
        if (response.ok) {
          const data: WooCommerceReview[] = await response.json();
          console.log("Reviews data:", data);
          // Use the WooCommerce API response directly - product_id is already the field name
          const productIds = data.map((review: WooCommerceReview) => Number(review.product_id));
          console.log("Setting reviewed product IDs:", productIds);
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

  // Helper function to convert WooOrderLineItem to CartItem
  const convertLineItemToCartItem = (lineItem: any): CartItem => ({
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
        console.log(`Order ${order.id} using line_items:`, order.line_items.length);
        return order.line_items.map(convertLineItemToCartItem);
      }
      
      // Fallback to items (custom field that might not exist on older orders)
      if (order.items && Array.isArray(order.items)) {
        console.log(`Order ${order.id} using items:`, order.items.length);
        return order.items.map(convertToCartItem);
      }
      
      console.warn(`Order ${order.id} has no line_items or items:`, { line_items: order.line_items, items: order.items });
      return [];
    } catch (error) {
      console.error(`Error converting items for order ${order.id}:`, error);
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
      console.error(`Error processing amounts for order ${order.id}:`, error);
      // Return safe defaults if there's an error
      return { subtotal: undefined, shipping: undefined, tax: undefined, total: 0 };
    }
  };

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    console.log("Not authenticated, returning null");
    return null
  }

  if (loading) {
    console.log("Loading state, showing spinner");
    return <LoadingSpinner message="Loading orders..." />
  }

  console.log("Rendering order history with", orders.length, "orders");
  return (
    <div>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <ul>
          {orders.map((order: WooOrder, i: number) => {
            try {
              console.log(`Processing order ${i + 1}/${orders.length}:`, order.id);
              console.log(`Order ${order.id} structure:`, {
                hasLineItems: !!order.line_items,
                lineItemsLength: order.line_items?.length,
                hasItems: !!order.items,
                itemsLength: order.items?.length,
                total: order.total,
                status: order.status
              });
              
              const datePaid = localTimes[i] || new Date()
              const items = convertOrderItems(order)
              console.log(`Order ${order.id} converted items:`, items.length);
              
              const { subtotal, shipping, tax, total } = getOrderAmounts(order)
              console.log(`Order ${order.id} amounts:`, { subtotal, shipping, tax, total });

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
              console.error(`Error processing order ${order.id}:`, error);
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
