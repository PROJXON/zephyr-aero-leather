"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"
import OrderSummary from "./OrderSummary"
import calculateTotal from "../../lib/calculateTotal"

export default function OrderHistory({ products }) {
    const { user, isAuthenticated } = useAuth()
    const [orders, setOrders] = useState([])

    useEffect(() => {
        (async () => {
            if (isAuthenticated) {
                const orderResponse = await fetch(`/api/order?userID=${user.id}`)
                const data = await orderResponse.json()
                setOrders(data.orders || [])
            }
        })()
    }, [isAuthenticated])

    return (<>
        {isAuthenticated ? (<div>
            {orders.length === 0 ?
                <p>No orders found</p> :
                <ul>
                    {orders.map((order, i) => {
                        const datePaid = new Date(order.date_paid)
                        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                        const items = order.line_items
                        const total = calculateTotal(items, products)

                        return (<li key={order.id}>
                            <h2 className={"font-bold text-xl text-center underline"}>
                                <div className={`p-2 ${i !== 0 ? " border-t-2 border-black" : ""}`}>
                                    {months[datePaid.getMonth()]} {datePaid.getDate()}, {datePaid.getFullYear()} {datePaid.toLocaleString([], {
                                        hour: "numeric",
                                        minute: "2-digit"
                                    })}
                                </div>
                            </h2>
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