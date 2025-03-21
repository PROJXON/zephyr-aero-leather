"use client"
import { useCart } from "@/app/context/CartContext";
import ChangeQuantity from "./ChangeQuantity";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Checkout({ products }) {
    const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();

    const getItemInfo = item => {
        const itemInfo = products.filter(product => product.id === item.id)[0]
        const price = itemInfo.price * item.quantity

        return [itemInfo, price]
    }

    const calculateTotal = () => {
        let initialTotal = 0

        cartItems.map(item => {
            const price = getItemInfo(item)[1]
            initialTotal += price
        })

        return initialTotal
    }

    const [total, setTotal] = useState(calculateTotal)

    useEffect(() => {
        setTotal(calculateTotal())
    }, [cartItems])

    return (<>
        {cartItems?.length > 0 ? <div className="grid grid-cols-[60%_40%]">
            <form>
                Form elements go here
            </form>
            <div>
                <h2 className="font-bold text-xl mb-2">Order Summary</h2>
                <ul>
                    {cartItems.map(item => {
                        const [itemInfo, price] = getItemInfo(item)
                        const imageInfo = itemInfo.images[0]
                        const priceJSX = <p className="text-right text-green-600">${price}</p>

                        return (<li key={item.id} className="grid grid-cols-[100px_auto] gap-2 mb-2">
                            <Image
                                src={imageInfo.src}
                                alt={imageInfo.alt}
                                width={100}
                                height={100}
                                className="object-cover"
                                style={{ aspectRatio: "1 / 1" }}
                            />
                            <div className="text-sm">
                                <p>{itemInfo.name}</p>
                                <div className="grid grid-cols-2">
                                    <div>
                                        {item.quantity > 1 && <span className="text-zinc-300 mr-3 align-middle">x {item.quantity}</span>}
                                        <ChangeQuantity
                                            sign="+"
                                            onClick={() => {
                                                addToCart(item.id)
                                                setTotal(curr => curr + itemInfo.price)
                                            }}
                                        />&nbsp;&nbsp;
                                        <ChangeQuantity
                                            sign="-"
                                            onClick={() => {
                                                if (item.quantity == 1) removeFromCart(item.id)
                                                else updateQuantity(item.id, item.quantity - 1)
                                                setTotal(curr => curr - itemInfo.price)
                                            }}
                                        />
                                    </div>
                                    {priceJSX}
                                </div>
                            </div>
                        </li>)
                    })}
                </ul>
                <hr />
                <div className="grid grid-cols-2 text-sm mt-2">
                    <p className="font-bold">Total</p>
                    <p className="text-right">${total}</p>
                </div>
            </div>
        </div> : <p>Your cart is empty</p>}
    </>)
}