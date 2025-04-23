"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"

export default function OrderHistory({ token }) {
    const { user, isAuthenticated } = useAuth()
    const [orders, setOrders] = useState([])

    useEffect(() => {
        (async () => {
            if (isAuthenticated) {
                //404 error
                const ordersResponse = await fetch(
                    `${process.env.WOOCOMMERCE_API_URL}/wp-json/wc/v3/orders?customer=${user.id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )

                setOrders(ordersResponse.data)
            }
        })()
    }, [isAuthenticated])

    return (<>
        {isAuthenticated ? (<div>
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