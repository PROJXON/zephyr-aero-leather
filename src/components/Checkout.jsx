"use client"
import { useCart } from "@/app/context/CartContext";

export default function Checkout({ products }) {
    const { cartItems, removeFromCart, setCartOpen, cartOpen } = useCart();
    console.log(cartItems)

    return (<>
        {cartItems?.length > 0 ? <div>
            {cartItems.map(item => {
                const itemInfo = products.filter(product => product.id === item.id)[0]

                return (<div key={item.id}>
                    <p>{itemInfo.name}</p>
                </div>)
            })}
        </div> : <p>Your cart is empty</p>}
    </>)
}