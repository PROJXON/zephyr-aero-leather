"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"
import OrderSummary from "./OrderSummary"
import calculateTotal from "../../lib/calculateTotal"

export default function OrderHistory({ products }) {
    const { isAuthenticated } = useAuth()
    const [orders, setOrders] = useState([])
    const [localTimes, setLocalTimes] = useState([])

    useEffect(() => {
        (async () => {
            if (isAuthenticated) {
                const orderResponse = await fetch("/api/order")
                const data = await orderResponse.json()
                const ordersArray = data.orders || []
                setOrders(ordersArray)

                let localTimesArray = []
                ordersArray.forEach(order => {
                    const timeString = order.meta_data.find(meta => meta.key === "user_local_time")?.value
                    localTimesArray.push(new Date(timeString))
                })
                setLocalTimes(localTimesArray)
            }
        })()
    }, [isAuthenticated])

    return (<>
        {isAuthenticated ? (<div>
            {orders.length === 0 ?
                <p>No orders found</p> :
                <ul>
                    {orders.map((order, i) => {
                        const datePaid = localTimes[i]
                        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                        const items = order.items
                        const total = calculateTotal(items, products)

                        return (<li key={order.id}>
                            <h2 className={"font-bold text-xl text-center underline"}>
                                <div className={`p-2${i !== 0 ? " border-t-2 border-black" : ""}`}>
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