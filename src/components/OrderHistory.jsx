"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"

export default function OrderHistory() {
    const { user, isAuthenticated } = useAuth()
    const [orders, setOrders] = useState([])

    useEffect(() => {
        (async () => {
            if (isAuthenticated) {
                const orderResponse = await fetch(`/api/order?userID=${user.id}`)
                const data = await orderResponse.json()
                setOrders(data.orders || [])
                console.log(data.orders)
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