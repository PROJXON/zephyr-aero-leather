"use client"
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import { useState, useEffect, Fragment } from "react";
import { FaEdit } from "react-icons/fa"
import getChangeQuantity from "../../lib/getChangeQuantity"
import ChangeQuantitySpans from "./ChangeQuantitySpans";

export default function Checkout({ products }) {
    const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart()

    const getItemInfo = item => {
        const itemInfo = products.filter(product => product.id === item.id)[0]
        const priceInCents = itemInfo.price * 100 * item.quantity

        return [itemInfo, priceInCents]
    }

    const calculateTotal = () => {
        let initialTotal = 0

        cartItems.map(item => {
            const priceInCents = getItemInfo(item)[1]
            initialTotal += priceInCents
        })

        return initialTotal
    }

    const formatPrice = priceInCents => {
        const dollars = Math.floor(priceInCents / 100)
        const cents = priceInCents % 100
        return `$${dollars}.${cents.toString().padStart(2, '0')}`
    }

    let changeQuantity = getChangeQuantity({ addToCart, removeFromCart, updateQuantity })
    changeQuantity.push({
        icon: FaEdit,
        onClick: item => {
            setEditID(item.id)
            setNewQty(item.quantity.toString())
        }
    })

    const [total, setTotal] = useState(calculateTotal)
    const [editID, setEditID] = useState(null)
    const [newQty, setNewQty] = useState('')

    useEffect(() => setTotal(calculateTotal()), [cartItems])

    return (<>
        {cartItems?.length > 0 ? <div className="grid grid-cols-[60%_40%]">
            <form>
                Form elements go here
            </form>
            <div>
                <h2 className="font-bold text-xl mb-2">Order Summary</h2>
                <ul>
                    {cartItems.map(item => {
                        const [itemInfo, priceInCents] = getItemInfo(item)
                        const imageInfo = itemInfo.images[0]

                        return (<li key={item.id} className="grid grid-cols-[100px_auto] gap-2 mb-2">
                            <Image
                                src={imageInfo.src}
                                alt={imageInfo.alt}
                                width={100}
                                height={100}
                                className="object-cover aspect-square"
                            />
                            <div className="text-sm">
                                <p>{itemInfo.name}</p>
                                <div className="grid grid-cols-2">
                                    <div className="flex items-center flex-wrap gap-1">
                                        {editID === item.id ? (<input
                                            className="w-12 text-xs p-2 pr-0"
                                            type="number"
                                            min="0"
                                            value={newQty}
                                            autoFocus
                                            onChange={e => setNewQty(e.target.value)}
                                            onBlur={() => {
                                                const qty = parseInt(newQty)
                                                if (!isNaN(qty)) {
                                                    if (qty == 0) removeFromCart(item.id)
                                                    else if (qty > 0) updateQuantity(item.id, qty)
                                                }
                                                setEditID(null)
                                            }}
                                            onKeyDown={e => {
                                                if (e.key === "Enter") e.target.blur()
                                            }}
                                        />) : (<>
                                            {item.quantity > 1 && (
                                                <span className="text-zinc-300 mr-1 align-middle whitespace-nowrap">
                                                    x {item.quantity}
                                                </span>
                                            )}
                                        </>)}
                                        <ChangeQuantitySpans cqs={changeQuantity} item={item} />
                                    </div>
                                    <p className="text-right text-green-600">{formatPrice(priceInCents)}</p>
                                </div>
                            </div>
                        </li>)
                    })}
                </ul>
                <hr />
                <div className="grid grid-cols-2 text-sm mt-2">
                    <p className="font-bold">Total</p>
                    <p className="text-right">{formatPrice(total)}</p>
                </div>
            </div>
        </div> : <p>Your cart is empty</p>}
    </>)
}