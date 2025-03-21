"use client"
import { useCart } from "@/app/context/CartContext";

export default function Checkout({ products }) {
    const { cartItems, removeFromCart, setCartOpen, cartOpen } = useCart();

    return (<>
        {cartItems?.length > 0 ? <div className="grid grid-cols-[60%_40%]">
            <form>
                Form elements go here
            </form>
            <ul>
                {cartItems.map(item => {
                    const itemInfo = products.filter(product => product.id === item.id)[0]

                    return (<li key={item.id}>
                        <p>{itemInfo.name}</p>
                    </li>)
                })}
            </ul>
        </div> : <p>Your cart is empty</p>}
    </>)
}