"use client"
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";

export default function Checkout({ products }) {
    const { cartItems, removeFromCart, setCartOpen, cartOpen } = useCart();
    let total = 0

    return (<>
        {cartItems?.length > 0 ? <div className="grid grid-cols-[60%_40%]">
            <form>
                Form elements go here
            </form>
            <div>
                <h2 className="font-bold text-xl mb-2">Order Summary</h2>
                <ul>
                    {cartItems.map(item => {
                        const itemInfo = products.filter(product => product.id === item.id)[0]
                        const imageInfo = itemInfo.images[0]

                        const price = itemInfo.price * item.quantity
                        total += price
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
                                {item.quantity > 1 ?
                                    <div className="grid grid-cols-2">
                                        <p className="text-zinc-300">x {item.quantity}</p>
                                        {priceJSX}
                                    </div> : priceJSX
                                }
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