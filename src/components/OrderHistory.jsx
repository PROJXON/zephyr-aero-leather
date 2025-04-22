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
        {isAuthenticated ? <div>
            Order History here
        </div> : <p>Loading...</p>}
    </>)
}