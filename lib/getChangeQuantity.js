import { FaPlus, FaMinus } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6"

export default function getChangeQuantity({ addToCart, removeFromCart, updateQuantity }) {
    return [
        {
            icon: FaPlus,
            onClick: item => addToCart(item.id)
        },
        {
            icon: FaMinus,
            onClick: item => {
                if (item.quantity == 1) removeFromCart(item.id)
                else updateQuantity(item.id, item.quantity - 1)
            }
        },
        {
            icon: FaXmark,
            onClick: item => removeFromCart(item.id)
        }
    ]
}