"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"

export default function OrderHistory({ token }) {
    const { isAuthenticated } = useAuth()
    const [orders, setOrders] = useState([])

    useEffect(() => {
        (async () => {
            const userResponse = await fetch(
                `${process.env.WOOCOMMERCE_API_URL}/wp-json/wp/v2/users/me`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            const userID = userResponse.data.id

            const ordersResponse = await fetch(
                `${process.env.WOOCOMMERCE_API_URL}/wp-json/wc/v3/orders?customer=${userID}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            setOrders(ordersResponse.data)
        })
    }, [isAuthenticated])

    return (<>
        {isAuthenticated ? (<div>
            {/* Saying "No orders found even if you do make an order" */}
            {orders.length === 0 ?
                <p>No orders found</p> :
                <ul>
                    {orders.map(order => (<li key={order.id}>
                        An order
                    </li>))}
                </ul>
            }
        </div>) : <p>Loading...</p>}
    </>)
}